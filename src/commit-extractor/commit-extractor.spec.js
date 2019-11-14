const { commitExtractor } = require('./commit-extractor');
const {types}= require('../configuration');

describe('commitExtractor', () => {

    const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const randomInt=()=>Math.floor(Math.random() * types.length-1) + 1  

    const commitCreator = () => {
        const obj = {};
        obj.scope = randomString();
        obj.type = types[randomInt()];
        obj.message = randomString();

        if(randomInt()>3){
            // sometimes it does not have scipe
            obj.scope=undefined
        }

        obj.commit = `${obj.type}${obj.scope?`(${obj.scope})`:''}: ${obj.message}`

     
        return obj;
    }
    for (var i = 0; i < 30; i++) {
        const commitObj=commitCreator();
        it(`should return scope < ${commitObj.scope}> from commit < ${commitObj.commit}> `, () => {
            const extractor=commitExtractor(commitObj.commit);
            expect(extractor.message).toBe(commitObj.message);
            expect(extractor.type).toBe(commitObj.type);
            expect(extractor.scope).toBe(commitObj.scope);
        })
    }

})