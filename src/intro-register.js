module.exports = (intro) => (name, itwants, handler) => {
    intro.iam(name, (iwant) => {
        iwant(...itwants.concat(['register']), (...itgot) => {
            const done = itgot.pop();
            const register = itgot.pop();
            const proxy = (...args) => handler(...itgot.concat(args));
            register(name, proxy);
            done(proxy);
        });
    });
};