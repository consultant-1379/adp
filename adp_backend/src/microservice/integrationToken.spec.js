/**
 * [ global.adp.microservice.integrationToken ]
 * @author Cein [edaccei]
 */
describe('Testing if [ global.adp.microservice.integrationToken ] is ready to be used.', () => {
  let getByOwnerData;
  let getByOwnerFail;

  beforeEach(() => {
    getByOwnerData = { templateJSON: { data: [] } };
    getByOwnerFail = false;

    global.adp = {};

    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.echoLog = () => {};

    global.adp.microservices = {};
    global.adp.microservices.getByOwner = () => new Promise((resolve, reject) => {
      if (getByOwnerFail) {
        reject();
        return;
      }
      resolve(getByOwnerData);
    });

    global.adp.microservice = {};
    global.adp.microservice.integrationToken = require('./integrationToken'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should be loaded in memory & ready for use.', (done) => {
    expect(global.adp.microservice.integrationToken).toBeDefined();
    done();
  });

  it('should fail if the userId, userRole and microserviceId is not passed.', (done) => {
    global.adp.microservice.integrationToken().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should fail if the getByOwner promise fails.', (done) => {
    getByOwnerFail = true;

    global.adp.microservice.integrationToken('userId', 'userRole', 'msId').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it('should fail if the getByOwner returns a incorrectly formatted object.', (done) => {
    getByOwnerData = {};

    global.adp.microservice.integrationToken('userId', 'userRole', 'msId').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should fail if the getByOwner returns empty data.', (done) => {
    global.adp.microservice.integrationToken('userId', 'userRole', 'msId').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should fail if the getByOwner returns data that does not match the given msid.', (done) => {
    const testMSId = 'msId';
    getByOwnerData = { templateJSON: { data: [{ _id: testMSId, access_token: 'test' }] } };

    global.adp.microservice.integrationToken('userId', 'userRole', 'notMSId').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should fail if the getByOwner returns data that does match the given msid but has no access_token.', (done) => {
    const testMSId = 'msId';
    getByOwnerData = { templateJSON: { data: [{ _id: testMSId }] } };

    global.adp.microservice.integrationToken('userId', 'userRole', testMSId).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should return the match ms access_token.', (done) => {
    const testMSId = 'msId';
    const testToken = 'testToken';
    getByOwnerData = { templateJSON: { data: [{ _id: testMSId, access_token: testToken }] } };

    global.adp.microservice.integrationToken('userId', 'userRole', testMSId).then((result) => {
      expect(result.access_token).toBe(testToken);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });
});
