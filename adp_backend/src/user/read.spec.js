// ============================================================================================= //
/**
* Unit test for [ global.adp.user.read ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.user.read ] is able to read a User (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.user = {};
    global.adp.user.read = require('./read'); // eslint-disable-line global-require
    global.adp.user.create = () => 200;
    global.adp.db = {};
    global.adp.user.thisUserShouldBeInDatabase = ID => new Promise((RESOLVE, REJECT) => {
      if (ID === 'emesuse') {
        const obj = {
          totalInDatabase: 5,
          limitOfThisResult: 999,
          offsetOfThisResult: 0,
          time: '1ms',
          docs: [
            {
              _id: 'emesuse',
              signum: 'emesuse',
              name: 'User',
              email: 'messy-user@adp-test.com',
              role: 'author',
              marketInformationActive: true,
              type: 'user',
              modified: 'Tue Nov 12 2019 09:13:42 GMT+0000 (Greenwich Mean Time)',
            },
          ],
        };
        RESOLVE(obj);
      } else {
        const error = { code: 404, message: '404 - User Not Found' };
        REJECT(error);
      }
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.user.read ] with a valid mock ID.', async (done) => {
    const validMockJSON = 'emesuse';
    await global.adp.user.read(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.user.read ] with a invalid mock ID, User cannot be found.', async (done) => {
    const inValidMockJSON = 'potato';
    await global.adp.user.read(inValidMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeUndefined();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
