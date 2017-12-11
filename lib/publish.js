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
  var defaultResources = sakuraConfig.defaultResources || {};
  try {
    resources = require(_path2.default.resolve(pwd, "./sakura.resources.json"));
  } catch (e) {/* handle error */}
  var appid = sakuraConfig.appid;
  var sakuraServer = sakuraConfig.sakuraServer;
  var htmlPath = sakuraConfig.htmlPath;
  var type = sakuraConfig.type || 1;
  var html;
  if (type != 1) {
    if (htmlPath) {
      try {
        html = _fs2.default.readFileSync(_path2.default.resolve(pwd, htmlPath), "utf-8");
      } catch (e) {
        console.log(_chalk2.default.red('Error → without html file'));
        process.exit(1);
      }
    } else {
      console.log(_chalk2.default.red('Error → missing htmlPath option at sakura.config.json'));
      process.exit(1);
    }
  }
  _axios2.default.post(sakuraServer + ('/api/v1/webapps/' + appid + '/resources'), {
    javascripts: resources.javascripts.concat(defaultResources.javascripts || []).join(','),
    styles: resources.styles.concat(defaultResources.styles || []).join(','),
    version: resources.hash,
    type: type, html: html
  }).then(function (response) {
    if (response.status == 200 && response.data) {
      console.log(_chalk2.default.green("→ success upload"));
    } else {
      console.log(_chalk2.default.red("→ fail upload with status: " + response.status));
    }
  }).catch(function (error) {
    console.log(error);
    console.log(_chalk2.default.red("→ fail upload"), "资源已上传或者资源服务器错误");
  });
};