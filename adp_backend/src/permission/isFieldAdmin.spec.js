// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.isFieldAdmin ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.isFieldAdmin ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.fieldListWithPermissions = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.checkFieldPermission = id => new Promise((MOCKRES1) => {
      if (id === 1 || id === 2) {
        MOCKRES1({
          signum: 'valid',
        });
      }
      MOCKRES1([]);
    });
    global.adp.permission.isFieldAdmin = require('./isFieldAdmin'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should not send anything if there is not permission for the specified asset', (done) => {
    const mockSignum = 'valid';
    const mockAsset = {
      testField1: 'testValue1',
      testField2: 'testValue2',
    };
    global.adp.permission.fieldPermissionCache = [
      {
        slug: 'testField1',
        id: 3,
      },
    ];
    global.adp.permission.isFieldAdmin(mockSignum, mockAsset)
      .then((expectReturn) => {
        expect(expectReturn).toBeUndefined();
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should send asset if there is valid permission for the specified asset and for invalid signum', (done) => {
    const mockSignum = 'invalidsignum';
    const mockAsset = {
      testField1: 'testValue1',
      testField2: 'testValue2',
    };
    global.adp.permission.fieldPermissionCache = [
      {
        slug: 'testField1',
        id: 1,
      },
      {
        slug: 'testField2',
        id: 2,
      },
    ];
    global.adp.permission.isFieldAdmin(mockSignum, mockAsset)
      .then((expectReturn) => {
        expect(expectReturn).toBeUndefined();
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should send asset if there is valid permission for the specified signum and asset', (done) => {
    const mockSignum = 'signum';
    const mockAsset = {
      testField1: 'testValue1',
      testField2: 'testValue2',
    };
    global.adp.permission.fieldPermissionCache = [
      {
        slug: 'testField1',
        id: 1,
      },
      {
        slug: 'testField2',
        id: 2,
      },
    ];
    global.adp.permission.isFieldAdmin(mockSignum, mockAsset)
      .then((expectReturn) => {
        expect(expectReturn).toEqual(mockAsset);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
// ============================================================================================= //
