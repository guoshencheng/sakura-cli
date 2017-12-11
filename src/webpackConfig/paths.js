const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPublic: resolveApp('public'),
  appIndexJs: resolveApp('src/index.js'),
  appBuild: resolveApp("dist"),
  packageJson: resolveApp('package.json').
  yarnLockFile: resolveApp('yarn.lock')
}
