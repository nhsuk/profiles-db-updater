const azureService = require('./utils/azureService');
const config = require('../config/config');
const log = require('./utils/logger');

const outputFile = `${config.OUTPUT_DIR}/${config.OUTPUT_FILE}`;

function getPrefix() {
  // prevent dev from over-writing production azure blob
  return process.env.NODE_ENV === 'production' ? '' : 'dev-';
}

function getDatestamp() {
  const today = new Date();
  return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
}

async function uploadOutputToAzure() {
  log.info(`Overwriting '${config.OUTPUT_FILE}' in Azure`);
  await azureService.uploadToAzure(config.CONTAINER_NAME, outputFile, `${getPrefix()}${config.OUTPUT_FILE}`);
  log.info(`Saving date stamped version of '${config.OUTPUT_FILE}' in Azure`);
  return azureService.uploadToAzure(config.CONTAINER_NAME, outputFile, `${getPrefix()}${config.OUTPUT_FILE}-${getDatestamp()}`);
}

module.exports = uploadOutputToAzure;
