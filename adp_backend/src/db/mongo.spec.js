// ============================================================================================= //
/**
* Unit test for [ global.adp.db.Mongo ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
describe('Testing [ global.adp.db.Mongo ] ', () => {
  let errConnect = false;
  let errDisconnect = false;
  let errCreateColl = null;
  const mockMongoClient = {
    createCollection(collName, callback) {
      callback(errCreateColl, {});
      return this.role;
    },
    collection(collName) {
      return collName;
    },
    serverConfig: {
      isConnected() {
        return true;
      },
    },
  };

  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => true;
    global.adp.config = {};
    global.adp.config.mongodb = 'mongodb://user@password:10.0.0.0:27017';
    global.adp.config.database = [
      { name: 'adp', appname: 'dataBase' },
    ];
    global.adp.db = {};
    global.adp.db.Mongo = require('./Mongo');
    global.adp.db.mongo = new global.adp.db.Mongo();
    global.adp.db.mongo.client = {};
    global.adp.db.mongo.client.db = () => mockMongoClient;
    global.adp.db.mongo.client.close = (callback) => {
      const resp = !!errDisconnect;
      callback(resp);
    };
    global.adp.db.mongo.client.connect = (callback) => {
      const resp = !!errConnect;
      callback(resp);
    };

    errConnect = false;
    errDisconnect = false;
    errCreateColl = null;
  });

  afterAll(() => {
    global.adp = null;
  });

  it('should create an instance of class.', (done) => {
    expect(global.adp.db.mongo).toBeDefined();
    done();
  });


  it('createCollections: Checking behavior if "collObj.name" is invalid.', (done) => {
    const name = 'testDatabase';
    const invalidCollection = [{ something: 'wrong' }];
    global.adp.db.mongo.createCollections(name, invalidCollection)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('adpPortalDBInit: Should check for the adpPortal database and related collections.', (done) => {
    global.adp.db.mongo.adpPortalDBInit().then(() => {
      expect(true).toBeTruthy();
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done.fail();
      });
  });

  it('adpPortalDBInit: Should check for the adpPortal database in case collection already exists.', (done) => {
    errCreateColl = {
      codeName: 'NamespaceExists',
    };
    global.adp.db.mongo.adpPortalDBInit().then(() => {
      expect(true).toBeTruthy();
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done.fail();
      });
  });

  it('adpPortalDBInit: Should fail to check for the adpPortal database in case error in createcollection.', (done) => {
    errCreateColl = {
      codeName: 'NoNamespaceExists',
    };
    global.adp.db.mongo.adpPortalDBInit().then(() => {
      expect(true).toBeFalsy();
      done.fail();
    })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('adpPortalDBInit: Should fail to check for the adpPortal database in case missing db list from config file.', (done) => {
    global.adp.config.database = null;
    global.adp.db.mongo.adpPortalDBInit().then(() => {
      expect(true).toBeFalsy();
      done.fail();
    })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('disconnect: Should disconnect mongodb adpPortal database.', (done) => {
    global.adp.db.mongo.disconnect().then(() => {
      expect(true).toBeTruthy();
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done.fail();
      });
  });

  it('disconnect: Should fail to disconnect mongodb adpPortal database due to some error.', (done) => {
    errDisconnect = true;
    global.adp.db.mongo.disconnect().then(() => {
      expect(true).toBeFalsy();
      done.fail();
    })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('disconnect: Should fail to disconnect mongodb adpPortal database if this.client is invalid.', (done) => {
    global.adp.db.mongo.client = null;
    global.adp.db.mongo.disconnect().then(() => {
      done.fail();
    })
      .catch(() => {
        done();
      });
  });

  it('connect: Should disconnect mongodb adpPortal database.', (done) => {
    global.adp.db.mongo.connect().then(() => {
      expect(true).toBeTruthy();
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done.fail();
      });
  });

  it('connect: Should fail to disconnect mongodb adpPortal database due to some error.', (done) => {
    errConnect = true;
    global.adp.db.mongo.connect().then(() => {
      expect(true).toBeFalsy();
      done.fail();
    })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('checkConnection: Should check connection of mongodb adpPortal database.', (done) => {
    expect(global.adp.db.mongo.checkConnection()).toBeTruthy();
    done();
  });

  it('checkConnection: Should return false if failed to check connection of mongodb adpPortal database.', (done) => {
    global.adp.db.mongo.client.db = () => null;

    expect(global.adp.db.mongo.checkConnection()).toBeFalsy();
    done();
  });

  it('checkConnection: Should return false if this.client is invalid.', (done) => {
    global.adp.db.mongo.client = null;

    expect(global.adp.db.mongo.checkConnection()).toBeFalsy();
    done();
  });
});
// ============================================================================================= //
