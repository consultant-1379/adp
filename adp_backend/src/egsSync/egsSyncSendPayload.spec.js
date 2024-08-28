// ============================================================================================= //
/**
* Unit test for [ adp.egsSync.egsSynccheckGroup ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class EgsSyncClass {
  closePayloadsToSend() {
    if (adp.mockBehavior.closePayloadsToSend) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }

  sendPayload() {
    if (adp.mockBehavior.sendPayload) {
      return new Promise(RES => RES([1, 2, 3]));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}

describe('Testing [ adp.egsSync.egsSyncSendPayload ] Behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      closePayloadsToSend: true,
      sendPayload: true,
    };
    adp.echoLog = ERRORCODE => ERRORCODE;
    const mockErrorLog = (code, desc, error) => {
      adp.errorLog = { code, desc };
      return { code, desc, error };
    };
    adp.egsSync = {};
    adp.egsSync.EgsSyncClass = EgsSyncClass;
    adp.egsSync.egsSyncSendPayload = proxyquire('./egsSyncSendPayload', {
      './EgsSyncClass': EgsSyncClass,
      './../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case to send egsPayload', (done) => {
    adp.egsSync.egsSyncSendPayload('MockPayLoadId', 'MockedQueueObjective')
      .then((RES) => {
        expect(RES.sentIds[0]).toBe(1);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Negative case', (done) => {
    adp.mockBehavior.sendPayload = false;
    adp.egsSync.egsSyncSendPayload('MockPayLoadId', 'MockedQueueObjective')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('MockError');
        expect(ERROR.desc).toBeDefined();
        done();
      });
  });
});
