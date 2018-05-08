import chalk from "chalk";
const opn = require('opn'); 

import * as config from "./lib/config";
import { IAppConfig } from "./lib/config";
import * as project from "./lib/project";
import * as misc from "./lib/misc";

import { IAppConfigUrls } from "./lib/misc";

export default async (toBeOpened: string = null) => {
    
    if (!project.isValid()) {
        return console.log(
            chalk.red('\n Looks like you are not in a Sheetbase project!')
        );
    }

    const projectConfigs = await project.getConfig();
    const appConfigs = await config.get();
    let configs: IAppConfig = Object.assign({}, projectConfigs, appConfigs);
    
    const urls: IAppConfigUrls =  misc.buildConfigLinks(configs);    

    if(toBeOpened) {
        let linkToOpen = '';
        if(typeof toBeOpened !== 'string') {
            toBeOpened = 'driveFolderUrl';
        }
        linkToOpen = urls[toBeOpened];
        if(linkToOpen) {
            opn(linkToOpen);
            console.log('\nOpen link in browser ['+ toBeOpened +']: '+ chalk.green(linkToOpen));
        } else {
            console.log(chalk.red('\nNo link for ['+ toBeOpened +'] to be opened.'));
        }
    } else {
        let mineMessage = '';
        mineMessage += '\n+ Backend URL [backendUrl]: '+ chalk.green(
            urls.backendUrl||'n/a'
        );
        mineMessage += '\n+ Project folder URL [driveFolderUrl]: '+ chalk.green(
            urls.driveFolderUrl||'n/a'
        );
        mineMessage += '\n+ Backend script URL [scriptUrl]: '+ chalk.green(
            urls.scriptUrl||'n/a'
        );
        mineMessage += '\n+ Database URL [databaseUrl]: '+ chalk.green(
            urls.databaseUrl||'n/a'
        );
        mineMessage += '\n+ Content folder URL [contentFolderUrl]: '+ chalk.green(
            urls.contentFolderUrl||'n/a'
        );

        console.log(mineMessage);
    }

    
}