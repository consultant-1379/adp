// ============================================================================================= //
/**
* Unit test for [ adp.migration.fixRBACGroupsIDOnUsers ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
const { ObjectId } = require('mongodb');
// ============================================================================================= //
class mockAdp {
  update() {
    if (adp.shouldCrash.Adp.update === 1) {
      const ERROR = 'MockError';
      return new Promise((RES, REJ) => REJ(ERROR));
    }
    return new Promise(RES => RES());
  }

  allUsersWhereRBACIDisString() {
    if (adp.shouldCrash.Adp.allUsersWhereRBACIDisString === 1) {
      const ERROR = 'MockError';
      return new Promise((RES, REJ) => REJ(ERROR));
    }
    if (adp.shouldCrash.Adp.allUsersWhereRBACIDisString === 2) {
      return new Promise(RES => RES({}));
    }
    const obj = {
      docs: [
        {
          _id: 'etest1',
          signum: 'etest1',
          name: 'test 1',
          rbac: [
            { _id: '602e415e01f5f70007a0a950', name: 'Wrong rbacGroup 1' },
          ],
        },
        {
          _id: 'etest2',
          signum: 'etest2',
          name: 'test 2',
          rbac: [
            { _id: '602e440d01f5f70007a0a952', name: 'Wrong rbacGroup 2' },
          ],
        },
        {
          _id: 'etest3',
          signum: 'etest3',
          name: 'test 3',
          rbac: [
            { _id: '602e415e01f5f70007a0a950', name: 'Wrong rbacGroup 1' },
            { _id: '602e440d01f5f70007a0a952', name: 'Wrong rbacGroup 2' }],
        },
      ],
    };
    return new Promise(RES => RES(obj));
  }
}
// ============================================================================================= //
class mockRBACGroups {
  indexGroups() {
    if (adp.shouldCrash.RBACGroups.indexGroups === 1) {
      const ERROR = 'MockError';
      return new Promise((RES, REJ) => REJ(ERROR));
    }
    if (adp.shouldCrash.RBACGroups.indexGroups === 2) {
      return new Promise(RES => RES({}));
    }
    const obj = {
      docs: [
        { _id: new ObjectId('602e415e01f5f70007a0a950'), name: 'test 1' },
        { _id: new ObjectId('602e440d01f5f70007a0a952'), name: 'test 2' },
      ],
    };
    return new Promise(RES => RES(obj));
  }
}
// ============================================================================================= //
describe('Testing [ adp.migration.fixRBACGroupsIDOnUsers ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.db = {};

    adp.docs = {};
    adp.docs.list = [];
    adp.echoLogTracker = [];
    adp.echoLog = (A1, A2) => {
      adp.echoLogTracker.push({ msg: A1, obj: A2 });
    };

    adp.models = {};
    adp.models.Adp = mockAdp;
    adp.models.RBACGroups = mockRBACGroups;

    adp.shouldCrash = {};
    adp.shouldCrash.Adp = {};
    adp.shouldCrash.Adp.update = 0;
    adp.shouldCrash.Adp.allUsersWhereRBACIDisString = 0;
    adp.shouldCrash.RBACGroups = {};
    adp.shouldCrash.RBACGroups.indexGroups = 0;

    adp.migration = {};
    adp.migration.fixRBACGroupsIDOnUsers = require('./fixRBACGroupsIDOnUsers');
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  afterEach(() => {
    global.adp = null;
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('A simple successful case.', (done) => {
    adp.migration.fixRBACGroupsIDOnUsers()
      .then((RESULT) => {
        const a = adp.echoLogTracker;

        expect(RESULT).toEqual(true);
        expect(a[0].obj.signum).toEqual('etest1');
        expect(a[0].obj.updatedGroupNames[0]).toEqual('test 1');
        expect(a[1].obj.signum).toEqual('etest2');
        expect(a[1].obj.updatedGroupNames[0]).toEqual('test 2');
        expect(a[2].obj.signum).toEqual('etest3');
        expect(a[2].obj.updatedGroupNames[0]).toEqual('test 1');
        expect(a[2].obj.updatedGroupNames[1]).toEqual('test 2');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ adp.models.RBACGroups.indexGroups ] crashes.', (done) => {
    adp.shouldCrash.RBACGroups.indexGroups = 1;
    adp.migration.fixRBACGroupsIDOnUsers()
      .then(() => {
        const a = adp.echoLogTracker;

        expect(a[0].msg).toEqual('Error caught on [ rbacModels.indexGroups @ adp.models.RBACGroups ] at [ allRBACGroups ]');
        expect(a[0].obj.origin).toEqual('allRBACGroups');
        expect(a[0].obj.error).toEqual('MockError');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ adp.models.RBACGroups.indexGroups ] returns an invalid answer.', (done) => {
    adp.shouldCrash.RBACGroups.indexGroups = 2;
    adp.migration.fixRBACGroupsIDOnUsers()
      .then(() => {
        const a = adp.echoLogTracker;

        expect(a).toEqual([]);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ adp.models.Adp.allUsersWhereRBACIDisString ] crashes.', (done) => {
    adp.shouldCrash.Adp.allUsersWhereRBACIDisString = 1;
    adp.migration.fixRBACGroupsIDOnUsers()
      .then(() => {
        const a = adp.echoLogTracker;

        expect(a[0].msg).toEqual('Error caught on [ adpModels.allUsersWhereRBACIDisString @ adp.models.Adp ] at [ allUsersNeedToBeUpdated ]');
        expect(a[0].obj.origin).toEqual('allUsersNeedToBeUpdated');
        expect(a[0].obj.error).toEqual('MockError');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ adp.models.Adp.allUsersWhereRBACIDisString ] returns an invalid answer.', (done) => {
    adp.shouldCrash.Adp.allUsersWhereRBACIDisString = 2;
    adp.migration.fixRBACGroupsIDOnUsers()
      .then(() => {
        const a = adp.echoLogTracker;

        expect(a).toEqual([]);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [ adp.models.Adp.update ] crashes.', (done) => {
    adp.shouldCrash.Adp.update = 1;
    return adp.migration.fixRBACGroupsIDOnUsers()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        const a = adp.echoLogTracker;

        expect(a[0].msg).toEqual('Caught an error on [ adpModels.update @ new adp.models.Adp ]');
        expect(a[0].obj.origin).toEqual('updateTheGroupsOnTheseUsers');
        expect(a[0].obj.error).toEqual('MockError');
        expect(a[0].obj.user.signum).toEqual('etest1');
        expect(a[1].obj.user.signum).toEqual('etest2');
        expect(a[2].obj.user.signum).toEqual('etest3');
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
