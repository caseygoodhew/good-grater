const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _select = require('./src')('./handler/select');

describe('Test that select', function() {
    const getSelect = (done) => {
        const mocks = {
            spatula: x => y => {
                return {
                    spatula: x
                };
            },
            register: callCounter()
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _select(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getSelect((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('select');
            expect(intro.itWants()).to.deep.equal(['register', 'spatula']);
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

        getSelect(select => select(context, 'data-in', doneCC));
    });
});