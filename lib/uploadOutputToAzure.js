const moment = require('moment');

const azureService = require('./utils/azureService');
const config = require('../config/config');
const log = require('./utils/logger');

const outputFile = `${config.OUTPUT_DIR}/${config.OUTPUT_FILE}`;

function getDateYYYYMMDD(date) {
  return moment(date).format('YYYYMMDD');
}

function getPrefix() {
  // prevent dev from over-writing production azure blob
  return process.env.NODE_ENV === 'production' ? '' : 'dev-';
}

function getTimeStampedName() {
  const name = config.OUTPUT_FILE.replace('.json', `-${getDateYYYYMMDD(new Date())}.json`);
  return `${getPrefix()}${name}`;
}

async function uploadOutputToAzure() {
  const name = `${getPrefix()}${config.OUTPUT_FILE}`;
  log.info(`Overwriting '${name}' in Azure`);
  await azureService.uploadToAzure(config.CONTAINER_NAME, outputFile, name);

  const timeStampedName = getTimeStampedName();
  log.info(`Saving date stamped version '${timeStampedName}' in Azure`);
  return azureService.uploadToAzure(config.CONTAINER_NAME, outputFile, timeStampedName);
}

module.exports = uploadOutputToAzure;
