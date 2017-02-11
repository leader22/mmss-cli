const cli = require('./cli');
const argv = require('yargs')
  .usage('Usage: $0 --input [path/to/playlist.txt] --output [path/to/music.json]')
  .demandOption(['input'])
  .alias('o', 'output')
  .alias('i', 'input')
  .default('output', './music.json')
  .argv;

cli.exec(argv.input, argv.output);
