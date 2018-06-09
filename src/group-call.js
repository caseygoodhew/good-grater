const emptyFn = () => {}

module.exports = function(handler, allDone) {

    var _toInvoke = []
    var _waitingOn = -1;

    const checkAllDone = function() {
        if (!_waitingOn) {
            _waitingOn = -1
            allDone();
        }
    }

    const intercept = function(oneDone) {
        return function() {
            oneDone(...arguments);
            _waitingOn--;
            checkAllDone();
        }
    }
    return {
        register: function(context, done) {
            _toInvoke.push(() => handler(context, intercept(done || emptyFn)));
        },

        invoke: function() {
            if (_waitingOn != -1) {
                return;
            }

            _waitingOn = _toInvoke.length;
            const toInvoke = _toInvoke;
            _toInvoke = [];

            checkAllDone();

            toInvoke.forEach(x => x());
        }
    }
}