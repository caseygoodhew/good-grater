const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const match = require('./src')('./handler/match')(utils.spatula);;

describe('Test that match', function() {

    const invokeTest = (input, local, output) => {
        const assert = (localArgs, doneArgs) => {
            expect(localArgs).to.deep.equal([
                [],
                [
                    output
                ]
            ]);

            expect(doneArgs.length).to.equal(1);
        }

        const localCC = callCounter(local)
        const context = {
            local: localCC
        };
        const doneCC = callCounter(() => {
            assert(localCC.getLastArgs(), doneCC.getLastArgs());
        });

        match(context, input, doneCC);
    }

    it('succeeds with valid regex value using spatula local', function() {
        invokeTest(/[0-9]/g, () => {
            return {
                text: () => 'abc42xyz'
            }
        }, {
            'spatula': '42'
        })
    });

    it('succeeds with valid regex value using string local', function() {
        invokeTest(/[0-9]/g, () => 'abc42xyz', {
            'spatula': '42'
        })
    });

    it('succeeds with valid regex value using undefined local', function() {
        invokeTest(/[0-9]/g, () => {}, {
            'spatula': ''
        })
    });

    it('succeeds with valid regex value using number local', function() {
        invokeTest(/[0-9]/g, () => 42, {
            'spatula': '42'
        })
    });

    it('succeeds with a string for the regex value', function() {
        invokeTest('', () => 'anything', {
            'spatula': ''
        })
    });

    it('succeeds with undefined for the regex value', function() {
        invokeTest(undefined, () => 'anything', {
            'spatula': ''
        })
    });
});