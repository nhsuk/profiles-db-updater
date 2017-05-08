const chai = require('chai');

const fileHelper = require('../../lib/fileHelper');

const expect = chai.expect;

describe('File Helper', () => {
  describe('loadJson', () => {
    it('should return undefined for missing file', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(fileHelper.loadJson('noSuchFile')).to.be.undefined;
    });
  });
});

