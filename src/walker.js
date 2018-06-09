module.exports = (nodes, options) => (context, done) => {

    const type = context.node().type || 'raw';
    const handler = nodes(type);

    if (!handler) {
        throw new Error(`Unhandled node type (${type})`);
    }

    switch (type) {
        case 'array':
            handler(context, done);
            break;

        default:
            handler(context, subcontext => nodes('child')(subcontext, done));
            break;
    }
}