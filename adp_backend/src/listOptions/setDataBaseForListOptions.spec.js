// ============================================================================================= //
/**
* Unit test for [ global.adp.listOptions.setDataBaseForListOptions ]
* @author Omkar
*/
// ============================================================================================= //
describe('Testing results of [ global.adp.listOptions.setDataBaseForListOptions ] ', () => {
  // =========================================================================================== //
  const listOptionDatabaseValue = { docs: [] };
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.getSizeInMemory = () => 123456;
    global.adp.listOptions = {};
    global.adp.timeStepNext = () => '';
    // eslint-disable-next-line global-require
    global.adp.listOptions.setDataBaseForListOptions = require('./setDataBaseForListOptions');
    global.adp.db = {};
    global.adp.db.find = DB => new Promise((RESOLVE, REJECT) => {
      if (DB === 'dataBaseListOption') {
        RESOLVE(listOptionDatabaseValue);
        return { listOptionDatabaseValue };
      }
      const errorOBJ = {};
      REJECT(errorOBJ);
      return errorOBJ;
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should fill listoptions database with appropriate values and send response message', async (done) => {
    await global.adp.listOptions.setDataBaseForListOptions()
      .then((response) => {
        expect(response).toEqual('"listOption" database was filled with default values!');
        done();
      }).catch(() => {
        done();
      });
  });
  // =========================================================================================== //

  // =========================================================================================== //
});
