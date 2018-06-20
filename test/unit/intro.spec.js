const expect = require('chai').expect;
const _intro = require('./src')('./intro');

describe('Test that intro ', function() {
    it('works when we register a module with no dependencies', function(testdone) {
        const intro = _intro();
        intro.iam('test1', (iwant, done) => {
            iwant(() => {
                testdone()
            });
        });
    });

    it('works when we register a module with a pre-defined dependency', function(testdone) {
        const intro = _intro({
            initial: () => 'initial'
        });

        intro.iam('test1', (iwant, done) => {
            iwant('initial', (initial) => {
                expect(initial()).to.equal('initial');
                testdone();
            });
        });
    });

    it('works when we register multiple synchronous modules', function(testdone) {
        const intro = _intro({
            initial: () => 'initial'
        });

        const track = [];

        const checktestdone = (name) => {
            track.push(name);

            if (track.length === 1) {
                expect(track).to.deep.equal(['test1']);
            }

            if (track.length === 2) {
                expect(track).to.deep.equal(['test1', 'test2']);
                testdone();
            }
        }

        intro.iam('test1', (iwant) => {
            iwant('initial', 'test2', (initial, test2, done) => {
                expect(initial()).to.equal('initial');
                expect(test2()).to.equal('test2');

                done(() => 'test1');
                checktestdone('test1');
            });
        });

        intro.iam('test2', (iwant) => {
            iwant('initial', (initial, done) => {
                expect(initial()).to.equal('initial');

                done(() => 'test2');
                checktestdone('test2');
            });
        });
    });

    it('works when we register multiple asynchronous modules', function(testdone) {
        const intro = _intro({
            initial: () => 'initial'
        });

        const track = [];

        const checktestdone = (name) => {
            track.push(name);

            if (track.length === 1) {
                expect(track).to.deep.equal(['test2']);
            }

            if (track.length === 2) {
                expect(track).to.deep.equal(['test2', 'test1']);
                testdone();
            }
        }

        const delay = handler => {
            setTimeout(handler, 10);
        }

        intro.iam('test1', (iwant) => {
            iwant('initial', 'test2', (initial, test2, done) => {
                expect(initial()).to.equal('initial');
                expect(test2()).to.equal('test2');

                delay(() => {
                    done(() => 'test1');
                    checktestdone('test1');
                });
            });
        });

        intro.iam('test2', (iwant) => {
            iwant('initial', (initial, done) => {
                expect(initial()).to.equal('initial');

                delay(() => {
                    done(() => 'test2');
                    checktestdone('test2');
                });
            });
        });
    });
});