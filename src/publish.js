import path from 'path'
import fs from 'fs';
import axios from 'axios';
const pwd = process.cwd();
import chalk from 'chalk';

const env = process.env.NODE_ENV;

module.exports = () => {
  var sakuraConfig;
  var resources;
  try {
    sakuraConfig = require(path.resolve(pwd, './sakura.config.json'));
    if (sakuraConfig[env]) {
      sakuraConfig = Object.assign(sakuraConfig, sakuraConfig[env])
    }
    console.log(chalk.green("Read config success → " + JSON.stringify(sakuraConfig)))
  } catch (e) {
    console.log(chalk.red("Error → without sakura config file"))
    process.exit(1);
  }
  var defaultResources = sakuraConfig.defaultResources || {} ;
  try {
    resources = require(path.resolve(pwd, "./sakura.resources.json"));
  } catch (e) { /* handle error */ }
  const appid = sakuraConfig.appid;
  var sakuraServer = sakuraConfig.sakuraServer;
  var htmlPath = sakuraConfig.htmlPath;
  var type = sakuraConfig.type || 1;
  var html;
  if (type != 1) {
    if (htmlPath) {
      try {
        html = fs.readFileSync(path.resolve(pwd, htmlPath), "utf-8")
      } catch (e) {
        console.log(chalk.red('Error → without html file'))
        process.exit(1);
      }
    } else {
      console.log(chalk.red('Error → missing htmlPath option at sakura.config.json'))
      process.exit(1);
    }
  }
  axios.post(sakuraServer + `/api/v1/webapps/${appid}/resources`, {
    javascripts: resources.javascripts.concat(defaultResources.javascripts || []).join(','),
    styles: resources.styles.concat(defaultResources.styles || []).join(','),
    version: resources.hash,
    type, html
  }).then(response => {
    if (response.status == 200 && response.data) {
      console.log(chalk.green("→ success upload"))
    } else {
      console.log(chalk.red("→ fail upload with status: " + response.status))
    }
  }).catch(error => {
    console.log(error)
    console.log(chalk.red("→ fail upload"), "资源已上传或者资源服务器错误")
  })
}
