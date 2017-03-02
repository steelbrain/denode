const Path = require('path')
const { app, ipcMain, BrowserWindow } = require('electron')
const Helpers = require('./helpers')

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

const options = Helpers.getElectronOptions()
const denodeOptions = Helpers.getDenodeOptions(options.manifest)

if (denodeOptions.DENODE_INSECURE) {
  app.commandLine.appendSwitch('--ignore-certificate-errors')
}

app.setName('denode')
app.setPath('userData', Path.join(Path.dirname(app.getPath('userData')), 'denode'))
app.setPath('userCache', Path.join(Path.dirname(app.getPath('userCache')), 'denode'))

app.on('window-all-closed', function() {
  app.quit()
})
app.on('ready', Helpers.installExtensions(function() {
  const electronOptions = Object.assign({}, options.electron)
  if (electronOptions.hide) {
    Object.assign(electronOptions, {
      height: 400,
    })
  }

  const window = new BrowserWindow(electronOptions)
  window.loadURL(`file://${Path.normalize(Path.join(__dirname, '..', 'browser', 'index.html'))}`)
  window.webContents.openDevTools({ mode: 'bottom' })
  if (options.electron.hide) {
    window.webContents.once('devtools-closed', function() {
      window.hide()
      setImmediate(() => window.close())
    })
  }

  window.webContents.on('dom-ready', function() {
    window.webContents.send('setup', JSON.stringify({
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
    }))
  })
}))

ipcMain.on('stdout', function(_, data) {
  process.stdout.write(data)
})
ipcMain.on('stderr', function(_, data) {
  process.stderr.write(data)
})
process.stdin.on('data', function(chunk) {
  if (window) {
    window.webContents.send('stdin', chunk.toString())
  }
})
process.stdin.resume()
