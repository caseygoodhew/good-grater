module.exports = (context, name, done) => {
    done(context.set('result', name, context.data()));
}