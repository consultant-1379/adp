/**
* Unit test for [ global.adp.documentCategory.matchDocNameToCategory ]
* @author Cein-Sven Da Costa [edaccei]
*/

let listOptionsGet;
describe('Testing [ global.adp.documentCategory.matchDocNameToCategory ] ', () => {
  beforeEach(() => {
    listOptionsGet = {
      resolve: true,
      data: [],
    };

    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.listOptions = {
      get: () => new Promise((resolve, reject) => {
        if (listOptionsGet.resolve) {
          resolve(JSON.stringify(listOptionsGet.data));
        } else {
          reject(listOptionsGet.data);
        }
      }),
    };

    global.adp.echoLog = () => true;

    global.adp.documentCategory = {};
    global.adp.documentCategory.matchDocNameToCategory = require('./matchDocNameToCategory');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should return category name and slug.', async (done) => {
    const testCat = {
      id: 1,
      documentationCategories: 0,
      name: 'Test Cat',
      slug: 'test-cat',
    };
    const testDoc = {
      id: 1,
      documentationCategories: 1,
      name: 'Test Doc',
      slug: 'test-doc',
    };

    const group10 = {
      id: 10,
      items: [testCat],
    };
    const group11 = {
      id: 11,
      items: [testDoc],
    };

    listOptionsGet.data = [group10, group11];

    global.adp.documentCategory.matchDocNameToCategory(testDoc.slug)
      .then((result) => {
        expect(result.name).toBe(testCat.name);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should return default category name and slug.', async (done) => {
    const testDefault = {
      id: 99,
      documentationCategories: 0,
      name: 'Test Cat',
      slug: 'test-cat',
      default: true,
    };
    const testDoc = {
      id: 1,
      documentationCategories: 1,
      name: 'Test Doc',
      slug: 'test-doc',
    };

    const group10 = {
      id: 10,
      items: [testDefault],
    };
    const group11 = {
      id: 11,
      items: [testDoc],
    };

    listOptionsGet.data = [group10, group11];

    global.adp.documentCategory.matchDocNameToCategory(testDoc.name)
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
      id: 99,
      documentationCategories: 0,
      name: 'Test Cat',
      slug: 'test-cat',
    };
    const testDoc = {
      id: 1,
      documentationCategories: 1,
      name: 'Test Doc',
      slug: 'test-doc',
    };

    const group10 = {
      id: 10,
      items: [testcat],
    };
    const group11 = {
      id: 11,
      items: [testDoc],
    };

    listOptionsGet.data = [group10, group11];

    global.adp.documentCategory.matchDocNameToCategory(testDoc.name)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });

  it('should return error the query fails.', async (done) => {
    listOptionsGet.resolve = false;

    global.adp.documentCategory.matchDocNameToCategory('test')
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
