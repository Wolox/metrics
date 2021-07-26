#!/usr/bin/env node

const fs = require('fs');
const { error, success } = require('./utils');
const { execSync } = require('child_process');

const IGNORE_CONFLICT_FILE = './ignore-conflict/.gitattributes';
const RESULT_COVERAGE_FILE = './code_coverage.json';
const COVERAGE_REPORT_JSON_FILE = './coverage/coverage-summary.json';

function readCoverageFile() {
  console.log(
    '\n###=========================================================================================================\n\n'
  );
  success('Running project code coverage metric process ...');

  success(`\nChecking if ${IGNORE_CONFLICT_FILE} exists`);

  if (!fs.existsSync(IGNORE_CONFLICT_FILE)) {
    success(
      `\n${IGNORE_CONFLICT_FILE} does not exists, creating .gitattributes on /ignore-conflict folder.`
    );

    fs.mkdir('./ignore-conflict', { recursive: true }, (err) => {
      if (err) {
        error(err);
        process.exit(1);
      }

      const fileContent = `${RESULT_COVERAGE_FILE} merge=ours`;

      fs.writeFile(
        IGNORE_CONFLICT_FILE,
        fileContent,
        'utf8',
        (errorReadFile) => {
          if (errorReadFile) {
            error(errorReadFile);
            process.exit(1);
          }
        }
      );
    });
  } else {
    success(`\n${IGNORE_CONFLICT_FILE} exists`);
  }

  // Change git merge driver
  success(`\nChanging git merge driver configuration`);
  execSync('git config merge.ours.driver true');

  if (!fs.existsSync(COVERAGE_REPORT_JSON_FILE)) {
    error(
      `${COVERAGE_REPORT_JSON_FILE} file doesn't exist in the root directory, run test:coverage command first`
    );
    process.exit(1);
  }

  fs.readFile(COVERAGE_REPORT_JSON_FILE, (errorReadReport, data) => {
    if (errorReadReport) {
      error(errorReadReport);
      process.exit(1);
    }

    const coverageAsJson = JSON.parse(data);
    const linesCoveragePct = {
      lines: coverageAsJson.total.lines.pct,
      statements: coverageAsJson.total.statements.pct,
      functions: coverageAsJson.total.functions.pct,
      branches: coverageAsJson.total.branches.pct,
    };
    const result = JSON.stringify(linesCoveragePct, null, 2);

    fs.writeFile(RESULT_COVERAGE_FILE, result, 'utf8', (errorReadFile) => {
      if (errorReadFile) {
        error(errorReadFile);
        process.exit(1);
      }
      console.log('\n------======------ coverage result ------======------\n');
      console.log(`--- lines:        ${linesCoveragePct.lines}%\n`);
      console.log(`--- statements:   ${linesCoveragePct.statements}%\n`);
      console.log(`--- functions:    ${linesCoveragePct.functions}%\n`);
      console.log(`--- branches:     ${linesCoveragePct.branches}%\n`);
      success(
        `\nFinished project code coverage metric process, has been written into file: ${RESULT_COVERAGE_FILE}.\nRemember to always git add this file when has changes.`
      );
      console.log(
        '\n=========================================================================================================###\n\n'
      );
      process.exit(0);
    });
  });
}

readCoverageFile();
