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

var _init = require('./init.js');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

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
      }
    }
  };
};

var buildConfig = function buildConfig(name, config) {
  return Object.assign({ name: name, gitUrl: "", tech: "normal" }, config);
};

var createDir = function createDir(config) {
  try {
    _fs2.default.mkdirSync(_path2.default.resolve(cwd, "./" + config.name));
    console.log(_chalk2.default.green("→ create " + (_path2.default.resolve(cwd, "./" + config.name) + " success!")));
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
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/package.json"), fileString);
  console.log("Sakura-cli:", _chalk2.default.green("→ create pacakage.json success"));
};

var renderWebpackConfig = function renderWebpackConfig(config) {
  var webpackDevString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/webpack.config.dev/" + config.tech + ".js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/webpack.config.js"), webpackDevString);
  var webpackProString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/webpack.config.pro/" + config.tech + ".js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/webpack.config.product.js"), webpackProString);
  console.log("Sakura-cli:", _chalk2.default.green("→ create webpack.config.js success"));
};

var renderSakuraConfig = function renderSakuraConfig(config) {
  var defaultConfig = require('../template/sakura.default.config.json');
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/sakura.config.json"), JSON.stringify(defaultConfig, null, "  "));
  console.log("Sakura-cli:", _chalk2.default.green("→ create sakura.config.json success"));
};

var renderIndex = function renderIndex(config) {
  var indexHtmlString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/indexHtml/" + config.tech + ".html"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/index.html"), indexHtmlString);
  var indexJsString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/indexJs/" + config.tech + ".js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/index.js"), indexJsString);
  console.log("Sakura-cli:", _chalk2.default.green("→ create index.js, index.html success"));
};

var renderGulpfile = function renderGulpfile(config) {
  var gulpfileString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/gulpfile.js"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/gulpfile.js"), gulpfileString);
  console.log("Sakura-cli:", _chalk2.default.green("→ create gulpfile.js success"));
};

var renderStyle = function renderStyle(config) {
  var styleString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../template/style.scss"), "utf-8");
  _fs2.default.writeFileSync(_path2.default.resolve(cwd, "./" + config.name + "/style.scss"), styleString);
  console.log("Sakura-cli:", _chalk2.default.green("→ create style.scss success"));
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
    renderSakuraConfig(outConfig);
    renderIndex(outConfig);
    renderGulpfile(outConfig);
    renderStyle(outConfig);
  });
};