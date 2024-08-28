// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.menuApplyRulesOnManual ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservice.menuApplyRulesOnManual ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = S => S;
    global.adp.clone = J => JSON.parse(JSON.stringify(J));
    global.adp.documentMenu = {};
    global.adp.documentMenu.process = {};
    global.adp.documentMenu.process.action = MENU => new Promise((RESOLVE, REJECT) => {
      if (MENU.mockControl === false) {
        const mockError = 'Mock Error';
        REJECT(mockError);
      } else if (MENU.mockDocumentMenuProcessActionError === true) {
        const menu = MENU;
        menu.manual.errors = {};
        menu.manual.errors.development = ['MockError on Development'];
        menu.manual.errors.release = ['MockError on Release'];
        delete menu.mockDocumentMenuProcessActionError;
        RESOLVE(menu);
      } else {
        RESOLVE(MENU);
      }
    });
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microservice = {};
    global.adp.microservice.menuBasicStructure = OBJ => OBJ;
    global.adp.microservice.menuApplyRulesOnManual = require('./menuApplyRulesOnManual'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should do nothing, because menu is undefined.', (done) => {
    const obj = {};
    global.adp.microservice.menuApplyRulesOnManual(obj.menu)
      .then((RESULT) => {
        expect(RESULT).toBeUndefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should do nothing, because menu.manual is undefined.', (done) => {
    const obj = { menu: {} };
    global.adp.microservice.menuApplyRulesOnManual(obj.menu)
      .then((RESULT) => {
        expect(RESULT.manual).toBeUndefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Simulating a reject of global.adp.documentMenu.process.action promise.', (done) => {
    const obj = {
      menu: {
        manual: [
          {
            mockemenuitem: 'something',
          },
        ],
        auto: [
          {
            mockemenuitem: 'something',
          },
        ],
        mockControl: false,
      },
    };
    global.adp.microservice.menuApplyRulesOnManual(obj.menu)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('Testing a successful case.', (done) => {
    const obj = {
      menu: {
        manual: {
          development: ['something'],
          release: ['something', 'something'],
          date_modified: 'mock date',
        },
        auto: {
          development: [],
          release: [],
          date_modified: '',
        },
      },
    };
    global.adp.microservice.menuApplyRulesOnManual(obj.menu, true)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [global.adp.documentMenu.process.action] find some errors.', (done) => {
    const obj = {
      menu: {
        mockDocumentMenuProcessActionError: true,
        manual: [
          {
            mockemenuitem: 'something',
          },
        ],
        auto: [
          {
            mockemenuitem: 'something',
          },
        ],
      },
    };
    global.adp.microservice.menuApplyRulesOnManual(obj.menu)
      .then(() => {
        done.fail();
      })
      .catch((errorArray) => {
        expect(errorArray.length).toBeGreaterThan(0);
        done();
      });
  });
});
// ============================================================================================= //
