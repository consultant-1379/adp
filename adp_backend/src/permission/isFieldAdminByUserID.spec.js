// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.isFieldAdminByUserID ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let internalDbError;
let permiDBResp;
class MockPermission {
  index() {
    return new Promise((resolve, reject) => {
      if (internalDbError) {
        reject();
      }
      resolve(permiDBResp);
    });
  }
}

describe('Testing [ global.adp.permission.isFieldAdminByUserID ] behavior.', () => {
  internalDbError = false;
  let internalGetListoptionsError = false;
  permiDBResp = {};
  let listoptionsResp = {};
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.db = {};
    global.adp.db.find = () => new Promise((resolve, reject) => {
      if (internalDbError) {
        reject();
      }
      resolve(permiDBResp);
    });
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((resolve, reject) => {
      if (internalGetListoptionsError) {
        reject();
      }
      resolve(JSON.stringify(listoptionsResp));
    });
    global.adp.permission = {};
    global.adp.permission.isFieldAdminByUserID = require('./isFieldAdminByUserID'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
    internalDbError = false;
    internalGetListoptionsError = false;
  });

  it('Should send fields for which user is admin', (done) => {
    const mockSignum = 'testSignum';
    permiDBResp = {
      docs: [
        {
          'group-id': 1,
          'item-id': 2,
          admin: {
            testSignum: {

            },
          },
        },
      ],
    };
    listoptionsResp = [
      {
        id: 1,
        slug: 'testField',
        items: [
          {
            id: 1,
            name: 'testFieldItem1',
          },
          {
            id: 2,
            name: 'testFieldItem2',
          },
        ],
      },
    ];
    global.adp.permission.isFieldAdminByUserID(mockSignum)
      .then((expectReturn) => {
        expect(expectReturn.length).toEqual(1);
        expect(expectReturn[0].field).toEqual('testField');
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should send empty fields if it could not be denormalize using listoption', (done) => {
    const mockSignum = 'testSignum';
    permiDBResp = {
      docs: [
        {
          'group-id': 1,
          'item-id': 2,
          admin: {
            testSignum: {

            },
          },
        },
      ],
    };
    listoptionsResp = [];
    global.adp.permission.isFieldAdminByUserID(mockSignum)
      .then((expectReturn) => {
        expect(expectReturn.length).toEqual(1);
        expect(expectReturn[0]).toEqual({});
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should send empty fields if user is not admin of any field', (done) => {
    const mockSignum = 'testSignum';
    permiDBResp = {
      docs: [
        {
          'group-id': 1,
          'item-id': 2,
          admin: {
            testSignum1: {

            },
          },
        },
      ],
    };
    listoptionsResp = [
      {
        id: 1,
        slug: 'testField',
        items: [
          {
            id: 1,
            name: 'testFieldItem1',
          },
          {
            id: 2,
            name: 'testFieldItem2',
          },
        ],
      },
    ];
    global.adp.permission.isFieldAdminByUserID(mockSignum)
      .then((expectReturn) => {
        expect(expectReturn.length).toEqual(0);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should reject with error in case of reading permissions from database', (done) => {
    const mockSignum = 'testSignum';
    internalDbError = true;
    global.adp.permission.isFieldAdminByUserID(mockSignum)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('Should reject with error in case of reading listoptions', (done) => {
    const mockSignum = 'testSignum';
    internalDbError = false;
    permiDBResp = {
      docs: [
        {
          'group-id': 1,
          'item-id': 2,
          admin: {
            testSignum1: {

            },
          },
        },
      ],
    };
    internalGetListoptionsError = true;
    global.adp.permission.isFieldAdminByUserID(mockSignum)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
