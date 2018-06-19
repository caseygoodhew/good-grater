const _ = require('lodash');

module.exports = (spatula, _groupCall) => (context, val, done) => {
    const walker = context.walker();
    const node = context.node();
    const result = [];

    const groupCall = _groupCall(() => {
        done(result);
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
}