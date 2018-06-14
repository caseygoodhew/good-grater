module.exports = (spatula) => (context, attrib, done) => {
    const value = spatula(context.data().attr(attrib));
    done(context.data(value));
}