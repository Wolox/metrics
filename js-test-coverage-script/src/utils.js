const chalk = require('chalk');

const error = (errorString) => console.error(chalk.red(errorString));
const success = (successString) => console.log(chalk.green(successString));

module.exports.error = error;
module.exports.success = success;
