const _ = require('lodash');

module.exports = (_groupCall) => (context, then, done) => {

    const walker = context.walker();
    const groupCall = _groupCall(() => {
        done(context);
    });

    groupCall(
        _.castArray(then)
        .map(node =>
            onedone =>
            walker(context.node(node), onedone)
        )
    );
}





//