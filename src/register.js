const _ = require('lodash');

module.exports = () => {
    const _handlers = [];

    const result = (name, handler, options) => {

        options = options || {};

        const entry = {
            name: name,
            handler: handler,
            default: options.default
        };

        var index = -1;

        if (options.before) {
            index = _.findIndex(_handlers, o => o.name === options.before);
        }

        _handlers.splice(index === -1 ? _handlers.length : index, 0, entry);
    }

    result.getHandlers = () => [].concat(_handlers).reverse();

    return result;
}