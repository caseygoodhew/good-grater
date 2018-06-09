const _groupCall = require('../group-call');

module.exports = (walker, nodes, options) => (context, done) => {

    context.result()[context.node().name] = [];

    const groupCall = _groupCall(walker, () => {
        done(context);
    });

    context
        .data()(context.node().selector)
        .forEach(data => {
            const newContext = context
                .data(data)
                .node(context.node().then)
                .result({});

            groupCall.register(newContext, subcontext => {
                context.result()[context.node().name].push(subcontext.result());
            });
        });

    groupCall.invoke();
}