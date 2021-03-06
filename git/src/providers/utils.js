// eslint-disable-next-line no-magic-numbers
const MILLISECONDS_IN_HOURS = 1000 * 3600;
const METRIC_RANGE_TO_ANALIZE = 14;

module.exports.getHoursBetween = (startDate, endDate) =>
  (new Date(endDate) - new Date(startDate)) / MILLISECONDS_IN_HOURS;

module.exports.getTimelapse = () => {
  const today = new Date();
  today.setDate(today.getDate() - METRIC_RANGE_TO_ANALIZE);
  return today;
};
