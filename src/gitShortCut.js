const { execSync } = require('child_process')

const ex = (command) => execSync(command).toString().trim();

const dateOfCommit = (commitHash) => ex(`git show -s --format=%ci ${commitHash}`);
const hashLastCommit = (number) => ex(`git log --skip ${number - 1} -n 1 --pretty=%H --no-merges`)
const messageLastCommit = (number) => ex(`git log --skip ${number - 1} -n 1 --pretty=%B --no-merges`)
const lastTag = () => ex(`git describe --abbrev=0`)
const allCommitSince = (commitHash) => ex(`git log ${commitHash}...HEAD --pretty=format:%s --no-merges`);
const firstCommitAllTime = () => ex('git rev-list --max-parents=0 HEAD')

module.exports = {
    lastTag,
    dateOfCommit,
    messageLastCommit,
    allCommitSince,
    firstCommitAllTime,
    hashLastCommit,
    ex
};
