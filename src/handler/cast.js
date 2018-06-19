const _ = require('lodash');

module.exports = (spatula, castMap) => (context, cast, done) => {
    if (context.getDom) {
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    if (!castMap[cast]) {
        throw new Error(`Unhandled cast type '${cast}'`)
    }

    castMap[cast](context, spatula(context.data()), (value) => {
        done(context.data(value));
    });
}