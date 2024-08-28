// ============================================================================================= //
/**
* Unit test for [ global.adp.getDefaultRBACGroupID ]
* @author Veerender voskula [zvosvee]
*/
// ============================================================================================= //
describe('Testing [ global.adp.getDefaultRBACGroupID ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.config = {};
    adp.DEFAULT_GROUPID = '602e415e01f5f70007a0a950';
    global.adp.getDefaultRBACGroupID = require('./getDefaultRBACGroupID');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should give Internal Users Group for eid users.', (done) => {
    expect(global.adp.getDefaultRBACGroupID('emeuse')).toEqual(adp.DEFAULT_GROUPID);
    done();
  });

  it('Should give Internal Users Group for xid,zid and all different users.', (done) => {
    expect(global.adp.getDefaultRBACGroupID('xtapase')).toEqual(adp.DEFAULT_GROUPID);
    expect(global.adp.getDefaultRBACGroupID('ztapase')).toEqual(adp.DEFAULT_GROUPID);
    expect(global.adp.getDefaultRBACGroupID('ktapase')).toEqual(adp.DEFAULT_GROUPID);
    done();
  });

  it('Should give Internal Users Group for empty param', (done) => {
    expect(global.adp.getDefaultRBACGroupID()).toEqual(adp.DEFAULT_GROUPID);
    done();
  });
});
// ============================================================================================= //
