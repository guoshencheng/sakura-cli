var program = require('commander');
var packageJson = require('./package.json');
var chalk = require('chalk');
program.version(packageJson.version)
.option("-r --roadhog")
.option("-n --normal")
.command("init").action(function() {
  console.log(chalk.yellow("INIT => TODO add init command handler, write code here"), {
    roadhog: program.roadhog,
    normal: program.normal
  });
  //TODO: add init command handler
})
.command("publish").action(function() {

})
program.parse(process.argv);
