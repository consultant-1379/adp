/**
* Unit test for [ global.adp.documentCategory.fetchAutoDocCategoryBySlug ]
* @author Cein-Sven Da Costa [edaccei]
*/

let dbFindPass;
let dbFindData;
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

describe('Testing [ global.adp.documentCategory.fetchAutoDocCategoryBySlug ] ', () => {
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

    global.adp.documentCategory = {};
    global.adp.documentCategory.fetchAutoDocCategoryBySlug = require('./fetchAutoDocCategoryBySlug'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should return matched category obj.', async (done) => {
    const testCat = {
      'group-id': 10,
      'select-id': 1,
      name: 'test cat',
      slug: 'test-cat',
    };

    dbFindData = [testCat];

    global.adp.documentCategory.fetchAutoDocCategoryBySlug(testCat.slug)
      .then((result) => {
        expect(result.name).toBe(testCat.name);
        done();
      }).catch(() => {
        done.fail();
        done();
      });
  });

  it('should return null if there is no category match.', async (done) => {
    const testCat = {
      'group-id': 10,
      'select-id': 1,
      name: 'test-cat',
    };

    dbFindData = [testCat];

    global.adp.documentCategory.fetchAutoDocCategoryBySlug('NoMatch')
      .then((result) => {
        expect(result).toBeNull();
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should return null if the db search fails.', async (done) => {
    dbFindPass = false;

    global.adp.documentCategory.fetchAutoDocCategoryBySlug('test')
      .then((result) => {
        expect(result).toBeNull();
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
