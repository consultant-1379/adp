// ============================================================================================= //
/**
* Unit test for [ adp.egsSync.egsSynccheckGroup ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class EgsSyncClass {
  checkGroup() {
    if (adp.mockBehavior.checkGroup) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}

describe('Testing [ adp.egsSync.egsSynccheckGroup ] Behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      checkGroup: true,
    };
    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.egsSync = {};
    adp.egsSync.EgsSyncClass = EgsSyncClass;
    adp.egsSync.egsSyncCheckGroups = proxyquire('./egsSyncCheckGroups', {
      './../library/errorLog': adp.erroLog,
      './EgsSyncClass': EgsSyncClass,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case', (done) => {
    adp.egsSync.egsSyncCheckGroups('MockType', [1, 2, 3], 'mockQueueObjective')
      .then((RES) => {
        expect(RES).toBe('MockSuccess');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Negative case', (done) => {
    adp.mockBehavior.checkGroup = false;
    adp.egsSync.egsSyncCheckGroups('MockType', [1, 2, 3], 'mockQueueObjective')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR).toBe(500);
        done();
      });
  });
});
