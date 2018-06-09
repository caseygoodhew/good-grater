const _ = require('lodash');
const spatula = require('good-spatula');

module.exports = (walker, nodes, options) => (context, done) => {
    const raw = context.node().value;
    const value = _.isNil(raw) ? raw : String(raw);
    done(context.data(spatula(value)));
}