const { getRepositoryInfo } = require('./service');
const { pullRequestLifeSpan, pickUpTime } = require('./metrics');

const { ERROR, gitMetrics } = require('../../constants');

module.exports = (authToken) => async (repository, organization) => {
  const gitData = [];
  try {
    const repositoryInfo = await getRepositoryInfo(repository, organization, authToken);
    gitData.push({
      metric: gitMetrics.CODE_REVIEW_AVG_TIME,
      description: 'Promedio de existencia de PR hasta merge - Hs',
      value: pullRequestLifeSpan(repositoryInfo)
    });

    gitData.push({
      metric: gitMetrics.PICK_UP_TIME,
      description: 'Pick up Time',
      value: pickUpTime(repositoryInfo)
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Error: \n ${e}`);
    gitData.push({
      metric: 'GITHUB',
      description: 'Git error',
      value: ERROR.REPO_NOT_FOUND
    });
  }

  return gitData;
};
