#!/usr/bin/env node
import inquirer from 'inquirer';
import clone from 'git-clone';
import calkanim from 'chalk-animation';
import chalk from 'chalk';
import fs from 'fs'
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import nanospinner from 'nanospinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pLang;
let lice;
let pName;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const date = new Date();
const year = date.getFullYear();

async function start() {
    console.clear();
    const rainbowTitle = calkanim.rainbow(
        'WELCOME TO JSNERATOR'
    );

    await sleep();
    rainbowTitle.stop();

    console.clear();

    const spinner = nanospinner.createSpinner('Cloning Github repos').start();
    clone('https://github.com/Precious13ui/gitignore.git', './gitignore', null, null);
    clone('https://github.com/Precious13ui/markdown-licenses.git', './license', null, null);
    setTimeout(() => {
        spinner.success();
        return askPLanguge();
    }, 1000);
}

async function askPLanguge() {
    console.clear();
    const answers = await inquirer.prompt({
        name: 'p_Lang',
        type: 'input',
        message: 'What programing language do you want?',
    });

    pLang = answers.p_Lang;

    return getGitFile();
}

async function getGitFile() {
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Searching for a gitignore.').start();
    var file_a = new Array();
    fs.readdir("./gitignore", function (err, files) {
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
                    return checkIfExsists(file_a[0]);
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
    var files = new Array();
    file_a.forEach(function (file) {
        files.push(file.toString().replace(".gitignore", ""));
    });
    const answers = await inquirer.prompt({
        name: 'git_ig',
        type: 'list',
        message: 'We found multiple gitignore files with that name. Please pick the one you want.',
        choices: files,
    });

    return checkIfExsists(answers.git_ig.toString().concat(".gitignore"));
}

async function checkIfExsists(file) {
    console.clear();
    try {
        if (fs.existsSync('./.gitignore')) {
            const answer = await inquirer.prompt({
                name: 'c_apend',
                type: 'confirm',
                message: 'Do you want to add this to your other gitignore file?',
                default: false,
            });
            if (answer.c_apend) {
                handleGitWrite(file);
            } else {
                moveGitIgnore(file);
            }
        }
        else {
            moveGitIgnore(file);
        }
    } catch(err) {
        console.log(chalk.red(err));
    }
}

async function handleGitWrite(file) {
    let iserrored = false;
    const spinner = nanospinner.createSpinner('Modifying your gitignore.').start();
    try {
        const add = fs.readFileSync(path.join('./gitignore/', file), 'utf-8');
        const base = fs.readFileSync('./.gitignore', 'utf-8');

        if (add != base) {
            const final = base.concat(add);
            try {
                fs.writeFileSync('./.gitignore', final);
            } catch (err) {
                console.log(chalk.red(err));
                iserrored = true;
            }
        } else {
            console.log(chalk.yellow("Already in gitignore."));
            iserrored = true;
        }
    } catch (err) {
        console.log(chalk.red(err));
        iserrored = true;
    }
    setTimeout(() => {
        if (!iserrored) {
            spinner.success();
            return askName();
        } else {
            spinner.error();
            process.exit(1);
        }
    }, 1000);
}

async function moveGitIgnore(file) {
    let errored;
    const spinner = nanospinner.createSpinner('Moving your gitignore.').start();
    fs.copyFile(path.join('./gitignore/', file), "./.gitignore", function (err) {
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
    fs.readdir("./license", function (err, files) {
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
    var files = new Array();
    file_a.forEach(function (file) {
        files.push(file.toString().replace(".md", ""));
    });
    const answers = await inquirer.prompt({
        name: 'liceID',
        type: 'list',
        message: 'We found multiple licenses with that name. Please chose one.',
        choices: files,
    });
    return checkLice(answers.liceID.toString().concat(".md"));
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
    fs.readFile(path.join("./license/", file), 'utf8', (err, data) => {
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
    fs.writeFile("./LICENSE", content, function (err) {
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
    fs.copyFile(path.join('./license', file), "./LICENSE", function (err) {
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
    fs.rmSync('./gitignore', { recursive: true, force: true }, function (err) {
        if (err) {
            iserrored = true;
            console.log(chalk.red(err));
        }
    });
    fs.rmSync('./license', { recursive: true, force: true }, function (err) {
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