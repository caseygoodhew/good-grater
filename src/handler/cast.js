const _ = require('lodash');

const cast = (spatula, castMap, context, cast, done) => {
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

module.exports = (intro) => {
    intro.iam('cast', (iwant) => {
        iwant('register', 'spatula', 'cast-map', (register, spatula, castMap, done) => {
            const handler = (...args) => cast(spatula, castMap, ...args);
            register('cast', handler);
            done(handler);
        });
    });
}