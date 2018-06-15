const _ = require('lodash');

module.exports = (handlers) => {
    const walker = (context, done) => {
        const node = context.node();
        const nodeKeys = _.keysIn(node);

        var callback = done;
        /*
                node.then ?
                    //(subcontext) => walker(subcontext.node(node.then), done) :
                    (subcontext) => walker(subcontext, done) :
                    done;
        */
        handlers.map(handler => {
            //(context, data, done)
            if (handler.default !== undefined || _.includes(nodeKeys, handler.name)) {
                const value = node[handler.name] === undefined ?
                    handler.default :
                    node[handler.name];

                // long winded but apparently required for correct scoping
                callback = ((_value, _callback) => (_context) => {
                    handler.handler(_context, _value, _callback);
                })(value, callback);
            }
        });

        callback(context);
    }

    return walker;
}