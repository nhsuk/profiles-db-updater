const chai = require('chai');
const onlineServices = require('../../lib/merge/onlineServices');

describe('onlineServices', () => {
  describe('getBookingSystem', () => {
    it('should throw error for unknown service', () => {
      const throwsError = () => {
        onlineServices.add(
          {
            systemList: [{ GPPracticeCode: 'test' }],
            gp: { odsCode: 'test' },
            key: 'noSuchKey'
          }
        );
      };
      chai.assert.throws(throwsError, Error, 'Unknown key: noSuchKey');
    });

    it('should add supplier for known service', () => {
      const supplier = 'EMIS';
      const gp = {
        odsCode: 'test',
        contact: {
          website: 'http://fakesite'
        },
        onlineServices: {}
      };

      onlineServices.add(
        {
          systemList: [{
            Supplier: supplier,
            GPPracticeCode: 'test'
          }],
          gp,
          key: 'appointments'
        }
      );

      chai.expect(gp.onlineServices.appointments.supplier).to.equal(supplier);
    });
  });
});
