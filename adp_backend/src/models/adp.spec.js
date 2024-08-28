/**
* Unit test for [ adp.models.Adp ]
* @author Cein [edaccei]
*/

class MockMongoObjectId {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return `${this.id}`;
  }
}

describe('Testing [ adp.models.Adp ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.MongoObjectID = MockMongoObjectId;
    adp.config = {};
    adp.check = {};
    adp.MongoObjectID = MockMongoObjectId;
    adp.slugIt = SOMETHING => SOMETHING;
    adp.db.find = (dbName, dbSelector, dbOptions, projection) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      adp.check.dbprojection = projection;
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
    adp.db.updateMany = (dbName, filter, update, options = {}) => {
      adp.check.dbName = dbName;
      adp.check.filter = filter;
      adp.check.update = update;
      adp.check.options = options;
      return new Promise(resolve => resolve(true));
    };
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.mockRbac = [{ _id: 'mockId', name: 'mock name', type: 'group' }];
    adp.mockUsers = ['eidpermuser',
      {
        _id: 'eidpermuser',
        signum: 'eidpermuser',
        name: 'eidpermuser User',
        type: 'user',
        role: 'author',
        rbac: [],
      }];
    adp.models = {};
    adp.models.Adp = require('./Adp');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('getById: Should return a promise responding true, if parameter is an Array of IDs.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getById(['mockID'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['mockID'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getById: Should return a promise responding true, if parameter is an unique ID.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getById('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['mockID'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllAdminDevTeam: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAdminDevTeam()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ role: { $eq: 'admin' } }, { devteam: { $exists: true, $ne: null } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getAllWithMimerVersionStarter: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllWithMimerVersionStarter()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ mimer_version_starter: { $nin: [null, ''] } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('getAllAdminNotDevTeam: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAdminNotDevTeam()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ role: { $eq: 'admin' } }, { devteam: { $exists: false } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllAdmin: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAdmin()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ role: { $eq: 'admin' } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllAssetsByDomain: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAssetsByDomain(1)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ domain: { $eq: 1 }, type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getAllMSNaemandID: Should return a promise responding name and Ids of all microservices.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllMSNaemandID()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getByNameIfIsNotTheIDByType: Should check if a name already exists.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getByNameIfIsNotTheIDByType('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('assetSearchByQuery: Should return a promise responding true.', (done) => {
    const query = { query: 'Mock Test' };
    const adpModel = new adp.models.Adp();
    adpModel.assetSearchByQuery(query)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ query: 'Mock Test' });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByNameIfIsNotTheID: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getByNameIfIsNotTheID('Mock Name', 'Mock ID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ name: { $eq: 'Mock Name' } }, { deleted: { $exists: false } }, { _id: { $ne: 'Mock ID' } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByNameIfIsNotTheID: Should return a promise responding true even without ID.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getByNameIfIsNotTheID('Mock Name')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ name: { $eq: 'Mock Name' } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetByIDorSLUG: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAssetByIDorSLUG('MockID or MockSlug')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false }, $or: [{ _id: 'MockID or MockSlug' }, { slug: 'MockID or MockSlug' }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetByIDorSLUG: Should return a promise responding true even without ID.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAssetByIDorSLUG()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getMsById: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getMsById(['mockID'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['mockID'] }, type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexAssets: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.indexAssets()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('indexAssetsGetOnlyIDs: Should return a promise responnding true with only the IDs', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.indexAssetsGetOnlyIDs(true)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      })
      .catch(() => done.fail());
  });

  it('index: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ deleted: { $exists: false } });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByMSSlug: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getByMSSlug('mockSlug')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ slug: 'mockSlug', deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexMicroservices: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.indexMicroservices()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexUsers: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.indexUsers()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'user' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getUsersById: Should return a promise responding true, if parameter is an Array of IDs, with an empty projection.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getUsersById(['MockID'], true)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['MockID'] }, type: { $eq: 'user' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        expect(adp.check.dbprojection).toEqual({});
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getUsersById: Should return a promise responding true, if parameter is an unique ID and remove the rbac object from the result.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getUsersById('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['MockID'] }, type: { $eq: 'user' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        expect(adp.check.dbprojection).toEqual({ rbac: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getMsByDocumentUrl: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getMsByDocumentUrl('mockURL')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _documentation: { $elemMatch: { url: { $eq: 'mockURL' } } }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetDuplicateNames: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    const step1 = {
      $match: {
        $and: [
          {
            $or: [
              { type: { $in: ['assembly', 'microservice'] }, _id: { $ne: 'MockID' }, name: { $regex: 'mockname', $options: 'i' } },
              { type: { $in: ['assembly', 'microservice'] }, _id: { $ne: 'MockID' }, slug: 'MockName' },
            ],
          },
          { deleted: { $exists: false } },
        ],
      },
    };
    const step2 = { $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } };
    const step3 = { $match: { count: { $gt: 0 } } };
    const step4 = { $sort: { count: -1 } };
    const arrayToCompare = [step1, step2, step3, step4];
    adpModel.getAssetDuplicateNames('MockName', 'MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual(arrayToCompare);
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetDuplicateNames: Should return a promise responding true, even if ID is undefined.', (done) => {
    const adpModel = new adp.models.Adp();
    const step1 = {
      $match: {
        $and: [
          {
            $or: [
              { type: { $in: ['assembly', 'microservice'] }, name: { $regex: 'mockname', $options: 'i' } },
              { type: { $in: ['assembly', 'microservice'] }, slug: 'MockName' },
            ],
          },
          { deleted: { $exists: false } },
        ],
      },
    };
    const step2 = { $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } };
    const step3 = { $match: { count: { $gt: 0 } } };
    const step4 = { $sort: { count: -1 } };
    const arrayToCompare = [step1, step2, step3, step4];
    adpModel.getAssetDuplicateNames('MockName')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual(arrayToCompare);
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetDuplicateNames: Should return a promise responding true, even if ID and Name are undefined.', (done) => {
    const adpModel = new adp.models.Adp();
    const step1 = {
      $match: { type: { $in: ['assembly', 'microservice'] } },
    };
    const step2 = { $match: { deleted: { $ne: true } } };
    const step3 = { $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } };
    const step4 = { $match: { count: { $gt: 1 } } };
    const step5 = { $sort: { count: -1 } };
    const arrayToCompare = [step1, step2, step3, step4, step5];
    adpModel.getAssetDuplicateNames()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual(arrayToCompare);
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('deleteOne: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.deleteOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('update: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.update('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateUserPermissionGroup: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.updateUserPermissionGroup('mockID', adp.mockRbac)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbID._id).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deletePermissionGroupFromUsers: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.deletePermissionGroupFromUsers('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('removeXidPermissionsFromUsers: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.removeXidPermissionsFromUsers('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('addEidGroupToXidUsers: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.addEidGroupToXidUsers(adp.mockRbac[0], 'mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.filter).toEqual(
          {
            $and: [
              { type: 'user', rbac: { $elemMatch: { _id: 'mockID' } } },
              { type: 'user', rbac: { $not: { $elemMatch: { _id: adp.mockRbac[0]._id } } } },
            ],
          },
        );

        expect(adp.check.update).toEqual({ $push: { rbac: adp.mockRbac[0] } });
        expect(adp.check.options).toEqual({});
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updatePermissionGroupforMultipleUsers: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.updatePermissionGroupforMultipleUsers(adp.mockUsers, adp.mockRbac)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateUserPermissionGroupIfRbacGroupUpdated: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.updateUserPermissionGroupIfRbacGroupUpdated(adp.mockRbac[0])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getUsersByPermissionGroup: GROUPIDs array,Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getUsersByPermissionGroup(['mockid'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getUsersByPermissionGroup: no GROUPIDs ,Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getUsersByPermissionGroup()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateMany: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    const filter = { type: 'user' };
    const update = { $pull: { rbac: { name: 'XID Group' } } };
    adpModel.updateMany(filter, update)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.update.$pull.rbac.name).toBe('XID Group');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getMSByIdAndSecret: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Adp('mongoDB');
    adpModel.getMSByIdAndSecret('thisID', 'thisSecret')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adp');
        expect(adp.check.dbSelector._id).toEqual('thisID');
        expect(adp.check.dbSelector.inval_secret).toEqual('thisSecret');
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('msSearch: default search pipelines with no given pipelines', (done) => {
    const adpModel = new adp.models.Adp('mongoDB');
    adpModel.msSearch()
      .then((response) => {
        const pipelines = adp.check.dbSelector;

        expect(response).toBeTruthy();
        const filterPipeline = pipelines[0].$match.$and;

        expect(filterPipeline.length).toBe(2);
        expect(filterPipeline[0].type).toBeDefined('microservice');
        expect(filterPipeline[1].deleted.$exists).toBeFalsy();

        const unsetPipelineAfterMatch = pipelines[1].$unset;

        expect(unsetPipelineAfterMatch).toBe('inval_secret');

        const denormListopts = pipelines[2].$lookup.from;
        const denormTeam = pipelines[3].$lookup.as;
        const unsetRBAC = pipelines[4].$unset;
        const denormTags = pipelines[5].$lookup.from;
        const denormAddedFields1 = pipelines[6].$addFields;
        const denormAddedFields2 = pipelines[16].$addFields;

        expect(denormListopts).toBe('listoption');
        expect(denormTeam).toBe('denorm.team');
        expect(unsetRBAC).toBe('denorm.team.rbac');
        expect(denormTags).toBe('tag');
        expect(denormAddedFields1['denorm.auto_menu']).toBeDefined();
        expect(denormAddedFields1.tags).toBeDefined();
        expect(denormAddedFields1.team).toBeDefined();
        expect(denormAddedFields2.reusability_level_order).toBeDefined();
        expect(denormAddedFields2['denorm.reusability_level']).toBeDefined();
        expect(denormAddedFields2.service_category_order).toBeDefined();
        expect(denormAddedFields2['denorm.service_category']).toBeDefined();
        expect(denormAddedFields2.domain_order).toBeDefined();
        expect(denormAddedFields2['denorm.domain']).toBeDefined();
        expect(denormAddedFields2.serviceArea_order).toBeDefined();
        expect(denormAddedFields2['denorm.serviceArea']).toBeDefined();
        expect(denormAddedFields2.service_maturity_order).toBeDefined();
        expect(denormAddedFields2['denorm.service_maturity']).toBeDefined();
        expect(denormAddedFields2.assembly_category_order).toBeDefined();
        expect(denormAddedFields2['denorm.assembly_category']).toBeDefined();
        expect(denormAddedFields2['denorm.restricted']).toBeDefined();

        const sortBeforeGroup = pipelines[17].$sort;

        expect(sortBeforeGroup.service_maturity_order).toBe(-1);
        expect(sortBeforeGroup.name_lowercase).toBe(1);

        const groupBy = pipelines[18].$group._id;

        expect(groupBy).toBe('$type');

        const AddedFields3 = pipelines[19].$addFields;

        expect(AddedFields3.groupHeader).toBeNull();
        expect(AddedFields3.groupDescription).toBeNull();
        expect(AddedFields3.groupType).toBeFalsy();

        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('msSearch: pass in filter, sort, group, skip, limit queries, keep private keys and remove all attributes', (done) => {
    const unsetAttributeList = [
      'menu',
      'repo_urls',
      'menu_auto',
      'approval',
      'owner',
      'additional_info',
      'adp_organization',
      'adp_realization',
      'adp_strategy',
      'backlog',
      'domain',
      'report_service_bugs',
      'request_service_support',
    ];

    const adpModel = new adp.models.Adp('mongoDB');
    const filter = { newFilter: 'filter' };
    const sortBeforeGroupObj = { newSortGroupBefore: 'sortBefore' };
    const groupByKey = 'groupby';
    const sortAfterGroupObj = { newSortGroupAfter: 'sortAfter' };
    const skip = 10;
    const limit = 20;

    adpModel.msSearch(
      [filter], sortBeforeGroupObj, groupByKey, sortAfterGroupObj, skip, limit, false, false,
    ).then((response) => {
      const pipelines = adp.check.dbSelector;

      expect(response).toBeTruthy();
      const filterPipeline = pipelines[0].$match.$and;

      expect(filterPipeline.length).toBe(3);
      expect(filterPipeline[0].type).toBeDefined('microservice');
      expect(filterPipeline[1].deleted.$exists).toBeFalsy();
      expect(filterPipeline[2].newFilter).toBe(filter.newFilter);

      expect(pipelines[1].$unset).toEqual(unsetAttributeList);

      const sortBeforePipeline = pipelines[17].$sort;

      expect(sortBeforePipeline.newSortGroupBefore).toBe(sortBeforeGroupObj.newSortGroupBefore);

      const skipPipeline = pipelines[18].$skip;
      const limitPipeline = pipelines[19].$limit;

      expect(skipPipeline).toBe(skip);
      expect(limitPipeline).toBe(limit);

      const groupByPipeline = pipelines[20].$group._id;
      const groupByPipelineAddField = pipelines[21].$addFields;

      expect(groupByPipeline).toBe(`$${groupByKey}`);
      expect(groupByPipelineAddField.groupType).toBeTruthy();

      const sortAfterPipeline = pipelines[22].$sort;

      expect(sortAfterPipeline.newSortGroupAfter).toBe(sortAfterGroupObj.newSortGroupAfter);

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('msSearch: pass in only group and limit queries', (done) => {
    const adpModel = new adp.models.Adp('mongoDB');
    const groupByKey = 'groupby';
    const limit = 20;

    adpModel.msSearch(
      null, null, groupByKey, null, null, limit, false,
    ).then((response) => {
      const pipelines = adp.check.dbSelector;

      expect(response).toBeTruthy();

      const limitPipeline = pipelines[17].$limit;

      expect(limitPipeline).toBe(limit);

      const groupByPipeline = pipelines[18].$group._id;
      const groupByPipelineAddField = pipelines[19].$addFields;

      expect(groupByPipeline).toBe(`$${groupByKey}`);
      expect(groupByPipelineAddField.groupType).toBeTruthy();

      done();
    }).catch(() => {
      done.fail();
    });
  });


  it('getAllAssetsIDsByDomain: Should return a promise, with the right query and options.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAssetsIDsByDomain()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0, sort: { domain: 1 } });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllAssetsIDsByServiceOwner: Should return a promise, with the right query and options.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAssetsIDsByServiceOwner('MockUserID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ 'team.signum': { $in: ['MockUserID'] } }, { 'team.serviceOwner': true }, { type: { $in: ['assembly', 'microservice'] } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0, sort: { 'team.signum': 1 } });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllAssetsIDsByServiceOwner: Should return a promise, with the right query and options ( Array of Users ).', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getAllAssetsIDsByServiceOwner(['MockUserID1', 'MockUserID2'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ 'team.signum': { $in: ['MockUserID1', 'MockUserID2'] } }, { 'team.serviceOwner': true }, { type: { $in: ['assembly', 'microservice'] } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0, sort: { 'team.signum': 1 } });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('allAssetsForRBAC: Should return a promise, with the right query and options ( Array of Users ).', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.allAssetsForRBAC(['MockUserID1', 'MockUserID2'], 'author', false, false, ['microservice'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ type: { $in: ['microservice'] } }, { deleted: { $exists: false } }, { _id: { $in: ['MockUserID1', 'MockUserID2'] } }] });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('allAssetsForRBAC: Should reject with error if ASSETS is not array.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.allAssetsForRBAC('asset', 'author')
      .then(() => {
        expect(true).toBeFalsy();
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.msg).toEqual('Bad Request - Expecting ARRAY for ASSETS, got string');
        done();
      });
  });

  it('allAssetsForRBAC: Should reject with error if ROLE is not string.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.allAssetsForRBAC([], 123)
      .then(() => {
        expect(true).toBeFalsy();
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.msg).toEqual('Bad Request - Expecting STRING for ROLE, got number');
        done();
      });
  });

  it('allAssetsForRBAC: Should reject with error asset array is empty and user is not admin.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.allAssetsForRBAC([], 'role')
      .then(() => {
        expect(true).toBeFalsy();
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.msg).toEqual('Bad Request - Array cannot be empty for non-admin role');
        done();
      });
  });


  it('checkIfPermissionGroupsAreNotReal: Should return a promise with the result of the request.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.checkIfPermissionGroupsAreNotReal(['MockID_1', 'MockID_2', 'MockID_3'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ $and: [{ 'rbac._id': { $nin: ['MockID_1', 'MockID_2', 'MockID_3'] } }, { type: 'user' }] });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('updateTeamMails: Should return a promise with the result of the request.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.updateTeamMails('previous@email.com', 'new@email.com')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.filter).toEqual({ type: { $in: ['assembly', 'microservice'] }, teamMails: 'previous@email.com' });
        expect(adp.check.update).toEqual({ $set: Object({ 'teamMails.$': 'new@email.com' }) });
        expect(adp.check.options).toEqual({});
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getNameEmailAndSignumBySignum: Should return a promise with the result of the request ( One signum ).', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getNameEmailAndSignumBySignum('eztest')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: Object({ $in: ['eztest'] }), type: Object({ $eq: 'user' }), deleted: Object({ $exists: false }) });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getNameEmailAndSignumBySignum: Should return a promise with the result of the request ( Multiple Signums ).', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getNameEmailAndSignumBySignum(['eztest', 'etest', 'efinaltest'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: Object({ $in: ['eztest', 'etest', 'efinaltest'] }), type: Object({ $eq: 'user' }), deleted: Object({ $exists: false }) });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('cleanContentPermissions: should return successfully, with query param contain objectIds to remove for permission type content static array from type user', (done) => {
    const adpModel = new adp.models.Adp();
    const testObjIdArr = ['0', '1'];
    adpModel.cleanContentPermissions(testObjIdArr)
      .then(() => {
        expect(true).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');

        const { type, 'rbac.permission.type': permType, 'rbac.permission.static': permStatic } = adp.check.filter;

        expect(type).toBe('user');
        expect(permType).toBe('content');
        expect(permStatic.$in[0]).toBe(testObjIdArr[0]);
        expect(permStatic.$in[1]).toBe(testObjIdArr[1]);

        const { 'rbac.$[].permission.$[elem].static': updateStaticArr } = adp.check.update.$pullAll;

        expect(updateStaticArr[0]).toBe(testObjIdArr[0]);
        expect(updateStaticArr[1]).toBe(testObjIdArr[1]);

        const { arrayFilters } = adp.check.options;

        expect(arrayFilters.length).toBe(1);
        expect(arrayFilters[0]['elem.type']).toBe('content');
        done();
      }).catch(() => done.fail());
  });


  it('updateOnlyAutoMenu: successful cases', (done) => {
    adp.versionSort = require('../library/versionSort');
    adp.db.update = (col, obj) => new Promise(resolve => resolve({ success: true, obj }));
    adp.db.find = () => {
      const mockAsset = {
        docs: [
          {
            _id: 'mockID',
            menu: {
              auto: { development: [], release: [] },
              manual: [],
            },
          },
        ],
      };
      return new Promise(resolve => resolve(mockAsset));
    };

    const expected1 = {
      success: true,
      obj: {
        _id: 'mockID',
        menu: {
          auto: {
            development: [{ mockTestDev: true }],
            release: [{ mockTestRelease: true }],
          },
          manual: [],
        },
      },
    };

    const expected2 = {
      success: true,
      obj: {
        _id: 'mockID',
        menu: {
          auto: {
            development: [{ mockTestDev: true }],
            release: [],
          },
          manual: [],
        },
      },
    };

    const expected3 = {
      success: true,
      obj: {
        _id: 'mockID',
        menu: {
          auto: {
            development: [],
            release: [
              {
                version: '1.0.1',
                mockTestRelease: true,
              },
            ],
          },
          manual: [],
        },
      },
    };

    const releaseAuto = {
      development: [
        {
          mockTestDev: true,
        },
      ],
      release: [
        {
          version: '1.0.1',
          mockTestRelease: true,
        },
      ],
    };

    const adpModel = new adp.models.Adp();
    adpModel.updateOnlyAutoMenu('mockID', { release: [{ mockTestRelease: true }], development: [{ mockTestDev: true }] })
      .then((RESULT1) => {
        expect(RESULT1).toEqual(expected1);
        adpModel.updateOnlyAutoMenu('mockID', { development: [{ mockTestDev: true }], release: [{ mockTestRelease: true }] }, 'development')
          .then((RESULT2) => {
            expect(RESULT2).toEqual(expected2);
            adpModel.updateOnlyAutoMenu('mockID', { development: [{ mockTestDev: true }], release: [{ mockTestRelease: true }] }, 'indevelopment')
              .then((RESULT3) => {
                expect(RESULT3).toEqual(expected2);
                adpModel.updateOnlyAutoMenu('mockID', { development: [{ mockTestDev: true }], release: [{ mockTestRelease: true }] }, 'in-development')
                  .then((RESULT4) => {
                    expect(RESULT4).toEqual(expected2);
                    adpModel.updateOnlyAutoMenu('mockID', releaseAuto, '1.0.1')
                      .then((RESULT5) => {
                        expect(RESULT5).toEqual(expected3);
                        done();
                      })
                      .catch(() => {
                        done.fail();
                      });
                  })
                  .catch(() => {
                    done.fail();
                  });
              })
              .catch(() => {
                done.fail();
              });
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });

  it('updateOnlyAutoMenu: More successful cases', (done) => {
    adp.versionSort = require('../library/versionSort');
    adp.db.update = (col, obj) => new Promise(resolve => resolve({ success: true, obj }));
    adp.db.find = () => {
      const mockAsset = {
        docs: [
          {
            _id: 'mockID',
            menu: {
              auto: {
                development: [],
                release: [
                  {
                    version: '1.0.0',
                    mockTestRelease: false,
                  },
                  {
                    version: '1.0.1',
                    mockTestRelease: false,
                  },
                ],
              },
              manual: [],
            },
          },
        ],
      };
      return new Promise(resolve => resolve(mockAsset));
    };

    const expected1 = {
      success: true,
      obj: {
        _id: 'mockID',
        menu: {
          auto: {
            development: [],
            release: [
              {
                version: '1.0.1',
                mockTestRelease: true,
              },
              {
                version: '1.0.0',
                mockTestRelease: false,
              },
            ],
          },
          manual: [],
        },
      },
    };

    const releaseAuto = {
      development: [
        {
          mockTestDev: true,
        },
      ],
      release: [
        {
          version: '1.0.1',
          mockTestRelease: true,
        },
      ],
    };

    const adpModel = new adp.models.Adp();
    adpModel.updateOnlyAutoMenu('mockID', releaseAuto, '1.0.1')
      .then((RESULT1) => {
        expect(RESULT1).toEqual(expected1);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('getMicroserviceList: Should return a microservices list with name and Ids.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getMicroserviceList()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getMSByIdForAssembly: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Adp();
    adpModel.getMSByIdForAssembly('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adp');
        expect(adp.check.dbSelector).toEqual({ _id: { $eq: 'MockID' }, type: { $in: ['assembly', 'microservice'] }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
