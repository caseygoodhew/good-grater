module.exports = () => (context, val, done) => {
    done(val.html());
}