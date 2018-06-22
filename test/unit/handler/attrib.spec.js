const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _attrib = require('./src')('./handler/attrib');

describe('Test that attrib', function() {

    const getAttrib = (done) => {
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

        _attrib(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getAttrib((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('attrib');
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

    it('succeeds with a attrib value', function(testdone) {

        const assert = (attrArgs, dataArgs, doneArgs) => {
            expect(attrArgs).to.deep.equal([
                ["attr-in"]
            ]);

            expect(dataArgs).to.deep.equal([
                [],
                [{
                    spatula: "attr-value"
                }]
            ]);

            expect(doneArgs.length).to.equal(1);

            testdone();
        }


        const attrCC = callCounter(() => 'attr-value');
        const dataCC = callCounter(() => {
            return {
                attr: attrCC
            }
        });
        const doneCC = callCounter(() => {
            assert(attrCC.getLastArgs(), dataCC.getLastArgs(), doneCC.getLastArgs());
        });

        const context = {
            data: dataCC
        };

        getAttrib(attrib => attrib(context, 'attr-in', doneCC));
    });
});