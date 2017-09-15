const mergeEtlOutput = require('./lib/mergeEtlOutput');
const schedule = require('node-schedule');
const log = require('./lib/utils/logger');
const scheduleConfig = require('./config/scheduleConfig');

async function runUpdater() {
  if (!scheduleConfig.schedulerDisabled()) {
    // run on initial start, then on the schedule
    await mergeEtlOutput();
  }

  log.info(`Scheduling profiles etl merge with rule '${scheduleConfig.getSchedule()}'`);
  schedule.scheduleJob(scheduleConfig.getSchedule(), async () => {
    await mergeEtlOutput();
  });
}

runUpdater();
