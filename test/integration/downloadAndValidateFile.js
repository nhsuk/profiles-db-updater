const chai = require('chai');
const fs = require('fs');
const nock = require('nock');

const downloadAndValidateFile = require('../../lib/downloadAndValidateFile');
const fileHelper = require('../../lib/utils/fileHelper');
const config = require('../../config/config');

const expect = chai.expect;

const filename = config.POMI_BOOKING_FILE;
const filePath = `${config.INPUT_DIR}/${filename}`;
const url = config.POMI_BOOKING_URL;

describe('Download ETL files', () => {
  after(() => {
    nock.cleanAll();
    nock.restore();
  });

  it('should download ETL file to input folder', (done) => {
    const singleRecordString = '[{"PeriodEnd": "28/02/2017","GPPracticeCode": "P87668","Supplier": "INPS"}]';
    nock(url)
      .get('')
      .reply(200, singleRecordString);
    const testFilename = `${config.POMI_BOOKING_FILE}.test`;
    const testFilePath = `${config.INPUT_DIR}/${testFilename}`;
    downloadAndValidateFile(url, testFilename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(testFilePath)).to.be.true;
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the new json is invalid', (done) => {
    nock(url)
      .get('')
      .reply(200, 'bad json');

    downloadAndValidateFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.not.be.empty;
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the new json has much fewer records', (done) => {
    nock(url)
      .get('')
      .reply(200, '[]');

    downloadAndValidateFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        const json = fileHelper.loadJson(filePath);
        // eslint-disable-next-line no-unused-expressions
        expect(json).to.not.be.empty;
        expect(json.length).to.be.greaterThan(0);
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the url invalid', (done) => {
    nock(url)
      .get('')
      .replyWithError('download throws error');

    downloadAndValidateFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.not.be.empty;
        done();
      }).catch(done);
  });
});

