
const commitMessageChecker = (commitMessage) => {
    return new RegExp(/(feat|fix|chore)(.+): .* #\d+/)
        .test(commitMessage)
};

module.exports = commitMessageChecker;