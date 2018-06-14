const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const attrib = require('./src')('./handler/attrib')(utils.spatula);;

describe('Test that attrib', function() {
    it('succeeds with a attrib value', function(done) {

        const assert = (attrArgs, localArgs, doneArgs) => {
            expect(attrArgs).to.deep.equal([
                ["attr-in"]
            ]);

            expect(localArgs).to.deep.equal([
                [],
                [{
                    spatula: "attr-value"
                }]
            ]);

            expect(doneArgs.length).to.equal(1);

            done();
        }


        const attrCC = callCounter(() => 'attr-value');
        const localCC = callCounter(() => {
            return {
                attr: attrCC
            }
        });
        const doneCC = callCounter(() => {
            assert(attrCC.getLastArgs(), localCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            local: localCC
        };

        attrib(context, 'attr-in', doneCC);
    });
});