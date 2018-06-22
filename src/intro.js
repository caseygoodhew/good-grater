const _ = require('lodash');
const chalk = require('chalk');

const _buildStats = (ihave, register) => () => {
    const getname = filter => _.filter(register, filter).map(x => x.name);

    return {
        actve: _.keysIn(ihave),
        introducing: getname(x => x.status === 'INTRODUCING'),
        introduced: getname(x => x.status === 'INTRODUCED'),
        dispatched: getname(x => x.status === 'DISPATCHED'),
        complete: getname(x => x.status === 'COMPLETE')
    }
}

const _reporter = (timer, stats, _logger) => {
    const logger = _logger === undefined ? console.log : _logger;

    if (typeof timer !== 'number') {
        throw new Error(`timer must be a number - got ${timer}`)
    }

    if (typeof logger !== 'function') {
        throw new Error(`logger must be a function - got ${logger}`)
    }

    logger(chalk.cyan(`Intro timer running @ ${timer} ms interval`));

    var running = false;
    var lastMsg = undefined;

    return () => {
        if (running) {
            return;
        }

        running = true;

        setTimeout(() => {
                running = false;
                const s = stats();
                const msg = [];
                msg.push(chalk.grey('*** intro stats ***'));
                msg.push(chalk.cyan(`${s.actve.length} total active modules`));
                msg.push(chalk.cyan(`${s.introducing.length} waiting for introduction`));
                msg.push(chalk.yellow(`${s.introduced.length} waiting for peers`));
                msg.push(chalk.red(`${s.dispatched.length} waiting for instance`));

                const _msg = msg.join('\n');
                if (_msg !== lastMsg) {
                    lastMsg = _msg;
                    logger(_msg);
                }
            },
            timer
        );
    }
};

module.exports = (config, timer, logger) => {

    const ihave = _.transform(config || {}, (r, v, k) => {
        r[k] = v;
    }, {});

    const register = [];

    const stats = _buildStats(ihave, register);

    const reporter = timer === undefined ?
        () => {} :
        _reporter(timer, stats, logger);

    var waitfor = [];
    const processWaitFor = () => {
        var waitmore = [];
        waitfor.forEach(x => {
            if (_(x.wants).every(w => ihave[w])) {
                x.done(...x.wants.map(w => ihave[w]));
            } else {
                waitmore.push(x);
            }
        });

        waitfor = waitmore;
    }

    const dispatch = item => {
        item.status = 'DISPATCHED';
        item.done(...item.wants.map(w => ihave[w]), (ref) => {
            ihave[item.name] = ref;
            item.status = 'COMPLETE';
            processRegister();
            reporter();
            processWaitFor();
        });
        reporter();
    };

    const processRegister = () => {
        const item = _.find(register,
            r => r.status === 'INTRODUCED' &&
            _(r.wants).every(
                w => ihave[w]
            )
        );

        if (!item) {
            return;
        }

        dispatch(item);
        processRegister();
    };

    const iam = (name, introduce) => {
        const item = {
            name: name
        };

        register.push(item);

        const handshake = (_item, _introduce) => {
            _item.status = 'INTRODUCING';
            _introduce((...wants) => {
                _item.done = wants.pop();
                _item.wants = wants;
                _item.status = 'INTRODUCED';

                processRegister();
            });

            reporter();
        }

        handshake(item, introduce);
    };

    return {
        iam: iam,
        waitfor: (...wants) => {
            const done = wants.pop();
            waitfor.push({
                wants: wants,
                done: done
            });
            processWaitFor();
        },
        stats: stats
    };
}