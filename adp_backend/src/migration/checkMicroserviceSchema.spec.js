// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.checkMicroserviceSchema ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.checkMicroserviceSchema ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.mockControlEchoLogCalled = false;
    global.adp.echoLog = () => {
      global.adp.mockControlEchoLogCalled = true;
    };
    global.adp.microservice = {};
    global.adp.microservice.validateSchema = (JOBJECT) => {
      switch (JOBJECT.name) {
        case 'mockValidTest':
          return true;
        default:
          return ['mock error'];
      }
    };
    global.adp.migration = {};
    global.adp.migration.checkMicroserviceSchema = require('./checkMicroserviceSchema'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Valid Object: Should not call echoLog command.', (done) => {
    const obj = {
      name: 'mockValidTest',
    };
    global.adp.migration.checkMicroserviceSchema(obj)
      .then((RESULT) => {
        if (RESULT === true) {
          if (global.adp.mockControlEchoLogCalled === false) {
            done();
          } else {
            done.fail();
          }
        } else {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Invalid Object: Should call echoLog command.', (done) => {
    const obj = {
      name: 'mockInvalidTest',
    };
    global.adp.migration.checkMicroserviceSchema(obj)
      .then((RESULT) => {
        if (RESULT === true) {
          if (global.adp.mockControlEchoLogCalled === false) {
            done.fail();
          } else {
            done();
          }
        } else {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
