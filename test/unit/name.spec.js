const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const name = require('./src')('./handler/name');

describe('Test that name', function() {
    it('succeeds with a name value', function(done) {

        const assert = (setArgs, doneArgs) => {
            expect(setArgs).to.deep.equal([
                ["result", "name-in", "data-value"]
            ]);

            expect(doneArgs).to.deep.equal([
                ["set-result"]
            ]);

            done();
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

    it('throws if you initialize with spatula', function() {
        expect(() => name({
            getDom: true
        })).to.throw(TypeError);
    });
});