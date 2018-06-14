module.exports = (context, name, done) => {
    if (context.getDom) {
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    done(context.set('result', name, context.local()));
}