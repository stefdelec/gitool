const { allCommitSince, dateOfCommit } = require('../gitShortCut');
const { types } = require('../configuration');
const { commitExtractor } = require('../commit-extractor/commit-extractor');
const Mustache = require('mustache');
const { readFileSync, writeFileSync } = require("fs");

const addToAcc = (acc, commitType, value) => {
    if (!acc[commitType]) {
        acc[commitType] = {}
        acc[commitType].content = [];
        acc[commitType].length = 0;
        acc[commitType].name = commitType;

    }
    acc[commitType].content.push(value);
    acc[commitType].length = acc[commitType].content.length;
    return acc;
}

const getArrayofCommit = (commitLogs) => commitLogs.split('\n');

const groupByScope = (commitLogs) => {
    const commits = getArrayofCommit(commitLogs);
    return commits.reduce((acc, commit) => {

        const extractedCommit = commitExtractor(commit);

        if (extractedCommit && extractedCommit.scope) {
            acc = addToAcc(acc, extractedCommit.scope, commit);
        }
        return acc;
    }, {})
}

const groupByType = (commitLogs) => {

    const commits = getArrayofCommit(commitLogs);
    return commits.reduce((acc, commit) => {

        const extractedCommit = commitExtractor(commit);
        if (extractedCommit && types.includes(extractedCommit.type)) {
            acc = addToAcc(acc, extractedCommit.type, commit);
        }
        return acc;
    }, {})

}
const groupCommits = (commitHash, groupBy) => {
    const commitsLog = allCommitSince(commitHash);
    let groupedCommit
    if (groupBy === 'type') {
        groupedCommit = groupByType(commitsLog);
    } else if (groupBy === 'scope') {
        groupedCommit = groupByScope(commitsLog);

    }
    return groupedCommit;
}
const write = (view) => {

    const template = readFileSync(__dirname + '/template.file.txt').toString();

    const output = Mustache.render(template, view);
    eval(output);

}
const prettyPrint = (commitHash, groupBy, path) => {
    const groupedCommit = groupCommits(commitHash, groupBy);

    const data =
    {
        title: commitHash,
        sections: Object.keys(groupedCommit).map(key => groupedCommit[key])
    }

    const template = readFileSync(__dirname + '/template.terminal.txt').toString();
    const fileTemplate = readFileSync(__dirname + '/template.file.txt').toString();


    const consoleLogs = Mustache.render(template, data);

    const file = Mustache.render(fileTemplate, data);

    eval(consoleLogs);

    if (path) {
        console.log('Writing release not at: ', path);
        writeFileSync(path, file);
    }
}

module.exports = { prettyPrint, write };