const chalk         = require('chalk');
const opn           = require('opn');

const file = require('./lib/file');

async function getConfigs() {
    let configs = {};

    try {
        let text = '';
        
        text = file.readText('./sheetbase.config.json');
        configs.projectFolder = (text.match(/\"driveFolder\"\: \"(.*?)\"/)||[])[1];

        text = file.readText('./backend/configs/Sheetbase.config.js');
        configs.database = (text.match(/\"database\"\: \"(.*?)\"/)||[])[1];
        configs.databaseBackend = (text.match(/\"databaseBackend\"\: \"(.*?)\"/)||[])[1];

        text = file.readText('./backend/.clasp.json');        
        configs.backendScript = (text.match(/\"scriptId\"\: \"(.*?)\"/)||[])[1];
    } catch(error) {}

    return configs;
}

module.exports = {

    run: async (configKey) => {
        const configs = await getConfigs();

        // build link
        let configUrls = {};
        if(configs.projectFolder)
            configUrls.projectFolder = 'https://drive.google.com/drive/folders/'+ configs.projectFolder;
        if(configs.backendScript)
            configUrls.backendScript = 'https://script.google.com/d/'+ configs.backendScript +'/edit';
        if(configs.database)
            configUrls.database = 'https://docs.google.com/spreadsheets/d/'+ configs.database +'/edit';
        if(configs.databaseBackend)
            configUrls.databaseBackend = 'https://docs.google.com/spreadsheets/d/'+ configs.databaseBackend +'/edit';

        if(configKey) {
            let linkToOpen = '';
            if(typeof configKey !== 'string') {
                linkToOpen = configUrls.projectFolder;
            } else {
                linkToOpen = configUrls[configKey];
            }
            if(linkToOpen) {
                opn(linkToOpen);
                console.log('Open link in browser: '+ linkToOpen);
            }
        } else {
            let mineMessage = '';
            mineMessage += '+ Drive folder [projectFolder]: '+ chalk.green(
                configUrls.projectFolder||'n/a'
            );
            mineMessage += '\n+ Backend script [backendScript]: '+ chalk.green(
                configUrls.backendScript||'n/a'
            );
            mineMessage += '\n+ Database [database]: '+ chalk.green(
                configUrls.database||'n/a'
            );
            mineMessage += '\n+ Backend Database [databaseBackend]: '+ chalk.green(
                configUrls.databaseBackend||'n/a'
            );
    
            console.log('\n');
            console.log(mineMessage);
            console.log('\n');
        }

        
    }

}