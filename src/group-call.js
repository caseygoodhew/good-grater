const _ = require('lodash');

module.exports = (allDone) => {

    if (typeof allDone !== 'function') {
        throw new TypeError('group-call must be initialized with a callback function')
    }

    const checkAllDone = () => {
        if (_(status).every(x => x)) {
            allDone();
        }
    }

    const oneDone = (index) => (...args) => {
        status[index] = true;
        checkAllDone();
    }

    var status = [];

    return (toInvoke) => { // [(done) => {}]
        if (!_(status).every(x => x)) {
            throw new Error('group call already in progress')
        }

        if (!_.isArray(toInvoke)) {
            throw new TypeError('group call must be called with an array of functions')
        }

        if (!_.every(toInvoke, x => typeof x === 'function')) {
            throw new TypeError('group call must be called with an array of functions')
        }

        status = toInvoke.map(x => false);
        checkAllDone();
        toInvoke.forEach((fn, i) => fn(oneDone(i)));
    }
}