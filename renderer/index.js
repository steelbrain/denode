// Override process.exit
process.exit = function () {};

const fs = require('fs');
const path = require('path');
const electron = require('electron');

electron.ipcRenderer.once('setup', function (_, data) {
  const parsed = JSON.parse(data);
  process.argv = parsed.argv;

  Object.assign(process.stdout, parsed.stdout);
  Object.assign(process.stderr, parsed.stderr);

  process.stdout._write = function (chunk, _, callback) {
    process.nextTick(callback);
    electron.ipcRenderer.send('stdout', chunk.toString());
  };

  process.stderr._write = function (chunk, _, callback) {
    process.nextTick(callback);
    electron.ipcRenderer.send('stderr', chunk.toString());
  };

  electron.ipcRenderer.on('stdin', function (_, data) {
    process.stdin.push(data);
  });

  __dirname = process.cwd();
  __filename = path.join(__dirname, 'denode');
  module.filename = __filename;

  const App = parsed.request;
  if (!App) {
    console.warn('No application specified');
  } else {
    setTimeout(function doTheMagic() {
      debugger;
      const resolvedPath = fs.realpathSync(path.resolve(process.cwd(), App));
      console.log('export of main file', require(resolvedPath));
    }, 1000);
  }
});
