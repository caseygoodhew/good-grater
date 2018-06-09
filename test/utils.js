const mockRequire = require('mock-require');

module.exports = function() {

    mockRequire('good-spatula', x => x);

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
        mockContext: mockContext
    }
}