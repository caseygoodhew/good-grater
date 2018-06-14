const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const match = require('./src')('./handler/match');

describe('Test that match', function() {

    const invokeTest = (input, data, output) => {
        const assert = (dataArgs, doneArgs) => {
            expect(dataArgs).to.deep.equal([
                [],
                [
                    output
                ]
            ]);

            expect(doneArgs.length).to.equal(1);
        }

        const dataCC = callCounter(data)
        const context = {
            data: dataCC
        };
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        match(context, input, doneCC);
    }

    it('succeeds with valid regex value using spatula data', function() {
        invokeTest(/[0-9]/g, () => {
                return {
                    text: () => 'abc42xyz'
                }
            },
            '42'
        )
    });

    it('succeeds with valid regex value using string data', function() {
        invokeTest(/[0-9]/g, () => 'abc42xyz', '42')
    });

    it('succeeds with valid regex value using undefined data', function() {
        invokeTest(/[0-9]/g, () => {}, '')
    });

    it('succeeds with valid regex value using number data', function() {
        invokeTest(/[0-9]/g, () => 42, '42')
    });

    it('succeeds with a string for the regex value', function() {
        invokeTest('', () => 'anything', '')
    });

    it('succeeds with undefined for the regex value', function() {
        invokeTest(undefined, () => 'anything', '')
    });

    it('throws if you initialize with spatula', function() {
        expect(() => match({
            getDom: true
        })).to.throw(TypeError);
    });
});