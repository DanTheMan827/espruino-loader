/*
  MIT License

  Copyright (c) 2022 Daniel Radtke

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var fs = require("fs");
var path = require("path");

function cleanIncludes(source) {
  return source.replace(/require(?:\.resolve)?\(('serialport'|'nw\.gui'|"http"|"https"|"fs")\)/g, 'undefined');
}

function loadJS(filePath) {
  return cleanIncludes(fs.readFileSync(filePath, {encoding:"utf8"}))
}

function hasModule(mod) {
  try {
    require.resolve(mod);

    return true;
  } catch(e) {
    return false;
  }
}

module.exports = {
  default: function () {
    const resourcePath = this.resourcePath.replace(/\\/g, "/");
    const espruinoPath = path.dirname(require.resolve("espruino"));
    const resourceFile = this.resourcePath.startsWith(espruinoPath) ? resourcePath.substr(espruinoPath.length + 1) : "index.js";

    var espruinoFiles = (this.resourceQuery.startsWith("?") ? this.resourceQuery.substr(1).split(",") : []);
    var filePreOutput = [];
    var filePostOutput = [];
    var output = [];
    var fileOutput = "";
    var easyRequire = (mod, ...files) => hasModule(mod) && files.includes(resourceFile) && filePreOutput.push(`var ${mod} = require("${mod}");`);

    if (resourceFile == "index.js" && espruinoFiles.length == 0) {
      espruinoFiles = [
        "espruino.js",
        "core/utils.js",
        "core/config.js",
        "core/serial.js",
        "core/serial_chrome_serial.js",
        "core/serial_chrome_socket.js",
        "core/serial_node_serial.js",
        "core/serial_web_audio.js",
        "core/serial_web_bluetooth.js",
        "core/serial_web_serial.js",
        "core/serial_websocket_relay.js",
        "core/serial_frame.js",
        "core/terminal.js",
        "core/codeWriter.js",
        "core/modules.js",
        "core/env.js",
        "core/flasher.js",
        "core/flasherESP8266.js",
        "plugins/boardJSON.js",
        "plugins/versionChecker.js",
        "plugins/compiler.js",
        "plugins/assembler.js",
        "plugins/getGitHub.js",
        "plugins/unicode.js",
        "plugins/minify.js",
        "plugins/pretokenise.js",
        "plugins/saveOnSend.js",
        "plugins/setTime.js"
      ]
    }

    if (resourceFile == "index.js") {
        espruinoFiles.forEach(file => {
          output.push(`${file == "espruino.js" ? "module.exports = " : ""}require("!espruino-loader!espruino/${file}");`);
        });

        return output.join("\n");
    }

    if (resourceFile == "espruino.js") {
      filePostOutput.push('module.exports = Espruino;');
    }

    if (resourceFile != "espruino.js" && resourceFile != "index.js") {
      filePreOutput.push('var Espruino = require("!espruino-loader!espruino/espruino.js");');
      filePostOutput.push('module.exports = Espruino;');
    }

    easyRequire("acorn", "plugins/pretokenise.js", "plugins/compiler.js");
    easyRequire("escodegen", "plugins/minify.js");
    easyRequire("esmangle", "plugins/minify.js");
    easyRequire("esprima", "plugins/minify.js");
    easyRequire("utf8", "plugins/unicode.js");

    fileOutput = loadJS(path.join(espruinoPath, resourceFile));

    if (filePreOutput.length > 0) {
      output.push(filePreOutput.join("\n"));
    }

    output.push(fileOutput);

    if (filePostOutput.length > 0) {
      output.push(filePostOutput.join("\n"));
    }

    return output.join("\n\n");
  }
}
