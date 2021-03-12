const gitlabMetrics = require('./providers/gitlab');
const githubMetrics = require('./providers/github');
const { PROVIDERS } = require('./constants');

module.exports = (provider, authToken) => {
  let providerMetricGenerator = null;

  switch (provider) {
    case PROVIDERS.github:
      providerMetricGenerator = githubMetrics;
      break;
    case PROVIDERS.gitlab:
      providerMetricGenerator = gitlabMetrics;
      break;
    default: {
      const validProviders = Object.values(PROVIDERS);
      // eslint-disable-next-line no-console
      console.error(
        `We don't recognize '${provider}' as a valid provider. It might not exist or we might not have implemented it yet. Valid providers are ${validProviders}`
      );
      throw new Error('INVALID_PROVIDER');
    }
  }

  return providerMetricGenerator(authToken);
};
