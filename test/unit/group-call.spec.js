const expect = require('chai').expect;
const randomInt = require('random-int');
const utils = require('./utils')();
const callCounter = utils.callCounter;

const _groupCall = require('./src')('./group-call');

describe('Test that group-call', function() {
    it('succeeds when there\'s no children', function(done) {
        const groupCall = _groupCall(done);
        groupCall([]);
    });

    it('succeeds when there\'s one child', function(done) {
        const groupCall = _groupCall(() => {
            expect(handler.getLastArgs().length).to.equal(1);
            done();
        });

        const handler = callCounter(oneDone => {
            oneDone();
        });

        groupCall([handler]);
    });

    it('succeeds when there\'s five children', function(done) {
        const groupCall = _groupCall(() => {
            expect(handler.getLastArgs().length).to.equal(5);
            done();
        });

        const handler = callCounter(oneDone => {
            setTimeout(oneDone, randomInt(100))
        });

        groupCall([handler, handler, handler, handler, handler]);
    });

    it('multiple calls to oneDone don\'t interfere', function(done) {
        var counter = 0;
        const groupCall = _groupCall(() => {
            expect(counter).to.equal(10);
            done();
        });

        const handler = (repeat) => oneDone => {
            const newOneDone = () => {
                counter++;
                oneDone();
            }

            if (repeat) {
                newOneDone();
                newOneDone();
                newOneDone();
                setTimeout(newOneDone, 1);
                setTimeout(newOneDone, 1);
                setTimeout(newOneDone, 1);
                setTimeout(newOneDone, 1);
                setTimeout(newOneDone, 1);
                setTimeout(newOneDone, 1);
            } else {
                setTimeout(newOneDone, 10);
            }
        };

        groupCall([handler(true), handler()]);
    });

    it('throws when initialized without a callback function', function() {
        expect(() => _groupCall()).to.throw(TypeError);
    });

    it('throws when invoke without an array', function() {
        const groupCall = _groupCall(() => {});
        expect(() => groupCall()).to.throw(TypeError);
        expect(() => groupCall('throw')).to.throw(TypeError);
    });

    it('throws when invoke without an array of functions', function() {
        const groupCall = _groupCall(() => {});
        expect(() => groupCall(['function'])).to.throw(TypeError);
        expect(() => groupCall([() => {}, 'function'])).to.throw(TypeError);
    });

    it('throws when a groupcall is already in progress', function() {
        const groupCall = _groupCall(() => {
            // should never execute
            expect(false).to.be.true;
        });

        const handler = () => {};

        groupCall([handler]);

        expect(() => groupCall([handler])).to.throw(Error);
    });
});