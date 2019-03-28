const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const [,, dir] = process.argv;

const files = fs.readdirSync(dir);

execFileSync('mkdir', [dir + '_']);
for (const file of files) {
  const fPath = path.join(dir, file);
  const oPath = path.join(dir + '_', file);

  execFileSync('ffmpeg', [
    '-i',
    fPath,
    '-ss',
    '0.2',
    '-acodec',
    'copy',
    oPath
  ]);
}
