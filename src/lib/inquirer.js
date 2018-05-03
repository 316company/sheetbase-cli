const inquirer    = require('inquirer');

module.exports = {
    
    askForRemoteRepo: () => {
        console.log('\nSet up remote repo, enter a valid .git url.');
        const questions = [
            {
              type : 'input',
              name : 'remoteUrl',
              message : 'Remote repo:'
            }
        ];
        return inquirer.prompt(questions);
    },

    askForBackendId: () => {
        console.log('\nOpen the apps script project, deploy version 1 as Web App, get the Web App URL and update the config.');
        const questions = [
            {
              type : 'input',
              name : 'backendUrl',
              message : 'Web app Url:'
            }
        ];
        return inquirer.prompt(questions);
    }
}