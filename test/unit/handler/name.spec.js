const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _name = require('./src')('./handler/name');

describe('Test that name', function() {

    const getName = (done) => {
        const mocks = {
            register: callCounter()
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _name(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getName((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('name');
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

        getName(name => name(context, 'name-in', doneCC));
    });
});