const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const _context = require('dynamic-context');

const attrib = require('./src')('./handler/attrib');

describe('Test that attrib', function() {

    it('succeeds with a attrib value', function(testdone) {
        const attrCC = callCounter(() => 'attr-value');
        const contextIn = _context(['data'])
            .data({
                attr: attrCC
            });

        attrib(utils.spatula, contextIn, 'attr-in', contextOut => {
            expect(attrCC.getLastArgs()).to.deep.equal([
                ["attr-in"]
            ]);

            expect(contextOut.data()).to.deep.equal({
                spatula: "attr-value"
            });

            testdone();
        });
    });
});