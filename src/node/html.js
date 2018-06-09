module.exports = (walker, nodes, options) => (context, done) => {
    const node = context.node();
    const el = node.selector ? context.data()(node.selector) : context.data();

    if (node.name) {
        context.result()[node.name] = el.html();
    }

    done(context.data(el.html()));
}