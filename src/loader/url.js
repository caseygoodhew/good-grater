const fetch = require('node-fetch');
const blender = require('good-blender');
const chalk = require('chalk');

module.exports = (context, rel, done) => {

    console.log(chalk.grey(`fetching ${rel}`));

    var fullUrl = blender(rel, context.loader());

    fetch(fullUrl)
        .then(res => res.text())
        .then(body => done(context.loader(fullUrl).data(body)))
        .catch(err => console.log(err));
}