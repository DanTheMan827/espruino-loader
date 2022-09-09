# espruino-loader

A webpack loader for Espruino tools.

## Installation
`npm i --save-dev espruino-loader`

## Usage

You can include espruino one of two ways.

### Including Everything
```javascript
var Espruino = require("!espruino-loader!espruino");
```

### Including Each File Individually

This has the advantage of allowing you to remove files you don't intend on using to save space.
```javascript
var Espruino = require("!espruino-loader!espruino/espruino.js");
require("!espruino-loader!espruino/core/utils.js");
require("!espruino-loader!espruino/core/config.js");
require("!espruino-loader!espruino/core/serial.js");
require("!espruino-loader!espruino/core/serial_chrome_serial.js");
require("!espruino-loader!espruino/core/serial_chrome_socket.js");
require("!espruino-loader!espruino/core/serial_node_serial.js");
require("!espruino-loader!espruino/core/serial_web_audio.js");
require("!espruino-loader!espruino/core/serial_web_bluetooth.js");
require("!espruino-loader!espruino/core/serial_web_serial.js");
require("!espruino-loader!espruino/core/serial_websocket_relay.js");
require("!espruino-loader!espruino/core/serial_frame.js");
require("!espruino-loader!espruino/core/terminal.js");
require("!espruino-loader!espruino/core/codeWriter.js");
require("!espruino-loader!espruino/core/modules.js");
require("!espruino-loader!espruino/core/env.js");
require("!espruino-loader!espruino/core/flasher.js");
require("!espruino-loader!espruino/core/flasherESP8266.js");
require("!espruino-loader!espruino/plugins/boardJSON.js");
require("!espruino-loader!espruino/plugins/versionChecker.js");
require("!espruino-loader!espruino/plugins/compiler.js");
require("!espruino-loader!espruino/plugins/assembler.js");
require("!espruino-loader!espruino/plugins/getGitHub.js");
require("!espruino-loader!espruino/plugins/unicode.js");
require("!espruino-loader!espruino/plugins/minify.js");
require("!espruino-loader!espruino/plugins/pretokenise.js");
require("!espruino-loader!espruino/plugins/saveOnSend.js");
require("!espruino-loader!espruino/plugins/setTime.js");
```
