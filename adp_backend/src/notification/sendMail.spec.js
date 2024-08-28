// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.sendMail ]
* @author
*/
// ============================================================================================= //
const mockErrorResponse = 'Incorrect Parameters';

let getLogsFail;
let mockLoggerResponse;
class MockAdpLogClass {
  getLogs(SIGNUM, TYPE, ASSET, LIMIT, SKIP, ISADMIN) {
    global.compareData = {};
    global.compareData.signum = SIGNUM;
    global.compareData.type = TYPE;
    global.compareData.asset = ASSET;
    global.compareData.limit = LIMIT;
    global.compareData.skip = SKIP;
    global.compareData.isadmin = ISADMIN;
    return new Promise((resolve, reject) => {
      if (getLogsFail) {
        reject();
        return;
      }
      resolve(mockLoggerResponse);
    });
  }
}

describe('Testing [ global.adp.notification.sendMail ] behavior', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLogClass;
    mockLoggerResponse = [];
    getLogsFail = false;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.nodeMailer = '';
    global.request = {};
    global.request.post = (OBJ, CALLBACK) => {
      if (OBJ.url === 'mockNodemailer') {
        CALLBACK(null, { statusCode: 200 });
      } else {
        CALLBACK(mockErrorResponse, { statusCode: 500 });
      }
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.notification.sendMail = require('./sendMail');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should successfully send email if the request object and url are correct.', () => {
    const MOCKMAILOBJECT = {
      senderMail: 'mocksenderemal',
      recipientsMail: [
        'mockrecipent1',
        'mockrecipent2',
      ],
      subject: 'mockSubject',
      messageText: 'mockMessageText',
      messageHTML: 'mockMessageHTML',
    };
    global.adp.config.nodeMailer = 'mockNodemailer';
    global.adp.notification.sendMail(MOCKMAILOBJECT).then((resp) => {
      expect(resp).toEqual(MOCKMAILOBJECT);
    });
  });

  it('Should not send email if the request url is incorrect.', () => {
    const MOCKMAILOBJECT = {
      senderMail: 'mocksenderemal',
      recipientsMail: [
        'mockrecipent1',
        'mockrecipent2',
      ],
      subject: 'mockSubject',
      messageText: 'mockMessageText',
      messageHTML: 'mockMessageHTML',
    };
    global.adp.config.nodeMailer = 'mockNodemailerInvalid';
    global.adp.notification.sendMail(MOCKMAILOBJECT).then(() => {
    })
      .catch((err) => {
        expect(err).toEqual(mockErrorResponse);
      });
  });
});
// ============================================================================================= //
