const { getRepositoryInfo } = require('./service');

const { getHoursBetween, getTimelapse } = require('../utils');

module.exports = (authToken) => async (repository, organization) => {
  try {
    const repositoryInfo = await getRepositoryInfo(repository, organization, authToken);

    const pullRequests = repositoryInfo.data.data.repository.pullRequests.edges;
    const timelapse = getTimelapse();

    const response = pullRequests
      .filter((pr) => pr.node.merged && new Date(pr.node.closedAt) > timelapse)
      .map(({ node }) => ({
        review_time: getHoursBetween(node.createdAt, node.closedAt),
        pick_up_time: getHoursBetween(node.createdAt, node.reviews.edges[0].node.createdAt)
      }));

    return response;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Error: \n ${e}`);
    return null;
  }
};
