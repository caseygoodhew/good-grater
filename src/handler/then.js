const _ = require('lodash');

module.exports = (_groupCall) => (context, then, done) => {
    if (_.isArray(then)) {
        throw new Error('not implemented');
    } else {
        debugger;
        done(context.node(then));
    }
}