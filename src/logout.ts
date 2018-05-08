import chalk from "chalk";

import * as google from "./lib/google";

export default () => {
    console.log(chalk.green('You logged out!'));
    return google.deauthorization();
}