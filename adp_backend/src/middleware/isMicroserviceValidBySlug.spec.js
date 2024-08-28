// ============================================================================================= //
/**
* Unit test for [ adp.middleware.isMicroserviceValidBySlug ]
* @author Abhishek Singh [zihabns]
*/
// ============================================================================================= //
describe('Testing  [ adp.middleware.isMicroserviceValidBySlug ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.getSizeInMemory = () => true;
    adp.mockRES = {};
    adp.mockNEXT = () => true;
    adp.echoLog = text => text;
    adp.setHeaders = () => ({ end() { return true; } });
    adp.docs = {};
    adp.docs.list = [];
    adp.docs.rest = [];
    adp.Answers = require('../answers/AnswerClass');
    adp.checkSlugError = false;
    adp.checkSlugDbError = false;
    adp.microservice = {};
    adp.microservice.checkSlug = () => new Promise((RESOLVE, REJECT) => {
      if (adp.checkSlugDbError) {
        const err = {};
        REJECT(err);
        return;
      }
      if (adp.checkSlugError) {
        RESOLVE('Invalid');
        return;
      }
      RESOLVE('Valid SLUG');
    });
    adp.middleware = {};
    adp.middleware.isMicroserviceValidBySlug = require('./isMicroserviceValidBySlug');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should reject if Microservice slug is not provided', (done) => {
    adp.middleware.isMicroserviceValidBySlug(null, adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should reject if Microservice slug is undefined', (done) => {
    adp.middleware.isMicroserviceValidBySlug(undefined, adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should test if Microservice slug is provided', (done) => {
    adp.middleware.isMicroserviceValidBySlug('validslug', adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should test if Microservice slug is invalid', (done) => {
    adp.checkSlugError = true;
    adp.middleware.isMicroserviceValidBySlug('invalidslug', adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should test if unable to check Microservice slug in database', (done) => {
    adp.checkSlugDbError = true;
    adp.middleware.isMicroserviceValidBySlug('invalidslug', adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
