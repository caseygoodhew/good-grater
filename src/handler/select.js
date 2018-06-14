module.exports = (spatula) => (context, selector, done) => {
    const data = context.data();
    const value = spatula(data);
    const result = value(selector);

    done(context.data(result).local(result));
}