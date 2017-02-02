const path = require('path')

function getDenodeOption(options, name) {
  return process.env.hasOwnProperty(name) || options.indexOf(name) !== -1
}
function getDenodeOptions(manifest) {
  const manifestOptions = (manifest && manifest.denodeOptions) || []
  return {
    DENODE_INSECURE: getDenodeOption(manifestOptions, 'DENODE_INSECURE'),
  }
}
function getElectronOptions() {
  const options = {
    electron: {
      hide: true,
      width: 800,
      height: 800
    },
    main: process.argv[2] || './',
    manifest: {},
    directory: process.cwd(),
  }

  try {
    options.manifest = require(path.join(options.directory, 'package.json'))
  } catch (_) {}
  if (process.argv.indexOf('--ignore-local') === -1) {
    Object.assign(options.electron, options.manifest.electronOptions)
  }
  if (path.resolve(options.main) === options.directory && options.manifest.electronMain) {
    options.main = options.manifest.electronMain
  }
  return options
}

module.exports = { getDenodeOptions, getElectronOptions }
