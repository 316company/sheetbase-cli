const CLI           = require('clui');
const Spinner       = CLI.Spinner;
const chalk         = require('chalk');
const git           = require('simple-git/promise');
const replace       = require('replace-in-file');
var randomstring    = require("randomstring");
const execSync      = require('child_process').execSync;

const file = require('./lib/file');
const inquirer = require('./lib/inquirer');

function isValidGitUrl(str) {
    return str && str.substr(0, 8) === 'https://' && str.substr(str.length - 4, 4) === '.git';
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
        } catch (error) {
            status.stop();
            return console.log(
                chalk.red('\nRepo not exists or errors happen! Repo: ' + repo)
            );
        }

        // step 2: config
        try {
            // sheetbase.config.json
            await replace({
                files: './' + dir + '/sheetbase.config.json',
                from: /\"name\"\: \".*\"/,
                to: '\"name\"\: \"' + dir + '\"'
            });

            // package.json
            await replace({
                files: './' + dir + '/package.json',
                from: /\"name\"\: \".*\"/,
                to: '\"name\"\: \"' + dir + '\"'
            });

            // TODO: create neccessary files in drive and setup values accordingly

            const apiKey = randomstring.generate();
            const encryptionKey = randomstring.generate({
                length: 12,
                charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$%&*'
            });

            // backend/configs/Sheetbase.config.js
            await replace({
                files: './' + dir + '/backend/configs/Sheetbase.config.js',
                from: [
                    /apiKey\: \'.*\'/,
                    /encryptionKey\: \'.*\'/,

                    /database\: \'.*\'/,
                    /backend\: \'.*\'/,
                    /contentFolder\: \'.*\'/,
                    /databaseBackend\: \'.*\'/
                ],
                to: [
                    'apiKey: \'' + apiKey + '\'',
                    'encryptionKey: \'' + encryptionKey + '\'',

                    'database\: \'<your_spreadsheet_id>\'',
                    'backend\: \'<your_webapp_id>\'',
                    'contentFolder\: \'<your_folder_id>\'',
                    'databaseBackend\: \'<your_spreadsheet_id>\''
                ]
            });

            // src/configs/sheetbase.config.ts
            await replace({
                files: './' + dir + '/src/configs/sheetbase.config.ts',
                from: [
                    /apiKey\: \'.*\'/,

                    /database\: \'.*\'/,
                    /backend\: \'.*\'/
                ],
                to: [
                    'apiKey: \'' + apiKey + '\'',

                    'database\: \'<your_spreadsheet_id>\'',
                    'backend\: \'<your_webapp_id>\''
                ]
            });

        } catch (error) {
            status.stop();
            return console.log(
                chalk.red('\nError setting up project configuration!')
            );
        }

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
        
        console.log('\nClone repo ... '+ chalk.green('Done'));
        console.log('Config project ... '+ chalk.green('Done'));
        console.log('Setup git ... '+ chalk.green('Done'));

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
        if (file.fileExists('./' + dir + '/sheetbase.config.json')) {

            console.log('\nDone! What next?\n');
            let suggestCommandsMessage = '   $ ' + chalk.green('cd ./' + dir)
            if (isValidGitUrl(remote)) suggestCommandsMessage += '\n   $ ' + chalk.green('git push -u origin master');
            console.log(suggestCommandsMessage);

            console.log('\nProject properties:\n');
            let projectPropertiesMessage = '   Drive folder: '+ chalk.green('n/a');
                projectPropertiesMessage += '\n   Remote repo: '+ chalk.green(isValidGitUrl(remote) ? remote: 'n/a');
            console.log(projectPropertiesMessage);
        } else {
            console.log(
                chalk.yellow('\n(!) Looks like the repo is not a valid Sheetbase theme! Repo: ' + repo)
            );
        }

    }

}