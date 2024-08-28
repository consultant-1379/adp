// ============================================================================================= //
/**
* Unit test for [ global.adp.tags.newTag ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockTag {
  getByName() {
    return new Promise((resolve) => {
      const RES = {};
      RES.resultsReturned = 0;
      resolve(RES);
    });
  }

  createOne() {
    return new Promise((resolve) => {
      const RES = {};
      RES.ok = true;
      RES.id = '123';
      resolve(RES);
    });
  }
}

describe('Testing [ global.adp.tags.newTag ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Tag = MockTag;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => new Promise(() => {});

    global.adp.tags = {};
    global.adp.tags.reload = () => new Promise((RESOLVE) => { RESOLVE(true); });
    global.adp.tags.newTag = require('./newTag'); // eslint-disable-line global-require

    global.adp.tags.items = [
      {
        id: '123',
        group: '1',
        tag: 'Old Tag 1',
        order: 1,
      },
      {
        id: '456',
        group: '1',
        tag: 'Old Tag 2',
        order: 2,
      },
    ];
    global.temp = {};
    global.temp.userobj = {
      signum: 'unitTestUser',
    };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Creating a new and valid Tag.', (done) => {
    global.adp.tags.newTag('NewTag', global.temp.userobj)
      .then((RES) => {
        expect(RES).toEqual('123');
        done();
      })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Empty tag. Should return an Error.', (done) => {
    global.adp.tags.newTag('  ', global.temp.userobj)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      })
      .catch((ERR) => {
        expect(ERR).toEqual('Empty Tag');
        done();
      });
  });
});
// ============================================================================================= //
