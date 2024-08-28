// ============================================================================================= //
/**
* Unit test for [ global.adp.versionSort ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.versionSort ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.versionSort = require('./versionSort'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });
  // =========================================================================================== //
  it('Sorting an Array of Simple Versions (0.0.0) by "version" property (ASC).', (done) => {
    const testArray = [
      { version: '2.0.3' },
      { version: '2.0.1' },
      { version: '1.0.0' },
      { version: '1.1.0' },
      { version: '2.0.2' },
      { version: '1.0.1' },
      { version: '2.0.0' },
      { version: '1.1.3' },
      { version: '1.1.1' },
      { version: '1.1.2' },
      { version: '1.0.2' },
      { version: '2.1.2' },
      { version: '2.1.0' },
      { version: '1.0.3' },
      { version: '2.1.1' },
      { version: '2.1.3' },
    ];
    const expectedArray = [
      { version: '1.0.0' },
      { version: '1.0.1' },
      { version: '1.0.2' },
      { version: '1.0.3' },
      { version: '1.1.0' },
      { version: '1.1.1' },
      { version: '1.1.2' },
      { version: '1.1.3' },
      { version: '2.0.0' },
      { version: '2.0.1' },
      { version: '2.0.2' },
      { version: '2.0.3' },
      { version: '2.1.0' },
      { version: '2.1.1' },
      { version: '2.1.2' },
      { version: '2.1.3' },
    ];
    const resultArray = testArray.sort(global.adp.versionSort('version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
  it('Sorting an Array of Simple Versions (0.0.0) by "version" property (DESC).', (done) => {
    const testArray = [
      { version: '2.0.3' },
      { version: '2.0.1' },
      { version: '1.0.0' },
      { version: '1.1.0' },
      { version: '2.0.2' },
      { version: '1.0.1' },
      { version: '2.0.0' },
      { version: '1.1.3' },
      { version: '1.1.1' },
      { version: '1.1.2' },
      { version: '1.0.2' },
      { version: '2.1.2' },
      { version: '2.1.0' },
      { version: '1.0.3' },
      { version: '2.1.1' },
      { version: '2.1.3' },
    ];
    const expectedArray = [
      { version: '2.1.3' },
      { version: '2.1.2' },
      { version: '2.1.1' },
      { version: '2.1.0' },
      { version: '2.0.3' },
      { version: '2.0.2' },
      { version: '2.0.1' },
      { version: '2.0.0' },
      { version: '1.1.3' },
      { version: '1.1.2' },
      { version: '1.1.1' },
      { version: '1.1.0' },
      { version: '1.0.3' },
      { version: '1.0.2' },
      { version: '1.0.1' },
      { version: '1.0.0' },
    ];

    const resultArray = testArray.sort(global.adp.versionSort('-version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
  it('Sorting an Array of Versions (0.0-A) by "version" property (ASC).', (done) => {
    const testArray = [
      { version: '2.0-release' },
      { version: '2.0-beta' },
      { version: '2.1-alpha' },
      { version: '1.0-release' },
      { version: '1.1-beta' },
      { version: '2.0-alpha' },
      { version: '2.1-release' },
      { version: '1.0-alpha' },
      { version: '1.1-release' },
      { version: '1.0-beta' },
      { version: '1.1-alpha' },
      { version: '2.1-beta' },
    ];
    const expectedArray = [
      { version: '1.0-alpha' },
      { version: '1.0-beta' },
      { version: '1.0-release' },
      { version: '1.1-alpha' },
      { version: '1.1-beta' },
      { version: '1.1-release' },
      { version: '2.0-alpha' },
      { version: '2.0-beta' },
      { version: '2.0-release' },
      { version: '2.1-alpha' },
      { version: '2.1-beta' },
      { version: '2.1-release' },
    ];

    const resultArray = testArray.sort(global.adp.versionSort('version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
  it('Sorting an Array of Versions (0.0-A) by "version" property (DESC).', (done) => {
    const testArray = [
      { version: '2.0-release' },
      { version: '2.0-beta' },
      { version: '2.1-alpha' },
      { version: '1.0-release' },
      { version: '1.1-beta' },
      { version: '2.0-alpha' },
      { version: '2.1-release' },
      { version: '1.0-alpha' },
      { version: '1.1-release' },
      { version: '1.0-beta' },
      { version: '1.1-alpha' },
      { version: '2.1-beta' },
    ];
    const expectedArray = [
      { version: '2.1-release' },
      { version: '2.1-beta' },
      { version: '2.1-alpha' },
      { version: '2.0-release' },
      { version: '2.0-beta' },
      { version: '2.0-alpha' },
      { version: '1.1-release' },
      { version: '1.1-beta' },
      { version: '1.1-alpha' },
      { version: '1.0-release' },
      { version: '1.0-beta' },
      { version: '1.0-alpha' },
    ];

    const resultArray = testArray.sort(global.adp.versionSort('-version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
  it('Sorting an Array of Mixed Versions by "version" property (ASC).', (done) => {
    const testArray = [
      { version: '1.0.rc2' },
      { version: '1.A@st10' },
      { version: '1.0.rc1' },
      { version: '1.A@st11' },
      { version: '1.A@stable' },
      { version: '1.0.rc3' },
      { version: '1.0#00' },
      { version: '1.A.B.C.D.E.F.88' },
      { version: '1.A@ss10' },
    ];
    const expectedArray = [
      { version: '1.0#00' },
      { version: '1.0.rc1' },
      { version: '1.0.rc2' },
      { version: '1.0.rc3' },
      { version: '1.A.B.C.D.E.F.88' },
      { version: '1.A@ss10' },
      { version: '1.A@st10' },
      { version: '1.A@st11' },
      { version: '1.A@stable' },
    ];

    const resultArray = testArray.sort(global.adp.versionSort('version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
  it('Sorting an Array of Mixed Versions by "version" property (DESC).', (done) => {
    const testArray = [
      { version: '1.0.rc2' },
      { version: '1.A@st10' },
      { version: '1.0.rc1' },
      { version: '1.A@st11' },
      { version: '1.A@stable' },
      { version: '1.0.rc3' },
      { version: '1.0#00' },
      { version: '1.A.B.C.D.E.F.88' },
      { version: '1.A@ss10' },
    ];
    const expectedArray = [
      { version: '1.A@stable' },
      { version: '1.A@st11' },
      { version: '1.A@st10' },
      { version: '1.A@ss10' },
      { version: '1.A.B.C.D.E.F.88' },
      { version: '1.0.rc3' },
      { version: '1.0.rc2' },
      { version: '1.0.rc1' },
      { version: '1.0#00' },
    ];

    const resultArray = testArray.sort(global.adp.versionSort('-version'));

    expect(JSON.stringify(resultArray)).toBe(JSON.stringify(expectedArray));
    done();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
