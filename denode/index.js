'use strict'

const Path = require('path')
const Electron = require('electron')
const STDIN = []
let window
let request = process.argv[3]

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

let options = {
  hide: true,
  width: 800,
  height: 800
}
let manifestInfo
try {
  manifestInfo = require(Path.join(process.cwd(), 'package.json'))
} catch (_) { }
if (manifestInfo && process.argv.indexOf('--ignore-local') === -1) {
  if (typeof manifestInfo.electronOptions === 'object' && manifestInfo.electronOptions) {
    Object.assign(options, manifestInfo.electronOptions)
  }
}
if (manifestInfo && (request === './' || request === '.' || request === '.\\') && typeof manifestInfo.electronMain === 'string' && manifestInfo.electronMain) {
  request = manifestInfo.electronMain
}

if (process.env.hasOwnProperty('DENODE_INSECURE') || (manifestInfo && manifestInfo.denodeOptions && manifestInfo.denodeOptions.indexOf('DENODE_INSECURE') !== -1)) {
  Electron.app.commandLine.appendSwitch('--ignore-certificate-errors')
}

Electron.app.on('ready', function() {

  window = new Electron.BrowserWindow(options)
  window.loadURL(`file://${Path.join(__dirname, 'index.html')}`)
  window.on('closed', function() {
    Electron.app.quit()
  })
  window.webContents.openDevTools({ detach: options.hide })
  if (options.hide) {
    window.webContents.once('devtools-opened', function() {
      setImmediate(function() {
          window.hide()
          window.webContents.once('devtools-closed', function() {
            setImmediate(function() {
              window.close()
            })
          })
      })
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

    for (let i = 0, length = STDIN.length; i < length; ++i) {
      window.webContents.send('stdin', STDIN[i])
    }
  })
})

Electron.ipcMain.on('stdout', function(_, data) {
  process.stdout.write(data)
})
Electron.ipcMain.on('stderr', function(_, data) {
  process.stderr.write(data)
})
process.stdin.on('data', function(chunk) {
  const stringish = chunk.toString()
  if (window) {
    window.webContents.send('stdin', stringish)
  }
  STDIN.push(stringish)
})
process.stdin.resume()
