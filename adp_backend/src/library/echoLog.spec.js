// ============================================================================================= //
/**
* Unit test for [ global.adp.echoLog ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockEchoLogModel {
  constructor() {
    this.id = 1;
  }

  createOne() {
    return new Promise(RES => RES());
  }
}

describe('Testing [ adp.echoLog ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.EchoLog = MockEchoLogModel;
    adp.docs = {};
    adp.docs.list = [];
    adp.dbSetup = {};
    adp.echoDebugConsoleMode = true;
    adp.config = {};
    adp.config.siteAddress = 'https://localhost:9999/';
    adp.timeStamp = require('./timeStamp');
    adp.echoLog = require('./echoLog');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ adp.echoLog ] just with one parameter', () => {
    const result = adp.echoLog('First Parameter');

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] just with one parameter (B&W Version)', () => {
    adp.config.siteAddress = '';
    const result = adp.echoLog('First Parameter');

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] first parameter is not a string, should generate an error', () => {
    const result = adp.echoLog(123);

    expect(result).toBeFalsy();
  });


  it('[ adp.echoLog ] three correct parameters', () => {
    const result = adp.echoLog('First Parameter', null, 200);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] the third parameter is not a number, should generate an error', () => {
    const result = adp.echoLog('First', null, '123');

    expect(result).toBeFalsy();
  });


  it('[ adp.echoLog ] four correct parameters', () => {
    const result = adp.echoLog('First Parameter', null, 200, 'packName');

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] the fourth parameter is not a string, should generate an error', () => {
    const result = adp.echoLog('First', null, 123, 123);

    expect(result).toBeFalsy();
  });


  it('[ adp.echoLog ] five correct parameters', () => {
    const result = adp.echoLog('First Parameter', null, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] the fifth parameter is not a boolean, should generate an error', () => {
    const result = adp.echoLog('First', null, 123, 'packName', 123);

    expect(result).toBeFalsy();
  });


  it('[ adp.echoLog ] wrong parameters, should generate a combined error', () => {
    const result = adp.echoLog('First', null, '123', 123, 123);

    expect(result).toBeFalsy();
  });


  it('[ adp.echoLog ] generating a 200 echoLog', () => {
    const result = adp.echoLog('Mock Message', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] generating a 300 echoLog', () => {
    const result = adp.echoLog('Mock Message', null, 300, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] generating a 400 echoLog', () => {
    const result = adp.echoLog('Mock Message', null, 400, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] generating a 500 echoLog', () => {
    const result = adp.echoLog('Mock Message', null, 500, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with clock timer in the start', () => {
    const result = adp.echoLog('[+100] Mock Message', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with brackets in the text', () => {
    const result = adp.echoLog('Mock Message [ package ] text', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a missing bracket in the text', () => {
    const result = adp.echoLog('Mock Message [ package text', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a messy bracket in the text', () => {
    const result = adp.echoLog('Mock ] Message [ package text', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with one value in milliseconds', () => {
    const result = adp.echoLog('Mock Message in 10ms', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with two values in milliseconds', () => {
    const result = adp.echoLog('Mock Message in 10ms and after, more 20ms', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with two values in milliseconds (B&W Version)', () => {
    adp.config.siteAddress = '';
    const result = adp.echoLog('Mock Message in 10ms and after, more 20ms', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a "fake" milliseconds', () => {
    const result = adp.echoLog('Mock Message in AAms', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with single quotes', () => {
    const result = adp.echoLog('Mock Message with \'single quotes\'', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a "fake" single quote', () => {
    const result = adp.echoLog('Mock Message with a fake \'single quote', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with double quotes', () => {
    const result = adp.echoLog('Mock Message with "double quotes"', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a fake double quote', () => {
    const result = adp.echoLog('Mock Message with a fake "double quote', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] 200 echoLog with a mix of quotes', () => {
    const result = adp.echoLog('Mock \'Message\' with a "mix \'of\' quotes"', null, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] OBJ parameter is not null', () => {
    const result = adp.echoLog('Mock Message with OBJ', { mock: 'Object' }, 200, 'packName', false);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] DATABASE parameter is true, but [ adp.db ] is undefined', () => {
    const result = adp.echoLog('Mock Message with DATABASE', { mock: 'Object' }, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] DATABASE parameter is true, but [ adp.db.create ] is undefined', () => {
    adp.db = {};
    const result = adp.echoLog('Mock Message with DATABASE', { mock: 'Object' }, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] DATABASE parameter is true and [ adp.db.create ] is valid', () => {
    adp.db = {};
    adp.db.create = () => new Promise((RES) => { RES(); });
    const result = adp.echoLog('Mock Message with DATABASE', { mock: 'Object' }, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] DATABASE parameter is true and [ adp.db.create ] is valid (B&W Version)', () => {
    adp.config.siteAddress = '';
    adp.db = {};
    adp.db.create = () => new Promise((RES) => { RES(); });
    const result = adp.echoLog('Mock Message with DATABASE', { mock: 'Object' }, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] DATABASE parameter is true, [ adp.db.create ] is valid but will return an error', () => {
    adp.db = {};
    adp.db.create = () => new Promise((RES, REJ) => { REJ(); });
    const result = adp.echoLog('Mock Message with DATABASE', { mock: 'Object' }, 200, 'packName', true);

    expect(result).toBeTruthy();
  });


  it('[ adp.echoLog ] behavior if [ adp.echoDebugConsoleMode ] is false', () => {
    adp.echoDebugConsoleMode = false;
    const result = adp.echoLog('Test', null, 200, 'packName', false);

    expect(result).toBeFalsy();
  });
});
// ============================================================================================= //
