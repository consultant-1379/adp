// ============================================================================================= //
/**
* Unit test for [ errorLog ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockEchoLogModel {
  constructor() {
    this.id = 1;
  }

  createOne() {
    if (adp.behavior.createOne === 'success') {
      return new Promise(RES => RES());
    }
    const mockDBError = 'mockDBError';
    return new Promise((RES, REJ) => REJ(mockDBError));
  }
}

const errorLog = require('./errorLog');

const packName = 'errorLog.Spec';

describe('Testing [ errorLog ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.behavior = {};
    adp.behavior.createOne = 'success';
    adp.models = {};
    adp.models.EchoLog = MockEchoLogModel;
    adp.docs = {};
    adp.docs.list = [];
    adp.dbSetup = {};
    adp.echoDebugConsoleMode = true;
    adp.config = {};
    adp.config.siteAddress = 'https://localhost:9999/';
    global.chalk = require('chalk');
    adp.timeStamp = require('./timeStamp');
    adp.echoLog = () => {};
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ errorLog ] simple successful case ( 500 Error Log ).', (done) => {
    const errorCode = 500;
    const errorMessage = 'Mock Error Message';
    const errorObject = {
      error: { mockErrorObject: true },
    };
    const result = errorLog(errorCode, errorMessage, errorObject, 'main', packName);

    expect(result.code).toEqual(errorCode);
    expect(result.desc).toEqual(errorMessage);
    expect(result.data).toBeDefined();
    expect(result.data.error).toEqual(errorObject.error);
    expect(result.origin).toEqual('main');
    expect(result.packName).toEqual(packName);
    done();
  });


  it('[ errorLog ] simple successful case ( 404 Error Log ).', (done) => {
    const errorCode = 404;
    const errorMessage = 'Mock Not Found Error Message';
    const errorObject = {
      error: { mockErrorObject: true },
    };
    const result = errorLog(errorCode, errorMessage, errorObject, 'main', packName);

    expect(result.code).toEqual(errorCode);
    expect(result.desc).toEqual(errorMessage);
    expect(result.data).toBeDefined();
    expect(result.data.error).toEqual(errorObject.error);
    expect(result.origin).toEqual('main');
    expect(result.packName).toEqual(packName);
    done();
  });


  it('[ errorLog ] when it got the object created by another [ errorLog ].', (done) => {
    const firstErrorCode = 404;
    const firstErrorMessage = 'First Mock Error Message';
    const firstErrorObject = {
      error: { mockErrorObject1: true },
    };
    const result = errorLog(firstErrorCode, firstErrorMessage, firstErrorObject, 'firstPlace', packName);

    const secondErrorCode = 500;
    const secondErrorMessage = 'Second Mock Error Message';
    const secondErrorObject = {
      error: result,
    };
    const finalResult = errorLog(secondErrorCode, secondErrorMessage, secondErrorObject, 'secondPlace', packName);

    expect(finalResult.code).toEqual(firstErrorCode);
    expect(finalResult.desc).toEqual(firstErrorMessage);
    expect(finalResult.data).toBeDefined();
    expect(finalResult.data.error).toEqual(firstErrorObject.error);
    expect(finalResult.origin).toEqual('firstPlace');
    expect(finalResult.packName).toEqual(packName);
    done();
  });


  it('[ errorLog ] if [ createOne @ adp.models.EchoLog ] crashes.', (done) => {
    adp.behavior.createOne = 'crash';
    const errorCode = 500;
    const errorMessage = 'Mock Error Message';
    const errorObject = {
      error: { mockErrorObject: true },
    };
    const result = errorLog(errorCode, errorMessage, errorObject, 'main', packName);

    expect(result.code).toEqual(errorCode);
    expect(result.desc).toEqual(errorMessage);
    expect(result.data).toBeDefined();
    expect(result.data.error).toEqual(errorObject.error);
    expect(result.origin).toEqual('main');
    expect(result.packName).toEqual(packName);
    done();
  });
});
// ============================================================================================= //
