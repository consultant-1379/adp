const proxyquire = require('proxyquire');
/**
* Unit test for [ adp.models.MasterQueue ]
* @author Tirth Pipalia [zpiptir]
*/

class MockMongoObjectId {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return `${this.id}`;
  }
}

describe('Testing [ adp.models.MasterQueue ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.config = {};
    adp.check = {};
    global.adp.dynamicSort = require('../library/dynamicSort');
    global.adp.echoLog = () => {};
    adp.MongoObjectID = MockMongoObjectId;

    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };

    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = (COLLECTION) => {
      adp.check.createIndexCollection = COLLECTION;
      return {
        createIndex() {
          return true;
        },
      };
    };

    adp.slugIt = SOMETHING => SOMETHING;

    adp.queue = {};
    adp.queue.obtainObjectiveLink = () => 'https://mockLink/V2.0_mockID';

    adp.models = {};
    adp.models.MasterQueue = proxyquire('./MasterQueue', {
      './../library/errorLog': (code, desc, data, origin, packName) => ({
        code,
        desc,
        data,
        origin,
        packName,
      }),
    });
  });


  afterEach(() => {
    global.adp = null;
  });

  it('Successful case for add()', (done) => {
    adp.db.create = () => {
      const result = { ok: true, id: 'mockid' };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.add('mockMission', 'mockTarget', 'mockCommand', [1])
      .then((response) => {
        expect(response.status).toBeTruthy();
        expect(response.queue).toEqual('mockid');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Successful case for add() with objective and index', (done) => {
    adp.db.create = () => {
      const result = { ok: true, id: 'mockid' };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.add('mockMission', 'mockTarget', 'mockCommand', [1], 'mockObjective', 1)
      .then((response) => {
        expect(response.status).toBeTruthy();
        expect(response.queue).toEqual('mockid');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful error handling for add() when db.create returns false', (done) => {
    adp.db.create = () => {
      const result = { ok: false, id: 'mockid' };
      return Promise.resolve(result);
    };

    const adpModel = new adp.models.MasterQueue();
    adpModel.add('mockMission', 'mockTarget', 'mockedCommand', [1])
      .then((response) => {
        expect(response.status).toBeFalsy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for add() when db.create throws error', (done) => {
    adp.db.create = () => {
      const error = {};
      return Promise.reject(error);
    };

    const adpModel = new adp.models.MasterQueue();
    adpModel.add('mockMission', 'mockTarget', 'mockedCommand', [1])
      .then((response) => {
        expect(response.code).toEqual(500);
        expect(response.desc).toEqual('Error on [ adp.db.create ] at adp.models.MasterQueue.add()');
        expect(response.origin).toEqual('add');
        expect(response.packName).toEqual('adp.models.MasterQueue');
        expect(response.data.collection).toEqual('masterQueue');
        expect(response.data.queueItem).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Successfull case for done()', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [{ started: new Date() }] };
      return Promise.resolve(result);
    };
    adp.db.update = () => {
      const result = { ok: true };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.done('mockID', 200, {})
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successfull error handling for done() when adp.db.find returns invalid answer', (done) => {
    global.adp.db.find = () => Promise.resolve({});
    const adpModel = new adp.models.MasterQueue();
    adpModel.done('mockID', 200, {})
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successfull error handling for done() when db.update returns ok:false', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [{ started: new Date() }] };
      return Promise.resolve(result);
    };
    adp.db.update = () => {
      const result = { ok: false };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.done('mockID', 200, {})
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successfull error handling for done() when db.update returns error', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [{ started: new Date() }] };
      return Promise.resolve(result);
    };
    const error = {};
    adp.db.update = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.done('mockID', 200, {})
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successfull error handling for done() when db.find returns error', (done) => {
    const error = {};
    global.adp.db.find = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.done('mockID', 200, {})
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for already() where combination of mission, target and objective is present in queue', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [{}] };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.already('mission', 'target', 'objective')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for already() where combination of mission, target and objective is not present in queue', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [] };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.already('mission', 'target', 'objective')
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for already() when adp.db.find throws error ', (done) => {
    const error = {};
    global.adp.db.find = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.already('mission', 'target', 'objective')
      .then((response) => {
        expect(response.code).toEqual(500);
        expect(response.desc).toEqual('Error on [ adp.db.find ] at adp.models.MasterQueue.already()');
        expect(response.data.collection).toEqual('masterQueue');
        expect(response.data.mongoQuery).toBeDefined();
        expect(response.data.mongoOptions).toBeDefined();
        expect(response.data.error).toEqual({});
        expect(response.origin).toEqual('already');
        expect(response.packName).toEqual('adp.models.MasterQueue');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for duplicates()', (done) => {
    global.adp.db.updateMany = () => {
      const result = { ok: true, modifiedCount: 3 };
      return Promise.resolve(result);
    };
    const JOB = { _id: 'mockedId', command: 'mockedCommand', params: 'mockedParams' };
    const adpModel = new adp.models.MasterQueue();
    adpModel.duplicates(JOB)
      .then((response) => {
        expect(response).toEqual(3);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for duplicates(), with Objective Group ID', (done) => {
    global.adp.db.updateMany = () => {
      const result = { ok: true, modifiedCount: 3 };
      return Promise.resolve(result);
    };
    const JOB = {
      _id: 'mockedId',
      command: 'mockedCommand',
      params: 'mockedParams',
      objective: 'mockObjective',
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.duplicates(JOB)
      .then((response) => {
        expect(response).toEqual(3);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Successful error handling case for duplicates() when db.updateMany() returns invalide answer', (done) => {
    global.adp.db.updateMany = () => {
      const error = {};
      return Promise.resolve(error);
    };
    const JOB = { _id: 'mockedId', command: 'mockedCommand', params: 'mockedParams' };
    const adpModel = new adp.models.MasterQueue();
    adpModel.duplicates(JOB)
      .then((response) => {
        expect(response.code).toEqual(500);
        expect(response.desc).toEqual('Invalid answer from db.updateMany ( RESULT.ok === true is expected )');
        expect(response.data.collection).toEqual('masterQueue');
        expect(response.data.mongoFilter).toBeDefined();
        expect(response.data.updateObject).toBeDefined();
        expect(response.data.error).toEqual({});
        expect(response.origin).toEqual('duplicates');
        expect(response.packName).toEqual('adp.models.MasterQueue');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling case for duplicates() when db.updateMany() throws error', (done) => {
    const error = {};
    global.adp.db.updateMany = () => Promise.reject(error);
    const JOB = { _id: 'mockedId', command: 'mockedCommand', params: 'mockedParams' };
    const adpModel = new adp.models.MasterQueue();
    adpModel.duplicates(JOB)
      .then((response) => {
        expect(response.code).toEqual(500);
        expect(response.desc).toEqual('Error on [ adp.db.updateMany ] at adp.models.MasterQueue.ducplicates()');
        expect(response.data.collection).toEqual('masterQueue');
        expect(response.data.mongoFilter).toBeDefined();
        expect(response.data.updateObject).toBeDefined();
        expect(response.data.error).toEqual({});
        expect(response.origin).toEqual('duplicates');
        expect(response.packName).toEqual('adp.models.MasterQueue');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for oldestItemInQueue()', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: '2022-08-09T14:20:12.067Z',
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.oldestItemInQueue()
      .then((RESULT) => {
        expect(RESULT).toBeGreaterThan(1);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Case when adp.db.find() sends invalid result for oldestItemInQueue()', (done) => {
    global.adp.db.find = () => {
      const result = { Mockederror: 'MockedErrorResult' };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.oldestItemInQueue()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.message).toBe('Invalid answer from Database');
        expect(ERROR.error.error.Mockederror).toBe('MockedErrorResult');
        done();
      });
  });

  it('Case when adp.db.find() sends 0 result for oldestItemInQueue()', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.oldestItemInQueue()
      .then((RESULT) => {
        expect(RESULT).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Case when oldestItemInQueue() throws an error', (done) => {
    global.adp.db.find = () => {
      const ERROR = 'MockedErrors';
      return Promise.reject(ERROR);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.oldestItemInQueue()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.message).toBe('Invalid answer from Database');
        expect(ERROR.error).toBe('MockedErrors');
        done();
      });
  });

  it('Successful case for status() when JOB is Waiting', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response.job).toBeDefined();
        expect(response.job.id).toEqual('mockedId');
        expect(response.job.status).toEqual(0);
        expect(response.job.statusDescription).toEqual('Waiting...');
        expect(response.job.queue.added).toBeDefined();
        expect(response.job.queue.waited).toBeDefined();
        expect(response.job.queue.started).toBeDefined();
        expect(response.job.queue.duration).toBeDefined();
        expect(response.job.queue.ended).toBeDefined();
        expect(response.job.result).toEqual('data');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for status() when JOB is Running...', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 1,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response.job).toBeDefined();
        expect(response.job.id).toEqual('mockedId');
        expect(response.job.status).toEqual(1);
        expect(response.job.statusDescription).toEqual('Running...');
        expect(response.job.queue.added).toBeDefined();
        expect(response.job.queue.waited).toBeDefined();
        expect(response.job.queue.started).toBeDefined();
        expect(response.job.queue.duration).toBeDefined();
        expect(response.job.queue.ended).toBeDefined();
        expect(response.job.result).toEqual('data');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for status() when JOB is Duplicated', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 2,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response.job).toBeDefined();
        expect(response.job.id).toEqual('mockedId');
        expect(response.job.status).toEqual(2);
        expect(response.job.statusDescription).toEqual('Duplicated, ignored. See message to more details.');
        expect(response.job.queue.added).toBeDefined();
        expect(response.job.queue.waited).toBeDefined();
        expect(response.job.queue.started).toBeDefined();
        expect(response.job.queue.duration).toBeDefined();
        expect(response.job.queue.ended).toBeDefined();
        expect(response.job.result).toEqual('data');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for status() when JOB is Crashed', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 3,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response.job).toBeDefined();
        expect(response.job.id).toEqual('mockedId');
        expect(response.job.status).toEqual(3);
        expect(response.job.statusDescription).toEqual('Process crashed. Ignored because reached the maximum number of allowed attempts.');
        expect(response.job.queue.added).toBeDefined();
        expect(response.job.queue.waited).toBeDefined();
        expect(response.job.queue.started).toBeDefined();
        expect(response.job.queue.duration).toBeDefined();
        expect(response.job.queue.ended).toBeDefined();
        expect(response.job.result).toEqual('data');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for status() when queueStatusCodeToString = -1', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: -1,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response.job).toBeDefined();
        expect(response.job.id).toEqual('mockedId');
        expect(response.job.status).toEqual(-1);
        expect(response.job.statusDescription).toEqual('Server Status Code: -1');
        expect(response.job.queue.added).toBeDefined();
        expect(response.job.queue.waited).toBeDefined();
        expect(response.job.queue.started).toBeDefined();
        expect(response.job.queue.duration).toBeDefined();
        expect(response.job.queue.ended).toBeDefined();
        expect(response.job.result).toEqual('data');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for status() when result.docs.lenght === 0', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [] };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then((response) => {
        expect(response).toEqual('mockedId was not found');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for status() when db.find throws error', (done) => {
    const resp = {};
    global.adp.db.find = () => Promise.reject(resp);
    const adpModel = new adp.models.MasterQueue();
    adpModel.status('mockedId')
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.desc).toEqual('Error on [ adp.db.find ] at adp.models.MasterQueue.status()');
        expect(error.data.collection).toEqual('masterQueue');
        expect(error.data.mongoOptions.limit).toEqual(1);
        expect(error.data.mongoOptions.skip).toEqual(0);
        expect(error.origin).toEqual('status');
        expect(error.packName).toEqual('adp.models.MasterQueue');
        done();
      });
  });

  it('Successful case for running() when docs.length === 1', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [{}] };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.running()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for running() when docs.length != 1', (done) => {
    global.adp.db.find = () => {
      const result = { docs: [] };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.running()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for running() when db.find throws error', (done) => {
    const error = {};
    global.adp.db.find = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.running()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Successful case for next() when queue is not empty', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 0,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => {
      const result = { ok: true };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response.status).toEqual(1);
        expect(response.added).toBeDefined();
        expect(response.started).toBeDefined();
        expect(response.waited).toBeDefined();
        expect(response.duration).toBeDefined();
        expect(response.ended).toBeDefined();
        expect(response.attempts).toEqual(1);
        expect(response.data.message).toEqual('Status 1: Running...');
        expect(response.data.desc).toEqual('This Job is being executed right now...');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for next() when queue is empty', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => {
      const result = { ok: true };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for next() when db.update returns invalid response', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 0,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => {
      const result = {};
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for next() when db.update throws error', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 0,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const error = {};
    global.adp.db.update = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for next() when db.find throws error', (done) => {
    const error = {};
    global.adp.db.find = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for next() when db.find returns invalid response', (done) => {
    global.adp.db.find = () => Promise.resolve({});
    const adpModel = new adp.models.MasterQueue();
    adpModel.next()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Case for retake() when attempts less than 3', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 1,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 1,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => {
      const result = { ok: true };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response.status).toEqual(1);
        expect(response.added).toBeDefined();
        expect(response.started).toBeDefined();
        expect(response.waited).toBeDefined();
        expect(response.duration).toBeDefined();
        expect(response.ended).toBeDefined();
        expect(response.attempts).toEqual(2);
        expect(response.data.message).toEqual('Status 1: Running again...');
        expect(response.data.desc).toEqual('Unable to finish this job on a previous try. Trying again right now.');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Case for retake() when attempts = 3', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 3,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => {
      const result = { ok: true };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Case for retake() when queue is empty', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for retake() when db.find returns invalid response', (done) => {
    global.adp.db.find = () => Promise.resolve({});
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for retake() when db.find throws error', (done) => {
    const error = {};
    global.adp.db.find = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for retake() when db.update returns invalid response', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 3,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    global.adp.db.update = () => Promise.resolve({});
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for retake() when db.update throws error', (done) => {
    global.adp.db.find = () => {
      const result = {
        docs: [{
          status: 0,
          added: new Date(),
          started: new Date(),
          waited: new Date(),
          duration: new Date(),
          ended: new Date(),
          attempts: 3,
          data: 'data',
        }],
      };
      return Promise.resolve(result);
    };
    const error = {};
    global.adp.db.update = () => Promise.reject(error);
    const adpModel = new adp.models.MasterQueue();
    adpModel.retake()
      .then((response) => {
        expect(response).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Successful case for addMany()', (done) => {
    adp.db.createMany = () => {
      const result = { ok: true, id: 'mockid' };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.addMany('mockMission', 'mockTarget', 'mockObjective', [{ cmd: 1 }, { cmd: 2 }])
      .then((response) => {
        expect(response.status).toBeTruthy();
        expect(response.queue).toEqual('mockObjective');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Error case for addMany(): Array Parameter is not an Array', (done) => {
    adp.db.createMany = () => {
      const result = { ok: true, id: 'mockid' };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.addMany('mockMission', 'mockTarget', 'mockObjective', {})
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('[ addMany() ] if [ adp.db.createMany ] returns an empty object result', (done) => {
    adp.db.createMany = () => {
      const result = {};
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.addMany('mockMission', 'mockTarget', 'mockObjective', [{ cmd: 1 }, { cmd: 2 }])
      .then((response) => {
        expect(response.status).toEqual(false);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('[ addMany() ] if [ adp.db.createMany ] crashes', (done) => {
    adp.db.createMany = () => {
      const result = { mockError: true };
      return Promise.reject(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.addMany('mockMission', 'mockTarget', 'mockObjective', [{ cmd: 1 }, { cmd: 2 }])
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Successfull case for documentSyncStatus()', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        docs: [{
          _id: 'auto-ms-with-mock-artifactory-doc-1__1664964343534',
          mission: 'documentRefresh',
          msId: 'mockID1',
          firstStatus: 0,
          lastStatus: 0,
          added: '2022-10-20T13:53:56.883Z',
          status: [0],
          started: 0,
          ended: 0,
        },
        {
          _id: 'auto-ms-with-mock-artifactory-doc-1__1664965295886',
          mission: 'documentRefresh',
          msId: '4befcc82eebf81c3e1b5242b49001084',
          firstStatus: 200,
          lastStatus: 200,
          status: [200],
          added: '2022-10-20T13:53:56.883Z',
          started: '2022-10-20T10:21:37.415Z',
          ended: '2022-10-20T10:21:37.493Z',
        }, {
          _id: 'auto-ms-with-mock-artifactory-doc-1__1664965295887',
          mission: 'documentRefresh',
          msId: '4befcc82eebf81c3e1b5242b49001084',
          firstStatus: 100,
          lastStatus: 0,
          status: [0],
          added: '2022-10-20T13:53:56.883Z',
          started: '2022-10-20T10:21:37.415Z',
          ended: '2022-10-20T10:21:37.493Z',
        }, {
          _id: 'auto-ms-with-mock-artifactory-doc-1__1664965295888',
          mission: 'documentRefresh',
          msId: '4befcc82eebf81c3e1b5242b49001084',
          status: [500],
          lastStatus: 500,
          added: '2022-10-20T13:53:56.883Z',
          started: '2022-10-20T10:21:37.415Z',
          ended: '2022-10-20T10:21:37.493Z',
        },
        ],
      };
      return Promise.resolve(result);
    };
    const masterQueue = new adp.models.MasterQueue();
    const msIDS = [{ id: 'mockID1', name: 'mockID1' },
      { id: '45e7f4f992afe7bbb62a3391e5019b57', name: 'Auto MS test 5' }];
    masterQueue.documentSyncStatus(msIDS)
      .then((RESULT) => {
        expect(RESULT.length).toBe(4);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('When documentSyncStatus() fails', (done) => {
    global.adp.db.aggregate = () => {
      const error = {
        code: 500,
        message: 'Mocked generated error',
      };
      return Promise.reject(error);
    };
    const MICROSERVICES = [];
    const masterQueue = new adp.models.MasterQueue();
    masterQueue.documentSyncStatus(MICROSERVICES)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.message).toBe('Mocked generated error');
        done();
      });
  });

  it('Successfull case for documentSyncStatusDetails()', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        docs: [
          {
            _id: 'auto-ms-with-mock-artifactory-doc-1__1664965295886',
            mission: 'documentRefresh',
            msId: '4befcc82eebf81c3e1b5242b49001084',
            firstStatus: 200,
            lastStatus: 200,
            status: [200],
            added: '2022-10-20T13:53:56.883Z',
            started: '2022-10-20T10:21:37.415Z',
            ended: '2022-10-20T10:21:37.493Z',
            payload: '',
          },
        ],
      };
      return Promise.resolve(result);
    };
    const masterQueue = new adp.models.MasterQueue();
    const objective = 'auto-ms-with-mock-artifactory-doc-1__1664965295886';
    masterQueue.documentSyncStatusDetails(objective)
      .then((RESULT) => {
        expect(RESULT.length).toBe(1);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('When documentSyncStatusDetails() fails', (done) => {
    global.adp.db.aggregate = () => {
      const error = {
        code: 500,
        message: 'Mocked generated error',
      };
      return Promise.reject(error);
    };
    const OBJECTIVE = '';
    const masterQueue = new adp.models.MasterQueue();
    masterQueue.documentSyncStatusDetails(OBJECTIVE)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Mocked generated error');
        done();
      });
  });

  it('Successful case for countItemsInQueue()', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        docs: [{
          count: 9,
        }],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.countItemsInQueue()
      .then((RESULT) => {
        expect(RESULT).toBe(9);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case for countItemsInQueue() when no docs are found', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        docs: [],
      };
      return Promise.resolve(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.countItemsInQueue()
      .then((RESULT) => {
        expect(RESULT).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful error handling for countItemsInQueue() when adp.db.aggregate sends invalid response', (done) => {
    global.adp.db.aggregate = () => Promise.resolve({ Mockederror: 'MockedInvalidError' });
    const adpModel = new adp.models.MasterQueue();
    adpModel.countItemsInQueue()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.message).toBe('Invalid answer from Database');
        expect(ERROR.error.error.Mockederror).toBe('MockedInvalidError');
        done();
      });
  });


  it('[ group ] in a successful case', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        totalCount: [{ total: 100 }],
        waitingCount: [{ total: 25 }],
      };
      return Promise.resolve({ docs: [result] });
    };
    const JOB = {
      _id: 'mockedId',
      command: 'mockedCommand',
      params: 'mockedParams',
      objective: 'mockObjective',
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.group(JOB)
      .then((response) => {
        expect(response.objective).toEqual('mockObjective');
        expect(response.total).toEqual(99);
        expect(response.totalWaiting).toEqual(25);
        expect(response.running).toEqual(74);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ group ] if the returns is empty', (done) => {
    global.adp.db.aggregate = () => {
      const result = {};
      return Promise.resolve({ docs: [result] });
    };
    const JOB = {
      _id: 'mockedId',
      command: 'mockedCommand',
      params: 'mockedParams',
      objective: 'mockObjective',
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.group(JOB)
      .then((response) => {
        expect(response).toEqual({ error: 'Not Available' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ group ] if there is no objective', (done) => {
    global.adp.db.aggregate = () => {
      const result = {
        totalCount: [{ total: 100 }],
        waitingCount: [{ total: 25 }],
      };
      return Promise.resolve({ docs: [result] });
    };
    const JOB = {
      _id: 'mockedId',
      command: 'mockedCommand',
      params: 'mockedParams',
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.group(JOB)
      .then((response) => {
        expect(response).toEqual(false);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ group ] if [ adp.db.aggregate ] crashes', (done) => {
    global.adp.db.aggregate = () => {
      const result = { mockError: true };
      return Promise.reject(result);
    };
    const JOB = {
      _id: 'mockedId',
      command: 'mockedCommand',
      params: 'mockedParams',
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.group(JOB)
      .then((response) => {
        expect(response).toEqual(false);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getPayload ] in a successful case', (done) => {
    global.adp.db.find = () => {
      const result = {
        payload: { mockPayload: true },
      };
      return Promise.resolve({ docs: [result] });
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.getPayload('mockObjective')
      .then((response) => {
        expect(response).toEqual({ mockPayload: true });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getPayload ] if get a empty payload', (done) => {
    global.adp.db.find = () => {
      const result = {};
      return Promise.resolve({ docs: [result] });
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.getPayload('mockObjective')
      .then((response) => {
        expect(response).toEqual();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getPayload ] if [ adp.db.find ] crashes', (done) => {
    global.adp.db.find = () => {
      const result = { mockError: true };
      return Promise.reject(result);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.getPayload('mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.origin).toEqual('getPayload');
        expect(error.packName).toEqual('adp.models.MasterQueue');
        done();
      });
  });


  it('[ setPayload ] in a successful case', (done) => {
    global.adp.db.updateMany = () => {
      const mockResult = { ok: true, matchedCount: 1 };
      return Promise.resolve(mockResult);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.setPayload('mockObjective', { mockPayload: true, index: 0 })
      .then((response) => {
        expect(response).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ setPayload ] if [ adp.db.updateMany ] crashes', (done) => {
    global.adp.db.updateMany = () => {
      const mockError = { error: true };
      return Promise.reject(mockError);
    };
    const adpModel = new adp.models.MasterQueue();
    adpModel.setPayload('mockObjective', { mockPayload: true })
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.origin).toEqual('setPayload');
        expect(error.packName).toEqual('adp.models.MasterQueue');
        done();
      });
  });
});
