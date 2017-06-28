var program = require('commander');
const packageJson = require('./package.json');
const chalk = require('chalk');
const lib = require('./lib');
program.version(packageJson.version)
.command("create <name>").action(function(name) {
  console.log(chalk.yellow("CREATE => TODO add create command handler, write code here"), { name });
  lib.craete({ name });
  //TODO: add create command handler
})
program.option("-n --normal")
.command("init").action(function() {
  console.log(chalk.yellow("INIT => TODO add init command handler, write code here"), { roadhog: program.roadhog, normal: program.normal });
  lib.init({})
  //TODO: add init command handler
})
program.command("publish").action(function() {
  lib.publish()
})

program.parse(process.argv);
