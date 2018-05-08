import chalk from "chalk";

import * as google from "./lib/google";

export default async () => {
    const user = await google.verify();
    
    if(!user) {
        return console.log('\n'+
            chalk.yellow('Please login to view you profile!') +'\n'+
            '$ '+ chalk.green('sheetbase login')
        );
    }
    
    console.log(
        '\nYou logged in as:'+
        '\n+ Email: '+ chalk.green(user.email)+
        '\n+ Access token: '+ chalk.green(user.accessToken)
    );
}