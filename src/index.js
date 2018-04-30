#!/usr/bin/env node

const program     = require('commander');
const chalk       = require('chalk');
const figlet       = require('figlet');

const start = require('./start');

program
  .version('0.0.1', '-v, --version')
  .description('Sheetbase CLI');

program
  .command('help').alias('h')
  .description('Output help')
  .action(() => {
    console.log(chalk.yellow(
      figlet.textSync('Sheetbase', { horizontalLayout: 'full' })
    ));
    program.outputHelp();
  });

program
  .command('start <dirName>').alias('s')
  .description('Start a new project in directory <dirName>')
  .option('-t, --theme [theme]', 'Official theme name or theme repo .git URL', 'ionic-starter')
  .option('-r, --remote [remote]', 'Setup remote for the project')
  .action((dirName, cmd) => {
    start.run(cmd.theme, dirName, cmd.remote);
  });

// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[(-v)(-h)s]/.test(process.argv.slice(2))) {
  console.log(chalk.yellow(
    figlet.textSync('Sheetbase', { horizontalLayout: 'full' })
  ));
  program.outputHelp();
  process.exit();
}
program.parse(process.argv);