// ============================================================================================= //
/**
* Unit test for [ adp.db.checkID ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObjectId {
  constructor(GOTID) {
    if (GOTID === undefined) {
      this.id = { id: 'ABCD' };
    } else {
      this.id = { id: GOTID };
    }
    return this.id;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.checkID ]', () => {
  beforeEach(() => {
    global.adp = {};
    adp.MongoObjectID = MockMongoObjectId;
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.clone = JSONOBJ => JSON.parse(JSON.stringify(JSONOBJ));
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.db.checkID = require('./checkID');
    adp.config = {};
    adp.config.database = [
      {
        collection: 'adp',
        type: ['microservice', 'user'],
        description: 'Used for Assets and Users',
      },
      {
        collection: 'rbacgroups',
        type: ['group'],
        description: 'Groups for RBAC System',
        useObjectID: true,
      },
    ];
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Basic case, using ID as string.', (done) => {
    const testObj = {
      _id: 'stringID',
      mockObject: true,
    };
    const after = adp.db.checkID('adp', testObj);

    expect(after).toEqual({ _id: 'stringID', mockObject: true });
    done();
  });


  it('Double case, using ID as string and another without ID (Should add).', (done) => {
    const testObj1 = {
      _id: 'stringID',
      mockObject: true,
    };
    const testObj2 = {
      mockObject: false,
    };
    const after1 = adp.db.checkID('adp', testObj1, true);
    const after2 = adp.db.checkID('adp', testObj2, true);

    expect(after1).toEqual({ _id: 'stringID', mockObject: true });
    expect(after2).toEqual({ _id: '[object Object]', mockObject: false });
    done();
  });


  it('Double case, using ID as string and another without ID (Should not add).', (done) => {
    const testObj1 = {
      _id: 'stringID',
      mockObject: true,
    };
    const testObj2 = {
      mockObject: false,
    };
    const after1 = adp.db.checkID('adp', testObj1);
    const after2 = adp.db.checkID('adp', testObj2);

    expect(after1).toEqual({ _id: 'stringID', mockObject: true });
    expect(after2).toEqual({ mockObject: false });
    done();
  });


  it('Basic case, using ID as ObjectID.', (done) => {
    const testObj = {
      _id: 'ABCDEFGHIJLMNOPQRSTUVYXZ',
      mockObject: true,
    };
    const after = adp.db.checkID('rbacgroups', testObj);

    expect(after).toEqual({ _id: { id: 'ABCDEFGHIJLMNOPQRSTUVYXZ' }, mockObject: true });
    done();
  });


  it('Basic case, using ID as ObjectID but without explicit ID (Should add).', (done) => {
    const testObj = {
      mockObject: true,
    };
    const after = adp.db.checkID('rbacgroups', testObj, true);

    expect(after).toEqual({ _id: { id: 'ABCD' }, mockObject: true });
    done();
  });


  it('Basic case, using ID as ObjectID but without explicit ID (Should not add).', (done) => {
    const testObj = {
      mockObject: true,
    };
    const after = adp.db.checkID('rbacgroups', testObj);

    expect(after).toEqual({ mockObject: true });
    done();
  });
});
// ============================================================================================= //
