const fs = require('fs');
const prettyHrtime = require('pretty-hrtime');
const log = require('./logger');
const onlineServices = require('./onlineServices');
const fileHelper = require('./fileHelper');
const config = require('../config/config');

const bookingSystems = require('../input/booking.json');
const scriptSystems = require('../input/scripts.json');
const recordsSystems = require('../input/records.json');

function saveFileSync(mergedData) {
  const outputDir = config.OUTPUT_DIR;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(`${outputDir}/${config.OUTPUT_FILE}`, JSON.stringify(mergedData), 'utf8');
}

function getSearchWords(gp) {
  return gp.address.addressLines.concat([gp.address.postcode, gp.name])
    .join(' ').toLowerCase().replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join(' ');
}

function mergeFiles() {
  const startTime = process.hrtime();
  const gps = fileHelper.loadJson(`${config.INPUT_DIR}/${config.GP_DATA_FILE}`);
  const merged = gps.map((gp) => {
    /* eslint-disable no-param-reassign */
    gp.onlineServices = {};
    gp.searchwords = getSearchWords(gp);
    onlineServices.add({ systemList: bookingSystems, gp, key: 'appointments' });
    onlineServices.add({ systemList: scriptSystems, gp, key: 'repeatPrescriptions' });
    onlineServices.add({ systemList: recordsSystems, gp, key: 'codedRecords' });
    /* eslint-enable no-param-reassign */

    return gp;
  });

  saveFileSync(merged);
  const endTime = process.hrtime(startTime);
  log.info(`Merging GP data sets took: ${prettyHrtime(endTime)}`);
}

module.exports = mergeFiles;
