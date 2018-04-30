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
    }
}