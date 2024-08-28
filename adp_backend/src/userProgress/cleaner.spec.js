// ============================================================================================= //
/**
* Unit test for [ global.adp.userProgress.cleaner ]
* @author Armando Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.userProgress.cleaner ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;

    global.adp.userProgress = {};
    global.adp.userProgress.cleaner = require('./cleaner'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should resolve successful this request.', (done) => {
    const menu = require('./cleaner.spec.json').response;
    const wid = 4787;
    const RESULT = global.adp.userProgress.cleaner(wid, menu);

    expect(RESULT.ID).toBe(4835);
    done();
  });
});
// ============================================================================================= //
