const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const _context = require('dynamic-context');

const match = require('./src')('./handler/match');

describe('Test that match', function() {

    const invokeTest = (input, data, expected, testdone) => {
        const contextIn = _context(['data']).set('data', data);

        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        match(contextIn, input, contextOut => {
            expect(contextOut.data()).to.equal(expected);
            testdone();
        });
    }

    it('succeeds with valid regex value using spatula data', function(testdone) {
        invokeTest(/[0-9]/g, {
                text: () => 'abc42xyz'
            },
            '42',
            testdone
        )
    });

    it('succeeds with valid regex value using string data', function(testdone) {
        invokeTest(/[0-9]/g, 'abc42xyz', '42', testdone)
    });

    it('succeeds with valid regex value using undefined data', function(testdone) {
        invokeTest(/[0-9]/g, {}, '', testdone)
    });

    it('succeeds with valid regex value using number data', function(testdone) {
        invokeTest(/[0-9]/g, 42, '42', testdone)
    });

    it('succeeds with valid regex value using undefined data', function(testdone) {
        invokeTest(/[0-9]/g, undefined, '', testdone)
    });

    it('succeeds with a string for the regex value', function(testdone) {
        invokeTest('', 'anything', '', testdone)
    });

    it('succeeds with undefined for the regex value', function(testdone) {
        invokeTest(undefined, 'anything', '', testdone)
    });
});