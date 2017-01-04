## 1.9.0

- Add Electron context menu, DevTron and ElectronDebug

## 1.8.3

- Fix a bug where some apps would terminate the renderer by overriding `process.exit`

## 1.8.2

- Retry on pinning dependencies **facepalm**

## 1.8.1

- Pin Electron to `v1.4.2` (Workaround for electron/electron#7519)

## 1.8.0

- Fix a deprecation warning
- Upgrade Electron to `v1.4.3`

## 1.7.0

- Upgrade Electron to `v1.3.3^` (from `v0.37.8^`)
- Fix tty support by adding `rows` and `columns` to `process.stdout` and `process.stderr`

## 1.6.3

- Random bugfixes

## 1.6.2

- Fix indexOf undefined error (#11)

## 1.6.1

- Fix a few issues with last release

## 1.6.0

- Add insecure mode where certificate errors are ignored, it can be triggered by setting the `DENODE_INSECURE` env param or by setting `denodeOptions` to `["DENODE_INSECURE"]` in manifest.
- Make a `console.log` message on init more verbose

## 1.5.2

- Upgrade electron 0.37.8

## 1.5.1

- Show version information when `--version` or `-v` is passed

## 1.5.0

- Add `--ignore-local` option
- Make sure app names in the dev tool header are lowercased
- Try to read and apply options from local manifest even if request is not `./`

## 1.4.0

- Implement a proper support for `process.argv`

## 1.3.0

- Support browser window options from the manifest
- Support custom main for electron from the manifest

## 1.2.2

- Fix relative requires in console (bug introduced by v1.2.0)

## 1.2.1

- Fix a bug with source maps introduced in v1.2.0

## 1.2.0

- Set `productName` properly
- Show the name of the app in topbar

## 1.1.0

- Properly set `process.std*.isTTY`
- Add support for `process.stdin`
- Add support for `process.stdout` and `process.stderr`

## 1.0.4

- Fix a crash on Ubuntu

## 1.0.3

- Upgrade electron version

## 1.0.2

- Fix a minor race condition between closing dev tools and app

## 1.0.1

- Show only the dev tools, not the whole window

## 1.0.0

- Initial release
