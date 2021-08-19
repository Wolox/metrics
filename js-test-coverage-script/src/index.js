#!/usr/bin/env node

const fs = require('fs');
const { error, success, printError } = require('./utils');
const { execSync } = require('child_process');

const IGNORE_CONFLICT_FILE = './ignore-conflict/.gitattributes';
const RESULT_COVERAGE_FILE = './code_coverage.json';
const COVERAGE_REPORT_JSON_FILE = './coverage/coverage-summary.json';

const checkForCoverageReportJsonFile = () => {
  success(`\nChecking if ${COVERAGE_REPORT_JSON_FILE} exists`);

  if (!fs.existsSync(COVERAGE_REPORT_JSON_FILE)) {
    error(
      `${COVERAGE_REPORT_JSON_FILE} file doesn't exist in the root directory, run test:coverage command first`
    );
    process.exitCode = 1;
    return;
  } else {
    success(`\n${COVERAGE_REPORT_JSON_FILE} exists`);
  }
};

const checkOrCreateGitIgnoreConfigFile = () => {
  success(`\nChecking if ${IGNORE_CONFLICT_FILE} exists`);

  if (!fs.existsSync(IGNORE_CONFLICT_FILE)) {
    success(
      `\n${IGNORE_CONFLICT_FILE} does not exists, creating .gitattributes on /ignore-conflict folder.`
    );

    try {
      // Create ignore-conflict folder for git
      fs.mkdirSync('./ignore-conflict');
      const fileContent = `${RESULT_COVERAGE_FILE} merge=ours`;
      fs.writeFileSync(IGNORE_CONFLICT_FILE, fileContent, 'utf8');

      // Adds ignore-conflict folder to git commit
      execSync(`git add ignore-conflict`);
    } catch (err) {
      printError(err);
    }
  } else {
    success(`\n${IGNORE_CONFLICT_FILE} exists`);
  }

  // Change git merge driver
  success(`\nChanging git merge driver configuration`);
  execSync('git config merge.ours.driver true');
};

const getParsedJsonReport = () => {
  try {
    // Read json lcov coverage file
    const data = fs.readFileSync(COVERAGE_REPORT_JSON_FILE, {
      encoding: 'utf8',
    });
    const coverageAsJson = JSON.parse(data);
    const linesCoveragePct = {
      lines: coverageAsJson.total.lines.pct,
      statements: coverageAsJson.total.statements.pct,
      functions: coverageAsJson.total.functions.pct,
      branches: coverageAsJson.total.branches.pct,
    };

    // Print result
    console.log('\n------======------ coverage result ------======------\n');
    console.log(`--- lines:        ${linesCoveragePct.lines}%\n`);
    console.log(`--- statements:   ${linesCoveragePct.statements}%\n`);
    console.log(`--- functions:    ${linesCoveragePct.functions}%\n`);
    console.log(`--- branches:     ${linesCoveragePct.branches}%\n`);

    return JSON.stringify(linesCoveragePct, null, 2);
  } catch (err) {
    printError(err);
  }
};

const writeJsonParsedReport = (jsonString) => {
  try {
    fs.writeFileSync(RESULT_COVERAGE_FILE, jsonString, 'utf8');
    // Add code_coverage.json into git commit
    execSync(`git add code_coverage.json`);
  } catch (err) {
    printError(err);
  }
};

// Starts the script
console.log(
  '\n###=========================================================================================================\n\n'
);

success('Running project code coverage metric process ...');

checkForCoverageReportJsonFile();
checkOrCreateGitIgnoreConfigFile();
const jsonStringResult = getParsedJsonReport();
writeJsonParsedReport(jsonStringResult);

success(
  `\nFinished project code coverage metric process, has been written into file: ${RESULT_COVERAGE_FILE}.\nRemember to always git add this file when has changes.`
);

console.log(
  '\n=========================================================================================================###\n\n'
);

process.exitCode = 0;
process.exit();
