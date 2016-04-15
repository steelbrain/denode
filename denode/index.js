'use strict'

const Path = require('path')
const Electron = require('electron')

Electron.app.on('ready', function() {
  var win = new Electron.BrowserWindow({ width: 800, height: 600, show: true });
  win.loadURL('file://' + Path.join(__dirname, 'index.html') + '?app=' + encodeURIComponent(process.argv[2] || ''));
  win.on('closed', function() {
    Electron.app.quit()
  })
})
