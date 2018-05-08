import chalk from "chalk";

import * as config from "./lib/config";
import * as project from "./lib/project";
import * as inquirer from "./lib/inquirer";

import { IAppConfig } from "./lib/config";

export default async (action, data) => {
    if (!project.isValid()) {
        return console.log(
            chalk.red('\n Looks like you are not in a Sheetbase project!')
        );
    }

    if(action === 'set') {
        if(data && typeof data === 'string') {
            await setManual(data);
        } else {
            await set();
        }
    } else {
        await get();
    }
}

async function get() {
    let appConfigs: IAppConfig = await config.get();
    let configMessage: string = '';
    for(let key in appConfigs) {
        configMessage += `\n+ ${key}: `+ chalk.green(appConfigs[key]||'n/a');
    }
    console.log('\nProject configurations:');
    console.log(configMessage);
    console.log('\n');
}

async function setManual(data) {

    let configData = {};
    let multipleSplit = data.split('|');
    multipleSplit.forEach(single => {
        let singleSplit = single.trim().split('=');
        if(singleSplit[1]) {
            configData[singleSplit[0].trim()] = singleSplit[1].trim();
        }
    });

    try {
        // app config
        await config.set(configData);
        console.log(chalk.green('\nConfig updated!'));
    } catch(error) {
        console.log(chalk.red('\nErrors setting config!'));
    }
}

async function set() {
    let answers = await inquirer.askForConfigs();
    for(let key in answers) {
        if(!answers[key]) delete answers[key];
    }
    try {
        await config.set(answers);
        console.log(chalk.green('\nConfig updated!'));
    } catch(error) {
        console.log(chalk.red('\nErrors setting config!'));
    }
}