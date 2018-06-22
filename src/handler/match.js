const match = (context, match, done) => {

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

module.exports = (intro) => {
    intro.iam('match', (iwant) => {
        iwant('register', (register, done) => {
            const handler = match;
            register('match', handler);
            done(handler);
        });
    });
}