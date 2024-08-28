// ============================================================================================= //
/**
* Unit test for [ adp.mimer.renderMimerArmMenu ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //


class MockRenderMimerArm {
  mainQueuePreparation() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.mainQueuePreparation === true) {
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


describe('Testing [ adp.mimer.renderMimerArmMenu ] Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mockBehavior = {};
    adp.mockBehavior.mainQueuePreparation = true;
    adp.echoLog = () => {};
    adp.mimer = {};
    adp.mimer.RenderMimerArm = MockRenderMimerArm;
    adp.mimer.renderMimerArmMenu = require('./renderMimerArmMenu');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Simple Successful Case.', (done) => {
    adp.mimer.renderMimerArmMenu('MockMSID')
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Simple Negative Case.', (done) => {
    adp.mockBehavior.mainQueuePreparation = false;
    adp.mimer.renderMimerArmMenu('MockMSID')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});


// ============================================================================================= //
