// ============================================================================================= //
/**
* Unit test for [ adp.proxy.ProxyClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockRequest {
  constructor() {
    this.mockContent = 'mockContent';
    this.mockError = { error: 'mockError' };
  }

  get(PARAM, CALLBACK) {
    if (global.requestStatusCode === 500) {
      CALLBACK(this.mockError, { statusCode: global.requestStatusCode }, {});
    } else {
      CALLBACK(undefined, { statusCode: global.requestStatusCode }, this.mockContent);
    }
  }

  post(PARAM, CALLBACK) {
    if (global.requestStatusCode === 500) {
      CALLBACK(this.mockError, { statusCode: global.requestStatusCode }, {});
    } else {
      CALLBACK(undefined, { statusCode: global.requestStatusCode }, this.mockContent);
    }
  }
}
// ============================================================================================= //
describe('Testing [ adp.proxy.ProxyClass ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.requestStatusCode = 200;
    global.request = new MockRequest();
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => { };
    adp.proxy = {};
    adp.proxy.ProxyClass = require('./ProxyClass');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ getData ] Successful case test.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);

    proxy.getData('Mock Parameter')
      .then((RESULT) => {
        expect(RESULT).toBe('mockContent');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getData ] Successful case test, with retrocompatibility parameters.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);

    proxy.getData('Mock Parameter', 'Mock Payload')
      .then((RESULT) => {
        expect(RESULT).toBe('mockContent');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getData ] Negative case, if get an unexpected error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 500;

    proxy.getData('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get an unexpected error, with retrocompatibility parameters.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 500;

    proxy.getData('Mock Parameter', 'Mock Payload')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get a 404 error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 404;

    proxy.getData('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get a 404 error, with retrocompatibility parameters.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 404;

    proxy.getData('Mock Parameter', 'Mock Payload')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get a 401 error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 401;

    proxy.getData('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get a 401 error, with retrocompatibility parameters.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 401;

    proxy.getData('Mock Parameter', 'Mock Payload')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get another error code.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 0;

    proxy.getData('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getData ] Negative case, if get another error code, with retrocompatibility parameters.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 0;

    proxy.getData('Mock Parameter', 'Mock Payload')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getUser ] Successful case test.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);

    proxy.getUser('Mock Parameter')
      .then((RESULT) => {
        expect(RESULT).toBe('mockContent');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ getUser ] Negative case, if get an unexpected error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 500;

    proxy.getUser('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getUser ] Negative case, if get a 404 error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 404;

    proxy.getUser('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getUser ] Negative case, if get a 401 error.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 401;

    proxy.getUser('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ getUser ] Negative case, if get another error code.', (done) => {
    const mockURLServer = 'https://mock.test.server/';
    const proxy = new adp.proxy.ProxyClass(mockURLServer);
    global.requestStatusCode = 0;

    proxy.getUser('Mock Parameter')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
