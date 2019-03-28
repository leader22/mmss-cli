const fs = require('fs');
const rl = require('readline');
const [, , ...args] = process.argv;

const [iFlag, inputPath, oFlag, outputPath] = args;

if (!(iFlag === '-i' && oFlag === '-o')) {
  throw new Error('Args are invalid!');
}

const readline = rl.createInterface({
  input: fs.createReadStream(inputPath),
  crlfDelay: Infinity,
});

let isHeader = true;
const songs = [];
readline.on('line', line => {
  if (isHeader) {
    isHeader = false;
  } else {
    songs.push(lineToSongInit(line));
  }
});
readline.on('close', onClose);

function lineToSongInit(line) {
  const [
    /* '名前':                 */ name,
    /* 'アーティスト':         */ artist,
    /* '作曲者':               */ ,
    /* 'アルバム':             */ album,
    /* 'グループ':             */ ,
    /* '作品':                 */ ,
    /* '楽章番号':             */ ,
    /* '楽章数':               */ ,
    /* '楽章名':               */ ,
    /* 'ジャンル':             */ ,
    /* 'サイズ':               */ ,
    /* '時間':                 */ duration,
    /* 'ディスク番号':         */ disc,
    /* 'ディスク数':           */ ,
    /* 'トラック番号':         */ track,
    /* 'トラック数':           */ ,
    /* '年':                   */ year,
    /* '変更日':               */ updated,
    /* '追加日':               */ ,
    /* 'ビットレート':         */ ,
    /* 'サンプルレート':       */ ,
    /* '音量調整':             */ ,
    /* '種類':                 */ ,
    /* 'イコライザ':           */ ,
    /* 'コメント':             */ ,
    /* '再生回数':             */ ,
    /* '最後に再生した日':     */ ,
    /* 'スキップ回数':         */ ,
    /* '最後にスキップした日': */ ,
    /* 'マイレート':           */ ,
    /* '場所':                 */ path,
  ] = line.split('\t');

  // Length must be 3 or 4
  const pathArr = _getNormalizedPathArr(path);

  const songInit = {
    name,
    artist: artist || '-',
    album: album || pathArr.slice(-2, -1).pop(),
    albumArtist: pathArr[0],
    duration,
    disc: disc || '1',
    track: track || '1',
    year: year || '0',
    updated,
    path: pathArr.join('/'),
  };

  return songInit;
}
function onClose() {
  const tree = {};
  songs.sort(__treeSort);

  for (const song of songs) {
    const { album, year, albumArtist } = song;

    tree[albumArtist] = tree[albumArtist] || {};
    tree[albumArtist][album] = tree[albumArtist][album] || { songs: [], year };

    // アルバム単位であればよい
    delete song.year;
    // データが組み上がれば必要ない
    delete song.albumArtist;
    delete song.updated;

    tree[albumArtist][album].songs.push(song);
  }

  const json = Object.keys(tree).map(artistName => {
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

  console.log(`${songs.length} songs`);
  console.log('write', outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(json));
}

function _getNormalizedPathArr(path) {
  let pathArr = [];

  if (!path) {
    console.log(path);
    throw new Error('Unexpected path!');
  }

  path = path.normalize();

  // old mac
  if (path.startsWith('Macintosh HD/Users/leader22/Music/iTunes/Music/')) {
    pathArr = path.split('/').slice(6);
  }
  // new mac
  if (path.startsWith('Macintosh HD/Users/leader22/Media/music/')) {
    pathArr = path.split('/').slice(5);
  }

  if (!(pathArr.length === 3 || pathArr.length === 4)) {
    console.log(path);
    throw new Error('Unexpected path!');
  }

  return pathArr;
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
