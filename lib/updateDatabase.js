const downloadEtlFiles = require('./downloadEtlFiles');
const mergeFiles = require('./mergeFiles');
const importData = require('./importData');
const config = require('../config/config');

async function runImport() {
  return importData(`${config.OUTPUT_DIR}/${config.OUTPUT_FILE}`, config.mongodb.collection, config.mongodb.connectionString);
}

async function updateDatabase() {
  await downloadEtlFiles();
  mergeFiles();
  return runImport();
}

module.exports = updateDatabase;

