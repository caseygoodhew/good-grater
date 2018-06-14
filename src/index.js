const _ = require('lodash');
const spatula = require('good-spatula');
const _context = require('./context')(['data', 'node', 'result', 'resource']);

const walker = function(context, handlers, done) {
    const node = context.node();
    const nodeKeys = _.keysIn(node);

    var callback = node.then ?
        (subcontext) => walker(subcontext.node(node.then), handlers, done) :
        done;

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

const handlers = [];

const grater = function() {

    return (node, done) => {
        walker(_context.node(node).data({}).result({}), [].concat(handlers).reverse(), (context) => {
            debugger;
            done(context.result());
        })
    }
};

grater.register = (name, handler, options) => {

    options = options || {};

    const entry = {
        name: name,
        handler: handler,
        default: options.default
    };

    var index = -1;

    if (options.before) {
        index = _.findIndex(handlers, o => o.name === options.before);
    }

    handlers.splice(index === -1 ? handlers.length : index, 0, entry);
}

grater.register('data', require('./handler/data')(spatula));

grater.register('select', require('./handler/select')(spatula), {
    default: ''
});

grater.register('attrib', require('./handler/attrib')(spatula));

grater.register('match', require('./handler/match'));

grater.register('cast', require('./handler/cast')(spatula));

grater.register('name', require('./handler/name'));

grater.register('follow', require('./handler/follow'));

module.exports = grater;