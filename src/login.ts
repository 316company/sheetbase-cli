import chalk from "chalk";

import * as google from './lib/google';

export default async () => {
    const client = await google.getClient();
    if(client)
        return console.log('Already login!');
    
    await google.authorization();
    console.log(chalk.green('Login success!'));
    process.exit();
}