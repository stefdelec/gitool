const {commitExtractor} =require('../commit-extractor/commit-extractor');

const isVersionUpdate=(commitMessage)=>{
    const semverRegex=new RegExp(/^(\d{1,}\.){1,2}\d{1,}$/);
    return semverRegex.test(commitMessage);
}
const commitMessageChecker = (commitMessage) => {
    const result= commitExtractor(commitMessage)

    return result!==undefined || isVersionUpdate(commitMessage);
};

module.exports = commitMessageChecker;
