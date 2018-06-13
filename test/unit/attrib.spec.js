const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const attrib = require('./src')('./handler/attrib')(utils.spatula);;

describe('Test that attrib', function() {
    it('succeeds with a attrib value', function(done) {

        const assert = (attrArgs, setArgs, doneArgs) => {
            expect(attrArgs).to.deep.equal([
                ["attr-in"]
            ]);

            expect(setArgs).to.deep.equal([
                ["local", "value", {
                    spatula: "attr-value"
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                ["set-result"]
            ]);

            done();
        }


        const attrCC = callCounter(() => 'attr-value');
        const setCC = callCounter(() => 'set-result');
        const doneCC = callCounter(() => {
            assert(attrCC.getLastArgs(), setCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            local: () => {
                return {
                    attr: attrCC
                }
            },
            set: setCC
        };

        attrib(context, 'attr-in', doneCC);
    });
});