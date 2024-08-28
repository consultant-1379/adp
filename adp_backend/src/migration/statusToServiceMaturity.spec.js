// ============================================================================================= //
/**
* Unit test for [global.adp.migration.statusToServiceMaturity]
* @author Cein [edaccei]
*/
/* eslint-disable no-useless-escape                                                              */
// ============================================================================================= //
describe('Testing [ global.adp.migration.statusToServiceMaturity ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.statusToServiceMaturity = require('./statusToServiceMaturity'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should change status PRA(3) to service_maturity RFCU(7) if restricted is unrestricted(0/undefined) and remove restricted.', (done, fail) => {
    const testObj = {
      service_category: 1,
      restricted: 0,
      status: 3,
      helmurl: 'not empty',
      giturl: 'not empty',
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 7,
      helmurl: 'not empty',
      giturl: 'not empty',
      restricted: undefined,
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity RFCU(7) if service category GS or RS and restricted is unrestricted(0/undefined) and remove restricted.', (done, fail) => {
    const testObj = {
      service_category: 1,
      restricted: 0,
      status: 3,
      helmurl: 'not empty',
      giturl: 'not empty',
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 7,
      helmurl: 'not empty',
      giturl: 'not empty',
      restricted: undefined,
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity RFNCU(6) if restricted is not unrestricted and is Service Category GS or RS.', (done, fail) => {
    const testObj = {
      service_category: 2,
      restricted: 2,
      status: 3,
      helmurl: 'not empty',
      giturl: 'not empty',
    };

    const expectedObj = {
      service_category: 2,
      restricted: 2,
      service_maturity: 6,
      helmurl: 'not empty',
      giturl: 'not empty',
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity DS(8) if no helmurl and is Service Category GS or RS.', (done, fail) => {
    const testObj = {
      service_category: 1,
      status: 3,
      giturl: 'not empty',
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 8,
      giturl: 'not empty',
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity Idea(1) if no helmurl, no giturl and is Service Category GS or RS.', (done, fail) => {
    const testObj = {
      service_category: 1,
      status: 3,
      restricted: 0,
      helmurl: '',
      giturl: '',
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 1,
      helmurl: '',
      giturl: '',
      status: undefined,
      restricted: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity RFCU(7) if not Service Category GS or RS and has no restriction.', (done, fail) => {
    const testObj = {
      service_category: 3,
      status: 3,
      restricted: 0,
    };

    const expectedObj = {
      service_category: 3,
      service_maturity: 7,
      status: undefined,
      restricted: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PRA(3) to service_maturity RFNCU(6) if not Service Category GS or RS and has a restriction.', (done, fail) => {
    const testObj = {
      service_category: 3,
      status: 3,
      restricted: 2,
    };

    const expectedObj = {
      service_category: 3,
      service_maturity: 6,
      restricted: 2,
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status In Development(2) to service_maturity Idea(6) if Service Category GS or RS and no git set.', (done, fail) => {
    const testObj = {
      service_category: 2,
      status: 2,
    };

    const expectedObj = {
      service_category: 2,
      service_maturity: 1,
      status: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status PoC(4) to service_maturity Idea(1).', (done, fail) => {
    const testObj = {
      service_category: 1,
      status: 4,
      restricted: 0,
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 1,
      status: undefined,
      restricted: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status In Development(2) to service_maturity DS(8) if giturl is set when service category is GS or RS.', (done, fail) => {
    const testObj = {
      service_category: 1,
      status: 2,
      restricted: 0,
      giturl: 'test',
    };

    const expectedObj = {
      service_category: 1,
      service_maturity: 8,
      status: undefined,
      restricted: undefined,
      giturl: 'test',
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should change status In Development(2) to service_maturity DS(8) if not service category GS or RS and there is a missing giturl.', (done, fail) => {
    const testObj = {
      service_category: 3,
      status: 2,
      restricted: 0,
    };

    const expectedObj = {
      service_category: 3,
      service_maturity: 8,
      status: undefined,
      restricted: undefined,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toEqual(expectedObj);
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should not run the migration if status is not set.', (done, fail) => {
    const testObj = {
      service_category: 3,
      service_maturity: 1,
      restricted: 0,
    };

    global.adp.migration.statusToServiceMaturity(testObj).then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => {
      fail();
    });
  });
});
