/**
* Unit test for [global.adp.migration.yamlDocumentMenu]
* @author Cein [edaccei]
*/
describe('Testing [ global.adp.migration.yamlDocumentMenu ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.yamlDocumentMenu = require('./yamlDocumentMenu'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should set menu_auto, repo_urls and menu keys with corresponding values if the ms obj does not contain them.', (done, fail) => {
    global.adp.migration.yamlDocumentMenu({}).then((result) => {
      expect(typeof result.menu_auto).not.toEqual('undefined');
      expect(typeof result.menu_auto).not.toEqual(null);
      expect(result.menu_auto).toEqual(false);

      expect(result.repo_urls).toBeTruthy();
      expect(result.repo_urls.development).toEqual('');
      expect(result.repo_urls.release).toEqual('');

      expect(result.menu).toBeTruthy();
      expect(result.menu.auto).toBeTruthy();
      expect(result.menu.auto.date_modified).toEqual('');
      expect(result.menu.auto.errors).toBeTruthy();
      expect(result.menu.auto.errors.development).toEqual([]);
      expect(result.menu.auto.errors.release).toEqual([]);
      expect(result.menu.auto.development).toEqual([]);
      expect(result.menu.auto.release).toEqual([]);

      expect(result.menu.manual).toBeTruthy();
      expect(result.menu.auto.date_modified).toEqual('');
      expect(result.menu.auto.development).toEqual([]);
      expect(result.menu.auto.release).toEqual([]);

      done();
    }).catch(() => {
      fail();
    });
  });

  it('should return true if the expected object has menu_auto, repo_urls and menu keys set already.', (done, fail) => {
    const testObj = {
      menu_auto: false,
      repo_urls: {
        development: '',
        release: '',
      },
      menu: {
        auto: {
          date_modified: '',
          errors: {
            development: [],
            release: [],
          },
          development: [],
          release: [],
        },
      },
    };
    global.adp.migration.yamlDocumentMenu(testObj).then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => {
      fail();
    });
  });
});
