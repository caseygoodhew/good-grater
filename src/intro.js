const _ = require('lodash');

module.exports = (config) => {

    const ihave = _.transform(config || {}, (r, v, k) => {
        r[k] = v;
    }, {});

    const queue = [];

    const dispatch = item => {
        item.status = 'DISPATCHED';
        item.done(...item.wants.map(w => ihave[w]), (ref) => {
            ihave[item.name] = ref;
            item.status = 'COMPLETE';
            processQueue();
        });
    };

    const processQueue = () => {
        const item = _.find(queue,
            q => q.status === 'PENDING' &&
            _(q.wants).every(
                w => ihave[w]
            )
        );

        if (!item) {
            return;
        }

        dispatch(item);
        processQueue();
    };

    const iam = (name, introduce) => {
        introduce((...wants) => {
            const done = wants.pop();

            queue.push({
                name: name,
                wants: wants,
                done: done,
                status: 'PENDING'
            });

            processQueue();
        });
    };

    return {
        iam: iam
    };
}