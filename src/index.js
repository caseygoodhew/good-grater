const _ = require('lodash');
const spatula = require('good-spatula');

const _register = require('./register');
const _groupCall = require('./group-call');
const _context = require('./context');
const _walker = require('./walker');
const _loaders = require('./loader');

const grater = function(loader) {

    const register = _register();

    register('data', require('./handler/data')(spatula));
    register('select', require('./handler/select')(spatula));
    register('attrib', require('./handler/attrib')(spatula));
    register('match', require('./handler/match'));
    register('cast', require('./handler/cast')(spatula, _groupCall));
    register('name', require('./handler/name'));
    register('follow', require('./handler/follow')(spatula, loader));
    register('then', require('./handler/then')(_groupCall));

    const result = (node, done) => {
        const walker = _walker(register.getHandlers());
        const context = _context(['data', 'node', 'result', 'resource', 'walker', 'loader']);

        walker(context.node(node).data({}).result({}).walker(walker), (subcontext) => {
            done(subcontext.result());
        })
    }

    result.register = register;
    return result;
};

grater.loader = _loaders;

module.exports = grater;