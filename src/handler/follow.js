const _context = require('../context');

const follow = (spatula, loader, context, follow, done) => {
    if (follow !== true) {
        throw new Error('follow can only be true');
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

module.exports = (intro) => {
    intro.iam('follow', (iwant) => {
        iwant('register', 'spatula', 'loader', (register, spatula, loader, done) => {
            const handler = (...args) => follow(spatula, loader, ...args);
            register('follow', handler);
            done(handler);
        });
    });
}