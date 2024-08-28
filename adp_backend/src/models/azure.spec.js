/**
* Unit test for [ adp.models.azure ]
* @author Cein [edaccei]
*/

describe('Testing [ adp.models.azure ], ', () => {
  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.config = {};
    adp.config.azure = {
      grant_type: '',
      client_id: '',
      client_secret: '',
      resource: '',
    };

    global.request = (options, callback) => callback(null, {}, {});

    adp.models = {};
    adp.models.azure = require('./azure');
    adp.models.azure.clearToken();
  });

  afterEach(() => {
    adp = null;
  });

  it('connect: Should return a token object and track the new token.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testTokenObj),
    );

    const { azure } = adp.models;

    expect(azure.expiresMs).toBe(0);
    expect(azure.tokenSetTime).toBe(0);
    expect(azure._tokenObj).toEqual({});

    azure.connect().then((response) => {
      expect(response.access_token).toBe(testTokenObj.access_token);
      expect(response.expires_in).toBe(testTokenObj.expires_in);
      expect(azure.expiresMs).toBeGreaterThan(0);
      expect(azure.tokenSetTime).toBeGreaterThan(0);
      expect(azure._tokenObj.access_token).toBeDefined();
      expect(azure._tokenObj.expires_in).toBeDefined();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('connect: Should reject if the callback contains an error, token tracking must be cleared.', (done) => {
    global.request = (options, callback) => callback('Error', {}, {});

    const { azure } = adp.models;

    azure.connect().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('connect: Should reject if the access_token is not in the object.', (done) => {
    global.request = (options, callback) => callback(null, { statusCode: 200 }, JSON.stringify({}));

    const { azure } = adp.models;
    azure.expiresMs = 1000;
    azure.tokenSetTime = 1000;

    azure.connect().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      expect(azure.expiresMs).toBe(0);
      expect(azure.tokenSetTime).toBe(0);
      expect(azure._tokenObj.access_token).not.toBeDefined();
      done();
    });
  });

  it('connect: Should reject if there is no error response but the statusCode is not 200.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    global.request = (options, callback) => callback(
      null, { statusCode: 500 }, JSON.stringify(testTokenObj),
    );

    const { azure } = adp.models;
    azure.expiresMs = 1000;
    azure.tokenSetTime = 1000;
    azure._tokenObj = { access_token: 'test' };

    azure.connect().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      expect(azure.expiresMs).toBe(0);
      expect(azure.tokenSetTime).toBe(0);
      expect(azure._tokenObj.access_token).not.toBeDefined();
      done();
    });
  });

  it('connect: Should reject if there is not error response but the body is not of type json.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, testTokenObj,
    );

    const { azure } = adp.models;
    azure.expiresMs = 1000;
    azure.tokenSetTime = 1000;
    azure._tokenObj = { access_token: 'test' };

    azure.connect().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      expect(azure.expiresMs).toBe(0);
      expect(azure.tokenSetTime).toBe(0);
      expect(azure._tokenObj.access_token).not.toBeDefined();
      done();
    });
  });

  it('tokenObj: Should return a new token if an existing token does not exist, then retrieve the token again without creating a new one.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    const testTokenObj2 = {
      access_token: 'token2',
      expires_in: 3500,
    };

    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testTokenObj),
    );

    const { azure } = adp.models;

    azure.tokenObj().then((resp1) => {
      expect(resp1.access_token).toBe(testTokenObj.access_token);
      expect(resp1.expires_in).toBe(testTokenObj.expires_in);
      expect(azure.expiresMs).toBeGreaterThan(0);
      expect(azure.tokenSetTime).toBeGreaterThan(0);
      expect(azure._tokenObj.access_token).toBeDefined();
      expect(azure._tokenObj.expires_in).toBeDefined();

      global.request = (options, callback) => callback(null, {}, JSON.stringify(testTokenObj2));

      azure.tokenObj().then(() => {
        expect(resp1.access_token).toBe(testTokenObj.access_token);
        expect(resp1.expires_in).toBe(testTokenObj.expires_in);
        expect(azure.expiresMs).toBeGreaterThan(0);
        expect(azure.tokenSetTime).toBeGreaterThan(0);
        expect(azure._tokenObj.access_token).toBeDefined();
        expect(azure._tokenObj.expires_in).toBeDefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('tokenObj: Should return a new token if an existing token does not exist, then creating token due to token expiration.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 200,
    };
    const testTokenObj2 = {
      access_token: 'token2',
      expires_in: 1000,
    };

    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testTokenObj),
    );

    const { azure } = adp.models;

    azure.tokenObj().then((resp1) => {
      expect(resp1.access_token).toBe(testTokenObj.access_token);
      expect(resp1.expires_in).toBe(testTokenObj.expires_in);
      expect(azure.expiresMs).toBe(0);
      expect(azure.tokenSetTime).toBeGreaterThan(0);
      expect(azure._tokenObj.access_token).toBeDefined();
      expect(azure._tokenObj.expires_in).toBeDefined();

      global.request = (options, callback) => callback(
        null, { statusCode: 200 }, JSON.stringify(testTokenObj2),
      );

      azure.tokenObj().then((resp2) => {
        expect(resp2.access_token).toBe(testTokenObj2.access_token);
        expect(resp2.expires_in).toBe(testTokenObj2.expires_in);
        expect(azure.expiresMs).toBeGreaterThan(0);
        expect(azure.tokenSetTime).toBeGreaterThan(0);
        expect(azure._tokenObj.access_token).toBeDefined();
        expect(azure._tokenObj.expires_in).toBeDefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('tokenObj: Should reject if the new token has no access_token field.', (done) => {
    const testTokenObj = {
      expires_in: 200,
    };

    global.request = (options, callback) => callback(null, {}, JSON.stringify(testTokenObj));

    const { azure } = adp.models;

    azure.tokenObj().then(() => {
      expect(false).toBeTruthy();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('token: Should return a new token.', (done) => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };

    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testTokenObj),
    );

    const { azure } = adp.models;

    azure.token().then((resp) => {
      expect(resp).toBe(testTokenObj.access_token);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('tokenActiveCheck: Should return true if the tokenobj and tokenSetTime is set and the token has not expired.', () => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    const currentDate = new Date();

    const { azure } = adp.models;
    azure._tokenObj = testTokenObj;
    azure.tokenSetTime = currentDate.getTime();
    azure.expiresMs = testTokenObj.expires_in;

    expect(azure.tokenActiveCheck()).toBeTruthy();
  });

  it('tokenActiveCheck: Should reject if tokenobj or tokenSetTime are not set or the token has expired.', () => {
    const testTokenObj = {
      access_token: 'token',
      expires_in: 3500,
    };
    const currentDate = new Date();

    const { azure } = adp.models;
    azure._tokenObj = {};
    azure.tokenSetTime = currentDate.getTime();
    azure.expiresMs = testTokenObj.expires_in;

    expect(azure.tokenActiveCheck()).toBeFalsy();

    azure._tokenObj = testTokenObj;
    azure.tokenSetTime = 0;
    azure.expiresMs = testTokenObj.expires_in;

    expect(azure.tokenActiveCheck()).toBeFalsy();

    azure._tokenObj = testTokenObj;
    azure.tokenSetTime = currentDate.getTime();
    azure.expiresMs = 0;
  });

  it('trackNewToken: Should set the default expiry time if the token does not have expires_in set.', () => {
    const testTokenObj = {
      access_token: 'token',
    };

    const { azure } = adp.models;
    const defaultTime = azure.defaultExpSec * 1000;

    azure.trackNewToken(testTokenObj);

    expect(azure.expiresMs).toBe(defaultTime);
    expect(azure.tokenSetTime).toBeGreaterThan(0);
    expect(Object.keys(azure._tokenObj).length).toBeGreaterThan(0);
  });
});
