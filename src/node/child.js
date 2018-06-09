const _groupCall = require('../group-call');
const _ = require('lodash');

module.exports = (walker, nodes, options) => (context, done) => {

    const children = _.castArray(context.node().then || []);

    const groupCall = _groupCall(walker, () => {
        done(context);
    });

    children.forEach(child => {
        groupCall.register(context.node(child), (subcontext) => {
            var result = subcontext.result();
        });
    });

    groupCall.invoke();
}