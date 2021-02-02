const { allCommitSince ,gitAddAll } = require('../gitShortCut');
const { types } = require('../configuration');
const { commitExtractor } = require('../commit-extractor/commit-extractor');
const Mustache = require('mustache');
const { readFileSync, writeFileSync } = require("fs");

const addToAcc = (acc, commitType, value, filters) => {
    const shouldAdd=!filters || filters.length === 0 || filters.includes(commitType);
    if (!acc[commitType] && shouldAdd) {
        acc[commitType] = {}
        acc[commitType].content = [];
        acc[commitType].length = 0;
        acc[commitType].name = commitType;

    }
    if (shouldAdd) {
        acc[commitType].content.push(value);
        acc[commitType].length = acc[commitType].content.length;
    }
    return acc;
}

const getArrayofCommit = (commitLogs) => commitLogs
    .split('\n')

const groupByScope = (commitLogs, filters) => {
    const commits = getArrayofCommit(commitLogs);
    return commits.reduce((acc, commit) => {

        const extractedCommit = commitExtractor(commit);

        if (extractedCommit && extractedCommit.scope) {
            acc = addToAcc(acc, extractedCommit.scope, commit, filters);
        }
        return acc;
    }, {})
}

const groupByType = (commitLogs, filters) => {

    const commits = getArrayofCommit(commitLogs, filters);
    return commits.reduce((acc, commit) => {

        const extractedCommit = commitExtractor(commit);
        if (extractedCommit && types.includes(extractedCommit.type)) {
            acc = addToAcc(acc, extractedCommit.type, commit, filters);
        }
        return acc;
    }, {})

}
const groupCommits = (commitHash, groupBy,filters) => {
    const commitsLog = allCommitSince(commitHash);

    let groupedCommit
    if (groupBy === 'type') {
        groupedCommit = groupByType(commitsLog, filters);
    } else if (groupBy === 'scope') {
        groupedCommit = groupByScope(commitsLog, filters);

    }
    return groupedCommit;
}
const write = (view) => {

    const template = readFileSync(__dirname + '/template.file.txt').toString();

    const output = Mustache.render(template, view);
    eval(output);

}
const prettyPrint = (commitHash, groupBy, path, title = 'untitled', filters) => {
    const groupedCommit = groupCommits(commitHash, groupBy, filters);

    const data =
    {
        title,
        sections: Object.keys(groupedCommit).map(key => groupedCommit[key])
    }

    const template = readFileSync(__dirname + '/template.terminal.txt').toString();
    const fileTemplate = readFileSync(__dirname + '/template.file.txt').toString();


    const consoleLogs = Mustache.render(template, data);

    const file = Mustache.render(fileTemplate, data);

    eval(consoleLogs);

    if (path) {
        console.log('Writing changelog at: ', path);
        writeFileSync(path, file);
    }
}

module.exports = { prettyPrint, write };
