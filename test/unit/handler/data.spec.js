const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _data = require('./src')('./handler/data');

describe('Test that data', function() {
    const getData = (done) => {
        const mocks = {
            spatula: utils.spatula,
            register: callCounter()
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _data(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getData((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('data');
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

    it('succeeds with a data value', function(testdone) {
        const assert = (dataArgs, doneArgs) => {
            expect(dataArgs).to.deep.equal([
                [{
                    spatula: "data-in"
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                ["data-result"]
            ]);

            testdone();
        }


        const dataCC = callCounter(() => 'data-result');
        const doneCC = callCounter(() => {
            assert(dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        getData(data => data(context, 'data-in', doneCC));
    });
});