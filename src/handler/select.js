module.exports = (spatula) => (context, selector, done) => {
    if (!selector) {
        done(context);
    } else {
        const data = context.data();
        const value = spatula(data);
        const result = value(selector);
        done(context.data(result));
    }
}