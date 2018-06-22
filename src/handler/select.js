const select = (spatula, context, selector, done) => {
    if (!selector) {
        done(context);
    } else {
        const data = context.data();
        const value = spatula(data);
        const result = value(selector);
        done(context.data(result));
    }
}

module.exports = (intro) => {
    intro.iam('select', (iwant) => {
        iwant('register', 'spatula', (register, spatula, done) => {
            const handler = (...args) => select(spatula, ...args);
            register('select', handler);
            done(handler);
        });
    });
}