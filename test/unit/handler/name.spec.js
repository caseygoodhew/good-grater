const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const name = require('./src')('./handler/name');

describe('Test that name', function() {

    it('succeeds with a name value', function(testdone) {

        const assert = (setArgs, doneArgs) => {
            expect(setArgs).to.deep.equal([
                ["result", "name-in", "data-value"]
            ]);

            expect(doneArgs).to.deep.equal([
                ["set-result"]
            ]);

            testdone();
        }


        const setCC = callCounter(() => 'set-result');
        const doneCC = callCounter(() => {
            assert(setCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: () => 'data-value',
            set: setCC
        };

        name(context, 'name-in', doneCC);
    });
});