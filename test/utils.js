const expect = require('chai').expect;

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
        },
        introMock: (mocks, alldone) => {
            const results = {
                iam: [],
                iwant: []
            };
            return {
                whoIs: () => results.iam[0],
                itWants: () => [].concat(results.iwant),
                itIs: () => results.instance,
                iam: (...args) => {
                    results.iam = args;
                    expect(args.length).to.equal(2);
                    expect(typeof args[0]).to.equal('string');
                    expect(typeof args[1]).to.equal('function');
                    args[1]((...args) => {
                        expect(args.length).to.be.above(0);
                        const done = args.pop();
                        results.iwant = args;
                        expect(typeof done).to.equal('function');
                        done(...args.map(x => mocks[x]), (...args) => {
                            expect(args.length).to.equal(1);
                            results.instance = args[0];
                            alldone(results.instance);
                        });
                    });
                }
            }
        }
    }
}