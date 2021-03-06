# Active Window Listener
Listen to active windows by specifying them

This will be used in https://nertivia.tk (My chat web app project) in the future to show playing status and more!

## Usage
```js
const { ProcessListen } = require("active-window-listener");

const listener = new ProcessListen(["Discord.exe", "Telegram.exe", "Code.exe"]);

listener.changed(data => {
    console.log("Active: ", data)
})
```
This should output an object of Window Class properties. See the package used below to view the methods.

There is also a function to get windows that are opened. I needed to filter out some of the components from the "Windows" Directory in order to get the proper list.
```js
const { getWindows } = require("active-window-listener");

console.log(getWindows())
```
This should output an array of Window Class properties. See the package used below to view the methods.

## Package used
Mainly used to get all the active window information.
https://github.com/sentialx/node-window-manager/
Used to get File Description (Which is used to get the proper program name)
https://www.npmjs.com/package/exiftool-vendored
