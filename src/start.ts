import chalk from "chalk";
import { Spinner } from "clui";
import { execSync } from "child_process";
const git = require('simple-git/promise');

import * as file from "./lib/file";
import * as project from "./lib/project";
import * as google from "./lib/google";
import * as misc from "./lib/misc";

export default async (projectName: string, theme: string = 'ionic-starter', noNpmInstall: boolean = false, noGit: boolean = false) => {
    
    let repoUrl = theme;
    if (!misc.isValidGitUrl(repoUrl)) {
        repoUrl = 'https://github.com/316Company/sheetbase-' + repoUrl + '.git'; // assume string is a valid official theme name
    }



    // build valid folder name & check for existance
    projectName = file.buildValidName(projectName);
    if (file.directoryExists('./'+ projectName)) {
        return console.log(
            chalk.red('\nProject exists with the name "'+ projectName +'", please try other name or delete it!')
        );
    }



    // check login status
    const client = await google.getClient();
    if(!client) {
        console.log(
            chalk.yellow('\n(!) Please login to setup and config the project automatically!') +
            '\n$ '+ chalk.green('sheetbase login')
        );
    }



    /**
     * step 0: start action
     */
    console.log('\n> Create new Sheebase project.');
    let status = new Spinner('Creating new project ...');
    status.start();



    /**
     * step x: clone repo
     */
    try {
        await git().clone(repoUrl, projectName);
        if (!project.isValid(projectName)) {
            console.log(chalk.yellow('\n(!) Looks like the repo is not a valid Sheetbase project! Repo url: ' + repoUrl));
        }
    } catch (error) {
        status.stop();
        return console.log(
            chalk.red('\nRepo not exists or errors happen! Repo url: ' + repoUrl)
        );
    }


    
    status.stop();
    console.log(chalk.green(' ... done!'));



    /**
     * step x
     */
    try {
        let cmd = 'sheetbase setup';
        if(noNpmInstall) cmd += ' -x';
        if(noGit) cmd += ' -u';

        await execSync(cmd, {cwd: './'+ projectName, stdio: 'inherit'});
    } catch(error) {
        return console.log(
            chalk.red('\nError trying setup the project.')
        );
    }

}