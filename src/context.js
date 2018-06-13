const _ = require('lodash');

module.exports = function(_points) {

    if (!_.isArray(_points)) {
        throw new TypeError('constructor parameter must be and array');
    }

    if (!_.every(_points, x => {
            return typeof x === 'string' && x.length;
        })) {
        throw new TypeError('constructor parameter array must contain only strings');
    }

    if (!_points.length) {
        throw new TypeError('constructor parameter array cannot be empty');
    }

    const points = [].concat(_points);

    const context2 = function(values) {

        const rebuild = (index, value) => {
            return context2(points.map((p, i) => i === index ? value : values[i]))
        }

        const handler = (index) => (value) => {
            if (value === undefined) {
                return values[index];
            }

            return rebuild(index, value);
        }

        const instance = {
            set: (elem, name, value) => {
                const index = _.indexOf(points, elem);

                if (index === -1) {
                    throw new Error(`context does not have a '${elem}' attribute`);
                }

                const getVal = (current, name, newValue) => {
                    if (_.isNil(name)) {
                        return name === undefined ? newValue : name;
                    } else if (_.isObject(current)) {
                        current[name] = newValue;
                        return current;
                    } else {
                        return newValue === undefined ? name : newValue;
                    }
                }

                return rebuild(index, getVal(values[index], name, value));
            }
        };

        points.forEach((x, i) => instance[x] = handler(i));

        return instance;
    }

    return context2([]);
}