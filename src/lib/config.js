const chalk         = require('chalk');

const file = require('./file');

module.exports = {

    getConfigs: async (dir) => {
        let configs = {};
    
        try {
            let rootDir = './'+ (dir?dir+'/':'');
            let text = '';
            
            // raw values
            text = file.readText(rootDir +'sheetbase.config.json');
            configs.projectFolder = (text.match(/\"driveFolder\"\: \"(.*?)\"/)||[])[1];
            text = file.readText(rootDir +'src/configs/sheetbase.config.ts');
            configs.database = (text.match(/\"database\"\: \"(.*?)\"/)||[])[1];
            configs.backend = (text.match(/\"backend\"\: \"(.*?)\"/)||[])[1];
            text = file.readText(rootDir +'backend/.clasp.json');
            configs.backendScript = (text.match(/\"scriptId\"\: \"(.*?)\"/)||[])[1];

            // verify values
            for(let key in configs) {
                if(configs[key].substr(0,1)==='<'&&configs[key].substr(configs[key].length-1,1)==='>') configs[key] = null; 
            }

            // build link
            if(configs.projectFolder) configs.projectFolderUrl = `https://drive.google.com/drive/folders/${configs.projectFolder}`;
            if(configs.backend) configs.backendUrl = `https://script.google.com/macros/s/${configs.backend}/exec`;
            if(configs.backendScript) configs.backendScriptUrl = `https://script.google.com/d/${configs.backendScript}/edit`;
            if(configs.database) configs.databaseUrl = `https://docs.google.com/spreadsheets/d/${configs.database}/edit`;

        } catch(error) {
            console.log(
                chalk.yellow('(!) Error getting database Ids from the config. You may copy the Spreadsheets manually.')
            );
        }
    
        return configs;
    }

}