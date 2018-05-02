const chalk           = require('chalk');

const google = require('./lib/google');

module.exports = {

    run: async () => {
        const user = await google.verify();
        if(!user)
            return console.log(
                chalk.yellow('Please login to view you profile!') +'\n'+
                '$ '+ chalk.green('sheetbase login')
            );
        
        console.log(
            '\nYou logged in as:'+
            '\n+ Email: '+ chalk.green(user.email)+
            '\n+ Access token: '+ chalk.green(user.accessToken)
        );
    }

}