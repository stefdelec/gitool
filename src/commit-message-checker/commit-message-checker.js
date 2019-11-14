const { types } = require('../configuration');

const commitMessageChecker = (commitMessage) => {
    return new RegExp(/(feat|fix|docs|style|refactor|test|chore)(\(.{1,}\))?: .{1,}/g)
        .test(commitMessage)
};

module.exports = commitMessageChecker;