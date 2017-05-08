const fileHelper = require('./fileHelper');
const log = require('./logger');
const config = require('../config/config');

function isValidJson(path) {
  try {
    return fileHelper.loadJson(path);
  } catch (ex) {
    log.error(`Invalid json in ${path}. ${ex}`);
    return false;
  }
}

async function downloadEtlFiles() {
  const latestGpDataFile = `${config.INPUT_DIR}/${config.GP_DATA_FILE}.latest`;
  const gpDataFile = `${config.INPUT_DIR}/${config.GP_DATA_FILE}`;
  try {
    fileHelper.deleteFile(latestGpDataFile);
    await fileHelper.downloadFile(config.GP_DATA_URL, latestGpDataFile);
    if (isValidJson(latestGpDataFile)) {
      fileHelper.deleteFile(gpDataFile);
      fileHelper.renameFile(latestGpDataFile, gpDataFile);
    } else {
      log.error('Error retrieving file, using existing local file');
    }
  } catch (ex) {
    log.error(`Error retrieving file, using existing local file. ${ex}`);
  }
}

module.exports = downloadEtlFiles;
