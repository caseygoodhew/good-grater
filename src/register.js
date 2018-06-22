const _ = require('lodash');

module.exports = (expected) => {
    if (typeof expected !== undefined && !_.isArray(expected)) {
        throw new Error('expected an array of handler names')
    }

    const _expected = expected || [];
    const _handlers = {};
    const all = [];

    const result = (name, handler, options) => {

        options = options || {};

        if (_handlers[name]) {
            throw new Error(`'${name}' is already registered`)
        }

        _handlers[name] = {
            name: name,
            handler: handler,
            before: options.before
        };

        all.push(name);
    }

    result.getHandlers = () => {
        const handlers = _(expected).map(name => _handlers[name]).compact().value();

        all.forEach(name => {
            if (expected.indexOf(name) !== -1) {
                return;
            }

            const entry = handlers[name];

            var index = -1;
            if (entry.before) {
                index = _.findIndex(handlers, o => o.name === entry.before);
            }

            handlers.splice(index === -1 ? handlers.length : index, 0, entry);
        });

        return handlers.reverse();
    }

    return result;
}