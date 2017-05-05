// const chai = require('chai');
const downloadEtlFiles = require('../../lib/downloadEtlFiles');
// const config = require('../../config/config');

// const expect = chai.expect;


describe('Download ETL files', () => {
  it('should download ETL file to input folder', function test(done) {
    this.timeout(15000);
    downloadEtlFiles()
      .then(() => done()).catch(done);
  });
});
