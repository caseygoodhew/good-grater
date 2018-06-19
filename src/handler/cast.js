const _ = require('lodash');

module.exports = (spatula, _groupCall) => (context, cast, done) => {
    if (context.getDom) {
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    const castTo = (val, castDone) => {
        switch (cast) {
            case 'html':
                castDone(val.html());
                break;

            case 'text':
                castDone(val.text());
                break;

            case 'number':
                castDone(parseFloat(val.text()));
                break;

            case 'array':
                const walker = context.walker();
                const node = context.node();
                const result = [];

                const groupCall = _groupCall(() => {
                    castDone(result);
                });

                const dom = val.getDom();

                groupCall(
                    _.castArray(dom)
                    .map(function(el) {
                        return function(onedone) {
                            walker(context.node({
                                then: node.then,
                                follow: node.follow
                            }).data(spatula(el)).result({}), (itemcontext) => {
                                result.push(itemcontext.result());
                                onedone();
                            });
                        }
                    })
                );

                break;

            default:
                throw new Error(`Unhandled cast type '${cast}'`)
        }
    }

    castTo(spatula(context.data()), (value) => {
        done(context.data(value));
    });
}