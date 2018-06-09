const spatula = require('good-spatula')

module.exports = (walker, nodes, options) => (context, done) => {

    options.resourceLoader(context.data().text(), context.locator(), (data, locator) => {
        const subcontext = locator ? context.locator(locator) : context;
        done(subcontext.data(spatula(data)));
    });
}