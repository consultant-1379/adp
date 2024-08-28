// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.lowerCaseSignum ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockAdp {
  indexUsers() {
    return new Promise((resolve) => {
      const result = {
        docs: [
          {
            _id: 'usrtest1',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'USRTEST1',
          },
          {
            _id: 'usrtest2',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'usrtest2',
          },
          {
            _id: 'usrtest3',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'USRTEST3',
          },
        ],
      };
      resolve(result);
    });
  }

  update() {
    return new Promise((resolve) => {
      const result = {
        ok: true,
      };
      global.adp.db.counter += 1;
      resolve(result);
    });
  }
}

describe('Testing [ global.adp.migration.lowerCaseSignum ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = () => {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.lowerCaseSignum = require('./lowerCaseSignum'); // eslint-disable-line global-require

    global.adp.db = {};
    global.adp.db.get = () => new Promise((RES) => {
      const result = {
        docs: [
          {
            _id: 'usrtest1',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'USRTEST1',
          },
          {
            _id: 'usrtest2',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'usrtest2',
          },
          {
            _id: 'usrtest3',
            _rev: 'ytvfuygbuhnjmk',
            signum: 'USRTEST3',
          },
        ],
      };
      RES(result);
    });
    global.adp.db.counter = 0;
    global.adp.db.update = () => new Promise((RES) => {
      const result = {
        ok: true,
      };
      global.adp.db.counter += 1;
      RES(result);
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should be able to use "toLowerCase()" if Signum is not in lower case.', (done) => {
    global.adp.migration.lowerCaseSignum()
      .then(() => {
        expect(global.adp.db.counter).toBe(2);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
