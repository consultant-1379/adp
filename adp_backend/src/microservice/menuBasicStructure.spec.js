// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.menuBasicStructure ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservice.menuBasicStructure ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microservice = {};
    global.adp.microservice.menuBasicStructure = require('./menuBasicStructure'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should return a "Basic Empty Structure".', (done) => {
    const obj = {
      menu: {},
    };
    const expectedResult = '{"auto":{"development":[],"release":[],"date_modified":""},"manual":{"development":[],"release":[],"date_modified":""}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should return a "Basic Empty Structure" of "manual" without change "auto".', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {},
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"},"manual":{"development":[],"release":[],"date_modified":""}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should return a "Basic Empty Structure" of "auto" without change "manual".', (done) => {
    const obj = {
      menu: {
        auto: {},
        manual: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"development":[],"release":[],"date_modified":""},"manual":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add one missing field (development) in "auto" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"release":[{"something":"here"}],"date_modified":"something here","development":[]},"manual":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });

  it('Should add one missing field (release) in "auto" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"date_modified":"something here","release":[]},"manual":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add one missing field (date_modified) in "auto" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
        },
        manual: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":""},"manual":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add one missing field (development) in "manual" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"},"manual":{"release":[{"something":"here"}],"date_modified":"something here","development":[]}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add one missing field (release) in "manual" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          development: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"},"manual":{"development":[{"something":"here"}],"date_modified":"something here","release":[]}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add one missing field (date_modified) in "manual" without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          development: [{ something: 'here' }],
          release: [{ something: 'here' }],
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":"something here"},"manual":{"development":[{"something":"here"}],"release":[{"something":"here"}],"date_modified":""}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add three random missing fields without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          release: [{ something: 'here' }],
        },
        manual: {
          development: [{ something: 'here' }],
          date_modified: 'something here',
        },
      },
    };
    const expectedResult = '{"auto":{"release":[{"something":"here"}],"development":[],"date_modified":""},"manual":{"development":[{"something":"here"}],"date_modified":"something here","release":[]}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });


  it('Should add three another random missing fields without change anything else.', (done) => {
    const obj = {
      menu: {
        auto: {
          development: [{ something: 'here' }],
          date_modified: 'something here',
        },
        manual: {
          release: [{ something: 'here' }],
        },
      },
    };
    const expectedResult = '{"auto":{"development":[{"something":"here"}],"date_modified":"something here","release":[]},"manual":{"release":[{"something":"here"}],"development":[],"date_modified":""}}';
    obj.menu = global.adp.microservice.menuBasicStructure(obj.menu);

    expect(JSON.stringify(obj.menu)).toBe(expectedResult);
    done();
  });
});
// ============================================================================================= //
