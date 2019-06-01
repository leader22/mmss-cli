const [,, ...args] = process.argv;
const fs = require('fs');
const path = require('path');

const isDryRun = args.includes('-x') === false;
const [artistName] = args;

if (artistName.length === 0) {
  throw new Error('Arg artistName is not defined!');
}

console.log('dryrun ?', isDryRun);

const albums = fs.readdirSync(artistName);

for (const albumName of albums) {
  renameAlbum(albumName, artistName);
}

function renameAlbum(albumName, artistName) {
  const albumPath = path.join(artistName, albumName);
  const songNames = fs.readdirSync(albumPath);
  console.log('Rename files in', albumPath);

  for (const songName of songNames) {
    if (songName.startsWith(artistName)) {
      throw new Error('Already renamed!');
    }

    const songPath = path.join(artistName, albumName, songName);
    const newName = songName.replace(/^(\d-)?\d+\s/, `${artistName} - `);
    const newPath = path.join(artistName, albumName, newName);

    if (!isDryRun) {
      fs.renameSync(songPath, newPath);
    }
    console.log(songName, ' => ', newName);
  }

}
