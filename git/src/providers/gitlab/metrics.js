const { getHoursBetween } = require('../utils');

exports.pullRequestLifeSpan = (gitResponse) => {
  // The mergedAt check is because of an open issue in Gitlab API
  // Merged MRs might not have a mergedAt timestamp
  // Issue: https://gitlab.com/gitlab-org/gitlab/-/issues/26911
  const mergedMRs = gitResponse.data.data.project.mergeRequests.edges.filter(
    (mergeRequest) => mergeRequest.node.state === 'merged' && mergeRequest.node.mergedAt
  );

  const hours = mergedMRs.reduce(
    (accumulator, mergeRequest) =>
      accumulator + getHoursBetween(mergeRequest.node.createdAt, mergeRequest.node.mergedAt),
    0
  );

  // eslint-disable-next-line no-magic-numbers
  return mergedMRs.length > 0 ? Math.round((hours / mergedMRs.length) * 100) / 100 : null;
};

exports.pickUpTime = (gitResponse) => {
  const mergeRequests = gitResponse.data.data.project.mergeRequests.edges;

  // Amount of MRs that were picked up
  let pickUpAmount = 0;

  // Sum of the reviewed MR's pick up time in hours
  const hoursUntilPickup = mergeRequests.reduce((accumulator, mergeRequest) => {
    // eslint-disable-next-line init-declarations
    let pickupDate;
    if (mergeRequest.node.discussions && mergeRequest.node.discussions.edges.length > 0) {
      pickupDate = mergeRequest.node.discussions.edges[0].node.createdAt;
      pickUpAmount = pickUpAmount + 1;
    } else if (mergeRequest.node.state === 'merged' && mergeRequest.node.mergedAt) {
      pickupDate = mergeRequest.node.mergedAt;
      pickUpAmount = pickUpAmount + 1;
    } else {
      return accumulator;
    }
    return accumulator + getHoursBetween(mergeRequest.node.createdAt, pickupDate);
  }, 0);

  // Round to 2 decimals
  // eslint-disable-next-line no-magic-numbers
  return pickUpAmount > 0 ? Math.round((hoursUntilPickup / pickUpAmount) * 100) / 100 : null;
};
