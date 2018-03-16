const chai = require('chai');
const onlineServices = require('../../lib/merge/onlineServices');

describe('onlineServices', () => {
  describe('getBookingSystem', () => {
    it('should throw error for unknown service', () => {
      const throwsError = () => {
        onlineServices.add({
          gp: { odsCode: 'test' },
          key: 'noSuchKey',
          systemList: [{ GPPracticeCode: 'test' }],
        });
      };
      chai.assert.throws(throwsError, Error, 'Unknown key: noSuchKey');
    });

    it('should add supplier for known service', () => {
      const supplier = 'EMIS';
      const gp = {
        contact: {
          website: 'http://fakesite',
        },
        odsCode: 'test',
        onlineServices: {},
      };

      onlineServices.add({
        gp,
        key: 'appointments',
        systemList: [{
          GPPracticeCode: 'test',
          Supplier: supplier,
        }],
      });

      chai.expect(gp.onlineServices.appointments.supplier).to.equal(supplier);
    });
  });
});
