import prompt from 'prompt';
import chalk from 'chalk';
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
const pwd = process.cwd()

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
      },
      gitUrl: {
        description: "请输入项目仓库地址(git)",
        require: true
      }
    }
  }
}

const buildConfig = (name, config) => {
  return Object.assign({ name, gitUrl: "", tech: "normal" }, config);
}

const createDir = (config) => {
  try {
    fs.mkdirSync(path.resolve(pwd, "./" + config.name))
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
  fs.writeFileSync(path.resolve(pwd, "./" + config.name + "/package.json"), fileString)
}

const renderWebpackConfig = (config) => {
  var webpackDevString = fs.readFileSync(path.resolve(__dirname, "../template/webpack.config.dev/" + config.tech + ".js"), "utf-8");
  fs.writeFileSync(path.resolve(pwd, "./" + config.name + "/webpack.config.js"), webpackDevString);
  var webpackProString = fs.readFileSync(path.resolve(__dirname, "../template/webpack.config.pro/" + config.tech + ".js"), "utf-8");
  fs.writeFileSync(path.resolve(pwd, "./" + config.name + "/webpack.config.product.js"), webpackProString);
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
  })
}
