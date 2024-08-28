/**
* Unit test for [ cs.UpdateUserData ]
* @author Cein
*/

class MockInnersourceUserHistory {
  createUserSnapshot(signum, fullName, email, organisation, pplFinderUser) {
    return new Promise((res, rej) => {
      const receivedData = {
        signum, fullName, email, organisation, pplFinderUser,
      };
      const mockResp = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp;
      if (mockResp.res) {
        adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData = receivedData;
        res(mockResp.data);
      } else {
        rej(mockResp.data);
      }
    });
  }

  getUserSnapshot() {
    return new Promise((res, rej) => {
      const mockResp = adp.models.InnersourceUserHistoryMock.getUserSnapshot;
      if (mockResp.res) {
        res(mockResp.data);
      } else {
        rej(mockResp.data);
      }
    });
  }
}

describe('Unit test for cs.UpdateUserData', () => {
  beforeEach(() => {
    adp = {};

    adp.echoLog = () => {};

    adp.models = {};
    adp.models.InnersourceUserHistory = MockInnersourceUserHistory;
    adp.models.InnersourceUserHistoryMock = {
      createUserSnapshotResp: {
        res: true,
        data: [],
        receivedData: [],
      },
      getUserSnapshot: {
        res: true,
        data: { docs: [] },
      },
    };

    cs = {};
    cs.mode = 'CLASSICMODE';
    cs.UpdateUserDataLocalCacheArray = [];
    cs.UpdateUserData = require('./UpdateUserData');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should create a new user snapshot if there is no existing user snapshot.', (done) => {
    const testOrganisation = 'bdgs bdgs';
    const testData = {
      profileID: 'testid',
      operationalUnit: `bdgs  ${testOrganisation} other data`,
      displayName: 'name',
      email: 'email',
    };

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      const {
        signum, fullName, email, organisation, pplFinderUser,
      } = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData;

      expect(signum).toBe(testData.profileID);
      expect(fullName).toBe(testData.displayName);
      expect(email).toBe(testData.email);
      expect(testOrganisation).toBe(organisation);
      expect(pplFinderUser).toBeDefined();

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('Should create a new user snapshot if the users existing snapshot has a different organisation.', (done) => {
    const testOrganisation = 'new other';
    const testData = {
      profileID: 'testid',
      operationalUnit: ` ${testOrganisation} other info `,
      displayName: 'name',
      email: 'email',
    };
    const existingSnapshot = {
      signum: testData.profileID,
      fullName: testData.displayName,
      email: testData.email,
      organisation: 'old',
      pplFinderUser: {},
    };
    adp.models.InnersourceUserHistoryMock.getUserSnapshot.data.docs = [existingSnapshot];

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      const {
        signum, fullName, email, organisation, pplFinderUser,
      } = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData;

      expect(signum).toBe(testData.profileID);
      expect(fullName).toBe(testData.displayName);
      expect(email).toBe(testData.email);
      expect(testOrganisation).toBe(organisation);
      expect(pplFinderUser).toBeDefined();

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('Should not create a new user snapshot if the users existing snapshot has the same organisation.', (done) => {
    const testData = {
      profileID: 'testid',
      operationalUnit: null,
      displayName: 'name',
      email: 'email',
    };
    const existingSnapshot = {
      signum: testData.profileID,
      fullName: testData.displayName,
      email: testData.email,
      pplFinderUser: {},
    };
    adp.models.InnersourceUserHistoryMock.getUserSnapshot.data.docs = [existingSnapshot];

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      const {
        signum, fullName, email, organisation, pplFinderUser,
      } = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData;

      expect(signum).toBeUndefined();
      expect(fullName).toBeUndefined();
      expect(email).toBeUndefined();
      expect(organisation).toBeUndefined();
      expect(pplFinderUser).toBeUndefined();

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('Should create a new user snapshot with organisation as an empty string, if the peopleFinder operationalUnit is no type string.', (done) => {
    const testData = {
      profileID: 'testid',
      operationalUnit: 1,
      displayName: 'name',
      email: 'email',
    };

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      const {
        signum, fullName, email, organisation, pplFinderUser,
      } = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData;

      expect(signum).toBe(testData.profileID);
      expect(fullName).toBe(testData.displayName);
      expect(email).toBe(testData.email);
      expect(organisation).toBe('');
      expect(pplFinderUser).toBeDefined();

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('Should not run the same user twice in the same instance.', (done) => {
    const testData = {
      profileID: 'testid',
      operationalUnit: null,
      displayName: 'name',
      email: 'email',
    };
    cs.UpdateUserDataLocalCacheArray = [testData.profileID];

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      const {
        signum, fullName, email, organisation, pplFinderUser,
      } = adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.receivedData;

      expect(signum).toBeUndefined();
      expect(fullName).toBeUndefined();
      expect(email).toBeUndefined();
      expect(organisation).toBeUndefined();
      expect(pplFinderUser).toBeUndefined();

      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('Should reject if getUserSnapshot rejects.', (done) => {
    const testData = {
      profileID: 'testid',
      operationalUnit: null,
      displayName: 'name',
      email: 'email',
    };

    adp.models.InnersourceUserHistoryMock.getUserSnapshot.res = false;

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      done.fail();
    }).catch((errorGettingSnap) => {
      expect(errorGettingSnap.code).toBe(500);
      done();
    });
  });

  it('Should reject if createUserSnapshot rejects.', (done) => {
    const testData = {
      profileID: 'testid',
      operationalUnit: null,
      displayName: 'name',
      email: 'email',
    };

    adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.res = false;
    adp.models.InnersourceUserHistoryMock.createUserSnapshotResp.data = { code: 500 };

    const updateUserData = new cs.UpdateUserData();
    updateUserData.update(testData).then(() => {
      done.fail();
    }).catch((errorCreateSnap) => {
      expect(errorCreateSnap.code).toBe(500);
      done();
    });
  });

  it('getDepartment : Should return processed department value.', (done) => {
    const testOrgDataCollection = [
      { raw: 'BDGS SA PDU TEST', output: 'BDGS SA PDU TEST' },
      { raw: 'bdgs sa test pdu test2 test3', output: 'bdgs sa test pdu test2' },
      { raw: 'bdgs sa test notpdu test test2 test3', output: 'bdgs sa test notpdu' },
      { raw: 'bdgs rdps test test2', output: 'bdgs rdps test' },
      { raw: 'bdgs notrdps test test2 test3', output: 'bdgs notrdps' },
      { raw: 'bnew dnew test test2 test3', output: 'bnew dnew test' },
      { raw: 'bnew notdnew test test2 test3', output: 'bnew notdnew' },
      { raw: 'notbnew notdnew test test2 test3', output: 'notbnew notdnew' },
    ];

    const updateUserData = new cs.UpdateUserData();
    testOrgDataCollection.forEach(async (testOrganisation) => {
      expect(updateUserData.getDepartment(testOrganisation.raw).organisation)
        .toEqual(testOrganisation.output);
    });
    done();
  });
});
