const data = (spatula, context, data, done) => {
    done(context.data(spatula(data)));
}

module.exports = (intro) => {
    intro.iam('data', (iwant) => {
        iwant('register', 'spatula', (register, spatula, done) => {
            const handler = (...args) => data(spatula, ...args);
            register('data', handler);
            done(handler);
        });
    });
}