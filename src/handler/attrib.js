module.exports = (spatula) => (context, attrib, done) => {
    const value = spatula(context.local().attr(attrib));
    done(context.set('local', 'value', value));
}