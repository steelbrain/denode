#!/usr/bin/env node
'use strict'

var child_process = require('child_process')
var electron_path = require('electron-prebuilt')

child_process.spawnSync(electron_path, [require.resolve('./denode'), process.argv[0]].concat(process.argv.slice(2)), {
  stdio: 'inherit'
})
