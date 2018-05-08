import chalk from "chalk";

import { IAppConfig } from "./config";
import { IProjectConfig } from "./project";

export interface IAppConfigUrls {
    driveFolderUrl?: string,
    scriptUrl?: string,
    databaseUrl?: string,
    backendUrl?: string,
    contentFolderUrl?: string
}

/**
 * Check is a string is a valid git url
 * @param str - Git url
 */
export function isValidGitUrl(str: string): boolean {
    return str && str.substr(0, 8) === 'https://' && str.substr(str.length - 4, 4) === '.git';
}

/**
 * Build app config links
 * @param input - App configs
 */
export function buildConfigLinks(input: IAppConfig): IAppConfigUrls {
    let result = {};    
    for(let key in input) {
        // backend url
        if(key === 'backendUrl') result['backendUrl'] =  input[key];
        // drive folder
        if(key === 'driveFolder') result['driveFolderUrl'] = `https://drive.google.com/drive/folders/${input[key]}`;
        // backend script
        if(key === 'scriptId') result['scriptUrl'] = `https://script.google.com/d/${input[key]}/edit`;
        // database
        if(key === 'databaseId') result['databaseUrl'] = `https://docs.google.com/spreadsheets/d/${input[key]}/edit`;
        // content folder
        if(key === 'contentFolder') result['contentFolderUrl'] = `https://drive.google.com/drive/folders/${input[key]}`;
    }
    return result;
}

/**
 * 
 * @param ids - Drive file ids to check
 */
export function driveSetupUnsuccessMessage(ids: IAppConfig&IProjectConfig): string {
    let message: string = '';
    if(!ids.contentFolder || !ids.databaseId || !ids.scriptId) {
        message += '\n';
        message += (
            chalk.yellow('\n(!) Error setting up one or more Drive files, please set them up manually!')
        );
        if(ids.driveFolder) {
            message += '\nProject folder Url: '+ chalk.green(`https://drive.google.com/drive/folders/${ids.driveFolder}`);
        }
        if(!ids.contentFolder) {
            message += (
                '\n'+
                '+ '+ chalk.yellow('contentFolder') +' (./backend/configs/Sheetbase.config.js)'
            );
        }
        if(!ids.databaseId) {
            message += (
                '\n'+
                '+ '+ chalk.yellow('databaseId') +' (./backend/configs/Sheetbase.config.js)'
            );
        }
        if(!ids.scriptId) {
            message += (
                '\n'+
                '+ '+ chalk.yellow('scriptId') +' (./backend/.clasp.json)'
            );
        }        
        message += '\n';
    }
    return message;
}