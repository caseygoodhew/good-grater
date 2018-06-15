const _ = require('lodash');
const spatula = require('good-spatula');

const _register = require('./register');
const _groupCall = require('./group-call');
const _context = require('./context');
const _walker = require('./walker');

const grater = function() {

    const register = _register();
    debugger;
    register('data', require('./handler/data')(spatula));
    register('select', require('./handler/select')(spatula), {
        default: ''
    });
    register('attrib', require('./handler/attrib')(spatula));
    register('match', require('./handler/match'));
    register('cast', require('./handler/cast')(spatula));
    register('name', require('./handler/name'));
    register('follow', require('./handler/follow'));
    register('then', require('./handler/then')(_groupCall));

    const result = (node, done) => {
        const walker = _walker(register.getHandlers());
        const context = _context(['data', 'node', 'result', 'resource']);

        walker(context.node(node).data({}).result({}), (subcontext) => {
            done(subcontext.result());
        })
    }

    result.register = register;
    return result;
};

module.exports = grater;