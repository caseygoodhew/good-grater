module.exports = (spatula) => (context, data, done) => {
    done(context.data(spatula(data)));
}