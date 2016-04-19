'use strict'

const URL = require('url')
const Path = require('path')
const IPC = require('electron').ipcRenderer

process.stdout._write = function(chunk, _, callback) {
  process.nextTick(callback)
  IPC.send('stdout', chunk.toString())
}
process.stderr._write = function(chunk, _, callback) {
  process.nextTick(callback)
  debugger
  IPC.send('stderr', chunk.toString())
}
IPC.on('stdin', function(_, data) {
  process.stdin.push(data)
})

const App = URL.parse(location.href, true).query.app
if (!App) {
  console.warn('No application specified')
} else {
  console.log(require(Path.resolve(process.cwd(), App)))
}
