const _context = require('dynamic-context');

module.exports = (spatula, loader, context, goto, done) => {
    if (goto !== 'grater') {
        throw new Error(`goto can only be grater - got ${goto}`);
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