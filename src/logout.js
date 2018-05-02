const chalk           = require('chalk');

const google = require('./lib/google');

module.exports = {

    run: () => {
        console.log(chalk.green('You logged out!'));
        return google.deauthorization();
    }

};