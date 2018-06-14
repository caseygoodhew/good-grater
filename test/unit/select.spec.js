const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const select = require('./src')('./handler/select')(x => y => {
    return {
        spatula: x
    };
});

describe('Test that select', function() {
    it('succeeds with a select value', function(done) {
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

            done();
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

        select(context, 'data-in', doneCC);
    });
});