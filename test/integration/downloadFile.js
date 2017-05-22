const chai = require('chai');
const fs = require('fs');
const nock = require('nock');

const downloadFile = require('../../lib/downloadFile');
const fileHelper = require('../../lib/fileHelper');
const config = require('../../config/config');

const expect = chai.expect;

const filename = config.POMI_BOOKING_FILE;
const filePath = `${config.INPUT_DIR}/${filename}`;
const url = config.POMI_BOOKING_URL;

describe('Download ETL files', () => {
  it('should download ETL file to input folder', function test(done) {
    this.timeout(30000);
    const testFilename = `${config.POMI_BOOKING_FILE}.test`;
    const testFilePath = `${config.INPUT_DIR}/${testFilename}`;
    downloadFile(url, testFilename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(testFilePath)).to.be.true;
        done();
      }).catch(done);
  });

  it('should not replace existing json fileif the new json is invalid', (done) => {
    nock(url)
      .get('')
      .reply(200, 'bad json');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.be.defined;
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the new json has much fewer records', (done) => {
    nock(url)
      .get('')
      .reply(200, '[]');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        const json = fileHelper.loadJson(filePath);
        // eslint-disable-next-line no-unused-expressions
        expect(json).to.be.defined;
        expect(json.length).to.be.greaterThan(0);
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the url invalid', (done) => {
    nock(url)
      .get('')
      .replyWithError('download throws error');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.be.defined;
        done();
      }).catch(done);
  });
});

