const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const cast = require('./src')('./handler/cast');

describe('Test that cast', function() {

    it('succeeds with a data value', function(testdone) {
        const assert = (castArgs, dataArgs, doneArgs, context) => {

            expect(castArgs.length).to.equal(1);
            expect(castArgs[0].length).to.equal(3);

            expect(castArgs[0][0]).to.equal(context);
            expect(castArgs[0][1]).to.deep.equal({
                "spatula": "data-result"
            });
            expect(typeof castArgs[0][2]).to.equal('function');

            expect(dataArgs).to.deep.equal([
                [],
                ["cast-result"]
            ]);

            expect(doneArgs).to.deep.equal([
                ["data-result"]
            ]);

            testdone();
        }

        const dataCC = callCounter(() => 'data-result');

        const castCC = callCounter((_x, __x, done) => {
            done('cast-result');
        });

        const castMap = {
            'cast-to': castCC
        }

        const context = {
            data: dataCC
        };

        const doneCC = callCounter(() => {
            assert(castCC.getLastArgs(), dataCC.getLastArgs(), doneCC.getLastArgs(), context);
        });

        cast(utils.spatula, castMap, context, 'cast-to', doneCC);
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