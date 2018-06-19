const _ = require('lodash');

module.exports = (spatula, _groupCall) => _.reduce(['text', 'html', 'number', 'array'], (result, value) => {
    result[value] = require(`./${value}`)(spatula, _groupCall);
    return result;
}, {});