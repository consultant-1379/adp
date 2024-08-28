// ============================================================================================= //
/**
* Unit test for [ metrics.register ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
describe('Testing [ metrics.register ]', () => {
  global.adp = {};
  global.adp.docs = {};
  global.adp.docs.list = [];
  const {
    registerCustomMetrics, customMetrics, clearRegisters, TutorialRegistryClass,
  // eslint-disable-next-line global-require
  } = require('./register');

  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = text => text;
  });

  afterAll(() => {
    global.adp = null;
    clearRegisters();
  });

  it('Should create custom registors.', (done) => {
    registerCustomMetrics().then(() => {
      expect(true).toBeTruthy();
      expect(customMetrics).toBeDefined();
      expect(Object.entries(customMetrics).length).toBeGreaterThan(0);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should create tutorial register.', (done) => {
    TutorialRegistryClass.createTutorialRegistry().then(() => {
      expect(true).toBeTruthy();
      expect(global.customRegisters.tutorialRegistry).toBeDefined();
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
