// ============================================================================================= //
/**
* Unit test for [ global.adp.quickTypeErrorMessage ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.quickTypeErrorMessage ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.quickTypeErrorMessage = require('./quickTypeErrorMessage'); // eslint-disable-line global-require
    global.adp.mock = null;
    global.adp.echoLog = (MSG, OBJ, CODE, MODULE) => {
      global.adp.mock = {
        msg: MSG,
        obj: OBJ,
        code: CODE,
        module: MODULE,
      };
    };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Checking the message "FIELD should be TYPE" and the values sent to the Console Log.', (done) => {
    const msg = global.adp.quickTypeErrorMessage('FIELD', 'TYPE', 1, 'testing.module');
    const json = {
      msg: 'FIELD should be TYPE, instead of "1"/"number"',
      obj: { object: 1 },
      code: 500,
      module: 'testing.module',
    };

    expect(msg).toBe('FIELD should be TYPE');
    expect(global.adp.mock.msg).toBe(json.msg);
    expect(global.adp.mock.code).toBe(json.code);
    expect(global.adp.mock.module).toBe(json.module);
    done();
  });
});
// ============================================================================================= //
