module.exports = (spatula, context, selector, done) => {
    const data = context.data();
    const value = spatula(data);
    const result = selector ? value(selector) : value;
    done(context.data(result));
}