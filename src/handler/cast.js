module.exports = (spatula, castMap, context, cast, done) => {

    if (!castMap[cast]) {
        throw new TypeError(`Unhandled cast type '${cast}'`)
    }

    castMap[cast](context, spatula(context.data()), (value) => {
        done(context.data(value));
    });
}