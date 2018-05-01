const replace       = require('replace-in-file');
const chalk         = require('chalk');

const file = require('./lib/file');

module.exports = {

    run: async (data) => {
        let configData = {};
        let multipleSplit = data.split('|');
        multipleSplit.forEach(single => {
            let singleSplit = single.trim().split('=');
            if(singleSplit[1]) {
                configData[singleSplit[0].trim()] = singleSplit[1].trim();
            }
        });

        let appConfigFrom = []; let appConfigTo = [];
        let backendConfigFrom = []; let backendConfigTo = [];
        for(let key in configData) {
            switch(key) {
                case 'apiKey':
                    appConfigFrom.push(/\"apiKey\"\: \".*\"/);
                    appConfigTo.push('\"apiKey\": \"' + configData[key] + '\"');
                    backendConfigFrom.push(/\"apiKey\"\: \".*\"/);
                    backendConfigTo.push('\"apiKey\": \"' + configData[key] + '\"');
                break;

                case 'encryptionKey':
                    backendConfigFrom.push(/\"encryptionKey\"\: \".*\"/);
                    backendConfigTo.push('\"encryptionKey\": \"' + configData[key] + '\"');
                break;

                case 'database':
                    appConfigFrom.push(/\"database\"\: \".*\"/);
                    appConfigTo.push('\"database\": \"' + configData[key] + '\"');
                    backendConfigFrom.push(/\"database\"\: \".*\"/);
                    backendConfigTo.push('\"database\": \"' + configData[key] + '\"');
                break;

                case 'backend':
                    appConfigFrom.push(/\"backend\"\: \".*\"/);
                    appConfigTo.push('\"backend\": \"' + configData[key] + '\"');
                    backendConfigFrom.push(/\"backend\"\: \".*\"/);
                    backendConfigTo.push('\"backend\": \"' + configData[key] + '\"');
                break;

                case 'contentFolder':
                    backendConfigFrom.push(/\"contentFolder\"\: \".*\"/);
                    backendConfigTo.push('\"contentFolder\": \"' + configData[key] + '\"');
                break;

                case 'databaseBackend':
                    backendConfigFrom.push(/\"databaseBackend\"\: \".*\"/);
                    backendConfigTo.push('\"databaseBackend\": \"' + configData[key] + '\"');
                break;
            }
        }

        let appConfigPath = './src/configs/sheetbase.config.ts';
        let backendConfigPath = './backend/configs/Sheetbase.config.js';
        if (file.fileExists(appConfigPath)) {
            await replace({
                files: appConfigPath,
                from: appConfigFrom,
                to: appConfigTo
            });
        }
        if (file.fileExists(backendConfigPath)) {
            await replace({
                files: backendConfigPath,
                from: backendConfigFrom,
                to: backendConfigTo
            });
        }

        console.log(chalk.green('Config updated!'));
    }

}