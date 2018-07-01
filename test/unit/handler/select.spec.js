const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const select = require('./src')('./handler/select');

describe('Test that select', function() {

    const spatulaMock = x => y => {
        return {
            spatula: x
        };
    };

    it('succeeds with a select value', function(testdone) {
        const assert = (dataArgs, doneArgs) => {

            expect(JSON.parse(JSON.stringify(dataArgs))).to.deep.equal([
                [],
                [{
                    spatula: {
                        value: 'data-result'
                    }
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                [{
                    value: 'data-result'
                }]
            ]);

            testdone();
        }


        const dataCC = callCounter(() => {
            return {
                value: 'data-result'
            };
        });
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        select(spatulaMock, context, 'data-in', doneCC);
    });
});