const fs = require('fs');
const rl = require('readline');

class Cli {
  exec(input, output) {

    this.songs = [];

    const inputReadLine = rl.createInterface({
      input: fs.createReadStream(input, {
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
                  .filter(__hasValidPath)
                  .map(__formatSong);

    const tree = {};
    this.songs.forEach(song => {
      tree[song.albumArtist] = tree[song.albumArtist] || {};
      tree[song.albumArtist][song.album] = tree[song.albumArtist][song.album] || [];

      tree[song.albumArtist][song.album].push(song);
    });

    fs.writeFileSync(output, JSON.stringify(tree));
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
    /* 'ディスク数':           */ 'discs',
    /* 'トラック番号':         */ 'track',
    /* 'トラック数':           */ 'tracks',
    /* '年':                   */ 'year',
    /* '変更日':               */ null,
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

function __hasValidPath(song) {
  if (!song.path) { return false; }
  return true;
}

function __formatSong(song) {
  const pathArr = song.path.split(':').slice(3);

  song.albumArtist = pathArr[0];
  song.path = pathArr.join('/');

  return song;
}
