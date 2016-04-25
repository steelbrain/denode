DeNode
======

DeNode is short for Debug Node, it's a tiny wrapper around [Electron][1] that lets you debug your [Node][2] apps using Chrome Dev Tools :tada:

## Installation
```sh
npm install -g denode
```

## Usage

```sh
denode
denode .
denode ./index.js
denode `which browserify`
```

*Note*: `denode .` uses the `main` property in the project's `package.json`.

To reload the app, simply press CTRL + R on Linux/Windows and CMD + R on Mac OSX.

## Advanced Usage

If you do `denode .` or `denode ./` or `denode .\`, it tries to load options from the local `package.json` file. Here are the magic fields it understands

```json
{
  "name": "my-cool-app",
  "electronMain": "./electron.js",
  "electronOptions": {
    "hide": false
  }
}
```
The `electronOptions` field accepts all of [`BrowserWindow`][3] options, if `electronMain` is present, it is used instead of `main`.

## Screenshot

<img alt="DeNode" src="https://cloud.githubusercontent.com/assets/4278113/14579761/20e2a9a2-036b-11e6-8bc7-fba7cda9a026.png">

## License

DeNode is licensed under the terms of MIT License, see the LICENSE file for more info.

[1]:http://electron.atom.io/
[2]:http://nodejs.org/
[3]:http://electron.atom.io/docs/latest/api/browser-window
