const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (locator) => (rel, context, done) => {

    locator(rel, context, (folder, file) => {
        console.log(chalk.grey(`fetching ${file}`));

        fs.readFile(path.join(folder, file), 'latin1', function(err, data) {
            if (err) {
                throw new Error(`Could not load '${file}'`)
            }
            done(data);
        });
    });
}