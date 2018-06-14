const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const attrib = require('./src')('./handler/attrib')(utils.spatula);;

describe('Test that attrib', function() {
    it('succeeds with a attrib value', function(done) {

        const assert = (attrArgs, dataArgs, doneArgs) => {
            expect(attrArgs).to.deep.equal([
                ["attr-in"]
            ]);

            expect(dataArgs).to.deep.equal([
                [],
                [{
                    spatula: "attr-value"
                }]
            ]);

            expect(doneArgs.length).to.equal(1);

            done();
        }


        const attrCC = callCounter(() => 'attr-value');
        const dataCC = callCounter(() => {
            return {
                attr: attrCC
            }
        });
        const doneCC = callCounter(() => {
            assert(attrCC.getLastArgs(), dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        attrib(context, 'attr-in', doneCC);
    });
});