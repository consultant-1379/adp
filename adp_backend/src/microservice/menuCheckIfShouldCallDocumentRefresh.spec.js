// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.menuCheckIfShouldCallDocumentRefresh ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservice.menuCheckIfShouldCallDocumentRefresh ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microservice = {};
    global.adp.microservice.menuCheckIfShouldCallDocumentRefresh = require('./menuCheckIfShouldCallDocumentRefresh');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should return false because menu_auto is false.', (done) => {
    const mockAsset = {
      menu_auto: false,
      repo_urls: {
        development: 'mockLink',
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return false because repo_urls is undefined.', (done) => {
    const mockAsset = {
      menu_auto: true,
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return false because repo_urls.development is undefined.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return false because repo_urls.development is not a string.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 123,
        release: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return false because repo_urls.release is undefined.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return false because repo_urls.release is not a string.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'mockLink',
        release: 123,
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return true if repo_urls.development and repo_urls.release are empty strings.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: '',
        release: '',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(mockAsset);

    expect(result).toBeTruthy();
    done();
  });


  it('Should return false because repo_urls of mockAsset and PreviousMockAsset are equals.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://mocklink/dev/',
        release: 'http://mocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const PreviousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://mocklink/dev/',
        release: 'http://mocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice
      .menuCheckIfShouldCallDocumentRefresh(mockAsset, PreviousMockAsset);

    expect(result).toBeFalsy();
    done();
  });


  it('Should return true because repo_urls of mockAsset and PreviousMockAsset are different.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://mocklink/dev/',
        release: 'http://mocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const PreviousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://oldmocklink/dev/',
        release: 'http://oldmocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice
      .menuCheckIfShouldCallDocumentRefresh(mockAsset, PreviousMockAsset);

    expect(result).toBeTruthy();
    done();
  });


  it('Repo urls that contain only spaces will call the refresh to empty out the documentation.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: '  ',
        release: '  ',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const PreviousMockAsset = {
      menu_auto: true,
      repo_urls: {
        development: ' ',
        release: ' ',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice
      .menuCheckIfShouldCallDocumentRefresh(mockAsset, PreviousMockAsset);

    expect(result).toBeTruthy();
    done();
  });


  it('Old mockAsset there is no repo_urls.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://mocklink/dev/',
        release: 'http://mocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const PreviousMockAsset = {
      menu_auto: true,
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const result = global.adp.microservice
      .menuCheckIfShouldCallDocumentRefresh(mockAsset, PreviousMockAsset);

    expect(result).toBeTruthy();
    done();
  });


  it('Old mockAsset is null.', (done) => {
    const mockAsset = {
      menu_auto: true,
      repo_urls: {
        development: 'http://mocklink/dev/',
        release: 'http://mocklink/release/',
      },
      menu: {
        auto: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
        manual: {
          development: ['mockContent'],
          release: ['mockContent'],
        },
      },
    };
    const PreviousMockAsset = undefined;
    const result = global.adp.microservice
      .menuCheckIfShouldCallDocumentRefresh(mockAsset, PreviousMockAsset);

    expect(result).toBeTruthy();
    done();
  });
});
// ============================================================================================= //
