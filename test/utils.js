module.exports = function() {

    const mockContext = (config) => {

        const _config = {};
        for (var i in (config || {})) {
            _config[i] = config[i];
        }

        const getOrSet = (name) => (val) => {
            if (val) {
                _config[name] = val;
            }
            return _config[name];
        }

        return {
            node: getOrSet('node'),
            data: getOrSet('data')
        }
    }

    return {
        mockContext: mockContext,
        callCounter: (handler) => {
            const _args = [];
            const invoke = function() {
                _args.push(Array.prototype.slice.call(arguments));
                if (handler) {
                    return handler(...arguments);
                }
            }

            invoke.getLastArgs = () => _args;
            return invoke;
        },
        spatula: x => {
            return {
                spatula: x
            };
        }
    }
}