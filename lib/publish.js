'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pwd = process.cwd();


var env = process.env.NODE_ENV;

module.exports = function () {
  var sakuraConfig;
  var resources;
  try {
    sakuraConfig = require(_path2.default.resolve(pwd, './sakura.config.json'));
    if (sakuraConfig[env]) {
      sakuraConfig = Object.assign(sakuraConfig, sakuraConfig[env]);
    }
    console.log(_chalk2.default.green("Read config success → " + JSON.stringify(sakuraConfig)));
  } catch (e) {
    console.log(_chalk2.default.red("Error → without sakura config file"));
    process.exit(1);
  }
  try {
    resources = require(_path2.default.resolve(pwd, "./sakura.resources.json"));
  } catch (e) {/* handle error */}
  var appid = sakuraConfig.appid;
  var sakuraServer = sakuraConfig.sakuraServer;
  _axios2.default.post(sakuraServer + ('/api/v1/webapps/' + appid + '/resources'), {
    javascripts: resources.javascripts.join(','),
    styles: resources.styles.join(','),
    version: resources.hash
  }).then(function (response) {
    if (response.status == 200 && response.data) {
      console.log(_chalk2.default.green("→ success upload"));
    } else {
      console.log(_chalk2.default.red("→ fail upload with status: " + response.status));
    }
  }).catch(function (error) {
    console.log(_chalk2.default.red("→ fail upload"));
  });
};