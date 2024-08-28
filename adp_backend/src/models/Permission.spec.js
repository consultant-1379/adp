/**
* Unit test for [ adp.models.Permission ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Permission ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};
    adp.db.create = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(resolve => resolve(true));
    };
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.destroy = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.update = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.Permission = require('./Permission');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('permission');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getFieldAdminPermission: Checking the syntax of the query.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.getFieldAdminPermission('MockSignum', 3, 3)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('permission');
        expect(adp.check.dbSelector).toEqual({
          $and: [
            { deleted: { $exists: false } }, { 'group-id': { $eq: 3 } }, { 'item-id': { $eq: 3 } }, { 'admin.MockSignum': { $exists: true } },
          ],
        });

        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getAllFieldAdminPermissionBySignum: Checking the syntax of the query.', async (done) => {
    const permissionModel = new adp.models.Permission();
    const testSig = 'MockSignum';
    await permissionModel.getAllFieldAdminPermissionBySignum(testSig, 1, 1)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('permission');
        expect(adp.check.dbSelector).toEqual({ $and: [{ deleted: { $exists: false } }, { [`admin.${testSig}`]: { $exists: true } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 1 });
      }).catch(() => {
        done.fail();
      });

    await permissionModel.getAllFieldAdminPermissionBySignum([testSig])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('permission');
        expect(adp.check.dbSelector).toEqual({
          $and: [
            { deleted: { $exists: false } },
            {
              $or: [
                { [`admin.${testSig}`]: { $exists: true } },
              ],
            },
          ],
        });

        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
      }).catch(() => {
        done.fail();
      });

    done();
  });

  it('getAllPermissionsByField: Checking the syntax of the query.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.getAllPermissionsByField(3, 3)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('permission');
        expect(adp.check.dbSelector).toEqual({ $and: [{ deleted: { $exists: false } }, { 'group-id': { $eq: 3 } }, { 'item-id': { $eq: 3 } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('deleteOne: Should return a promise responding true.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.deleteOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('permission');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('updateOne: Should return a promise responding true.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.updateOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('permission');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const permissionModel = new adp.models.Permission();
    permissionModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('permission');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
