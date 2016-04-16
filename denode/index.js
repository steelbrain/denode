'use strict'

const Path = require('path')
const Electron = require('electron')

Electron.app.on('ready', function() {
  var win = new Electron.BrowserWindow({ width: 800, height: 600 });
  win.loadURL('file://' + Path.join(__dirname, 'index.html') + '?app=' + encodeURIComponent(process.argv[2] || ''));
  win.on('closed', function() {
    Electron.app.quit()
  })
  win.webContents.openDevTools({ detach: true })
  win.webContents.once('devtools-opened', function() {
    setImmediate(function() {
      win.hide()
    })
  })
  win.webContents.once('devtools-closed', function() {
    Electron.app.quit()
  })
})
