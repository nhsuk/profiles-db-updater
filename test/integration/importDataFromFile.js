const chai = require('chai');
const importData = require('../../lib/mongodb/importDataFromFile');
const DataImporter = require('../../lib/mongodb/dataImporter');
const MongoWrapper = require('../../lib/mongodb/mongoWrapper');
const config = require('../../config/config');

const expect = chai.expect;
const dataChangeThreshold = 0.9;
async function verifyCollection(minCount, name, done) {
  const mongoWrapper = new MongoWrapper(config.mongodb.connectionString);
  await mongoWrapper.openConnection();
  const count = await mongoWrapper.getTotalCount(name);
  await mongoWrapper.closeConnection();
  expect(count).to.be.greaterThan(minCount);
  done();
}

describe('importData', () => {
  it('should load the contents of a json file into mongodb', function test(done) {
    this.timeout(15000);
    importData('./data/gp-data-merged.json', 'gps3', config.mongodb.connectionString)
      .then(() => verifyCollection(9000, 'gps3', done)).catch(done);
  });

  it('should throw error for missing file', function test(done) {
    this.timeout(15000);
    importData('noSuchFile.json', 'gps3', config.mongodb.connectionString)
      .then(() => expect.fail('should have thrown error')).catch(() => done());
  });
});

describe('data importer', () => {
  it('should load the contents of a json file into mongodb', function test(done) {
    this.timeout(10000);
    const importer = new DataImporter(config.mongodb.connectionString, 'gps2', dataChangeThreshold);
    importer.importData({ name: 'lol' }).then(() => verifyCollection(0, 'gps2', done)).catch(done);
  });

  it('should throw exception if number of records greatly reduced', function test(done) {
    this.timeout(10000);
    const importer = new DataImporter(config.mongodb.connectionString, 'gps2', dataChangeThreshold);
    importer.importData([{ name: 'one' }, { name: 'two' }]).then(() => {
      importer.importData([{ name: 'one' }]).then(() => expect.fail('should have thrown error')).catch(() => done());
    });
  });
});
