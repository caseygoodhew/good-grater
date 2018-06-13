module.exports = (walker, nodes, options) => (context, done) => {
    const node = context.node();
    const el = node.selector ? context.data()(node.selector) : context.data();
    done(context.data(el));
}