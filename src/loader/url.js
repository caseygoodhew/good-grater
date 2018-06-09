const fetch = require('node-fetch');
const blender = require('good-blender');
const chalk = require('chalk');

module.exports = (rel, context, done) => {

    console.log(chalk.grey(`fetching ${rel}`));

    var fullUrl = blender(rel, context);

    fetch(fullUrl)
        .then(res => res.text())
        .then(body => done(body, fullUrl))
        .catch(err => console.log(err));
}