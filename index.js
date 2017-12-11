#! /usr/bin/env node

"use strict"

var program = require('commander');
const packageJson = require('./package.json');
const chalk = require('chalk');
const lib = require('./lib');
program.version(packageJson.version)
.command("create <name>").action(function(name) {
  lib.craete({ name });
  //TODO: add create command handler
})
program.option("-n --normal")
.command("init").action(function() {
  lib.init({})
  console.log(chalk.yellow("→ NEXT: try to add Sakura-Webpack-Plugin to your project"));
  //TODO: add init command handler
})
program.command("publish").action(function() {
  lib.publish()
})

program.command("proxy").action(function() {
  lib.proxy();
})

program.command("start").action(function() {
  lib.start();
})

program.parse(process.argv);
