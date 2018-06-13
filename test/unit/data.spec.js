const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const data = require('./src')('./handler/data')(utils.spatula);

describe('Test that data', function() {
    it('succeeds with a data value', function(done) {
        const assert = (dataArgs, doneArgs) => {
            expect(dataArgs).to.deep.equal([
                [{
                    spatula: "data-in"
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                ["data-result"]
            ]);

            done();
        }


        const dataCC = callCounter(() => 'data-result');
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        data(context, 'data-in', doneCC);
    });
});