var prompts = require('prompts');
const { types } = require('../configuration');
const shortCut = require('../gitShortCut');
const { commitExtractor } = require('../commit-extractor/commit-extractor');
const chalk = require("chalk");

const getType = async () => {
    const typesToShow = types
        .map((value, index) => `${value}(${index})`)
        .join(' | ');

    console.log(`types: ${typesToShow}`)

    const response = await prompts({
        type: 'text',
        name: 'type',
        message: 'What type?'
    });


    let type;
    if (isNaN(response.type)) {
        type = response.type
    } else {
        type = types[response.type]
    }

    return type;

}

getScope = async () => {

    let mostRecentScope = {
        undefined: 0
    };

    for (var i = 1; i < 30; i++) {
        const result = commitExtractor(shortCut.messageLastCommit(i));
        if (result && result.scope) {
            const { scope } = result;
            if (!mostRecentScope[scope]) {
                mostRecentScope[scope] = 0;
            }
            mostRecentScope[scope] = mostRecentScope[scope] + 1;
        }
    }


    console.log(chalk.bgBlackBright.white('Last used scopes'));
    console.log(chalk.bgBlackBright.white(Object
        .keys(mostRecentScope)
        .slice(0, 10)
        .map((value, index) => `${value}(${index})`)
        .join(' | ')));

    const response = await prompts({
        type: 'text',
        name: 'scope',
        message: 'What scope?'
    });

    let scope;
    if (isNaN(response.scope)) {
        scope = response.scope
    } else {
        scope = Object.keys(mostRecentScope)[response.scope]
    }

    return scope;
}

getMessage = async () => {
    const response = await prompts({
        type: 'text',
        name: 'message',
        message: 'What message?'
    });

    return response.message;
}
const messageComposer = async (test = false, addAll=false) => {
    let type, scope, message;

    type = await getType();
    console.log(`type will be ${type}`);

    scope = await getScope();
    console.log(`scope will be ${scope}`)
    
    message = await getMessage();
    console.log(`message will be ${message}`)

    const constructedScope = scope ? `(${scope})` : '';
    const commitMessage = `${type}${constructedScope}: ${message}`;

    console.log(`commit message:  < ${commitMessage} >`);

    const command = `git commit -m "${commitMessage}"`;


    if (!test && type && message) {
        if(addAll){
            shortCut.ex('git add .')
        }
        shortCut.ex(command)
    }
}

module.exports = messageComposer;
