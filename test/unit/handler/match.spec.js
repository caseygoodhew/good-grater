const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _match = require('./src')('./handler/match');

describe('Test that match', function() {

    const getMatch = (done) => {
        const mocks = {
            register: callCounter()
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _match(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getMatch((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('match');
            expect(intro.itWants()).to.deep.equal(['register']);
            expect(typeof intro.itIs()).to.equal('function');
            expect(instance).to.equal(intro.itIs());
            const registerArgs = mocks.register.getLastArgs();
            expect(registerArgs.length).to.equal(1);
            expect(registerArgs[0].length).to.equal(2);
            expect(registerArgs[0][0]).to.equal(intro.whoIs());
            expect(registerArgs[0][1]).to.equal(intro.itIs());
            testdone();
        });
    });

    const invokeTest = (input, data, output, testdone) => {
        const assert = (dataArgs, doneArgs) => {
            expect(dataArgs).to.deep.equal([
                [],
                [
                    output
                ]
            ]);

            expect(doneArgs.length).to.equal(1);

            testdone();
        }

        const dataCC = callCounter(data)
        const context = {
            data: dataCC
        };
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        getMatch(match => match(context, input, doneCC));
    }

    it('succeeds with valid regex value using spatula data', function(testdone) {
        invokeTest(/[0-9]/g, () => {
                return {
                    text: () => 'abc42xyz'
                }
            },
            '42',
            testdone
        )
    });

    it('succeeds with valid regex value using string data', function(testdone) {
        invokeTest(/[0-9]/g, () => 'abc42xyz', '42', testdone)
    });

    it('succeeds with valid regex value using undefined data', function(testdone) {
        invokeTest(/[0-9]/g, () => {}, '', testdone)
    });

    it('succeeds with valid regex value using number data', function(testdone) {
        invokeTest(/[0-9]/g, () => 42, '42', testdone)
    });

    it('succeeds with a string for the regex value', function(testdone) {
        invokeTest('', () => 'anything', '', testdone)
    });

    it('succeeds with undefined for the regex value', function(testdone) {
        invokeTest(undefined, () => 'anything', '', testdone)
    });
});