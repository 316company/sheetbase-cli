const replace = require('replace-in-file');
import chalk from "chalk";

import * as file from "./file";
import * as project from "./project";
import { IProjectConfig } from "./project";

export interface IFrontendConfig {
    apiKey?: string,
    backendUrl?: string
}

export interface IBackendConfig {
    apiKey?: string,
    databaseId?: string,
    encryptionKey?: string,
    contentFolder?: string,
    authUrl?: string
}

export interface IAppConfig extends IFrontendConfig, IBackendConfig {
    scriptId?: string
}

/**
 * 
 * @param type - Project type
 */
export async function get(type: string = 'ionic'): Promise<IAppConfig> {
    let result: IAppConfig = {};
    if(!type) {
        let projectConfigs: IProjectConfig = await project.getConfig();
        type = projectConfigs.type;
    }    
    switch(type) {
        case 'ionic':
        default:
        result = await getConfigTypeIonic();
        break;
    }
    return result;
}

/**
 * Set config for app
 * @param configData - Config data
 * @param type - Project type
 */
export async function set(configData: IAppConfig, type: string = 'ionic'): Promise<any> {
    if(!type) {
        let projectConfigs: IProjectConfig = await project.getConfig();
        type = projectConfigs.type;
    }
    switch(type) {
        case 'ionic':
        default:
            await setConfigTypeIonic(configData);
        break;
    }
}




function getConfigTypeIonic(): IAppConfig {
    let result: IAppConfig = {};    
    // raw values
    let content: string|any = '';
    
    content = file.readText('./backend/configs/Sheetbase.config.js');
    result.apiKey = (content.match(/\"apiKey\"\: \"(.*?)\"/)||[])[1];
    result.encryptionKey = (content.match(/\"encryptionKey\"\: \"(.*?)\"/)||[])[1];
    result.databaseId = (content.match(/\"databaseId\"\: \"(.*?)\"/)||[])[1];
    result.contentFolder = (content.match(/\"contentFolder\"\: \"(.*?)\"/)||[])[1];
    result.authUrl = (content.match(/\"authUrl\"\: \"(.*?)\"/)||[])[1];

    content = file.readText('./src/configs/sheetbase.config.ts');
    result.backendUrl = (content.match(/\"backendUrl\"\: \"(.*?)\"/)||[])[1];

    content = JSON.parse(file.readText('./backend/.clasp.json'));
    result.scriptId = content.scriptId;

    // verify values
    for(let key in result) {
        if(result[key]&&result[key].substr(0,1)==='<'&&result[key].substr(result[key].length-1,1)==='>') delete result[key];
    }
    return result;
}


/**
 * Set App and Backend config for Ionic
 * @param configData - Config data
 */
async function setConfigTypeIonic(configData: IAppConfig) {
    let backendConfigFrom = []; let backendConfigTo = [];
    let appConfigFrom = []; let appConfigTo = [];
    for(let key in configData) {
        switch(key) {
            case 'apiKey':
                backendConfigFrom.push(/\"apiKey\"\: \".*\"/);
                backendConfigTo.push('"apiKey": "' + configData[key] + '"');
                appConfigFrom.push(/\"apiKey\"\: \".*\"/);
                appConfigTo.push('"apiKey": "' + configData[key] + '"');
            break;

            case 'databaseId':
                backendConfigFrom.push(/\"databaseId\"\: \".*\"/);
                backendConfigTo.push('"databaseId": "' + configData[key] + '"');
                appConfigFrom.push(/\"databaseId\"\: \".*\"/);
                appConfigTo.push('"databaseId": "' + configData[key] + '"');
            break;

            case 'backendUrl':
                appConfigFrom.push(/\"backendUrl\"\: \".*\"/);
                appConfigTo.push('"backendUrl": "' + configData[key] + '"');
            break;

            case 'contentFolder':
                backendConfigFrom.push(/\"contentFolder\"\: \".*\"/);
                backendConfigTo.push('"contentFolder": "' + configData[key] + '"');
            break;

            case 'encryptionKey':
                backendConfigFrom.push(/\"encryptionKey\"\: \".*\"/);
                backendConfigTo.push('"encryptionKey": "' + configData[key] + '"');
            break;
        }
    }

    // backend
    await replace({
        files: './backend/configs/Sheetbase.config.js',
        from: backendConfigFrom,
        to: backendConfigTo
    });
    // .clasp.json
    await file.editJson(
        './backend/.clasp.json',
        {
            scriptId: configData.scriptId
        }
    );

    // frontend
    await replace({
        files: './src/configs/sheetbase.config.ts',
        from: appConfigFrom,
        to: appConfigTo
    });

}