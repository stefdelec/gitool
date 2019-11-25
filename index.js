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

if (argv.prettyPrint) {
    const groupBy = argv.groupBy === 'scope' ? 'scope' : 'type';

    const commitFrom = argv.tag ? shortCut.lastTag().trim() : shortCut.firstCommitAllTime().trim();

    const commit = argv.hash || commitFrom;

    prettyPrint(commit, groupBy, argv.output);
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
