const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const _context = require('dynamic-context');

const select = require('./src')('./handler/select');

describe.only('Test that select', function() {

    it('succeeds with a select value', function(testdone) {
        const spatulaMock = x => y => {
            return {
                spatula: `${x}-${y}`
            };
        };

        const contextIn = _context(['data']).data('data-in')

        select(spatulaMock, contextIn, 'selector-in', contextOut => {
            expect(contextOut.data()).to.deep.equal({
                spatula: 'data-in-selector-in'
            });

            testdone();
        });
    });

    it('succeeds with an empty selector value', function(testdone) {
        const spatulaMock = x => {
            return {
                spatula: x
            };
        };

        const contextIn = _context(['data']).data('data-in')

        select(spatulaMock, contextIn, undefined, contextOut => {
            expect(contextOut.data()).to.deep.equal({
                spatula: 'data-in'
            });

            testdone();
        });
    });
});