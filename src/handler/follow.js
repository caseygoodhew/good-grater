const _context = require('../context');

module.exports = (spatula, loader) => {

    return (context, follow, done) => {
        if (follow !== true) {
            throw new Error('follow can only be true');
        }

        const loaderContext = context.loader() || _context(['data', 'loader']);
        loader(loaderContext.set('data'), context.data(), subloadercontext => {
            done(context.data(spatula(subloadercontext.data())).loader(subloadercontext));
        })
    };
}