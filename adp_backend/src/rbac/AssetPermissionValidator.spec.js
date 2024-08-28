const joi = require('joi');
/**
* Unit test for [ adp.rbac.AssetPermissionValidator ]
* @author Cein
*/

class MockMicroservicesController {
  validateListOfMSIds() {
    return new Promise((res, rej) => {
      if (global.adp.MockMsContr.validateListOfMSIdsRes) {
        res(global.adp.MockMsContr.validateListOfMSIdsData);
      } else {
        rej(global.adp.MockMsContr.validateListOfMSIdsData);
      }
    });
  }
}

class MockListOptionsController {
  validateIds() {
    return new Promise((res, rej) => {
      if (global.adp.MockListopsContr.validateIdsRes) {
        res(global.adp.MockListopsContr.validateIdsData);
      } else {
        rej(global.adp.MockListopsContr.validateIdsData);
      }
    });
  }
}

describe('Testing results of [ adp.rbac.AssetPermissionValidator ] ', () => {
  beforeAll(() => {
    global.joi = joi;
  });

  beforeEach(() => {
    adp = {};
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.MockMsContr = {
      validateListOfMSIdsRes: true,
      validateListOfMSIdsData: true,
    };
    global.adp.MockListopsContr = {
      validateIdsRes: true,
      validateIdsData: true,
    };


    adp.listOptions = { ListOptionsController: MockListOptionsController };
    global.adp.microservices = { MicroservicesController: MockMicroservicesController };
    adp.rbac = { AssetPermissionValidator: require('./AssetPermissionValidator') };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('validate: should return valid permission for future services and not exceptions', (done) => {
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: [],
      static: null,
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validate: should return valid permission for future services and with exceptions.', (done) => {
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: ['testMS', 'testMs'],
      static: null,
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validate: should return valid permission if dynamic is off and has static amount of services.', (done) => {
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: null,
      exception: null,
      static: ['testMS', 'testMs'],
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validate: should return valid permission dynamic permission with correct listoption ids.', (done) => {
    const grp1 = { _id: 'group1' };
    const grp2 = { _id: 'group2' };
    const itm1 = { _id: 'item1' };
    const itm2 = { _id: 'item2' };

    global.adp.MockListopsContr.validateIdsData = { data: [grp1, grp2, itm1, itm2] };

    const dirtyItm1 = { ...itm1, randomKey: 1 };
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: [
        {
          _id: grp1._id,
          randomKey: 1,
          items: [
            dirtyItm1,
          ],
        }, {
          _id: grp2._id,
          items: [
            dirtyItm1,
            itm2,
            itm1,
          ],
        },
      ],
      exception: [],
      static: null,
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then((result) => {
      const newDynamic = result.updatedPermission.dynamic;

      expect(result.valid).toBeTruthy();
      expect(newDynamic[0].randomKey).toBeUndefined();
      expect(newDynamic[0]._id).toBe(grp1._id);
      expect(newDynamic[0].items.length).toBe(1);
      expect(newDynamic[0].items[0].randomKey).toBeUndefined();
      expect(newDynamic[0].items[0]._id).toBe(itm1._id);
      expect(newDynamic[1]._id).toBe(grp2._id);
      expect(newDynamic[1].items.length).toBe(3);
      expect(newDynamic[1].items[0].randomKey).toBeUndefined();
      expect(newDynamic[1].items[0]._id).toBe(itm1._id);
      expect(newDynamic[1].items[1]._id).toBe(itm2._id);
      done();
    }).catch(() => done.fail());
  });

  it('validate: should reject valid permission dynamic permission with incorrect listoption ids.', (done) => {
    global.adp.MockListopsContr.validateIdsData = { data: [] };
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: [
        {
          _id: { _id: 'group1' },
          items: [
            { _id: 'item1' },
          ],
        },
      ],
      exception: [],
      static: null,
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
      done();
    });
  });

  it('validate: should reject if listoptions controller rejects.', (done) => {
    global.adp.MockListopsContr.validateIdsRes = false;
    global.adp.MockListopsContr.validateIdsData = { code: 500 };
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: [
        {
          _id: 'group1',
          items: [
            { _id: 'item1' },
          ],
        },
      ],
      exception: [],
      static: null,
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('validate: should reject if MicroservicesController rejects.', (done) => {
    global.adp.MockMsContr.validateListOfMSIdsRes = false;
    global.adp.MockMsContr.validateListOfMSIdsData = { code: 500 };
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
      dynamic: null,
      exception: null,
      static: ['testMS', 'testMs'],
    };
    const assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);

    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('validate: should reject for combinations of static and dynamic misconfigurations.', (done) => {
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
    };
    permObj.dynamic = null;
    permObj.exception = [];
    permObj.static = [];

    let assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
    });

    permObj.exception = [];
    permObj.dynamic = null;
    permObj.static = [];
    assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
    });

    permObj.static = null;
    permObj.exception = [];
    permObj.dynamic = null;
    assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
    });

    done();
  });

  it('validate: should return valid permission for combinations of static, dynamic and exception configurations. for assest', (done) => {
    const permObj = {
      _id: {},
      type: 'asset',
      name: 'test',
    };
    permObj.dynamic = [];
    permObj.exception = [];
    permObj.static = [];

    let assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    permObj.exception = [];
    permObj.dynamic = [];
    permObj.static = null;
    assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    permObj.static = [];
    permObj.exception = null;
    permObj.dynamic = null;
    assetPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    assetPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    done();
  });

  it('validate: should return valid permission for combinations of static, dynamic and exception configurations. for content', (done) => {
    const permObj = {
      _id: {},
      type: 'content',
      name: 'test',
    };
    permObj.dynamic = [];
    permObj.exception = [];
    permObj.static = [];

    let contentPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    contentPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    permObj.exception = [];
    permObj.dynamic = [];
    permObj.static = null;
    contentPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    contentPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    permObj.static = [];
    permObj.exception = null;
    permObj.dynamic = null;
    contentPermVal = new adp.rbac.AssetPermissionValidator(permObj);
    contentPermVal.validate().then((result) => {
      expect(result.valid).toBeTruthy();
      done();
    }).catch(() => done.fail());

    done();
  });
});
