const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const select = require('./src')('./handler/select')(x => y => x);

describe('Test that select', function() {
    it('succeeds with a select value', function(done) {
        const assert = (dataArgs, setArgs, doneArgs) => {

            expect(JSON.parse(JSON.stringify(dataArgs))).to.deep.equal([
                [],
                [{
                    value: "data-result"
                }]
            ]);

            expect(JSON.parse(JSON.stringify(setArgs))).to.deep.equal([
                [
                    "local",
                    "value",
                    {
                        "value": "data-result"
                    }
                ]
            ]);

            expect(doneArgs).to.deep.equal([
                ["set-result"]
            ]);

            done();
        }


        const setCC = callCounter(() => 'set-result');
        const dataCC = callCounter(() => {
            return {
                value: 'data-result',
                set: setCC
            };
        });
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), setCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        select(context, 'data-in', doneCC);
    });
});