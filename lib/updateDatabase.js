const downloadFile = require('./downloadFile');
const mergeFiles = require('./mergeFiles');
const importData = require('./importData');
const config = require('../config/config');

async function runImport() {
  return importData(`${config.OUTPUT_DIR}/${config.OUTPUT_FILE}`,
    config.mongodb.collection, config.mongodb.connectionString,
    config.THRESHOLD);
}


async function downloadFiles() {
  await downloadFile(config.GP_DATA_URL, config.GP_DATA_FILE);
  await downloadFile(config.POMI_BOOKING_URL, config.POMI_BOOKING_FILE);
  await downloadFile(config.POMI_SCRIPTS_URL, config.POMI_SCRIPTS_FILE);
  await downloadFile(config.POMI_RECORDS_URL, config.POMI_RECORDS_FILE);
}

async function updateDatabase() {
  await downloadFiles();
  mergeFiles();
  return runImport();
}

module.exports = updateDatabase;
