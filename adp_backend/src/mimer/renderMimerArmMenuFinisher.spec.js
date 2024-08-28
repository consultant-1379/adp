// ============================================================================================= //
/**
* Unit test for [ adp.mimer.renderMimerArmMenuFinisher ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //


class MockRenderMimerArm {
  finshRenderProcess() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.finshRenderProcess === true) {
        const obj = true;
        RES(obj);
      } else {
        const obj = false;
        REJ(obj);
      }
    });
  }
}

class MockAdp {
  getAssetSlugUsingID() {
    return new Promise(RES => RES('mock-asset-slug'));
  }
}


// ============================================================================================= //


describe('Testing [ adp.mimer.renderMimerArmMenuFinisher ] Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.mockBehavior = {};
    adp.mockBehavior.finshRenderProcess = true;
    adp.echoLog = () => {};
    adp.queue = {};
    adp.queue.getGroupStatus = () => new Promise(RES => RES(0));
    adp.queue.setPayload = () => new Promise(RES => RES());
    adp.queue.addJob = () => new Promise(RES => RES(true));
    adp.mimer = {};
    adp.mimer.RenderMimerArm = MockRenderMimerArm;
    adp.mimer.renderMimerArmMenuFinisher = require('./renderMimerArmMenuFinisher');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Simple Successful Case.', (done) => {
    adp.mimer.renderMimerArmMenuFinisher('MockMSID')
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Simple Negative Case.', (done) => {
    adp.mockBehavior.finshRenderProcess = false;
    adp.mimer.renderMimerArmMenuFinisher('MockMSID')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});


// ============================================================================================= //
