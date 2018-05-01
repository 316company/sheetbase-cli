#!/usr/bin/env node

const program     = require('commander');
const chalk       = require('chalk');
const figlet       = require('figlet');

const login = require('./login');
const logout = require('./logout');
const start = require('./start');
const mine = require('./mine');
const config = require('./config');

program
  .version('0.0.1', '-v, --version')
  .description('Sheetbase CLI');

program
  .command('help').alias('h')
  .description('Output help')
  .action(() => {
    program.outputHelp();
  });

program
  .command('login').alias('i')
  .description('Login into your Google account.')
  .action((cmd) => {
    login.run();
  });

program
  .command('logout').alias('o')
  .description('Logout of your Google account.')
  .action((cmd) => {
    logout.run();
  });

program
  .command('start <dirName>').alias('s')
  .description('Start a new project in directory <dirName>.')
  .option('-t, --theme [theme]', 'Official theme name or theme repo .git URL', 'ionic-starter')
  .option('-r, --remote [remote]', 'Setup remote for the project')
  .action((dirName, cmd) => {
    start.run(cmd.theme, dirName, cmd.remote);
  });

program
  .command('mine').alias('m')
  .description('View useful project properties.')
  .option('-o, --open [configKey]', 'Open link in browser')
  .action((cmd) => {
    mine.run(cmd.open);
  });

program
  .command('config <data>').alias('c')
  .description('Set config for the project.')
  .action((data, cmd) => {
    config.run(data);
  });


// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[(-v)(-h)hiosmc]/.test(process.argv.slice(2))) {
  console.log(chalk.yellow(figlet.textSync('Sheetbase', { horizontalLayout: 'full' })));
  program.outputHelp();
  process.exit();
}
program.parse(process.argv);