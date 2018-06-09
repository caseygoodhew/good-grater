const spatula = require('good-spatula')

module.exports = (walker, nodes, options) => (context, done) => {
    done(context.data(spatula(String(context.node().value))));
}