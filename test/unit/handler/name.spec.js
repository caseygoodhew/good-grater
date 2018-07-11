const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const _context = require('dynamic-context');

const name = require('./src')('./handler/name');

describe('Test that name', function() {

    it('succeeds with a name value', function(testdone) {

        const contextIn = _context(['data', 'result']).data('data-value').result({});

        name(contextIn, 'name-in', contextOut => {
            expect(contextOut.result()).to.deep.equal({
                'name-in': 'data-value'
            });

            testdone();
        });
    });
});