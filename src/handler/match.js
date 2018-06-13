module.exports = (spatula) => (context, match, done) => {

    const getValue = () => {
        const local = context.local();
        if (!local) {
            return '';
        }

        if (typeof local.text === 'function') {
            return local.text();
        }

        return local;
    }

    const result = (String(getValue()).match(match) || []).join('');
    done(context.set('local', 'value', spatula(result)));
}