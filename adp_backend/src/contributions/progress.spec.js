// ============================================================================================= //
/**
* Unit test for [ adp.contributions.progress ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ adp.contributions.progress ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.clone = J => JSON.parse(JSON.stringify(J));
    adp.echoLog = () => {};
    adp.contributions = {};
    adp.contributions.progress = require('./progress');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a successful case, returning only the instance ID', async (done) => {
    const assetId = 'mock-asset-id';
    const executionId = 'mock-timestamp-0001';
    const action = 'START';
    const mode = 'SELF';
    adp.contributions.progress(assetId, executionId, action, mode)
      .then((RESULT) => {
        expect(RESULT).toBe('mock-asset-id_mock-timestamp-0001');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a successful case, returning the full object', async (done) => {
    const assetId = 'mock-asset-id';
    const executionId = 'mock-timestamp-0001';
    const action = 'START';
    adp.contributions.progress(assetId, executionId, action)
      .then((RESULT) => {
        const obj = RESULT['mock-asset-id_mock-timestamp-0001'];
        if (obj === null || obj === undefined) {
          done.fail();
        } else {
          expect(obj.keeptUntil).toBeDefined();
          expect(obj.status).toBe('STARTED');
          expect(obj.startAt).toBeDefined();
          done();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing after finish an instance', async (done) => {
    const assetId = 'mock-asset-id';
    const executionId = 'mock-timestamp-0001';
    const action = 'START';
    const mode = 'SELF';
    adp.contributions.progress(assetId, executionId, action, mode)
      .then(() => {
        adp.contributions.progress(assetId, executionId, 'END')
          .then((RESULT) => {
            const obj = RESULT['mock-asset-id_mock-timestamp-0001'];

            expect(obj.keeptUntil).toBeDefined();
            expect(obj.status).toBe('ENDED');
            expect(obj.startAt).toBeDefined();
            expect(obj.endAt).toBeDefined();
            done();
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing simulation about clear an old instance', async (done) => {
    const assetId = 'mock-asset-id';
    const executionId = 'mock-timestamp-0002';
    const action = 'START';
    const mode = 'SELF';
    adp.contributions.contributorsStatisticsProgress = {
      'mock-asset-id_mock-timestamp-0001': {
        keeptUntil: new Date('2019-11-14T01:54:20.310Z'),
        status: 'ENDED',
        startAt: new Date('2019-11-13T13:54:20.310Z'),
        endAt: new Date('2019-11-13T13:54:20.310Z'),
      },
    };
    adp.contributions.progress(assetId, executionId, action, mode)
      .then(() => {
        adp.contributions.progress(assetId, executionId, 'END')
          .then((RESULT) => {
            const objA = RESULT['mock-asset-id_mock-timestamp-0001'];
            const objB = RESULT['mock-asset-id_mock-timestamp-0002'];

            expect(objA).toBeUndefined();
            expect(objB).toBeDefined();
            done();
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
