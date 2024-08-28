/**
* Unit test for [ global.adp.document.matchDocNameToCategory ]
* @author Cein-Sven Da Costa [edaccei]
*/

let dbFindPass = true;
let dbFindData = [];
class MockListOptionModel {
  getManyByGroupID() {
    return new Promise((resolve, reject) => {
      if (dbFindPass) {
        resolve({ docs: dbFindData });
      } else {
        reject();
      }
    });
  }
}

describe('Testing [ global.adp.document.matchDocNameToCategory ] ', () => {
  beforeEach(() => {
    dbFindPass = true;
    dbFindData = [];

    global.adp = {};
    adp.models = {};
    adp.models.Listoption = MockListOptionModel;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.echoLog = () => true;

    global.adp.slugIt = arg => arg;

    global.adp.document = {};
    global.adp.document.matchDocNameToCategory = require('./matchDocNameToCateogory'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should return category name and slug.', async (done) => {
    const testCat = {
      'group-id': 10,
      'select-id': 1,
      name: 'test-cat',
    };
    const testDoc = {
      'group-id': 11,
      'select-id': 1,
      'documentation-categories-auto': 1,
      name: 'test-doc',
    };

    dbFindData = [testCat, testDoc];

    global.adp.document.matchDocNameToCategory(testDoc.name)
      .then((result) => {
        expect(result.name).toBe(testCat.name);
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('should return default category name and slug.', async (done) => {
    const testDefault = {
      'group-id': 10,
      'select-id': 99,
      name: 'test-cat',
      default: true,
    };
    const testDoc = {
      'group-id': 11,
      'select-id': 1,
      'documentation-categories-auto': 1,
      name: 'test-doc',
    };

    dbFindData = [testDefault, testDoc];

    global.adp.document.matchDocNameToCategory(testDoc.name)
      .then((result) => {
        expect(result.name).toBe(testDefault.name);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should return error if no match and no default.', async (done) => {
    const testcat = {
      'group-id': 10,
      'select-id': 99,
      name: 'test-cat',
    };
    const testDoc = {
      'group-id': 11,
      'select-id': 1,
      'documentation-categories-auto': 1,
      name: 'test-doc',
    };

    dbFindData = [testcat, testDoc];

    global.adp.document.matchDocNameToCategory(testDoc.name)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });

  it('should return error the query fails.', async (done) => {
    dbFindPass = false;

    global.adp.document.matchDocNameToCategory('test')
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
