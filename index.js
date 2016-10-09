#!/usr/bin/env node
'use strict'

var child_process = require('child_process')
var electron_path = require('electron')
var show_version = process.argv.indexOf('--version') === 2 || process.argv.indexOf('-v') === 2

if (show_version) {
  var manifest = require('./package.json')
  console.log('DeDode - The human friendly way of debugging Node.js | v' + manifest.version)
} else {
  child_process.spawnSync(electron_path, [require.resolve('./denode'), process.argv[0]].concat(process.argv.slice(2)), {
    stdio: 'inherit'
  })
}
