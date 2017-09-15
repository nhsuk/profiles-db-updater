// cron style job, default to 7:15am
const defaultSchedule = '15 7 * * *';
const farFutureDate = new Date(2100, 0, 1, 0, 0);

function schedulerDisabled() {
  return process.env.DISABLE_SCHEDULER === 'true';
}

function getSchedule() {
  return schedulerDisabled() ? farFutureDate : process.env.UPDATE_SCHEDULE || defaultSchedule;
}

module.exports = {
  defaultSchedule,
  farFutureDate,
  getSchedule,
  schedulerDisabled,
};
