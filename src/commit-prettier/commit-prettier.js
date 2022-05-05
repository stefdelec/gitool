const { commitBetweenTags } = require('../gitShortCut');
const { types } = require('../configuration');
const { commitExtractor } = require('../commit-extractor/commit-extractor');
const Mustache = require('mustache');
const { readFileSync, writeFileSync, existsSync } = require("fs");

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
const groupCommits = (from, to, groupBy,filters) => {
    const commitsLog = commitBetweenTags(from, to);

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

const prettyPrint = (from, to, groupBy, path, projectName, versionTag, filters, date) => {
    const groupedCommit = groupCommits(from, to, groupBy, filters);

    const data =
    {
        projectName,
        versionTag: versionTag.replace('v', ''),
        date,
        sections: Object.keys(groupedCommit).map(key => groupedCommit[key])
    }

    const template = readFileSync(__dirname + '/template.terminal.txt').toString();
    const titleTemplate = readFileSync(__dirname + '/template.title.txt').toString();
    const fileTemplate = readFileSync(__dirname + '/template.file.txt').toString();


    const consoleLogs = Mustache.render(template, data);
    const title = Mustache.render(titleTemplate, data);
    const changelog = Mustache.render(fileTemplate, data);

    eval(consoleLogs);

    if (path) {
        if (existsSync(path)) { // file exists
            console.log('Writing changelog at: ', path);
            const data = readFileSync(path, { encoding:'utf8' });
            const newdata = data.replace(title, title + changelog);
            writeFileSync(path, newdata);
        } else { // file not exists
            console.log('Generating and writing changelog at: ', path);
            writeFileSync(path, title + changelog);
        }
    }
}

module.exports = { prettyPrint, write };
