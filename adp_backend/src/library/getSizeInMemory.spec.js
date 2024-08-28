// ============================================================================================= //
/**
* Unit test for [ global.adp.getSizeInMemory ]
* @author Rinosh Cherian [zcherin]
*/
// ============================================================================================= //
describe('Testing [ global.adp.getSizeInMemory ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.getSizeInMemory = require('./getSizeInMemory'); // eslint-disable-line global-require
    global.sizeof = function s(size) {
      return size;
    };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.getSizeInMemory ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.getSizeInMemory).toBeDefined();
    done();
  });

  // =========================================================================================== //
  it('get the size of an Object to be Zero bytes in string mode.', () => {
    const testSize = 0;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result === 'Zero bytes');

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be in bytes in string mode.', () => {
    const testSize = 1;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result.includes('bytes'));

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be in Kbytes in string mode.', () => {
    const testSize = 1024;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result.includes('Kbytes'));

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be in Mbytes in string mode.', () => {
    const testSize = 1024 * 1024;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result.includes('Mbytes'));

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be in Gbytes in string mode.', () => {
    const testSize = 1024 * 1024 * 1024;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result.includes('Gbytes'));

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be in Tbytes in string mode.', () => {
    const testSize = 1024 * 1024 * 1024 * 1024;
    const stringMode = true;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result.includes('Tbytes'));

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('get the size of an Object to be Zero bytes in number.', () => {
    const testSize = 0;
    const stringMode = false;
    const result = global.adp.getSizeInMemory(testSize, stringMode);
    const isEqual = (result === 0);

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
