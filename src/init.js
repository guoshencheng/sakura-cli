const cwd = process.cwd();
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

module.exports = (config) => {
  var defaultConfig = require('../template/sakura.default.config.json');
  fs.writeFileSync(path.resolve(cwd, "./sakura.config.js"), JSON.stringify(defaultConfig, null, "  "));
}
