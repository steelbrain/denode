const path = require('path');
const { app, ipcMain, BrowserWindow } = require('electron');

require('electron-debug')({ showDevTools: true });
require('electron-context-menu')();

if (process.env.hasOwnProperty('DENODE_INSECURE')) {
  app.commandLine.appendSwitch('--ignore-certificate-errors');
}

app.name = 'denode';
app.allowRendererProcessReuse = false;
app.setPath('userData', path.join(path.dirname(app.getPath('userData')), 'denode'));
app.setPath('userCache', path.join(path.dirname(app.getPath('userCache')), 'denode'));

function createWindow() {
  const window = new BrowserWindow({
    hide: true,
    width: 1000,
    height: 800,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  });

  window.loadFile(path.join(__dirname, '../renderer/index.html'));
  window.webContents.openDevTools({ mode: 'bottom' });

  window.webContents.on('dom-ready', function () {
    window.webContents.send(
      'setup',
      JSON.stringify({
        argv: process.argv.slice(1),
        request: process.argv[2],
        stdout: {
          isTTY: process.stdout.isTTY,
          columns: process.stdout.columns,
          rows: process.stdout.rows,
        },
        stderr: {
          isTTY: process.stderr.isTTY,
          columns: process.stderr.columns,
          rows: process.stderr.rows,
        },
      }),
    );

    process.stdin.on('data', function (chunk) {
      if (window) {
        window.webContents.send('stdin', chunk.toString());
      }
    });

    process.stdin.resume();
  });
}

if (process.platform !== 'darwin') {
  app.quit();
}
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.on('stdout', function (_, data) {
  process.stdout.write(data);
});

ipcMain.on('stderr', function (_, data) {
  process.stderr.write(data);
});
