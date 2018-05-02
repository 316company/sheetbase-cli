const replace       = require('replace-in-file');
const chalk         = require('chalk');

const file = require('./lib/file');

module.exports = {

    run: async (data) => {

        if (!file.fileExists('./sheetbase.config.json')) {
            return console.log(
                chalk.red('\n Looks like you are not in a Sheetbase project!')
            );
        }

        let configData = {};
        let multipleSplit = data.split('|');
        multipleSplit.forEach(single => {
            let singleSplit = single.trim().split('=');
            if(singleSplit[1]) {
                configData[singleSplit[0].trim()] = singleSplit[1].trim();
            }
        });

        let backendConfigFrom = []; let backendConfigTo = [];
        let appConfigFrom = []; let appConfigTo = [];
        for(let key in configData) {
            switch(key) {
                case 'apiKey':
                    backendConfigFrom.push(/\"apiKey\"\: \".*\"/);
                    backendConfigTo.push('\"apiKey\": \"' + configData[key] + '\"');
                    appConfigFrom.push(/\"apiKey\"\: \".*\"/);
                    appConfigTo.push('\"apiKey\": \"' + configData[key] + '\"');
                break;

                case 'database':
                    backendConfigFrom.push(/\"database\"\: \".*\"/);
                    backendConfigTo.push('\"database\": \"' + configData[key] + '\"');
                    appConfigFrom.push(/\"database\"\: \".*\"/);
                    appConfigTo.push('\"database\": \"' + configData[key] + '\"');
                break;

                case 'backend':
                    appConfigFrom.push(/\"backend\"\: \".*\"/);
                    appConfigTo.push('\"backend\": \"' + configData[key] + '\"');
                break;

                case 'contentFolder':
                    backendConfigFrom.push(/\"contentFolder\"\: \".*\"/);
                    backendConfigTo.push('\"contentFolder\": \"' + configData[key] + '\"');
                break;

                case 'encryptionKey':
                    backendConfigFrom.push(/\"encryptionKey\"\: \".*\"/);
                    backendConfigTo.push('\"encryptionKey\": \"' + configData[key] + '\"');
                break;
            }
        }

        let backendConfigPath = './backend/configs/Sheetbase.config.js';
        let appConfigPath = './src/configs/sheetbase.config.ts';
        if (file.fileExists(backendConfigPath)) {
            await replace({
                files: backendConfigPath,
                from: backendConfigFrom,
                to: backendConfigTo
            });
        }
        if (file.fileExists(appConfigPath)) {
            await replace({
                files: appConfigPath,
                from: appConfigFrom,
                to: appConfigTo
            });
        }

        console.log(chalk.green('Config updated!'));
    }

}