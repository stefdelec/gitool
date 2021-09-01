#!/usr/bin/env node
const commitMessageChercher = require('./src/commit-message-checker/commit-message-checker')
const shortCut = require('./src/gitShortCut');
const messageComposer = require('./src/message-composer/message-composer')
const chalk = require('chalk');
const { existsSync } = require('fs');

const argv = require('yargs')
    .alias('c', 'checkCommit')
    .alias('o', 'output')
    .alias('p', 'prettyPrint')
    .alias('pn','projectName')
    .alias('v','versionTag')
    .alias('a', 'addAll')
    .alias('m', 'messageComposer')
    .alias('t', 'test')
    .alias('l', 'last')
    .alias('g', 'groupBy')
    .alias('bu','bump')
    .alias('b','branch')
    .argv

const { prettyPrint } = require('./src/commit-prettier/commit-prettier');
// Check Last commit

if (argv.checkCommit) {
    const numberOfCommitToCheck = argv.last || 1;

    for (var i = 1; i <= numberOfCommitToCheck; i++) {
        const commitMessage = shortCut.messageLastCommit(i);
        const commitHash = shortCut.hashLastCommit(i);

        const isValid = commitMessageChercher(commitMessage);
        console.log(chalk.bgGray.white(`### START ANALYZING`))
        console.log(chalk.black(`### hash:${commitHash}`))

        if (isValid) {

            console.log(chalk.green(commitMessage))
            console.log(chalk.green('commit message is valid'));
        } else {
            console.log(chalk.red(commitMessage))
            console.log(chalk.red('commit message is NOT valid'));
            throw new Error()
        }
    }

}
if(argv.bump){
    console.log(argv.bump);
}
if (argv.prettyPrint) {
    if(!argv.projectName){
        throw new Error('Project name is mandatory');
    }

    if(!argv.versionTag){
        throw new Error('Version tag is mandatory');
    }
    console.log('Fetching tags from origin');
    shortCut.ex("git fetch origin --tags");

    const groupBy = argv.groupBy === 'scope' ? 'scope' : 'type';

    const tags = shortCut.getTagsOrderedByDate().split('\n').filter(t => t !== '').reverse();

    const getFromTag = (tagNumber) => tags[+tagNumber];

    const firstCommit =   shortCut.firstCommitAllTime().trim()

    const filters = argv.filters ? argv.filters.split('|') : undefined;
    const path = argv.output || './changelog.md';

    const getDateOfTag = (tag) => ((shortCut.getDateTimeOfTag(tag).trim().split(' '))[0]);
    const dateNow = (now = new Date()) => {
        let month = now.getMonth() + 1;
        month = month > 9 ? month : `0${month}`;
        return `${now.getFullYear()}-${month}-${now.getDate()}`;
    }

    if(!existsSync(path)){
        for (let i = 0; i < tags.length; i++) {
            const date = getDateOfTag(getFromTag(i));
            prettyPrint(i !== 0 ? getFromTag(i - 1) : firstCommit, getFromTag(i), groupBy, path, argv.projectName || 'untitled', getFromTag(i), filters, date);
        }
    }

    prettyPrint(tags.length !== 0 ? getFromTag(tags.length - 1) : shortCut.firstCommitAllTime().trim(), 'HEAD', groupBy, path, argv.projectName || 'untitled', argv.versionTag, filters, dateNow());


    if (argv.addAll) {
        console.log('Adding files to previous commit');
        shortCut.ex('git add .')
        shortCut.ex('git commit -m "release(changelog): Update changelog.md [CI SKIP]"')
    }
}

if (argv.messageComposer) {
    const isTest = argv.test || false;
    if (isTest) {
        console.log("exectued as test. No commit will be executed");
    }
    if (argv.addAll) {
        messageComposer(isTest, true);
    } else {
        messageComposer(isTest, false);
    }
}

if(argv.force){
    const branch=argv.branch || 'master';
    shortCut.ex(`git add . && git commit -m "release(changelog): Update changelog.md [CI SKIP]" && git fetch && git pull origin ${branch} --rebase && git push origin HEAD --force`);
}

if(argv.cane){
    shortCut.ex('git add .')
    shortCut.ex('git commit -m "release(changelog): Update changelog.md [CI SKIP]"')
}
