const updateDatabase = require('./lib/updateDatabase');
const schedule = require('node-schedule');
const log = require('./lib/logger');

async function runEtl() {
  const rule = process.env.UPDATE_SCHEDULE || '7 * * *';
  // run on initial start, then on the schedule
  await updateDatabase();

  log.info(`Scheduling profiles db update with rule '${rule}'`);
  schedule.scheduleJob(rule, () => {
    updateDatabase();
  });
}

runEtl();
