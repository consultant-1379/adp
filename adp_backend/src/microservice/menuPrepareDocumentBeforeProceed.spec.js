// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.menuPrepareDocumentBeforeProceed ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservice.menuPrepareDocumentBeforeProceed ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microservice = {};
    global.adp.microservice.menuBasicStructure = require('./menuBasicStructure'); // eslint-disable-line global-require
    global.adp.microservice.menuPrepareDocumentBeforeProceed = require('./menuPrepareDocumentBeforeProceed'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should return the same object because there is nothing to compare (Can`t change menu.auto).', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
          date_modified: 'some datetime here',
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
          date_modified: 'some datetime here',
        },
      },
    };
    const result = global.adp.microservice.menuPrepareDocumentBeforeProceed(mockAsset);

    expect(JSON.stringify(result)).toBe(JSON.stringify(mockAsset));
    done();
  });


  it('Should return the same object because there is nothing valid to compare (Can`t change menu.auto).', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
          date_modified: 'some datetime here',
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
          date_modified: 'some datetime here',
        },
      },
    };
    const oldMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: null,
    };
    const result = global.adp.microservice
      .menuPrepareDocumentBeforeProceed(mockAsset, oldMockAsset);

    expect(JSON.stringify(result)).toBe(JSON.stringify(mockAsset));
    done();
  });


  it('Should return the previous manual menu on the new object, because menu_auto is true (Can`t change menu.auto).', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['Forced Injection MockContent 1'],
          release: ['Forced Injection MockContent 2'],
          date_modified: 'Forced Injection New Datetime here',
        },
        manual: {
          development: [],
          release: [],
        },
      },
    };
    const previousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {},
        manual: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
      },
    };
    const expectedMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: [],
          release: [],
          date_modified: '',
        },
        manual: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
      },
    };
    const result = global.adp.microservice
      .menuPrepareDocumentBeforeProceed(mockAsset, previousMockAsset);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedMockAsset));
    done();
  });


  it('Should return the previous auto menu on the new object (Can`t change menu.auto).', (done) => {
    const mockAsset = {
      menu_auto: false,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: [],
          release: [],
          date_modified: '',
        },
        manual: {
          development: ['new mockContent 1'],
          release: ['new mockContent 2'],
          date_modified: 'some new datetime here',
        },
      },
    };
    const previousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
        manual: {
          development: [],
          release: [],
          date_modified: '',
        },
      },
    };
    const expectedMockAsset = {
      menu_auto: false,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
        manual: {
          development: ['new mockContent 1'],
          release: ['new mockContent 2'],
          date_modified: 'some new datetime here',
        },
      },
    };
    const result = global.adp.microservice
      .menuPrepareDocumentBeforeProceed(mockAsset, previousMockAsset);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedMockAsset));
    done();
  });


  it('Should rebuild the menu object and returns with previous auto menu, because menu object of mockAsset is undefined.', (done) => {
    const mockAsset = {
      menu_auto: false,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
    };
    const previousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
      },
    };
    const expectedMockAsset = {
      menu_auto: false,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
        manual: {
          development: [],
          release: [],
          date_modified: '',
        },
      },
    };
    const result = global.adp.microservice
      .menuPrepareDocumentBeforeProceed(mockAsset, previousMockAsset);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedMockAsset));
    done();
  });

  it('Successful test which can change menu.auto.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['New MockContent 1'],
          release: ['New MockContent 2'],
          date_modified: 'New Datetime here',
        },
        manual: {
          development: [],
          release: [],
        },
      },
    };
    const previousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {},
        manual: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
      },
    };
    const expectedMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['New MockContent 1'],
          release: ['New MockContent 2'],
          date_modified: 'New Datetime here',
        },
        manual: {
          development: ['previous mockContent 1'],
          release: ['previous mockContent 2'],
          date_modified: 'some previous datetime here',
        },
      },
    };
    const result = global.adp.microservice
      .menuPrepareDocumentBeforeProceed(mockAsset, previousMockAsset, true);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedMockAsset));
    done();
  });
});
// ============================================================================================= //
