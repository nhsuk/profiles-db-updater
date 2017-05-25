const chai = require('chai');
const onlineServices = require('../../lib/merge/onlineServices');

describe('onlineServices', () => {
  describe('getBookingSystem', () => {
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
});
