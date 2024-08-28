/**
* Unit test for [ adp.models.EgsPayload ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

class MockEchoLog {
  createOne(MOCKJSON) {
    return new Promise((resolve) => {
      resolve({ ok: true, id: MOCKJSON.id });
    });
  }
}

class MockMongoObjectId {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return `${this.id}`;
  }
}

class mockEgsControlClass {
  getByObjectIds() {
    if (adp.mockBehavior.getByObjectIds) {
      return new Promise((resolve) => {
        const RESULT = {
          docs: adp.mockBehavior.egsControl,
        };
        resolve(RESULT);
      });
    }
    return new Promise((resolve, reject) => {
      const error = { message: 'MockError from getByObjectIds' };
      reject(error);
    });
  }

  async insertOrUpdateEgsControlDocument() {
    if (adp.mockBehavior.insertOrUpdateEgsControlDocument) {
      return new Promise(resolve => resolve());
    }
    return new Promise((resolve, reject) => reject());
  }

  setEgsControlAsSync() {
    if (adp.mockBehavior.setEgsControl) {
      return new Promise((resolve) => {
        const result = {};
        resolve(result);
      });
    }
    return new Promise((resolve, reject) => {
      const error = 'mockError from setEgsControlAsSync';
      reject(error);
    });
  }
}

describe('Testing [ adp.models.EgsPayload ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.config = {};
    adp.check = {};

    adp.MongoObjectID = MockMongoObjectId;

    adp.queue = {};
    adp.queue.obtainObjectiveLink = () => 'mockQueueURL';
    adp.queue.addJob = () => new Promise((RES, REJ) => {
      if (adp.mockBehaviour.addJob) {
        RES({ queue: `MockQueueID_${(new Date()).getTime()}` });
      }
      const error = 'MockErroAtAddJob';
      REJ(error);
    });
    adp.queue.getNextIndex = () => new Promise((RES, REJ) => {
      if (adp.mockBehaviour.getNextIndex) {
        RES(0);
      }
      const error = 'MockErrorGetNextIndex';
      REJ(error);
    });
    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = (COLLECTION) => {
      adp.check.createIndexCollection = COLLECTION;
      return {
        createIndex() {
          return true;
        },
      };
    };

    adp.mockBehaviour = {
      addJob: true,
      getNextIndex: true,
      create: true,
      insertOrUpdateEgsControlDocument: true,
      setEgsControl: true,
      find: true,
      updateMany: true,
      getByObjectIds: true,
      update: true,
      findResult: {
        docs: [{
          _id: 'MockId',
          sync_status: 'MockSyncStatus',
          sizeinbytes: 'MocksizeIn bytes',
        }],
      },
    };

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;
    global.adp.echoLog = () => true;
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.slugIt = SOMETHING => SOMETHING;

    adp.db.updateMany = (dbName, filter, update, options = {}) => {
      adp.check.dbName = dbName;
      adp.check.filter = filter;
      adp.check.update = update;
      adp.check.options = options;
      if (adp.mockBehaviour.updateMany) {
        return new Promise(resolve => resolve({ ok: 'MockOkUpdateMany' }));
      }
      const error = 'MockErroFromDbUpdateMany';
      return new Promise((resolve, reject) => reject(error));
    };

    adp.db.update = (dbName, changes) => {
      adp.check.dbName = dbName;
      adp.check.changes = changes;
      if (adp.mockBehaviour.update) {
        return new Promise(resolve => resolve());
      }
      const error = 'MockErroFromDbUpdate';
      return new Promise((resolve, reject) => reject(error));
    };

    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;

      if (adp.mockBehaviour.create) {
        return new Promise(resolve => resolve(true));
      }
      const error = 'MockErroFromDbCreate';
      return new Promise((resolve, reject) => reject(error));
    };

    global.adp.getSizeInMemory = () => true;

    adp.db.find = (dbName, mongoQuery, mongoOption) => {
      if (dbName === 'egsPayload' && mongoQuery !== undefined && mongoOption.limit === 1
      && adp.mockBehaviour.find) {
        return new Promise(resolve => resolve(adp.mockBehaviour.findResult));
      }
      const error = 'MockerrorFind';
      return new Promise((resolve, reject) => reject(error));
    };
    adp.models.EgsControl = mockEgsControlClass;
    adp.models.EgsPayload = proxyquire('./EgsPayload', {
      '../library/errorLog': mockErrorLog,
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  it('addSenderToTheQueue: Should return queue objective.', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.addSenderToTheQueue([1, 2, 3])
      .then((response) => {
        expect(response.queue).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('addSenderToTheQueue: Negative case when addJob fails.', (done) => {
    adp.mockBehaviour.addJob = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.addSenderToTheQueue([1, 2, 3])
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('getTheOpenPayload: Returns one payload', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getTheOpenPayload()
      .then((response) => {
        expect(response._id).toBe('MockId');
        expect(response.sync_status).toBe('MockSyncStatus');
        expect(response.sizeinbytes).toBe('MocksizeIn bytes');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getTheOpenPayload: Negative case when db.model.create sends error', (done) => {
    adp.mockBehaviour.findResult.docs = [];
    adp.mockBehaviour.create = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getTheOpenPayload()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBe('MockErroFromDbCreate');
        done();
      });
  });

  it('getTheOpenPayload: Negative case when db.model.find sends error', (done) => {
    adp.mockBehaviour.find = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getTheOpenPayload()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data).toBeDefined();
        done();
      });
  });

  it('getTheOpenPayload: Negative case when db.find sends empty docs ', (done) => {
    adp.mockBehaviour.findResult.docs = [];
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getTheOpenPayload()
      .then((response) => {
        expect(response._id).toBeDefined();
        expect(response.sync_status).toBeDefined();
        expect(response.sizeinbytes).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getTheOpenPayload: Negative case when db.find sends incorrect response', (done) => {
    adp.mockBehaviour.findResult.docs = [1, 2];
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getTheOpenPayload()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBe('Invalid result from database');
        expect(ERROR.data.result).toBeDefined();
        done();
      });
  });

  it('closePayloadAndGetANewOne: Successful case', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.closePayloadAndGetANewOne('MockPayloadID')
      .then((res) => {
        expect(res._id).toBeDefined();
        expect(res.sync_status).toBeDefined();
        expect(res.sizeinbytes).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('closePayloadAndGetANewOne: Negative case in adp.db.create fails', (done) => {
    adp.mockBehaviour.create = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.closePayloadAndGetANewOne('MockPayloadID')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('addToPayload: Successful case', (done) => {
    const ESDOCUMENT = {
      external_id: 'MockexternalId',
      title: 'MockTitle',
      type: 'MockType',
      document_date: '2018-03-30',
      url: 'MockUrl',
      text: 'Mocktext',
    };
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.addToPayload('MockPayloadID', ESDOCUMENT)
      .then((res) => {
        expect(res).toBe('MockOkUpdateMany');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('addToPayload: Negative case if updateMany sends error', (done) => {
    adp.mockBehaviour.updateMany = false;
    const ESDOCUMENT = {
      external_id: 'MockexternalId',
      title: 'MockTitle',
      type: 'MockType',
      document_date: '2018-03-30',
      url: 'MockUrl',
      text: 'Mocktext',
    };
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.addToPayload('MockPayloadID', ESDOCUMENT)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('closePayloadsToSend: Successful case', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.closePayloadsToSend()
      .then((res) => {
        expect(res).toBe('MockOkUpdateMany');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('closePayloadsToSend: Negative case when updatMany fails', (done) => {
    adp.mockBehaviour.updateMany = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.closePayloadsToSend()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('getPayload: Successful case', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getPayload('MockPayloadId')
      .then((res) => {
        expect(res._id).toBe('MockId');
        expect(res.sync_status).toBe('MockSyncStatus');
        expect(res.sizeinbytes).toBe('MocksizeIn bytes');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getPayload: Negative case when db.model.find sends incorrect data', (done) => {
    adp.mockBehaviour.findResult = {};
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getPayload('MockPayloadId')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Database response is unexpected');
        expect(ERROR.data.databaseResponse).toBeDefined();
        done();
      });
  });

  it('getPayload: Negative case when db.model.find sends error', (done) => {
    adp.mockBehaviour.find = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.getPayload('MockPayloadId')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('setEgsPayloadAsSync: Successful case', (done) => {
    const egsPayloadModel = new adp.models.EgsPayload('MockQueueObjective');
    egsPayloadModel.setEgsPayloadAsSync('MockPayloadId', 'MockStatus', 'MockMessage')
      .then((res) => {
        expect(res).toBe('MockOkUpdateMany');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('setEgsPayloadAsSync: Negative case when db.model.updateMany sends error', (done) => {
    adp.mockBehaviour.updateMany = false;
    const egsPayloadModel = new adp.models.EgsPayload('MockPayloadId', 'MockStatus', 'MockMessage');
    egsPayloadModel.setEgsPayloadAsSync('MockPayloadId')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });
});
