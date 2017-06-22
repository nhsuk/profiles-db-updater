const mergeEtlOutput = require('./lib/mergeEtlOutput');
const schedule = require('node-schedule');
const log = require('./lib/utils/logger');
const config = require('./config/config');

async function runUpdater() {
  // run on initial start, then on the schedule
  await mergeEtlOutput();

  log.info(`Scheduling profiles etl merge with rule '${config.UPDATE_SCHEDULE}'`);
  schedule.scheduleJob(config.UPDATE_SCHEDULE, () => {
    // this is an async function, but await is not allowed within a lambda expression
    mergeEtlOutput();
  });
}

runUpdater();
