const commitExtractor = (commitMessage) => {
    const reg = new RegExp(/(feat|fix|docs|style|refactor|test|chore)(\((\w{1,})\)){0,1}: (.{1,})/)
    const result = commitMessage.match(reg)
    if (result) {
        return {
            raw: result[0],
            type: result[1],
            scope: result[3],
            message: result[4]
        }
    };
}

module.exports = {
    commitExtractor,
};
