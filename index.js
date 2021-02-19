#!/usr/bin/env node
const commitMessageChercher = require('./src/commit-message-checker/commit-message-checker')
const shortCut = require('./src/gitShortCut');
const messageComposer = require('./src/message-composer/message-composer')
const chalk = require('chalk');

const argv = require('yargs')
    .alias('c', 'checkCommit')
    .alias('o', 'output')
    .alias('p', 'prettyPrint')
    .alias('a', 'addAll')
    .alias('m', 'messageComposer')
    .alias('t', 'test')
    .alias('l', 'last')
    .alias('g', 'groupBy')
    .alias('bu','bump')
    .argv

const { prettyPrint, write } = require('./src/commit-prettier/commit-prettier');
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
        console.log('')
    }

}
if(argv.bump){
    console.log(argv.bump);
}
if (argv.prettyPrint) {
    console.log('Fetching tags from origin');
    shortCut.ex("git fetch origin --tags");

    const groupBy = argv.groupBy === 'scope' ? 'scope' : 'type';

    const tags = shortCut.getTagsOrderedByDate().split('\n').reverse();

    const numOftag=parseInt(argv.tag);

    const getFromTag = (tagNumber) => tags[+tagNumber];

    const commitFrom = argv.tag ? getFromTag(numOftag) : shortCut.firstCommitAllTime().trim();

    let title = `From ${getFromTag(numOftag)} to ${tags[0]}`;

    const filters = argv.filters ? argv.filters.split('|') : undefined;
    prettyPrint(commitFrom, groupBy, argv.output, title, filters);
    if (argv.addAll) {
        console.log('Adding files to previous commit');
        shortCut.ex('git add .')
        shortCut.ex('git commit --amend --no-edit')
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

if(argv.cane){
    shortCut.ex('git add .')
    shortCut.ex('git commit --amend --no-edit')
}
