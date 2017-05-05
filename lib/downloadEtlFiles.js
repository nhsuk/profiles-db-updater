const fileHelper = require('./fileHelper');
const log = require('./logger');
const config = require('../config/config');

async function downloadEtlFiles() {
  const gpDataFile = `${config.INPUT_DIR}/${config.GP_DATA_FILE}`;
  try {
    fileHelper.deleteFile(gpDataFile);
    await fileHelper.downloadFile(config.GP_DATA_URL, gpDataFile);
  } catch (ex) {
    log.info(`Error retrieving file, using default local file. ${ex}`);
    await fileHelper.copyFile(`${config.INPUT_DIR}/${config.GP_DATA_FILE}.default`, gpDataFile);
  }
}

module.exports = downloadEtlFiles;
