const fs = require('fs');
const rl = require('readline');


class Cli {
  exec(input, output) {

    this.songs = [];

    const inputReadLine = rl.createInterface({
      input: fs.createReadStream(input, {
        // utf16ともいうらしい
        encoding: 'ucs2',
      }),
      output: {},
    });

    let idx = 0;
    inputReadLine
      .on('line', line => {
        this._onLine(line, idx);
        idx++;
      })
      .on('close', () => this._onClose(output));
  }

  _onLine(line, idx) {
    if (idx === 0) { return; }

    const song = _toSongByLine(line);
    this.songs.push(song);
  }

  _onClose(output) {
    this.songs = this.songs
                  .filter(_hasValidPath)
                  .map(_formatSong);

    const tree = _toMediaTree(this.songs);
    const media = _toArrayByTree(tree);

    fs.writeFileSync(output, JSON.stringify(media));
    this.songs.length = 0;
  }
}

module.exports = (new Cli());


function _toSongByLine(line) {
  const reqFields = [
    /* '名前':                 */ 'name',
    /* 'アーティスト':         */ 'artist',
    /* '作曲者':               */ null,
    /* 'アルバム':             */ 'album',
    /* 'グループ':             */ null,
    /* '作品':                 */ null,
    /* '楽章番号':             */ null,
    /* '楽章数':               */ null,
    /* '楽章名':               */ null,
    /* 'ジャンル':             */ null,
    /* 'サイズ':               */ null,
    /* '時間':                 */ 'duration',
    /* 'ディスク番号':         */ 'disc',
    /* 'ディスク数':           */ null,
    /* 'トラック番号':         */ 'track',
    /* 'トラック数':           */ null,
    /* '年':                   */ 'year',
    /* '変更日':               */ 'updated',
    /* '追加日':               */ null,
    /* 'ビットレート':         */ null,
    /* 'サンプルレート':       */ null,
    /* '音量調整':             */ null,
    /* '種類':                 */ null,
    /* 'イコライザ':           */ null,
    /* 'コメント':             */ null,
    /* '再生回数':             */ null,
    /* '最後に再生した日':     */ null,
    /* 'スキップ回数':         */ null,
    /* '最後にスキップした日': */ null,
    /* 'マイレート':           */ null,
    /* '場所':                 */ 'path',
  ];

  const song = {};
  const lines = line.split(/\t/);
  reqFields.forEach((key, idx) => {
    if (key === null) { return; }
    song[key] = lines[idx];
  });

  return song;
}

function _hasValidPath(song) {
  // どういうわけか「場所」フィールドのないもの
  if (!song.path) { return false; }

  // バラおきになってるシングル
  const depth = song.path.split(':').length;
  if (depth < 5) { return false; }

  return true;
}

function _formatSong(song) {
  const pathArr = song.path.split(':').slice(3);

  // 「アーティスト」でグルーピングすると、同じアルバムでも違う扱いになってしまう
  song.albumArtist = pathArr[0];
  song.path = pathArr.join('/');

  return song;
}

function _toMediaTree(songs) {
  const tree = {};
  songs.sort(__treeSort).forEach(song => {
    const albumArtist = song.albumArtist;

    tree[albumArtist] = tree[albumArtist] || {};
    tree[albumArtist][song.album] = tree[albumArtist][song.album] || { songs: [], year: song.year };

    // アルバム単位であればよい
    delete song.year;
    // データが組み上がれば必要ない
    delete song.albumArtist;
    delete song.updated;

    tree[albumArtist][song.album].songs.push(song);
  });

  return tree;
}

function _toArrayByTree(tree) {
  return Object.keys(tree).map(artistName => {
    const albums = tree[artistName];
    const artist = {
      name: artistName,
      albums: Object.keys(albums).map(albumName => {
          const album = albums[albumName];
          album.name = albumName;
          album.songs.sort(__songsSort);
          return album;
        }),
    };
    artist.albums.sort(__albumsSort);
    return artist;
  });
}

function __treeSort(a, b) {
  const updatedA = new Date(a.updated).getTime();
  const updatedB = new Date(b.updated).getTime();

  return updatedA > updatedB ? -1 : 1;
}

function __songsSort(a, b) {
  const discA = ___toOrderNumber(a.disc);
  const discB = ___toOrderNumber(b.disc);
  const trackA = ___toOrderNumber(a.track);
  const trackB = ___toOrderNumber(b.track);

  // disc順のtrack順
  return discA > discB || discA === discB && trackA > trackB ? 1 : -1;
}

function __albumsSort(a, b) {
  const yearA = ___toOrderNumber(a.year);
  const yearB = ___toOrderNumber(b.year);

  return yearA > yearB ? -1 : 1;
}

function ___toOrderNumber(str) {
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : num;
}
