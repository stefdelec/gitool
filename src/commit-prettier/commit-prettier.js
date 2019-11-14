const { exec, execSync } = require('child_process')
const args=getArgs();

const commit = args.commit || 'b21825716d62f3f3eee9c26403310072ba085ffd';

const command = `git log ${commit} HEAD --pretty=format:%s --no-merges`;

const commitTypes = ['feat', 'fix', 'chore'];

const dateOfCommit = execSync(`git show -s --format=%ci ${commit}`).toString();

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
        commitTypes.forEach(commitType => {
            const isOfThisCommitType = commit.startsWith(commitType);
            if (isOfThisCommitType) {
                acc = addToAcc(acc, commitType, commit);
            }
        });
        return acc;
    }, {})
};
const commitsLog = execSync(command).toString();
const groupedCommit = extractCommit(commitsLog);

console.log(`Since: ${dateOfCommit}`)

Object.keys(groupedCommit)
    .forEach(type => {
        const num = groupedCommit[type].length;
        const commits = groupedCommit[type];

        console.log(`${num} ${type}`);
        commits.forEach(commit => console.log(commit));
        console.log('')
    })


function getArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}