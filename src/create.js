import prompt from 'prompt';
import chalk from 'chalk';
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import init from './init.js';
const cwd = process.cwd()

prompt.message = "Sakura";
const schema = (name) => {
  return {
    properties: {
      tech: {
        description: "项目采用什么技术，现已经支持(react, normal)，default is normal",
        message: "请选择react或者normal",
        require: true,
        pattern: /react|normal/
      },
      name: {
        description: "项目名称("+ name +")",
        require: true,
      }
    }
  }
}

const buildConfig = (name, config) => {
  return Object.assign({ name, gitUrl: "", tech: "normal" }, config);
}

const createDir = (config) => {
  try {
    fs.mkdirSync(path.resolve(cwd, "./" + config.name))
    console.log(chalk.green("→ create " + (path.resolve(cwd, "./" + config.name) + " success!")));
  } catch( error ) {
    if (error.code == "EEXIST") {
      console.log("Sakura: " + chalk.red("directory is exist"))
    } else {
      console.log(error.code, error.message);
    }
    process.exit(1);
  }
}

const renderPackageJson = (config) => {
  var template = ejs.compile(fs.readFileSync(path.resolve(__dirname, "../template/packageJson/" + config.tech + ".package.json"), 'utf-8'));  
  var fileString = template(config);
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/package.json"), fileString)
  console.log("Sakura-cli:", chalk.green("→ create pacakage.json success"));
}

const renderWebpackConfig = (config) => {
  var webpackDevString = fs.readFileSync(path.resolve(__dirname, "../template/webpack.config.dev/" + config.tech + ".js"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/webpack.config.js"), webpackDevString);
  var webpackProString = fs.readFileSync(path.resolve(__dirname, "../template/webpack.config.pro/" + config.tech + ".js"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/webpack.config.product.js"), webpackProString);
  console.log("Sakura-cli:", chalk.green("→ create webpack.config.js success"));
}

const renderSakuraConfig = (config) => {
  var defaultConfig = require('../template/sakura.default.config.json');
  fs.writeFileSync(path.resolve(cwd,"./" + config.name + "/sakura.config.json"), JSON.stringify(defaultConfig, null, "  "));
  console.log("Sakura-cli:", chalk.green("→ create sakura.config.json success"));
}

const renderIndex = (config) => {
  var indexHtmlString = fs.readFileSync(path.resolve(__dirname, "../template/indexHtml/" + config.tech + ".html"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/index.html"), indexHtmlString);
  var indexJsString = fs.readFileSync(path.resolve(__dirname, "../template/indexJs/" + config.tech + ".js"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/index.js"), indexJsString);
  console.log("Sakura-cli:", chalk.green("→ create index.js, index.html success"));
}

const renderGulpfile = (config) => {
  var gulpfileString = fs.readFileSync(path.resolve(__dirname, "../template/gulpfile.js"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/gulpfile.js"), gulpfileString);
  console.log("Sakura-cli:", chalk.green("→ create gulpfile.js success"));
}

const renderStyle = (config) => {
  var styleString = fs.readFileSync(path.resolve(__dirname, "../template/style.scss"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "./" + config.name + "/style.scss"), styleString);
  console.log("Sakura-cli:", chalk.green("→ create style.scss success"));
}

module.exports = (config) => {
  prompt.start();
  prompt.get(schema(config.name), (err, result) => {
    Object.keys(result).forEach(key => {
      if (result[key] == "") {
        delete result[key];
      }
    })
    const outConfig = buildConfig(config.name, result);
    createDir(outConfig);
    renderPackageJson(outConfig);
    renderWebpackConfig(outConfig);
    renderSakuraConfig(outConfig);
    renderIndex(outConfig);
    renderGulpfile(outConfig);
    renderStyle(outConfig);
  })
}
