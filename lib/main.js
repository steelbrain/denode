const Path = require('path')
const Electron = require('electron')
const Helpers = require('./helpers')
let window
let request = process.argv[3]

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

const options = Helpers.getElectronOptions()
const denodeOptions = Helpers.getDenodeOptions(options.manifest)

if (denodeOptions.DENODE_INSECURE) {
  Electron.app.commandLine.appendSwitch('--ignore-certificate-errors')
}

Electron.app.on('window-all-closed', function() {
  Electron.app.quit()
})
Electron.app.on('ready', function() {

  window = new Electron.BrowserWindow(options.electron)
  window.loadURL(`file://${Path.normalize(Path.join(__dirname, '..', 'browser', 'index.html'))}`)
  window.webContents.openDevTools({ detach: options.electron.hide })
  if (options.electron.hide) {
    window.webContents.once('devtools-opened', function() {
      window.hide()
    })
    window.webContents.once('devtools-closed', function() {
      window.hide()
      setImmediate(() => window.close())
    })
  }

  window.webContents.on('dom-ready', function() {
    window.webContents.send('setup', JSON.stringify({
      argv: process.argv.slice(2),
      request: request,
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
    }))
  })
})

Electron.ipcMain.on('stdout', function(_, data) {
  process.stdout.write(data)
})
Electron.ipcMain.on('stderr', function(_, data) {
  process.stderr.write(data)
})
process.stdin.on('data', function(chunk) {
  if (window) {
    window.webContents.send('stdin', chunk.toString())
  }
})
process.stdin.resume()
