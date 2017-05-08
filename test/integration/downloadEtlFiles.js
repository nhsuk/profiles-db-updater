const chai = require('chai');
const fs = require('fs');
const nock = require('nock');

const downloadEtlFiles = require('../../lib/downloadEtlFiles');
const config = require('../../config/config');

const expect = chai.expect;

const gpDataFile = `${config.INPUT_DIR}/${config.GP_DATA_FILE}`;


describe('Download ETL files', () => {
  it('should download ETL file to input folder', function test(done) {
    this.timeout(120000);
    downloadEtlFiles()
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(gpDataFile)).to.be.true;
        done();
      }).catch(done);
  });

  it('should not replace existing gp data if the new json is invalid', (done) => {
    nock(config.GP_DATA_URL)
      .get('')
      .reply(200, 'bad json');
    downloadEtlFiles()
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(gpDataFile)).to.be.true;
        done();
      }).catch(done);
  });
});

