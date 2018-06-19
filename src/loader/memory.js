const chalk = require('chalk');

module.exports = (data) => (context, rel, done) => {

    console.log(chalk.grey(`fetching ${rel}`));

    if (!data[rel]) {
        throw new Error(`Could not find and object with key '${rel}'`);
    }

    done(context.data(data[rel]));
}