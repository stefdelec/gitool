const {commitExtractor} =require('../commit-extractor/commit-extractor');

const commitMessageChecker = (commitMessage) => {
    const result= commitExtractor(commitMessage)
    return result!==undefined
};

module.exports = commitMessageChecker;