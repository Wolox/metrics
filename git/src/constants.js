const createObject = (keyArray) => keyArray.reduce((acc, key) => ({ ...acc, [key]: key }), {});

module.exports = {
  gitMetrics: createObject(['CODE_REVIEW_AVG_TIME', 'PICK_UP_TIME']),
  PROVIDERS: {
    github: 'github',
    gitlab: 'gitlab'
  }
};
