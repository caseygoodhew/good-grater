const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const _context = require('dynamic-context');

const data = require('./src')('./handler/data');

describe('Test that data', function() {
    it('succeeds with a data value', function(testdone) {
        const contextIn = _context(['data'])

        data(utils.spatula, contextIn, 'data-in', contextOut => {
            expect(contextOut.data()).to.deep.equal({
                spatula: 'data-in'
            });

            testdone();
        });
    });
});