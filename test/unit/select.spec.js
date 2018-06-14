const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const select = require('./src')('./handler/select')(x => y => x);

describe('Test that select', function() {
    it('succeeds with a select value', function(done) {
        const assert = (dataArgs, localArgs, doneArgs) => {

            expect(JSON.parse(JSON.stringify(dataArgs))).to.deep.equal([
                [],
                [{
                    value: "data-result"
                }]
            ]);

            expect(JSON.parse(JSON.stringify(localArgs))).to.deep.equal([
                [{
                    "value": "data-result"
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                ["local-result"]
            ]);

            done();
        }


        const localCC = callCounter(() => 'local-result');
        const dataCC = callCounter(() => {
            return {
                value: 'data-result',
                local: localCC
            };
        });
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), localCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        select(context, 'data-in', doneCC);
    });
});