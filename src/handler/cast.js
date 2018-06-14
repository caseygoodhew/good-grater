module.exports = (context, cast, done) => {
    if (context.getDom) {
        throw new TypeError('This module doesn\'t use spatula. Stop trying to do that.')
    }

    const castTo = (val) => {
        switch (cast) {
            case 'html':
                return val.html();
                break;

            case 'text':
                return val.text();
                break;

            case 'number':
                return parseFloat(val.text());
                break;

            default:
                throw new Error(`Unhandled cast type '${cast}'`)
        }
    }
    const value = castTo(context.local());

    done(context.local(value));
}