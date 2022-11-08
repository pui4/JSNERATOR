#!/usr/bin/env node
import inquirer from 'inquirer';
import clone from 'git-clone';
import calkanim from 'chalk-animation';
import chalk from 'chalk';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import nanospinner from 'nanospinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pLang;
let lice;
let projDir;
let pName;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const date = new Date();
const year = date.getFullYear();

async function start() {
    console.clear();
    const rainbowTitle = calkanim.rainbow(
        'WELCOME TO JSERATOR'
    );

    await sleep();
    rainbowTitle.stop();

    console.clear();

    const spinner = nanospinner.createSpinner('Cloning Github repos').start();
    clone('https://github.com/Precious13ui/gitignore.git', './gitignore', null, null);
    clone('https://github.com/Precious13ui/markdown-licenses.git', './license', null, null);
    setTimeout(() => {
        spinner.success();
        return setProjectDir();
    }, 1000);
}

async function setProjectDir() {
    const answers = await inquirer.prompt({
        name: 'location',
        type: 'input',
        message: 'Were would you like the gitignore and license to go?'
    });
    projDir = answers.location;
    return askPLanguge();
}

async function askPLanguge() {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'p_Lang',
        type: 'input',
        message: 'What programing language are you using?',
    });

    pLang = answers.p_Lang;

    return getGitFile();
}

async function getGitFile() {
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Searching for a gitignore.').start();
    var file_a = new Array();
    fs.readdir(path.join(__dirname, '/gitignore'), function (err, files) {
        //handling error
        if (err) {
            iserrored = true;
            console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            if (file.toLowerCase().includes(pLang) || file.includes(pLang)) {
                file_a.push(file.toString());
            }
        });
    });
    setTimeout(() => {
        if (!iserrored) {
            if (file_a[0] == null) {
                spinner.error();
                console.log(chalk.yellow("We couldn't find a gitignore for that."));
                return askPLanguge();
            } else {
                if (file_a.length >= 2) {
                    spinner.success();
                    return handleGitArray(file_a);
                } else {
                    spinner.success();
                    return moveGitIgnore(file_a[0]);
                }
            }
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

async function handleGitArray(file_a) {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'git_ig',
        type: 'list',
        message: 'We found multiple gitignore files with that name. Please pick the one you want.',
        choices: file_a,
    });

    return moveGitIgnore(answers.git_ig.toString());
}

async function moveGitIgnore(file) {
    let errored;
    const spinner = nanospinner.createSpinner('Moving your gitignore.').start();
    fs.copyFile(path.join(__dirname, '/gitignore', file), path.join(projDir, '/.gitignore'), function (err) {
        if (err) {
            spinner.error();
            errored = true
            console.log(chalk.red(err));
        }
    });
    setTimeout(() => {
        if (!errored) {
            spinner.success();
            return askName();
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

async function askName() {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'Person',
        type: 'input',
        message: 'What is your full name (for the license)?',
    });
    pName = answers.Person;
    return askLice();
}

async function askLice() {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'license',
        type: 'input',
        message: 'What license do you want?',
    });
    lice = answers.license;
    return getlicense();
}

async function getlicense() {
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Searching for a license.').start();
    var file_a = new Array();
    fs.readdir(path.join(__dirname, '/license'), function (err, files) {
        //handling error
        if (err) {
            iserrored = true;
            console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            if (file.toLowerCase().includes(lice) || file.includes(lice)) {
                file_a.push(file.toString());
            }
        });
    });
    setTimeout(() => {
        if (!iserrored) {
            if (file_a[0] == null) {
                spinner.error();
                console.log(chalk.yellow("We couldn't find a license for that."));
                return askLice();
            } else {
                if (file_a.length >= 2) {
                    spinner.success();
                    return handleLiceArray(file_a);
                } else {
                    spinner.success();
                    return checkLice(file_a[0]);
                }
            }
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

async function handleLiceArray(file_a) {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'liceID',
        type: 'list',
        message: 'We found multiple licenses with that name. Please chose one.',
        choices: file_a,
    });
    return checkLice(answers.liceID);
}

async function checkLice(file) {
    switch (file) {
        default:
            return readlicense(file);
        case "artistic-v2.0.md":
            return moveLice(file);
        case "epl-v1.0.md":
            return moveLice(file);
        case "gnu-lgpl-v3.0.md":
            return moveLice(file);
        case "unlicense.md":
            return moveLice(file);
    }
}

async function readlicense(file) {
    fs.readFile(path.join(__dirname, '/license/', file), 'utf8', (err, data) => {
        if (err) {
          console.error(chalk.red(err));
          return;
        }
        return parseLice(data);
    });
}

async function parseLice(content) {
    const spinner = nanospinner.createSpinner('Creating your license.').start();
    let c_array = content.split(" ");
    let index = 0;
    c_array.forEach(function (text) {
        if (text.includes("'<name>'")) {
            c_array[index] = pName;
        }
        if (text.includes("'<year>'")) {
            c_array[index] = year.toString();
        }
        index++;
    });
    setTimeout(() => {
        spinner.success();
        return finishLice(c_array.join(" "));
    }, 1000);
    
}

async function finishLice(content) {
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Moving your license.').start();
    fs.writeFile(path.join(projDir, '/LICENSE'), content, function (err) {
        if (err){
            console.log(chalk.red(err));
            iserrored = true;
        }
    });
    setTimeout(() => {
        if (!iserrored) {
            spinner.success();
            return finish();
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

async function moveLice(file) {
    let iserrored;
    const spinner = nanospinner.createSpinner('Moving your license.').start();
    fs.copyFile(path.join(__dirname, '/license', file), path.join(projDir, '/LICENSE'), function (err) {
        if (err) {
            spinner.error();
            iserrored = true
            console.log(chalk.red(err));
        }
    });
    setTimeout(() => {
        if (!iserrored) {
            spinner.success();
            return finish();
        }
    }, 1000);
}

async function finish() {
    console.clear();
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Cleaning up.').start();
    fs.rmSync(path.join(__dirname, '/gitignore'), { recursive: true, force: true }, function (err) {
        if (err) {
            iserrored = true;
            console.log(chalk.red(err));
        }
    });
    fs.rmSync(path.join(__dirname, '/license'), { recursive: true, force: true }, function (err) {
        if (err) {
            iserrored = true;
            console.log(chalk.red(err));
        }
    });
    setTimeout(() => {
        if (!iserrored) {
            spinner.success();
            console.log(chalk.green("Created license and gitignore succesfully!"));
            process.exit(0);
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

await start();