const { execSync } = require('child_process')
const { allCommitSince, dateOfCommit } = require('../gitShortCut');
const { types } = require('../configuration');
const chalk = require("chalk");
 const {commitExtractor} = require('../commit-extractor/commit-extractor');

 const addToAcc = (acc, commitType, value) => {
    if (!acc[commitType]) {
        acc[commitType] = []
    }
    acc[commitType].push(value);
    return acc;
}

const getArrayofCommit = (commitLogs) =>  commitLogs.split('\n');

const groupByScope=(commitLogs)=>{
    const commits=getArrayofCommit(commitLogs);

    return commits.reduce((acc, commit) => {

    const extractedCommit=commitExtractor(commit);

    if(extractedCommit && extractedCommit.scope){
        acc = addToAcc(acc, extractedCommit.scope, commit);
    }
        return acc;
    }, {})
}

const groupByType=(commitLogs)=>{

    const commits=getArrayofCommit(commitLogs);

    return commits.reduce((acc, commit) => {

    const extractedCommit=commitExtractor(commit);
    if(extractedCommit && types.includes(extractedCommit.type)){
        acc = addToAcc(acc, extractedCommit.type, commit);
    }
        return acc;
    }, {})

}
const prettyPrint = (commitHash,groupBy) => {
    const commitsLog = allCommitSince(commitHash);
    const theDate = dateOfCommit(commitHash)
    let groupedCommit
    if(groupBy==='type'){
            groupedCommit = groupByType(commitsLog);
    }else if(groupBy==='scope'){
        groupedCommit = groupByScope(commitsLog);

    }

    console.log(groupedCommit)
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