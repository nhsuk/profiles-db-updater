const chai = require('chai');
const fs = require('fs');
const nock = require('nock');

const downloadEtlFiles = require('../../lib/downloadEtlFiles');
const fileHelper = require('../../lib/fileHelper');
const config = require('../../config/config');

const expect = chai.expect;

const gpDataFile = `${config.INPUT_DIR}/${config.GP_DATA_FILE}.test`;
const params = {
  INPUT_DIR: config.INPUT_DIR,
  GP_DATA_FILE: `${config.GP_DATA_FILE}.test`,
  GP_DATA_URL: config.GP_DATA_URL,
};

describe('Download ETL files', () => {
  it('should download ETL file to input folder', function test(done) {
    this.timeout(150000);
    downloadEtlFiles(params)
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

    downloadEtlFiles(params)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(gpDataFile)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(gpDataFile)).to.be.defined;
        done();
      }).catch(done);
  });

  it('should not replace existing gp data if the url invalid', (done) => {
    nock(config.GP_DATA_URL)
      .get('')
      .replyWithError('download throws error');

    downloadEtlFiles(params)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(gpDataFile)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(gpDataFile)).to.be.defined;
        done();
      }).catch(done);
  });
});

