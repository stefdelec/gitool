const { execSync } = require('child_process')
const { allCommitSince, dateOfCommit } = require('../gitShortCut');
const { types } = require('../configuration');
const chalk = require("chalk");

const extractCommit = (text) => {
    const addToAcc = (acc, commitType, value) => {
        if (!acc[commitType]) {
            acc[commitType] = []
        }
        acc[commitType].push(value);
        return acc;
    }

    const split = text.split('\n');

    return split.reduce((acc, commit) => {
        types.forEach(commitType => {
            const isOfThisCommitType = commit.startsWith(commitType);
            if (isOfThisCommitType) {
                acc = addToAcc(acc, commitType, commit);
            }
        });
        return acc;
    }, {})
};

const prettyPrint = (commitHash) => {
    const commitsLog = allCommitSince(commitHash);
    const theDate = dateOfCommit(commitHash)
    const groupedCommit = extractCommit(commitsLog);

    console.log(chalk.greenBright(`Since: ${theDate}`))
    console.log(chalk.green(`commit hash ${commitHash}`))
    console.log('')
    Object.keys(groupedCommit)
        .forEach(type => {
            const num = groupedCommit[type].length;
            const commits = groupedCommit[type];

            console.log(chalk.bgGray.bold.white(`###     ${num} ${type}     ###`));
            commits.forEach(commit =>

                console.log(chalk.grey(commit))
            );
            console.log('')
        })
}

module.exports = prettyPrint;