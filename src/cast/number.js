module.exports = () => (context, val, done) => {
    done(parseFloat(val.text()));
}