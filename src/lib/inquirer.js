const inquirer    = require('inquirer');

module.exports = {
    
    askForRemoteRepo: () => {
        console.log('\nSet up remote repo, enter a valid .git url.');
        const questions = [
            {
              type : 'input',
              name : 'remote',
              message : 'Remote repo:'
            }
        ];
        return inquirer.prompt(questions);
    },

    askForBackendId: () => {
        console.log('\nOpen the apps script project, deploy version 1 as Web App, get the Web App ID and update the config.');
        const questions = [
            {
              type : 'input',
              name : 'backend',
              message : 'Web app Id:'
            }
        ];
        return inquirer.prompt(questions);
    }
}