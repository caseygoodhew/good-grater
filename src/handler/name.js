module.exports = (context, name, done) => {
    if (context.getDom) {
        debugger;
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    done(context.set('result', name, context.data()));
}