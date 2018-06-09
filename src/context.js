module.exports = function() {

    const context = function(node, data, result, locator, parent) {
        const isContext = node &&
            typeof node.node === 'function' &&
            typeof node.data === 'function' &&
            typeof node.result === 'function' &&
            typeof node.locator === 'function';

        const _node = isContext ? node.node() : node;
        const _data = isContext ? node.data() : data;
        const _result = isContext ? node.result() : result;
        const _locator = isContext ? node.locator() : locator;
        const _parent = isContext ? node : parent;

        const instance = {
            node: (n) => {
                return n === undefined ? _node : context(n, _data, _result, _locator, instance);
            },
            data: (d) => {
                return d === undefined ? _data : context(_node, d, _result, _locator, instance);
            },
            result: (r) => {
                return r === undefined ? _result : context(_node, _data, r, _locator, instance);
            },
            locator: (l) => {
                return l === undefined ? _locator : context(_node, _data, _result, l, instance);
            },
            parent: () => {
                return _parent;
            },
            val: () => {
                return {
                    node: _node,
                    data: _data,
                    result: _result,
                    locator: _locator,
                    parent: _parent ? _parent.val() : undefined
                }
            }
        };

        return instance;
    }

    return context();
}