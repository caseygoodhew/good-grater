const context = require('./context')

const modules = [
    'resource',
    'attrib',
    'child',
    'array',
    'string',
    'number',
    'html',
    'raw',
    'value'
].map(type => {
    return {
        type: type,
        module: require(`./node/${type}`)
    };
});

module.exports = (options) => {
    const nodeMap = {};

    const nodes = function(type) {
        return nodeMap[type];
    };

    const walker = require('./walker')(nodes, options);

    modules.forEach(x => {
        nodeMap[x.type] = x.module(walker, nodes, options);
    })

    return (selectors, startWith, done) => {
        const root = {
            type: 'value',
            value: startWith,
            then: {
                type: 'resource',
                then: selectors
            }
        };

        walker(context().node(root).result({}), context => {
            done(context.result());
        });
    };
};