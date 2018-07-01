module.exports = (spatula, context, attrib, done) => {
    const data = context.data();
    const value = data.attr(attrib);
    done(context.data(spatula(value)));
}