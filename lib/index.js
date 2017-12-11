'use strict';

var _create = require('./create.js');

var _create2 = _interopRequireDefault(_create);

var _init = require('./init.js');

var _init2 = _interopRequireDefault(_init);

var _publish = require('./publish.js');

var _publish2 = _interopRequireDefault(_publish);

var _proxy = require('./proxy.js');

var _proxy2 = _interopRequireDefault(_proxy);

var _start = require('./start.js');

var _start2 = _interopRequireDefault(_start);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  craete: _create2.default, init: _init2.default, publish: _publish2.default, proxy: _proxy2.default, start: _start2.default
};