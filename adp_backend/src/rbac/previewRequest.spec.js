/**
* Unit test for [ adp.rbac.previewRequest ]
* @author Cein
*/
describe('Testing results of [ adp.rbac.previewRequest  ] ', () => {
  class MockAdp {
    getUsersById() {
      return new Promise((res, rej) => {
        if (adp.models.adpResp.res) {
          res(adp.models.adpResp.data);
        } else {
          rej(adp.models.adpResp.data);
        }
      });
    }
  }

  class MockRBACGroups {
    getGroupByIds() {
      return new Promise((res, rej) => {
        if (adp.models.RBACGroupsResp.res) {
          res(adp.models.RBACGroupsResp.data);
        } else {
          rej(adp.models.RBACGroupsResp.data);
        }
      });
    }
  }

  class MockMongoObjectId {
    constructor(id) {
      return id;
    }
  }

  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};

    adp.models = {
      adpResp: {
        res: true,
        data: { docs: [] },
      },
      Adp: MockAdp,

      RBACGroupsResp: {
        res: true,
        data: { docs: [] },
      },
      RBACGroups: MockRBACGroups,
    };

    adp.MongoObjectID = MockMongoObjectId;

    adp.rbac = { previewRequest: require('./previewRequest') };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return sourceUser only if a single signum string is given', (done) => {
    const testSignum = 'testSig';
    adp.models.adpResp.data.docs = [{ _id: testSignum }];

    adp.rbac.previewRequest({ body: { source: testSignum } }).then((result) => {
      expect(result.sourceUser.length).toBe(1);
      expect(result.sourceUser[0]._id).toBe(testSignum);
      expect(result.sourceGroup).toBeNull();
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('group');
      done();
    }).catch(() => done.fail());
  });

  it('Should return sourceUser if a list of signums are given', (done) => {
    const testSignum = 'testSig';
    const testSignum2 = 'testSig2';
    adp.models.adpResp.data.docs = [{ _id: testSignum }, { _id: testSignum2 }];

    const reqObj = {
      body: {
        source: [testSignum, testSignum2],
        target: 'test',
        preview: true,
        track: true,
      },
    };

    adp.rbac.previewRequest(reqObj).then((result) => {
      expect(result.sourceUser.length).toBe(2);
      expect(result.sourceUser[0]._id).toBe(testSignum);
      expect(result.sourceUser[1]._id).toBe(testSignum2);
      expect(result.sourceGroup).toBeNull();
      expect(result.target.length).toBe(1);
      expect(result.preview).toBeTruthy();
      expect(result.track).toBeTruthy();
      expect(result.errorReason).toContain('group');
      done();
    }).catch(() => done.fail());
  });

  it('Should return sourceGroup only if a single groupId string is given', (done) => {
    const testGroupId = 'testgrp';
    adp.models.RBACGroupsResp.data.docs = [{ _id: testGroupId }];

    adp.rbac.previewRequest({ body: { source: testGroupId } }).then((result) => {
      expect(result.sourceUser).toBeNull();
      expect(result.sourceGroup.length).toBe(1);
      expect(result.sourceGroup[0]._id).toBe(testGroupId);
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('user');
      done();
    }).catch(() => done.fail());
  });

  it('Should return sourceGroup if a list of groupIds are given', (done) => {
    const testGroupId = 'testgrp';
    const testGroupId2 = 'testgrp2';
    adp.models.RBACGroupsResp.data.docs = [{ _id: testGroupId }, { _id: testGroupId2 }];

    const reqObj = {
      body: {
        source: [testGroupId, testGroupId2],
        target: ['test'],
        preview: false,
        track: false,
      },
    };

    adp.rbac.previewRequest(reqObj).then((result) => {
      expect(result.sourceUser).toBeNull();
      expect(result.sourceGroup.length).toBe(2);
      expect(result.sourceGroup[0]._id).toBe(testGroupId);
      expect(result.sourceGroup[1]._id).toBe(testGroupId2);
      expect(result.target.length).toBe(1);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('user');
      done();
    }).catch(() => done.fail());
  });

  it('Should return sourceUser & source group if a single signum string is given', (done) => {
    const testSignum = 'testSig';
    adp.models.adpResp.data.docs = [{ _id: testSignum }];

    adp.rbac.previewRequest({ body: { source: testSignum } }).then((result) => {
      expect(result.sourceUser.length).toBe(1);
      expect(result.sourceUser[0]._id).toBe(testSignum);
      expect(result.sourceGroup).toBeNull();
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('group');
      done();
    }).catch(() => done.fail());
  });

  it('Should return null sourceUser and sourceGroup if both Adp and RBACGroups models reject, Error should reflect no groups or users found', async (done) => {
    adp.models.RBACGroupsResp.res = false;

    await adp.rbac.previewRequest({ body: { source: 'testSig' } }).then((result) => {
      expect(result.sourceUser.length).toBe(0);
      expect(result.sourceGroup.length).toBe(0);
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('group');
      expect(result.errorReason).toContain('user');
    }).catch(() => done.fail());

    adp.models.adpResp.res = false;
    await adp.rbac.previewRequest({ body: { source: ['testSig', 'testSig2'] } }).then((result) => {
      expect(result.sourceUser.length).toBe(0);
      expect(result.sourceGroup.length).toBe(0);
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('group');
      expect(result.errorReason).toContain('user');
    }).catch(() => done.fail());

    done();
  });

  it('Should return null sourceUser and sourceGroup if both Adp and RBACGroups models returns empty arrays, Error should reflect no groups or users found', (done) => {
    adp.rbac.previewRequest({ body: { source: ['testSig'] } }).then((result) => {
      expect(result.sourceUser).toBeNull();
      expect(result.sourceGroup).toBeNull();
      expect(result.target.length).toBe(0);
      expect(result.preview).toBeFalsy();
      expect(result.track).toBeFalsy();
      expect(result.errorReason).toContain('group');
      expect(result.errorReason).toContain('user');
      done();
    }).catch(() => done.fail());
  });
});
