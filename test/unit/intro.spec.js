const expect = require('chai').expect;
const _intro = require('./src')('./intro');

describe.only('Test that intro ', function() {
    it('works when we register a module with no dependencies', function(testdone) {
        const intro = _intro();
        intro.iam('test1', (iwant) => {
            iwant(() => {
                testdone()
            });
        });
    });

    it('works when we register a module with a pre-defined dependency', function(testdone) {
        const intro = _intro({
            initial: () => 'initial'
        });

        intro.iam('test1', (iwant) => {
            iwant('initial', (initial) => {
                expect(initial()).to.equal('initial');
                expect(intro.stats()).to.deep.equal({
                    "actve": ["initial"],
                    "introducing": [],
                    "introduced": [],
                    "dispatched": ["test1"],
                    "complete": []
                });
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

                expect(intro.stats()).to.deep.equal({
                    "actve": ["initial", "test2"],
                    "introducing": [],
                    "introduced": [],
                    "dispatched": ["test1"],
                    "complete": ["test2"]
                });

                done(() => 'test1');
                checktestdone('test1');
            });
        });

        intro.iam('test2', (iwant) => {
            iwant('initial', (initial, done) => {
                expect(initial()).to.equal('initial');

                expect(intro.stats()).to.deep.equal({
                    "actve": ["initial"],
                    "introducing": [],
                    "introduced": ["test1"],
                    "dispatched": ["test2"],
                    "complete": []
                });

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

    it('works when we use a logger', function(testdone) {
        const msgs = [];
        var isDone = false;
        const logger = x => {
            msgs.push(x.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));

            if (!isDone) {
                return;
            }

            console.log(JSON.stringify(msgs, undefined, 4));
            expect(msgs).to.deep.equal([
                "Intro timer running @ 1 ms interval",
                "*** intro stats ***\n1 total active modules\n0 waiting for introduction\n0 waiting for peers\n1 waiting for instance",
                "*** intro stats ***\n2 total active modules\n0 waiting for introduction\n0 waiting for peers\n0 waiting for instance"
            ]);
            testdone();
        }

        const intro = _intro({
            initial: () => 'initial'
        }, 1, logger);

        const delay = handler => {
            setTimeout(handler, 3);
        }

        intro.iam('test1', (iwant) => {
            iwant('initial', (initial, done) => {
                expect(initial()).to.equal('initial');

                delay(() => {
                    isDone = true;
                    done(() => 'test1');
                });
            });
        });
    });

    it('throws when using an invalid timer', function() {
        expect(() => _intro({}, true)).to.throw(Error);
    });

    it('throws when using an invalid logger', function() {
        expect(() => _intro({}, 1, true)).to.throw(Error);
    });
});