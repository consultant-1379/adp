/**
* Unit test for [ global.adp.login.unbindClient ]
* @author Cein-Sven Da Costa [edaccei]
*/
describe('Testing [ global.adp.login.unbindClient ].', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.auditlog = {};
    global.adp.auditlog.create = () => new Promise(resolve => resolve());

    global.adp.login = {};
    global.adp.login.unbindClient = require('./unbindClient');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should reject unbinding a client throws an error that is not a callback', (done) => {
    const errorMsg = 'testError';
    const client = {
      connected: true,
      unbind: () => {
        throw new Error(errorMsg);
      },
    };

    global.adp.login.unbindClient(client, 'msg').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(`${error}`).toContain(errorMsg);
      done();
    });
  });

  it('Should reject if the Client.connected is still true after trying to unbind', (done) => {
    const client = {
      connected: true,
      unbind: callback => callback(false),
    };

    global.adp.login.unbindClient(client, 'msg').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('Should resolve true if the Client.connected is closed(false)', (done) => {
    class TestClient {
      constructor() {
        this.connected = true;
      }

      unbind(callback) {
        this.connected = false;
        return callback(null);
      }
    }
    const client = new TestClient();

    global.adp.login.unbindClient(client, 'msg').then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should reject if the client unbind callback returns an error.', (done) => {
    const callbackError = 'testError';
    const client = {
      connected: true,
      unbind: callback => callback(callbackError),
    };

    global.adp.login.unbindClient(client, 'msg').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBe(callbackError);
      done();
    });
  });

  it('Should resolve true if the given CLIENT.connected is false', (done) => {
    const client = { connected: false };
    global.adp.login.unbindClient(client, 'msg').then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should reject if the given CLIENT is undefined', (done) => {
    global.adp.login.unbindClient().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });
});
