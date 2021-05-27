const axios = require('axios');

const API = 'https://api.github.com/graphql';

const createHeaders = (authToken) => ({
  headers: {
    Authorization: `Bearer ${authToken}`
  }
});

// Owner and name should be typed between ""
const repositoryInfoQuery = (repository, organization) => ({
  query: `{
      repository(owner:"${organization}", name:"${repository}") {
        pullRequests(last: 100) {
          edges {
            node {
              closedAt,
              createdAt,
              merged,
              reviews(first: 30) {
                edges {
                  node {
                    state,
                    createdAt
                  }
                }
              }
            }
          }
        }
      }}`
});

exports.getRepositoryInfo = (repository, organization, authToken) =>
  axios.post(API, repositoryInfoQuery(repository, organization), createHeaders(authToken));
