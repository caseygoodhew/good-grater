module.exports = (spatula) => (context, match, done) => {

    const getValue = () => {
        const local = context.local();
        if (!local) {
            return '';
        }

        const value = local.value || local;

        if (typeof value.text === 'function') {
            return value.text();
        }

        return value;
    }

    const result = (String(getValue()).match(match) || []).join('');
    done(context.set('local', 'value', spatula(result)));
}