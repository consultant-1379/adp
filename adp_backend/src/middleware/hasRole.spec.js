// ============================================================================================= //
/**
* Unit test for [ adp.middleware.hasRole ]
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //

describe('Testing  [ adp.middleware.hasRole ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.mockRES = {};
    global.adp.mockNEXT = () => true;
    global.adp.echoLog = text => text;
    global.adp.setHeaders = () => ({ end() { return true; } });
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.Answers = require('../answers/AnswerClass');
    global.adp.hasRolemiddleware = require('./hasRole');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Userinaction is not admin;Block action and do not proceed further', async (done) => {
    adp.mockREQ = { user: { docs: [{ signum: 'TEST', role: 'user' }] } };
    adp.hasRoleMiddleware = global.adp.hasRolemiddleware('admin');
    const RESULT = await adp.hasRoleMiddleware(adp.mockREQ, global.adp.mockRES,
      global.adp.mockNEXT);

    expect(RESULT).toBeUndefined();
    done();
  });

  it('Userinaction is admin;Normal flow and proceed further', async (done) => {
    adp.mockREQ = { user: { docs: [{ signum: 'TEST', role: 'admin' }] } };
    adp.hasRoleMiddleware = global.adp.hasRolemiddleware('admin');
    const RESULT = await adp.hasRoleMiddleware(adp.mockREQ, global.adp.mockRES,
      global.adp.mockNEXT);

    expect(RESULT).toBeTruthy();
    done();
  });
});
// ============================================================================================= //
