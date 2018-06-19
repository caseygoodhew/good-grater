const _ = require('lodash');

module.exports = (handlers) => {
    const walker = (context, done) => {
        const node = context.node();
        const nodeKeys = _(node)
            .keysIn()
            .map(key => node[key] === undefined ? undefined : key)
            .compact()
            .value();

        var callback = done;

        handlers.map(handler => {
            if (handler.default !== undefined || _.includes(nodeKeys, handler.name)) {
                const value = node[handler.name] === undefined ?
                    handler.default :
                    node[handler.name];

                // long winded but required for correct scoping
                callback = ((_value, _callback) => (_context) => {
                    handler.handler(_context, _value, _callback);
                })(value, callback);
            }
        });

        callback(context);
    }

    return walker;
}