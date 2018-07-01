const _context = require('../context');

module.exports = (spatula, loader, context, follow, done) => {
    if (follow !== true) {
        throw new Error(`follow can only be true - got ${follow}`);
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