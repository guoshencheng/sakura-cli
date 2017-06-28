'use strict';

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pwd = process.cwd();

_prompt2.default.message = "Sakura";
var schema = function schema(name) {
  return {
    properties: {
      tech: {
        description: "项目采用什么技术，现已经支持(react, normal)，default is normal",
        message: "请选择react或者normal",
        require: true,
        pattern: /react|normal/
      },
      name: {
        description: "项目名称(" + name + ")",
        require: true
      },
      gitUrl: {
        description: "请输入项目仓库地址(git)",
        require: true
      }
    }
  };
};

var buildConfig = function buildConfig(name, config) {
  return Object.assign({ name: name, gitUrl: "", tech: "normal" }, config);
};

var createDir = function createDir(config) {
  try {
    _fs2.default.mkdirSync(_path2.default.resolve(pwd, "./" + config.name));
  } catch (error) {
    if (error.code == "EEXIST") {
      console.log("Sakura: " + _chalk2.default.red("directory is exist"));
    } else {
      console.log(error.code, error.message);
    }
    process.exit(1);
  }
};

var renderPackageJson = function renderPackageJson(config) {
  var template = _ejs2.default.compile(_fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/packageJson/" + config.tech + ".package.json"), 'utf-8'));
  var fileString = template(config);
  _fs2.default.writeFileSync(_path2.default.resolve(pwd, "./" + config.name + "/package.json"), fileString);
};

var renderWebpackConfig = function renderWebpackConfig(config) {
  var webpackDevString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/webpack.config.dev/" + config.tech + ".js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(pwd, "./" + config.name + "/webpack.config.js"), webpackDevString);
  var webpackProString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/webpack.config.pro/" + config.tech + ".js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(pwd, "./" + config.name + "/webpack.config.product.js"), webpackProString);
};

module.exports = function (config) {
  _prompt2.default.start();
  _prompt2.default.get(schema(config.name), function (err, result) {
    Object.keys(result).forEach(function (key) {
      if (result[key] == "") {
        delete result[key];
      }
    });
    var outConfig = buildConfig(config.name, result);
    createDir(outConfig);
    renderPackageJson(outConfig);
    renderWebpackConfig(outConfig);
  });
};