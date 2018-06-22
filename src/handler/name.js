const name = (context, name, done) => {
    if (context.getDom) {
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    done(context.set('result', name, context.data()));
}

module.exports = (intro) => {
    intro.iam('name', (iwant) => {
        iwant('register', (register, done) => {
            const handler = name;
            register('name', handler);
            done(handler);
        });
    });
}