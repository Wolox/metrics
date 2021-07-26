const { getRepositoryInfo } = require('./service');
const { getHoursBetween, getSevenDaysAgo } = require('../utils');

module.exports = (authToken) => async (repository, organization) => {
  try {
    const repositoryInfo = await getRepositoryInfo(repository.toLowerCase(), organization, authToken);

    const mergeRequests = repositoryInfo.data.data.project.mergeRequests.edges;
    const sevenDaysAgo = getSevenDaysAgo();

    const response = mergeRequests
      .filter((mr) => mr.node.state === 'merged' && mr.node.createdAt > sevenDaysAgo)
      .map(({ node }) => ({
        reviewTime: getHoursBetween(node.createdAt, node.mergedAt),
        pickUpTime: getHoursBetween(
          node.createdAt,
          node.discussions.edges[0] && node.discussions.edges[0].node.createdAt
        )
      }));

    return response;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Error: \n ${e}`);
    return null;
  }
};
