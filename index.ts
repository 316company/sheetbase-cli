#!/usr/bin/env node

const program = require('commander');
import chalk from "chalk";
const figlet = require('figlet');

import login from "./src/login";
import logout from "./src/logout";
import whoami from "./src/whoami";
import start from "./src/start";
import setup from "./src/setup";
import url from "./src/url";
import config from "./src/config";

program
  .version('0.0.13', '-v, --version')
  .usage('sheetbase [options] [command]')
  .description('Sheetbase CLI');

program
  .command('login')
  .description('Login into your Google account.')
  .action((cmd) => {
    return login();
  });

program
  .command('logout')
  .description('Logout of your Google account.')
  .action((cmd) => {
    return logout();
  });

program
  .command('whoami')
  .description('Show your account info.')
  .action((cmd) => {
    return whoami();
  });

program
  .command('start <projectName>')
  .description('Start a new project in directory <projectName>.')
  .option('-t, --theme [theme]', 'Official theme name or theme repo .git URL', 'ionic-starter')
  .option('-x, --noNpmInstall', 'Do not install npm packages')
  .option('-u, --noGit', 'Do not setup GIT')
  .action((projectName, cmd) => {
    return start(projectName, cmd.theme, cmd.noNpmInstall, cmd.noGit);
  });

program
  .command('setup')
  .description('Setup the project.')
  .option('-x, --noNpmInstall', 'Do not install npm packages')
  .option('-u, --noGit', 'Do not setup GIT')
  .action((cmd) => {
    return setup(cmd.noNpmInstall, cmd.noGit);
  });

program
  .command('url')
  .description('View useful project urls.')
  .option('-o, --open [urlKey]', 'Open link in browser')
  .action((cmd) => {
    return url(cmd.open);
  });

program
  .command('config <action>')
  .description('Set config for the project.')
  .option('-m, --manual [data]', 'Manually set the configs')
  .action((action, cmd) => {
    return config(action, cmd.manual);
  });

program
  .command('help')
  .description('Output help')
  .action((cmd) => {
    console.log(chalk.yellow(figlet.textSync('Sheetbase', { horizontalLayout: 'full' })));
    return program.outputHelp();
  });

program
  .command('*', { isDefault: true })
  .description('Any other command is not supported')
  .action((cmd) => {
    console.log(chalk.red(`Unknown command "${cmd}"`));
  });

if (!process.argv.slice(2).length) {
  console.log(chalk.yellow(figlet.textSync('Sheetbase', { horizontalLayout: 'full' })));
  program.outputHelp();
}

program.parse(process.argv);