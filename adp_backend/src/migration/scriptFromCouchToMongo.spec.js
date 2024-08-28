// ============================================================================================= //
/**
* Unit test for [ adp.migration.scriptFromCouchToMongo ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
describe('Testing [ adp.migration.scriptFromCouchToMongo ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.process = {};
    adp.processExit = () => {};
    adp.echoLog = () => {};
    adp.MongoInsertOneAnswerCode = 1;
    adp.MongoInsertOneCrash = false;
    adp.MongoCreateCollectionCrash = false;
    adp.MongoCreateDropBehavior = 0;
    adp.MongoConnectionCrash = false;
    adp.MongoDisconnectionCrash = false;
    global.behavior = 0;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.fs = {};
    global.fs.existsSync = () => false;
    global.fs.mkdirSync = () => true;
    global.fs.openSync = () => true;
    global.fs.appendFileSync = () => true;
    global.fs.unlinkSync = () => true;
    global.jsonFormatter = {};
    global.jsonFormatter.format = STR => STR;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.dateFormat = require('./../library/dateFormat');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.config = {};
    adp.config.defaultDB = 'couchDB';
    adp.config.database = [
      { name: 'adp', appname: 'dataBase' },
      { name: 'adplog', appname: 'dataBaseLog' },
      { name: 'migrationscripts', appname: 'dataBaseMigrationScripts' },
    ];
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.db = {};
    adp.db.mockMongoData = require('./scriptFromCouchToMongo.spec.json');
    adp.db.find = db => new Promise(RESOLVE => RESOLVE({ docs: adp.db.mockMongoData[db] }));
    adp.db.Mongo = require('./scriptFromCouchToMongo.specClass');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.migration = {};
    adp.migration.scriptFromCouchToMongo = require('./scriptFromCouchToMongo');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case test, adplogs should not have reserve words and no punctuation in object keys. ', (done) => {
    const adpData = adp.db.mockMongoData.dataBase[0];

    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        if (Array.isArray(adp.mockMongo)) {
          const adpRes = adp.mockMongo[0].register[0];

          expect(adpRes._id).toBe(adpData._id);
          expect(adpRes._rev).not.toBeDefined();
          expect(adpRes.name).toBe(adpData.name);

          const adplogPunctSpaceRes = adp.mockMongo[1].register[0].info.Rules;

          expect(adplogPunctSpaceRes.removepunctuationandspaces).toBeTruthy();
          expect(adplogPunctSpaceRes['similar. key']).not.toBeDefined();
          expect(adplogPunctSpaceRes['. ,']).not.toBeDefined();
          expect(Object.keys(adplogPunctSpaceRes).length).toBe(4);

          const migrationCouchToMongoRes = adp.mockMongo[2].register[0];

          expect(migrationCouchToMongoRes.runOnce).toBeTruthy();
          expect(migrationCouchToMongoRes.lastRun).toBeDefined();
          done();
        } else {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ defaultDB ] is not CouchDB, should resolve without execution', (done) => {
    adp.config.defaultDB = 'notCouchDB';
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If ./src/mongoLock/lock.json file exists, should resolve without execution', (done) => {
    global.fs.existsSync = () => true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If ./src/mongoLock/lock.json file exists in the end of execution, should rewrite it', (done) => {
    let counter = -1;
    global.fs.existsSync = () => {
      counter += 1;
      switch (counter) {
        case 1:
          return true;
        case 2:
          return true;
        default:
          return false;
      }
    };
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If Mongo returns an invalid anwser after tried to insertOne register, should reject', (done) => {
    adp.MongoInsertOneAnswerCode = 0;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Mongo crashes when tried to insertOne register, should reject', (done) => {
    adp.MongoInsertOneCrash = true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If CouchDB returns an invalid anwser after tried to find a register, should reject', (done) => {
    adp.db.find = () => new Promise((RESOLVE) => {
      RESOLVE({});
    });
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If CouchDB crashes when tried to find a register, should reject', (done) => {
    adp.db.find = () => new Promise((RESOLVE, REJECT) => {
      REJECT();
    });
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Mongo crashes when tried to create a collection, should reject', (done) => {
    adp.MongoCreateCollectionCrash = true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Mongo crashes when tried to drop a collection because doesn`t exist, should continue anyway', (done) => {
    adp.MongoCreateDropBehavior = 1;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If Mongo crashes when tried to drop a collection because unknow reasons, should reject', (done) => {
    adp.MongoCreateDropBehavior = 2;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Collection doesn`t exist and create collection fails, should reject', (done) => {
    adp.MongoCreateDropBehavior = 1;
    adp.MongoCreateCollectionCrash = true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Mongo connection crashes, should reject', (done) => {
    adp.MongoConnectionCrash = true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If Mongo disconnection crashes, should ignore and resolve', (done) => {
    adp.MongoDisconnectionCrash = true;
    adp.migration.scriptFromCouchToMongo()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
