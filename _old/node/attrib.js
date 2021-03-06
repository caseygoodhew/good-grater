const spatula = require('good-spatula')

module.exports = (walker, nodes, options) => (context, done) => {
    const node = context.node();
    const el = node.selector ? context.data()(node.selector) : context.data();

    const value = el.attr(node.attrib) || '';

    if (node.name) {
        context.result()[node.name] = value;
    }

    done(context.data(spatula(value)));
}