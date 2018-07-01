const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _cast = require('./src')('./handler/cast-intro');

describe('Test that cast-intro', function() {

    const getCast = (done) => {
        const mocks = {
            register: callCounter()
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _cast(intro);
    }

    it('wires itself correctly', function(testdone) {

        getCast((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('cast');
            expect(intro.itWants()).to.deep.equal(['spatula', 'cast-map', 'register']);
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
});