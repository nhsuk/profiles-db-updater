const requireEnv = require('require-environment-variables');
// requireEnvs must be at the top of the file as the azure-storage module uses the
// AZURE_STORAGE_CONNECTION_STRING variable on load
requireEnv(['AZURE_STORAGE_CONNECTION_STRING']);

const downloadAndValidateFile = require('./downloadAndValidateFile');
const mergeFiles = require('./merge/mergeFiles');
const uploadOutputToAzure = require('./uploadOutputToAzure');
const config = require('../config/config');

async function downloadFiles() {
  await downloadAndValidateFile(config.GP_DATA_URL, config.GP_DATA_FILE);
  await downloadAndValidateFile(config.POMI_BOOKING_URL, config.POMI_BOOKING_FILE);
  await downloadAndValidateFile(config.POMI_SCRIPTS_URL, config.POMI_SCRIPTS_FILE);
  await downloadAndValidateFile(config.POMI_RECORDS_URL, config.POMI_RECORDS_FILE);
}

async function mergeEtlOutputAndUpload() {
  await downloadFiles();
  mergeFiles();
  await uploadOutputToAzure();
}

module.exports = mergeEtlOutputAndUpload;
