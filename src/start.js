const CLI           = require('clui');
const Spinner       = CLI.Spinner;
const chalk         = require('chalk');
const git           = require('simple-git/promise');
const replace       = require('replace-in-file');
const randomstring  = require("randomstring");
const execSync      = require('child_process').execSync;
const editJsonFile  = require("edit-json-file");

const file = require('./lib/file');
const inquirer = require('./lib/inquirer');
const google = require('./lib/google');

function isValidGitUrl(str) {
    return str && str.substr(0, 8) === 'https://' && str.substr(str.length - 4, 4) === '.git';
}

async function getDatabases(dir) {
    let database = null;
    let databaseBackend = null;

    try {
        let text = file.readText('./'+ dir +'/backend/configs/Sheetbase.config.js');
        database = (text.match(/\"database\"\: \"(.*?)\"/)||[])[1];
        databaseBackend = (text.match(/\"databaseBackend\"\: \"(.*?)\"/)||[])[1];
    } catch(error) {
        console.error('\n\n\nGet databases: ', error);
    }

    return {
        database,
        databaseBackend
    };
}

async function setupDrive(projectName, databaseId, databaseBackendId) {
    projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);
    
    const client = await google.getClient();
    if(!client) return false;

    let projectFolder = null;
    let contentFolder = null;
    let backendScript = null;
    let database = null;
    let databaseBackend = null;

    try {
        let projectFolderResponse = await client.request({
            method: 'post',
            url: 'https://www.googleapis.com/drive/v3/files',
            data: {
                'name': 'Sheetbase Project: '+ projectName,
                'mimeType': 'application/vnd.google-apps.folder'
            }
        });
        if(projectFolderResponse.data.id) {
            // projectFolder
            projectFolder = projectFolderResponse.data.id;
            
            // content Folder
            let contentFolderResponse = await client.request({
                method: 'post',
                url: 'https://www.googleapis.com/drive/v3/files',
                data: {
                    'name': 'content',
                    'mimeType': 'application/vnd.google-apps.folder',
                    'parents': [projectFolder]
                }
            });
            if(contentFolderResponse.data.id) contentFolder = contentFolderResponse.data.id;
    
            // database
            if(databaseId) {
                let databaseResponse = await client.request({
                    method: 'post',
                    url: 'https://www.googleapis.com/drive/v3/files/'+ databaseId +'/copy',
                    data: {
                        'name': projectName +' Database',
                        'parents': [projectFolder]
                    }
                });
                if(databaseResponse.data.id) database = databaseResponse.data.id;
            }
    
            // databaseBackend
            if(databaseBackendId) {
                let databaseBackendResponse = await client.request({
                    method: 'post',
                    url: 'https://www.googleapis.com/drive/v3/files/'+ databaseBackendId +'/copy',
                    data: {
                        'name': projectName +' Database (Backend)',
                        'parents': [projectFolder]
                    }
                });
                if(databaseBackendResponse.data.id) databaseBackend = databaseBackendResponse.data.id;            
            }
            
            // backendScript
            let backendScriptResponse = await client.request({
                method: 'post',
                url: 'https://script.googleapis.com/v1/projects',
                data: {
                    'title': projectName +' Backend',
                    'parentId': projectFolder
                }
            });
            if(backendScriptResponse.data.scriptId) backendScript = backendScriptResponse.data.scriptId;
            
        }
    } catch(error) {
        console.error('\n\n\nDrive setup: ', error);
    }


    return {
        projectFolder,
        contentFolder,
        backendScript,
        database,
        databaseBackend
    };
}

module.exports = {

    run: async (repo, dir, remote) => {
        var _this = this;

        if (repo.substr(0, 18) !== 'https://github.com' && repo.substr(repo.length - 4, 4) !== '.git')
            repo = 'https://github.com/316Company/sheetbase-' + repo + '.git';

        if (file.directoryExists('./' + dir)) {
            return console.log(
                chalk.red('Directory exists, try other name or delete it!')
            );
        }

        if (!file.isValid(dir)) {
            return console.log(
                chalk.red('Invalid directory name!')
            );
        }

        // step 1: clone repo
        let status = new Spinner('Creating new project ...'); status.start();
        try {
            await git().clone(repo, dir);

            if (!file.fileExists('./' + dir + '/sheetbase.config.json')) {
                console.log(
                    chalk.yellow('\n(!) Looks like the repo is not a valid Sheetbase theme! Repo: ' + repo)
                );
            }
        } catch (error) {
            status.stop();
            return console.log(
                chalk.red('\nRepo not exists or errors happen! Repo: ' + repo)
            );
        }

        // setup drive
        const databases = await getDatabases(dir);
        const driveIds = await setupDrive(
            dir, databases.database, databases.databaseBackend
        );        

        // random data
        const apiKey = randomstring.generate();
        const encryptionKey = randomstring.generate({
            length: 12,
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$%&*'
        });


        // step 2: config
        try {
            let filePath = '';
            let jsonFile = null;

            // package.json
            filePath = './' + dir + '/package.json';
            jsonFile = editJsonFile(filePath);
            jsonFile.set('name', dir);
            jsonFile.save();

            // sheetbase.config.json
            filePath = './' + dir + '/sheetbase.config.json';
            if (file.fileExists(filePath)) {
                jsonFile = editJsonFile(filePath);
                jsonFile.set('name', dir);
                jsonFile.set('driveFolder', driveIds.projectFolder||'');
                jsonFile.save();
            }

            // backend/.clasp.json
            filePath = './' + dir + '/backend/.clasp.json';
            jsonFile = editJsonFile(filePath);
            jsonFile.set('scriptId', driveIds.backendScript||'<scriptId>');
            jsonFile.save();


            // backend/configs/Sheetbase.config.js
            filePath = './' + dir + '/backend/configs/Sheetbase.config.js';
            if (file.fileExists(filePath)) {
                await replace({
                    files: filePath,
                    from: [
                        /\"apiKey\"\: \".*\"/,
                        /\"encryptionKey\"\: \".*\"/,

                        /\"database\"\: \".*\"/,
                        /\"backend\"\: \".*\"/,

                        /\"contentFolder\"\: \".*\"/,
                        /\"databaseBackend\"\: \".*\"/
                    ],
                    to: [
                        '\"apiKey\": \"' + apiKey + '\"',
                        '\"encryptionKey\": \"' + encryptionKey + '\"',

                        '\"database\"\: \"'+ (driveIds.database||'<your_spreadsheet_id>') +'\"',
                        '\"backend\"\: \"<your_webapp_id>\"',

                        '\"contentFolder\"\: \"'+ (driveIds.contentFolder||'<your_folder_id>') +'\"',
                        '\"databaseBackend\"\: \"'+ (driveIds.databaseBackend||'<your_spreadsheet_id>') +'\"'
                    ]
                });
            }

            // src/configs/sheetbase.config.ts
            filePath = './' + dir + '/src/configs/sheetbase.config.ts';
            if (file.fileExists(filePath)) {
                await replace({
                    files: filePath,
                    from: [
                        /\"apiKey\"\: \".*\"/,

                        /\"database\"\: \".*\"/,
                        /\"backend\"\: \".*\"/
                    ],
                    to: [
                        '\"apiKey\"\: \"' + apiKey + '\"',

                        '\"database\"\: \"'+ (driveIds.database||'<your_spreadsheet_id>') +'\"',
                        '\"backend\"\: \"<your_webapp_id>\"'
                    ]
                });
            }

        } catch (error) {
            status.stop();
            return console.log(
                chalk.red('\nError setting up project configuration!')
            );
        }

        // TODO: push apps script

        // step 3: git
        await file.rmDir('./' + dir + '/.git');
        await git('./' + dir).init();
        await git('./' + dir).add('./*');
        await git('./' + dir).commit('Initial commit');
        if(remote) {
            // setup remote
            status.stop();
            try {                
                if (typeof remote !== 'string') {
                    const remoteAnswers = await inquirer.askForRemoteRepo();
                    remote = remoteAnswers.remote;
                }
                if(isValidGitUrl(remote)) {
                    await git('./' + dir).addRemote('origin', remote);
                }
            } catch (error) {
                return console.log(
                    chalk.red('\nError setting up git! You may check your .git URL or connection.')
                );
            }
        } else {
            status.stop();
        }
        
        console.log('\n'+ chalk.green('New Sheetbase project created successfully!'));

        // step 4: install packages
        console.log('\nInstalling packages ...');
        try {
            await execSync('npm install', {cwd: './'+ dir, stdio: 'inherit'});
        } catch(error) {
            status.stop();
            return console.log(
                chalk.red('\nError trying install packages.')
            );
        }

        // final: response
        let suggestCommandsMessage = '   $ ' + chalk.green(
            'cd ./' + dir
        )
        if (driveIds.backendScript) {
            suggestCommandsMessage += '\n   $ ' + chalk.green(
                'clasp push'
            );
            suggestCommandsMessage += '\n   + Deploy backend script as Web App (see link below), then:';
            suggestCommandsMessage += '\n   $ '+ chalk.green('sheetbase config backend=<your_webapp_id>');
        }
        if (isValidGitUrl(remote))
            suggestCommandsMessage += '\n   $ ' + chalk.green(
                'git push -u origin master'
            );
        

        let projectPropertiesMessage = '   Remote repo: '+ chalk.green(
            isValidGitUrl(remote) ? remote: 'n/a'
        );
        projectPropertiesMessage += '\n   Drive folder: '+ chalk.green(
            driveIds.projectFolder ? 'https://drive.google.com/drive/folders/'+ driveIds.projectFolder: 'n/a'
        );
        projectPropertiesMessage += '\n   Backend script: '+ chalk.green(
            driveIds.backendScript ? 'https://script.google.com/d/'+ driveIds.backendScript +'/edit': 'n/a'
        );
        projectPropertiesMessage += '\n   Database: '+ chalk.green(
            driveIds.database ? 'https://docs.google.com/spreadsheets/d/'+ driveIds.database +'/edit': 'n/a'
        );
        projectPropertiesMessage += '\n   Database (backend): '+ chalk.green(
            driveIds.databaseBackend ? 'https://docs.google.com/spreadsheets/d/'+ driveIds.databaseBackend +'/edit': 'n/a'
        );

        
        console.log('\n\n\nDone! What next?\n');
        console.log(suggestCommandsMessage);
        
        console.log('\nProject properties:\n');
        console.log(projectPropertiesMessage);
        console.log('\n');

    }

}