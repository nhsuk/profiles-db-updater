const updateDatabase = require('./lib/updateDatabase');
const schedule = require('node-schedule');
const log = require('./lib/logger');
const config = require('./config/config');

async function runEtl() {
  // run on initial start, then on the schedule
  await updateDatabase();

  log.info(`Scheduling profiles db update with rule '${config.UPDATE_SCHEDULE}'`);
  schedule.scheduleJob(config.UPDATE_SCHEDULE, () => {
    updateDatabase();
  });
}

runEtl();
