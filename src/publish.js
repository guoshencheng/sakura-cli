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
  try {
    resources = require(path.resolve(pwd, "./sakura.resources.json"));
  } catch (e) { /* handle error */ }
  const appid = sakuraConfig.appid;
  var sakuraServer = sakuraConfig.sakuraServer;
  axios.post(sakuraServer + `/api/v1/webapps/${appid}/resources`, {
    javascripts: resources.javascripts.join(','),
    styles: resources.styles.join(','),
    version: resources.hash
  }).then(response => {
    if (response.status == 200 && response.data) {
      console.log(chalk.green("→ success upload"))
    } else {
      console.log(chalk.red("→ fail upload with status: " + response.status))
    }
  }).catch(error => {
    console.log(chalk.red("→ fail upload"))
  })
}
