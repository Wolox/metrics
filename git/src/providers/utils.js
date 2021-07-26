// eslint-disable-next-line no-magic-numbers
const MILLISECONDS_IN_HOURS = 1000 * 3600;
const SEVEN_DAYS = 7;

module.exports.getHoursBetween = (startDate, endDate) =>
  (new Date(endDate) - new Date(startDate)) / MILLISECONDS_IN_HOURS;

module.exports.getSevenDaysAgo = () => {
  const today = new Date();
  today.setDate(today.getDate() - SEVEN_DAYS);
  return today;
};
