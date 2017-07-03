import path from 'path'
import fs from 'fs';
import axios from 'axios';
const pwd = process.cwd();
import chalk from 'chalk';

module.exports = () => {
  var sakuraConfig;
  var resources;
  try {
    sakuraConfig = require(path.resolve(pwd, './sakura.config.json'));
  } catch (e) {
    console.log(chalk.red("Error → without sakura config file"))
    process.exit(1);
  }
  try {
    resources = require(path.resolve(pwd, "./sakura.resources.json"));
  } catch (e) { /* handle error */ }
  const appid = sakuraConfig.appid;
  var sakuraServer = sakuraConfig.sakuraServer;
  axios.post(sakuraServer + `/api/apps/${appid}/all`, {
    config: sakuraConfig.config,
    resources
  }).then(response => {
    if (response.status == 200 && response.data) {
      console.log(chalk.green("→ success upload"))
    } else {
      console.log(chalk.red("→ fail upload with status: " + response.status))
    }
  }).catch(error => {
    console.log(chalk.red("→ fail upload with code: " + error.code))
  })
}
