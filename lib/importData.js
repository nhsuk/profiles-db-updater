const log = require('./logger');
const fs = require('fs');
const DataImporter = require('./dataImporter');

function loadJsonSync(path) {
  const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
  return jsonString ? JSON.parse(jsonString) : undefined;
}

async function importData(filename, collection, connectionString) {
  try {
    const data = loadJsonSync(filename);
    const dataImporter = new DataImporter(connectionString, collection, 0.8);
    await dataImporter.importData(data);
  } catch (err) {
    log.error(`Error importing data: ${err}`);
  }
}

module.exports = importData;
