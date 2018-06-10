module.exports = function(handler, allDone) {

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
    return function(toInvoke) {
        if (_waitingOn != -1) {
            throw new Erorr('Cannot invoke a group call already in progress')
        }

        _waitingOn = toInvoke.length;
        checkAllDone();
        toInvoke.forEach(x => x());
    }
}