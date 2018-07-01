module.exports = (context, match, done) => {

    const getValue = () => {
        const value = context.data();
        if (!value) {
            return '';
        }

        if (typeof value.text === 'function') {
            return value.text();
        }

        return value;
    }

    const result = (String(getValue()).match(match) || []).join('');
    done(context.data(result));
}