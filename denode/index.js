'use strict'

const Path = require('path')
const Electron = require('electron')
const STDIN = []
let win

Electron.app.on('ready', function() {
  win = new Electron.BrowserWindow({ width: 800, height: 600, title: 'DeNode' });
  win.loadURL('file://' + Path.join(__dirname, 'index.html') + '?app=' + encodeURIComponent(process.argv[2] || ''));
  win.on('closed', function() {
    Electron.app.quit()
  })
  win.webContents.openDevTools({ detach: true })
  win.webContents.once('devtools-opened', function() {
    setImmediate(function() {
      win.hide()
      win.webContents.once('devtools-closed', function() {
        setImmediate(function() {
          win.close()
        })
      })
    })
  })

  win.webContents.on('dom-ready', function() {
    for (let i = 0, length = STDIN.length; i < length; ++i) {
      win.webContents.send('stdin', STDIN[i])
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
  if (win) {
    win.webContents.send('stdin', stringish)
  }
  STDIN.push(stringish)
})
process.stdin.resume()
