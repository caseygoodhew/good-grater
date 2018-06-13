const _groupCall = require('../group-call');

module.exports = (walker, nodes, options) => (context, done) => {
    context.result()[context.node().name] = [];
    done(context);
}