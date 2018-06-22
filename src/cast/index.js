const _ = require('lodash');

const castmap = (spatula, _groupCall) => _.reduce(['text', 'html', 'number', 'array'], (result, value) => {
    result[value] = require(`./${value}`)(spatula, _groupCall);
    return result;
}, {});

module.exports = (iwant) => {
    iwant('spatula', 'groupCall', (spatula, groupCall, done) => {
        done(castmap(spatula, groupCall));
    });
}