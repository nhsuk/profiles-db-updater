const chai = require('chai');

const dateHelper = require('../../lib/utils/dateHelper');

const expect = chai.expect;

describe('Date Helper', () => {
  describe('getDateYYYYMMDD', () => {
    it('should return 25th December 2017 as 20171225', () => {
      // note javascript's odd date behaviour where 1 must be subtracted from the month
      expect(dateHelper.getDateYYYYMMDD(new Date(2017, 11, 25))).to.equal('20171225');
    });

    it('should pad single figure days with a zero', () => {
      expect(dateHelper.getDateYYYYMMDD(new Date(2017, 11, 5))).to.equal('20171205');
    });

    it('should pad single figure month with a zero', () => {
      expect(dateHelper.getDateYYYYMMDD(new Date(2017, 0, 5))).to.equal('20170105');
    });
  });
});
