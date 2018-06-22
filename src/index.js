const _ = require('lodash');
const _register = require('./register');
const _walker = require('./walker');
const _context = require('./context');

const intro = require('./intro')({
    spatula: require('good-spatula'),
    groupCall: require('./group-call'),
    context: _context
}, 100);

/*register('data', require('./handler/data')(spatula));
register('select', require('./handler/select')(spatula));
register('attrib', require('./handler/attrib')(spatula));
register('match', require('./handler/match'));
register('cast', require('./handler/cast')(spatula, _cast(spatula, _groupCall)));
register('name', require('./handler/name'));
register('follow', require('./handler/follow')(spatula, loader));
register('then', require('./handler/then')(_groupCall));*/
//register(x, igot[i]);

const grater = function(loader, done) {

    intro.iam(`cast-map`, require('./cast'));
    intro.iam('loader', x => x(y => y(loader)));

    const nodeHandlers = ['data', 'select', 'attrib', 'match', 'cast', 'name', 'follow', 'then'];
    intro.iam('register', x => x(y => y(_register(nodeHandlers))));

    nodeHandlers.forEach(x => {
        require(`./handler/${x}`)(intro);
    });

    intro.waitfor('register', ...nodeHandlers, (register) => {
        done((node, done) => {
            const walker = _walker(register.getHandlers());
            const context = _context(['data', 'node', 'result', 'resource', 'walker', 'loader']);

            walker(context.node(node).data({}).result({}).walker(walker), (subcontext) => {
                done(subcontext.result());
            });
        });
    });
};

grater.loader = require('./loader');
grater.intro = intro;
module.exports = grater;