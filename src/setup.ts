import { Spinner } from "clui";
import chalk from "chalk";
const randomstring = require('randomstring');
import { execSync } from "child_process";
const git = require('simple-git/promise');
const opn = require('opn');

import * as file from "./lib/file";
import * as project from "./lib/project";
import * as config from "./lib/config";
import * as drive from "./lib/drive";
import * as inquirer from "./lib/inquirer";
import * as misc from "./lib/misc";
import url from "./url";

import { IProjectConfig } from "./lib/project";
import { IAppConfig } from "./lib/config";

export default async (noNpmInstall: boolean = false, noGit: boolean = false) => {
        
    if (!project.isValid()) {
        return console.log(
            chalk.red('\n Looks like you are not in a Sheetbase project!')
        );
    }



    /**
     * step 0: start 
     */
    console.log('\n> Config Sheetbase project.');
    let status = new Spinner('Setting up config ...');
    status.start();



    /**
     * step 1: get current configs & prepare data
     */
    let projectName = file.getCurrentDirectoryBase();
    let projectCapitalizeName = projectName.charAt(0).toUpperCase() + projectName.slice(1);

    // get init project config
    let projectConfigs: IProjectConfig = {};
    let projectType: string = 'ionic';
    try {
        projectConfigs = await project.getConfig();
        projectType= projectConfigs.type || 'ionic';    
    } catch(error) {
        status.stop();
        return console.log(chalk.red(`\nErrors getting project configs.`));
    }

    // get init app configs
    let appConfigs: IAppConfig = {};
    try {
        appConfigs = await config.get(projectType);
    } catch(error) {
        status.stop();
        return console.log(chalk.red(`\nErrors getting app configs.`));
    }


    
    /**
     * step 2: create config values
     */
    let apiKey = randomstring.generate();
    let encryptionKey = randomstring.generate({
        length: 12,
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$%&*'
    });

    // setup drive files
    let driveFolder: string = null;
    let contentFolder: string = null;
    let databaseId: string = null;
    let scriptId: string = null;
    try {
        driveFolder = await drive.createFolder(
            'Sheetbase Project: '+ projectCapitalizeName
        );
        if(driveFolder) {
            contentFolder = await drive.createFolder(
                projectCapitalizeName +' Content',
                [driveFolder]
            );
            databaseId = await drive.copy(
                appConfigs.databaseId,
                projectCapitalizeName +' Database',
                [driveFolder]
            );
            scriptId = await drive.createScript(
                projectCapitalizeName +' Backend',
                driveFolder
            );
        }
    } catch(error) {
        console.log(misc.driveSetupUnsuccessMessage({
            driveFolder,
            contentFolder,
            databaseId,
            scriptId
        }));

        // fake it if any fails
        driveFolder = driveFolder || '<project_folder_id>';
        contentFolder = contentFolder || '<content_folder_id>';
        databaseId = databaseId || '<database_id>';
        scriptId = scriptId || '<script_id>';
    }


    
    /**
     * step 3: save config values
     */
    projectConfigs = Object.assign(projectConfigs, {
        name: projectName,
        driveFolder
    });
    appConfigs = Object.assign(appConfigs, {
        apiKey,
        encryptionKey,
        contentFolder,
        databaseId,
        scriptId
    });

    try {
        await file.editJson(
            './package.json',
            { name: projectName }
        );
        await project.setConfig(projectConfigs);
        await config.set(appConfigs, projectType);
    } catch(error) {
        status.stop();
        return console.log(chalk.red(`\nErrors saving configs.`));
    }


    /**
     * Almost done
     * From now on, do addtional steps 
     */
    status.stop();
    console.log(chalk.green(' ... done!'));



    /**
     * step 4: push & deploy script
     */
    if(scriptId) {
        try {
            console.log('\n> Push backend script, must have @google/clasp installed.');
            await execSync('clasp push', {cwd: './backend', stdio: 'inherit'});
            console.log(chalk.green(' ... done!'));

            // open script in browser
            opn('https://script.google.com/d/'+ scriptId +'/edit', {wait: false});
    
            // backend url
            console.log('\n> Update Backend URL.');
            const backendAnswers = await inquirer.askForBackendUrl();
            if(backendAnswers.backendUrl) {
                await config.set({
                    backendUrl: backendAnswers.backendUrl
                }, projectType);
                console.log(chalk.green(' ... done!'));
            } else {
                console.log(chalk.yellow(' ... ignored!'));
            }
        } catch(error) {
            return console.log(chalk.red('\nError trying to push backend script.'));
        }
    }
    


    /**
     * step x: setup git 
     */
    if(!noGit) {
        console.log('\n> Setup git.');
        try {
            let status = new Spinner('Setting up git ...');
            status.start();
        
            await file.rmDir('./.git');
            await git().init();
            await git().add('./*');
            await git().commit('Initial commit');
            
            status.stop();
        } catch(error) {}
        console.log(chalk.green(' ... done!'));
    }



    /**
     * step x: install packages
     */
    if(!noNpmInstall) {
        console.log('\n> Install packages.');
        try {
            await execSync('npm install', {cwd: './', stdio: 'inherit'});
        } catch(error) {
            return console.log(
                chalk.red('\nError trying install packages.')
            );
        }
        console.log(chalk.green(' ... done!'));
    }


    /**
     * final: response
     */
    console.log('\n> Done!');
    console.log(chalk.green(' ... successfully setup Sheetbase project!'));
    console.log('\nUseful links:');
    await url();    
}