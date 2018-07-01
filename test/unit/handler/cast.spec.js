const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;
const introMock = utils.introMock;

const _cast = require('./src')('./handler/cast');

describe('Test that cast', function() {

    const getCast = (done) => {
        const mocks = {
            spatula: utils.spatula,
            register: callCounter(),
            "cast-map": {
                "cast-to": callCounter((_x, _xx, done) => {
                    done('cast-result');
                })
            }
        };

        const intro = introMock(
            mocks,
            (...args) => {
                done(...args, intro, mocks)
            }
        );

        _cast(intro);
    }

    it('wires itself correctly using intro', function(testdone) {
        getCast((instance, intro, mocks) => {
            expect(intro.whoIs()).to.equal('cast');
            expect(intro.itWants()).to.deep.equal(['register', 'spatula', 'cast-map']);
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
        const assert = (castArgs, doneArgs) => {
            debugger;
            expect(castArgs).to.deep.equal([
                [{
                    spatula: "cast-to"
                }]
            ]);

            expect(doneArgs).to.deep.equal([
                ["cast-result"]
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

        getCast(cast => cast(context, 'cast-to', doneCC));
    });

    /*
        const invokeTest = (type, input, output) => {
            const msg = `*** type: '${type}', input: '${input}', output: '${output}' ***`;

            const assert = (htmlArgs, textArgs, dataArgs, doneArgs) => {
                if (type === 'html') {
                    expect(htmlArgs).to.deep.equal([
                        []
                    ], msg);

                    expect(textArgs).to.deep.equal([], msg);
                } else {
                    expect(htmlArgs).to.deep.equal([], msg);

                    expect(textArgs).to.deep.equal([
                        []
                    ], msg);
                }

                expect(dataArgs).to.deep.equal([
                    [],
                    [output]
                ], msg);

                expect(doneArgs.length).to.equal(1, msg);
            }

            const htmlCC = callCounter(() => input);
            const textCC = callCounter(() => input);
            const dataCC = callCounter(() => {
                return {
                    html: htmlCC,
                    text: textCC
                }
            });
            const doneCC = callCounter(() => {
                assert(
                    htmlCC.getLastArgs(),
                    textCC.getLastArgs(),
                    dataCC.getLastArgs(),
                    doneCC.getLastArgs());
            });

            const context = {
                data: dataCC
            };

            const cast = _cast(x => x);
            cast(context, type, doneCC);
        }

        it('succeeds with an html cast', function() {
            invokeTest('html', 'html-value', 'html-value');
        });

        it('succeeds with a text cast', function() {
            invokeTest('text', 'text-value', 'text-value');
        });

        it('succeeds with a number cast', function() {
            invokeTest('number', '42', 42);
            invokeTest('number', '42.3', 42.3);
            invokeTest('number', ' 42.0 ', 42);
            invokeTest('number', 'a 42', NaN);
            invokeTest('number', '42 a', 42);
        });*/
});