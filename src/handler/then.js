const _ = require('lodash');

const then = (_groupCall, context, then, done) => {

    const node = context.node();
    if (node.cast === 'array') {
        done(context);
        return;
    }

    const walker = context.walker();
    const groupCall = _groupCall(() => {
        done(context);
    });

    groupCall(
        _.castArray(then)
        .map(node =>
            onedone =>
            walker(context.node(node), onedone)
        )
    );
}

module.exports = (intro) => {
    intro.iam('then', (iwant) => {
        iwant('register', 'groupCall', (register, groupCall, done) => {
            const handler = (...args) => then(groupCall, ...args);
            register('then', handler);
            done(handler);
        });
    });
}