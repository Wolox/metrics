const { ERROR, gitMetrics } = require('../../constants');
const { pullRequestLifeSpan, pickUpTime } = require('./metrics');
const { getRepositoryInfo } = require('./service');

module.exports = (authToken) => async (repository, organization) => {
  const gitData = [];

  try {
    const repositoryInfo = await getRepositoryInfo(repository.toLowerCase(), organization, authToken);

    gitData.push({
      name: gitMetrics.CODE_REVIEW_AVG_TIME,
      value: pullRequestLifeSpan(repositoryInfo),
      version: '1.0'
    });

    gitData.push({
      name: gitMetrics.PICK_UP_TIME,
      value: pickUpTime(repositoryInfo),
      version: '1.0'
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Error: \n ${e}`);
    gitData.push({
      metric: 'GITLAB',
      description: 'Error de git',
      value: ERROR.REPO_NOT_FOUND
    });
  }

  return gitData;
};
