// ============================================================================================= //
/**
* Unit test for [ global.adp.user.getUserNameMail ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let errorDBResposne;
let SuccessDBResponse;

class MockAdp {
  getUsersById(KEY) {
    return new Promise((resolve) => {
      if (KEY === 'MOCKVALIDID') {
        return resolve(SuccessDBResponse);
      }
      return resolve(errorDBResposne);
    });
  }
}

describe('Testing if [ global.adp.user.getUserNameMail ] is able to get email of user', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.user = {};
    global.adp.user.getUserNameMail = require('./getUserNameMail'); // eslint-disable-line global-require
    global.adp.db = {};
    global.adp.db.get = (db, view, filter) => new Promise((RESOLVETHIS) => {
      if (filter.key === 'MOCKVALIDID') {
        RESOLVETHIS(SuccessDBResponse);
        return SuccessDBResponse;
      }
      RESOLVETHIS(errorDBResposne);
      return errorDBResposne;
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.user.read ] with an invalid user SIGNUM with null db response.', async (done) => {
    const invalidMockJSON = 'MOCKINVALIDID';
    errorDBResposne = {};
    errorDBResposne.docs = null;
    await global.adp.user.getUserNameMail(invalidMockJSON)
      .then(() => {
        done();
      }).catch((error) => {
        expect(error).toEqual('No record found for this SIGNUM');
        done();
      });
  });

  it('[ global.adp.user.read ] with empty db response.', async (done) => {
    const invalidMockJSON = 'MOCKINVALIDID';
    errorDBResposne = {};
    errorDBResposne.docs = [];
    await global.adp.user.getUserNameMail(invalidMockJSON)
      .then(() => {
        done();
      }).catch((error) => {
        expect(error).toEqual('No record found for this SIGNUM');
        done();
      });
  });

  it('[ global.adp.user.read ] with incorrect db response.', async (done) => {
    const invalidMockJSON = 'MOCKINVALIDID';
    errorDBResposne = {};
    errorDBResposne.docs = null;
    await global.adp.user.getUserNameMail(invalidMockJSON)
      .then(() => {
        done();
      }).catch((error) => {
        expect(error).toEqual('No record found for this SIGNUM');
        done();
      });
  });

  it('[ global.adp.user.read ] with a valid user SIGNUM.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    SuccessDBResponse = {
      docs: [{
        name: 'Test Name',
        email: 'Test Email',
      }],
    };
    await global.adp.user.getUserNameMail(validMockJSON)
      .then((resp) => {
        expect(resp).toEqual(SuccessDBResponse.docs[0]);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
