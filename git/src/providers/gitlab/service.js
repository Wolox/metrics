const axios = require('axios');

const GITLAB_API = 'https://gitlab.com/api/graphql';

const createHeaders = (authToken) => ({
  headers: {
    Authorization: `Bearer ${authToken}`
  }
});

const repositoryInfoQuery = (repository, namespace) => ({
  query: `
    {
      project(fullPath: "${namespace}/${repository}") {
        mergeRequests(last: 100) {
          edges {
            node {
              createdAt,
              mergedAt,
              state,
              discussions(first: 30) {
                edges {
                  node {
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }`
});

exports.getRepositoryInfo = (repository, namespace, authToken) =>
  axios.post(GITLAB_API, repositoryInfoQuery(repository, namespace), createHeaders(authToken));
