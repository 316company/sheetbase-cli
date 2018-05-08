import * as file from './file';

export interface IProjectConfig {
    name?: string,
    type?: string,
    driveFolder?: string
}


/**
 * Check if a valid Sheetbase project
 * @param projectName - Project name
 */
export function isValid(projectName: string = null): boolean {
    let projectRoot = './'+ (projectName?projectName+'/':'');
    return file.fileExists( projectRoot +'sheetbase.config.json');
}

/**
 * Get config from ./sheetbase.config.json
 * @param projectName - Project name
 */
export async function getConfig(): Promise<IProjectConfig> {
    return JSON.parse(file.readText('./sheetbase.config.json'));
}

/**
 * Set config to ./sheetbase.config.json
 * @param configData - Config data
 */
export async function setConfig(configData: IProjectConfig): Promise<any> {
    return await file.editJson(
        './sheetbase.config.json',
        configData
    );    
}