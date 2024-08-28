// ============================================================================================= //
/**
* Unit test for [ adp.mimer.renderMimerArmMenuVersion ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //


class MockRenderMimerArm {
  versionDocumentPreparation() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.versionDocumentPreparation === true) {
        const obj = true;
        RES(obj);
      } else {
        const obj = false;
        REJ(obj);
      }
    });
  }
}


// ============================================================================================= //


describe('Testing [ adp.mimer.renderMimerArmMenuVersion ] Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mockBehavior = {};
    adp.mockBehavior.versionDocumentPreparation = true;
    adp.echoLog = () => {};
    adp.mimer = {};
    adp.mimer.RenderMimerArm = MockRenderMimerArm;
    adp.mimer.renderMimerArmMenuVersion = require('./renderMimerArmMenuVersion');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Simple Successful Case.', (done) => {
    adp.mimer.renderMimerArmMenuVersion('MockMSID')
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Simple Negative Case.', (done) => {
    adp.mockBehavior.versionDocumentPreparation = false;
    adp.mimer.renderMimerArmMenuVersion('MockMSID')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});


// ============================================================================================= //
