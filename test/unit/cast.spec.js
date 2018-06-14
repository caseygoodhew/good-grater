const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

const cast = require('./src')('./handler/cast');

describe('Test that cast', function() {

    const invokeTest = (type, input, output) => {
        const msg = `*** type: '${type}', input: '${input}', output: '${output}' ***`;

        const assert = (htmlArgs, textArgs, localArgs, doneArgs) => {
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

            expect(localArgs).to.deep.equal([
                [],
                [output]
            ], msg);

            expect(doneArgs.length).to.equal(1, msg);
        }

        const htmlCC = callCounter(() => input);
        const textCC = callCounter(() => input);
        const localCC = callCounter(() => {
            return {
                html: htmlCC,
                text: textCC
            }
        });
        const doneCC = callCounter(() => {
            assert(
                htmlCC.getLastArgs(),
                textCC.getLastArgs(),
                localCC.getLastArgs(),
                doneCC.getLastArgs());
        });

        const context = {
            local: localCC
        };

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
    });

    it('throws if you initialize with spatula', function() {
        expect(() => cast({
            getDom: true
        })).to.throw(TypeError);
    });
});