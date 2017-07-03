'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();


module.exports = function (config) {
  var defaultConfig = require('../template/sakura.default.config.json');
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./sakura.config.js"), JSON.stringify(defaultConfig, null, "  "));
};