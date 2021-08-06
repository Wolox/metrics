const chalk = require('chalk');

const error = (errorString) => console.error(chalk.red(errorString));
const success = (successString) => console.log(chalk.green(successString));
const printError = (err) => {
  error(err);
  process.exitCode = 1;
  process.exit();
  return;
};

module.exports.error = error;
module.exports.success = success;
module.exports.printError = printError;
