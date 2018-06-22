const attrib = (spatula, context, attrib, done) => {
    const data = context.data();
    const value = data.attr(attrib);
    done(context.data(spatula(value)));
}

module.exports = (intro) => {
    intro.iam('attrib', (iwant) => {
        iwant('register', 'spatula', (register, spatula, done) => {
            const handler = (...args) => attrib(spatula, ...args);
            register('attrib', handler);
            done(handler);
        });
    });
}