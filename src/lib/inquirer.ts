const inquirer = require('inquirer');

import { IAppConfig } from "./config";

/**
 * Ask for backend url
 */
export function  askForBackendUrl(): Promise<{ backendUrl: string }> {
    console.log('Open the apps script project, deploy version 1 as Web App, get the Web App URL and update the config.');
    const questions = [
        {
            type : 'input',
            name : 'backendUrl',
            message : 'Web app Url:'
        }
    ];
    return inquirer.prompt(questions);
}

/**
 * Ask for backend url
 */
export function askForConfigs(): Promise<IAppConfig> {
    console.log('Set configs for the project, leave blank to not modified.');
    const questions = [
        {
            type : 'input',
            name : 'apiKey',
            message : 'API Key [apiKey]:'
        },
        {
            type : 'input',
            name : 'backendUrl',
            message : 'Backend URL [backendUrl]:'
        },
        {
            type : 'input',
            name : 'databaseId',
            message : 'Database ID [databaseId]:'
        },
        {
            type : 'input',
            name : 'contentFolder',
            message : 'Content folder ID [contentFolder]:'
        },
        {
            type : 'input',
            name : 'encryptionKey',
            message : 'Encryption Key [encryptionKey]:'
        },        
        {
            type : 'input',
            name : 'authUrl',
            message : 'Auth URL [authUrl]:'
        }
    ];
    return inquirer.prompt(questions);
}