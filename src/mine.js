const chalk         = require('chalk');
const opn           = require('opn');

const file = require('./lib/file');
const config = require('./lib/config');

module.exports = {

    run: async (configKey) => {
        
        if (!file.fileExists('./sheetbase.config.json')) {
            return console.log(
                chalk.red('\n Looks like you are not in a Sheetbase project!')
            );
        }

        const configs = await config.getConfigs();

        if(configKey) {
            let linkToOpen = '';
            if(typeof configKey !== 'string') {
                linkToOpen = configs.projectFolderUrl;
            } else {
                linkToOpen = configs[configKey +'Url'];
            }
            if(linkToOpen) {
                opn(linkToOpen);
                console.log('\nOpen link in browser: '+ chalk.green(linkToOpen));
            }
        } else {
            let mineMessage = '';
            mineMessage += '\n+ Backend [backend]: '+ chalk.green(
                configs.backendUrl||'n/a'
            );
            mineMessage += '+ Drive folder [projectFolder]: '+ chalk.green(
                configs.projectFolderUrl||'n/a'
            );
            mineMessage += '\n+ Backend script [backendScript]: '+ chalk.green(
                configs.backendScriptUrl||'n/a'
            );
            mineMessage += '\n+ Database [database]: '+ chalk.green(
                configs.databaseUrl||'n/a'
            );
            mineMessage += '\n+ Backend Database [databaseBackend]: '+ chalk.green(
                configs.databaseBackendUrl||'n/a'
            );
    
            console.log('\n');
            console.log(mineMessage);
            console.log('\n');
        }

        
    }

}