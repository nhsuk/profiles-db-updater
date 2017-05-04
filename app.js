const updateDatabase = require('./lib/updateDatabase');
const schedule = require('node-schedule');
const log = require('./lib/logger');

const rule = process.env.UPDATE_SCHEDULE || '23 * * *';
// run on initial start, then on the schedule
updateDatabase();

log.info(`Scheduling profiles db update with rule '${rule}'`);
schedule.scheduleJob(rule, () => {
  updateDatabase();
});

