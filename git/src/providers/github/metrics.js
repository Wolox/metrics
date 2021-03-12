const { getHoursBetween } = require('../utils');

exports.pullRequestLifeSpan = (gitResponse) => {
  // Ignore PRs that weren't merged yet
  const mergedPRs = gitResponse.data.data.repository.pullRequests.edges.filter(
    (pullRequest) => pullRequest.node.merged
  );

  // Sum of the reviewed PR's pick up time in hours
  const hours = mergedPRs.reduce(
    (accumulator, pullRequest) =>
      accumulator + getHoursBetween(pullRequest.node.createdAt, pullRequest.node.closedAt),
    0
  );

  // Round to 2 decimals
  // eslint-disable-next-line no-magic-numbers
  return mergedPRs.length > 0 ? Math.round((hours / mergedPRs.length) * 100) / 100 : NaN;
};

exports.pickUpTime = (gitResponse) => {
  // Ignore PRs that haven't been picked up yet
  const pullRequests = gitResponse.data.data.repository.pullRequests.edges.filter(
    (pullRequest) => pullRequest.node.reviews && pullRequest.node.reviews.edges.length > 0
  );

  // Sum of the reviewed PR's pick up time in hours
  const hoursUntilPickup = pullRequests.reduce((accumulator, pullRequest) => {
    if (pullRequest.node.reviews.edges.length > 0) {
      const pickupDate = pullRequest.node.reviews.edges[0].node.createdAt;
      return accumulator + getHoursBetween(pullRequest.node.createdAt, pickupDate);
    }
    return accumulator;
  }, 0);

  // Round to 2 decimals
  // eslint-disable-next-line no-magic-numbers
  return pullRequests.length > 0 ? Math.round((hoursUntilPickup / pullRequests.length) * 100) / 100 : NaN;
};
