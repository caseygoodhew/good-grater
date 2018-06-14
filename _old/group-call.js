const _ = require('lodash');

module.exports = function(handler, allDone) {
        // wow. I sure did mess this up!
        var _waitingOn = -1;

        const checkAllDone = function() {
            if (!_.every(_waitingOn, x => x) {
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

                _waitingOn = toInvoke.map(() => false);
                checkAllDone();
                toInvoke.forEach((x, i) => (index) => x());
            }
        }