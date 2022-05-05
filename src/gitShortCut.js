const { execSync } = require('child_process')

const ex = (command) => execSync(command).toString().trim();

const dateOfCommit = (commitHash) => ex(`git show -s --format=%ci ${commitHash}`);
const hashLastCommit = (number) => ex(`git log --skip ${number - 1} -n 1 --pretty=%H --no-merges`)
const messageLastCommit = (number) => ex(`git log --skip ${number - 1} -n 1 --pretty=%B --no-merges`)
const lastTag = () => ex(`git describe --abbrev=0 --tags`)
const firstCommitAllTime = () => ex('git rev-list --max-parents=0 HEAD')
const commitBetweenTags = (from, to) => ex(`git log ${from}...${to} --pretty=format:%s --no-merges`)
const getTagsOrderedByDate = () => ex(`git tag --format='%(refname:strip=2)' --sort=creatordate`)
const gitAddAll=()=>ex('git add .')
const getDateTimeOfTag = (tag) => ex(`git log -1 --format=%ai ${tag}`)

module.exports = {
    lastTag,
    dateOfCommit,
    messageLastCommit,
    commitBetweenTags,
    firstCommitAllTime,
    hashLastCommit,
    gitAddAll,
    getTagsOrderedByDate,
    getDateTimeOfTag,
    ex
};
