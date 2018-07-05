const _context = require('../context');

module.exports = (spatula, loader, context, goto, done) => {
    if (goto !== true) {
        throw new Error(`goto can only be true - got ${goto}`);
    }

    const node = context.node();
    if (node.cast === 'array') {
        done(context);
        return;
    }

    const loaderContext = context.loader() || _context(['data', 'loader']);
    loader(loaderContext.set('data'), context.data(), subloadercontext => {
        done(context.data(spatula(subloadercontext.data())).loader(subloadercontext));
    })
};