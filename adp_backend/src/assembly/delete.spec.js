// ============================================================================================= //
/**
* Unit test for [ global.adp.assembly.delete ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
class MockAdp {
  getById(KEY) {
    return new Promise((RESOLVE, REJECT) => {
      if (KEY === 'MOCKVALIDID' || KEY === 'MOCKUPDATEERROR') {
        const obj = {
          _id: KEY,
          _rev: 'ABC',
        };
        const objArray = [obj];
        RESOLVE({ docs: objArray, totalInDatabase: 10 });
        return { docs: objArray, totalInDatabase: 10 };
      }
      if (KEY === 'MOCKGETERROR') {
        RESOLVE({ docs: [undefined], totalInDatabase: 0 });
        return { docs: [undefined], totalInDatabase: 0 };
      }
      if (KEY === 'MOCKGETERROR2') {
        RESOLVE({ docs: [undefined], totalInDatabase: 0 });
        return { docs: [undefined], totalInDatabase: 0 };
      }
      const errorOBJ = {};
      REJECT(errorOBJ);
      return errorOBJ;
    });
  }

  update(ASSEMBLY) {
    return new Promise((RESOLVE) => {
      // eslint-disable-next-line no-underscore-dangle
      if (ASSEMBLY._id === 'MOCKUPDATEERROR') {
        RESOLVE({ ok: false });
      } else {
        RESOLVE({ ok: true });
      }
    });
  }
}
describe('Testing if [ global.adp.assembly.delete ] is able to delete an Assembly (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = text => text;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.notification.sendAssetMail = () => new Promise(RESOLVE => RESOLVE());
    global.adp.assembly = {};
    global.adp.microservice = {};
    // global.adp.microservice.synchronizeWithElasticSearch = () => new Promise(RES => RES());
    global.adp.microservice.CRUDLog = () => true;
    global.adp.assembly.delete = require('./delete'); // eslint-disable-line global-require
  });

  it('[ global.adp.assembly.delete ] with a valid mock ID.', (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.assembly.delete(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.assembly.delete ] with an invalid mock ID, Assembly cannot be found.', (done) => {
    const inValidMockJSON = 'MOCKINVALIDID';
    global.adp.assembly.delete(inValidMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        global.adp = null;
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toEqual(404);
        global.adp = null;
        done();
      });
  });

  it('Testing if [global.adp.db.get] give an invalid answer.', (done) => {
    const validMockJSON = 'MOCKGETERROR';
    global.adp.assembly.delete(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing if [global.adp.db.get] give another invalid answer.', (done) => {
    const validMockJSON = 'MOCKGETERROR2';
    global.adp.assembly.delete(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing if [global.adp.db.update] give an invalid answer.', (done) => {
    const validMockJSON = 'MOCKUPDATEERROR';
    global.adp.assembly.delete(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
