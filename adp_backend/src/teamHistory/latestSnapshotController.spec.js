const testData = require('./latestSnapshotController.spec.json');

/**
* Unit test for [ adp.teamHistory.LatestSnapshotController ]
* @author Cein-Sven Da Costa [edaccei]
*/

describe('Testing [ adp.teamHistory.LatestSnapshotController ].', () => {
  let searchByMailerResp;
  let getSnapshotsByIdResp;
  let bulkSnapshotUpdateCreateResp;
  let fetchLastSnapshotByMsIdResp;

  class MockTeamHistoryController {
    constructor() {
      this.getSnapshotsByIdResp = getSnapshotsByIdResp;
      this.bulkSnapshotUpdateCreateResp = bulkSnapshotUpdateCreateResp;
      this.fetchLastSnapshotByMsIdResp = fetchLastSnapshotByMsIdResp;
    }

    getSnapshotsById(snapshotIdsList) {
      return new Promise((res, rej) => {
        adp.unitTestObj.getSnapshotsByIdGivenParam = snapshotIdsList;
        if (this.getSnapshotsByIdResp.res) {
          res(this.getSnapshotsByIdResp.data);
        } else {
          rej(this.getSnapshotsByIdResp.data);
        }
      });
    }

    bulkSnapshotUpdateCreate(bulkOpSnapshots) {
      return new Promise((res, rej) => {
        adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam = bulkOpSnapshots;
        if (this.bulkSnapshotUpdateCreateResp.res) {
          res(this.bulkSnapshotUpdateCreateResp.data);
        } else {
          rej(this.bulkSnapshotUpdateCreateResp.data);
        }
      });
    }

    fetchLastSnapshotByMsId() {
      return new Promise((res, rej) => {
        if (this.fetchLastSnapshotByMsIdResp.res) {
          res(this.fetchLastSnapshotByMsIdResp.data);
        } else {
          rej(this.fetchLastSnapshotByMsIdResp.data);
        }
      });
    }
  }

  class MockRecursivePDLMembers {
    constructor(mailers, includePortalUserData) {
      this.mailer = mailers;
      this.includeUserDate = includePortalUserData;
      this.searchByMailersResp = searchByMailerResp;
    }

    searchByMailers() {
      return new Promise((res, rej) => {
        if (this.searchByMailersResp.res) {
          res(this.searchByMailersResp.data);
        } else {
          rej(this.searchByMailersResp.resp.date);
        }
      });
    }
  }
  beforeEach(() => {
    searchByMailerResp = { res: true, data: [] };
    getSnapshotsByIdResp = { res: true, data: [] };
    bulkSnapshotUpdateCreateResp = { res: true, data: [] };
    fetchLastSnapshotByMsIdResp = { res: true, data: [] };

    adp = {};
    adp.unitTestObj = {
      bulkSnapshotUpdateCreateGivenParam: [],
      getSnapshotsByIdGivenParam: [],
    };

    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.config = {};
    adp.config.innersourceLaunchDate = new Date('January 1, 3000 00:00:00');

    adp.peoplefinder = {};
    adp.peoplefinder.RecursivePDLMembers = MockRecursivePDLMembers;

    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = MockTeamHistoryController;

    adp.teamHistory.LatestSnapshotController = require('./LatestSnapshotController');
  });

  afterEach(() => {
    adp = null;
  });

  it('Should create new snapshot with date_created as the 1st jan snapshot due to the launch date being in the future.', (done) => {
    const {
      msListData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamDetailChangeTest;

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinder = searchByMailerData.members[0].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = { lastSnapshotList: [], errors: [] };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).not.toBeDefined();
      expect(result._rev).not.toBeDefined();
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      const { portal, peopleFinder } = result.team[0];

      expect(result.team.length).toBe(1);
      expect(portal._id).toBe(expPortal[0]._id);
      expect(portal.signum).toBe(expPortal[0].signum);
      expect(portal.serviceOwner).toBe(expPortal[0].serviceOwner);

      expect(peopleFinder.mailNickname).toBe(expPplFinder.mailNickname);
      expect(peopleFinder.displayName).toBe(expPplFinder.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should create new snapshot with date_created not as 1st jan snapshot due to the launch date being in the past.', (done) => {
    const {
      msListData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamDetailChangeTest;

    adp.config.innersourceLaunchDate = new Date(+0);

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinder = searchByMailerData.members[0].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = { lastSnapshotList: [], errors: [] };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData, true);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).not.toBeDefined();
      expect(result._rev).not.toBeDefined();
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).not.toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      const { portal, peopleFinder } = result.team[0];

      expect(result.team.length).toBe(1);
      expect(portal._id).toBe(expPortal[0]._id);
      expect(portal.signum).toBe(expPortal[0].signum);
      expect(portal.serviceOwner).toBe(expPortal[0].serviceOwner);

      expect(peopleFinder.mailNickname).toBe(expPplFinder.mailNickname);
      expect(peopleFinder.displayName).toBe(expPplFinder.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should detect detail changes, update existing snapshot with date_created as 1st jan snapshot due to the launch date being in the future.', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamDetailChangeTest;

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinder = searchByMailerData.members[0].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).toBe(fetchLastSnapshotByMsIdData[0]._id);
      expect(result._rev).toBe(fetchLastSnapshotByMsIdData[0]._rev);
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      expect(result.date_updated).toBeDefined();

      const { portal, peopleFinder } = result.team[0];

      expect(result.team.length).toBe(1);
      expect(portal._id).toBe(expPortal[0]._id);
      expect(portal.signum).toBe(expPortal[0].signum);
      expect(portal.serviceOwner).toBe(expPortal[0].serviceOwner);

      expect(peopleFinder.mailNickname).toBe(expPplFinder.mailNickname);
      expect(peopleFinder.displayName).toBe(expPplFinder.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should detect detail changes, create a new snapshot with date_created not as 1st jan snapshot due to the launch date being in the past.', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamDetailChangeTest;

    adp.config.innersourceLaunchDate = new Date(+0);

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinder = searchByMailerData.members[0].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData, true);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).not.toBeDefined();
      expect(result._rev).not.toBeDefined();
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).not.toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      expect(result.date_updated).not.toBeDefined();

      const { portal, peopleFinder } = result.team[0];

      expect(result.team.length).toBe(1);
      expect(portal._id).toBe(expPortal[0]._id);
      expect(portal.signum).toBe(expPortal[0].signum);
      expect(portal.serviceOwner).toBe(expPortal[0].serviceOwner);

      expect(peopleFinder.mailNickname).toBe(expPplFinder.mailNickname);
      expect(peopleFinder.displayName).toBe(expPplFinder.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should not create a snapshot, if the team and their details have not changed.', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.noTeamChangesTest;

    adp.config.innersourceLaunchDate = new Date(+0);

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should not update a snapshot, if the team and their details have not changed.', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.noTeamChangesTest;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should detect team member changes and create a new snapshot with launch in the past', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    adp.config.innersourceLaunchDate = new Date(+0);

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinderMemb1 = searchByMailerData.members[0].peopleFinder;
    const expPplFinderMemb2 = searchByMailerData.members[1].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData, true);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).not.toBeDefined();
      expect(result._rev).not.toBeDefined();
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).not.toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      expect(result.date_updated).not.toBeDefined();

      const { portal: portalMember1, peopleFinder: peopleFinderMember1 } = result.team[0];
      const { portal: portalMember2, peopleFinder: peopleFinderMember2 } = result.team[1];

      expect(result.team.length).toBe(2);
      expect(portalMember1._id).toBe(expPortal[0]._id);
      expect(portalMember1.signum).toBe(expPortal[0].signum);
      expect(portalMember1.serviceOwner).toBe(expPortal[0].serviceOwner);
      expect(portalMember2._id).toBe(expPortal[1]._id);
      expect(portalMember2.signum).toBe(expPortal[1].signum);
      expect(portalMember2.serviceOwner).toBe(expPortal[1].serviceOwner);

      expect(peopleFinderMember1.mailNickname).toBe(expPplFinderMemb1.mailNickname);
      expect(peopleFinderMember1.displayName).toBe(expPplFinderMemb1.displayName);
      expect(peopleFinderMember2.mailNickname).toBe(expPplFinderMemb2.mailNickname);
      expect(peopleFinderMember2.displayName).toBe(expPplFinderMemb2.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should detect team member changes and update the snapshot with launch in the future', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinderMemb1 = searchByMailerData.members[0].peopleFinder;
    const expPplFinderMemb2 = searchByMailerData.members[1].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).toBe(fetchLastSnapshotByMsIdData[0]._id);
      expect(result._rev).toBe(fetchLastSnapshotByMsIdData[0]._rev);
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      expect(result.date_updated).toBeDefined();

      const { portal: portalMember1, peopleFinder: peopleFinderMember1 } = result.team[0];
      const { portal: portalMember2, peopleFinder: peopleFinderMember2 } = result.team[1];

      expect(result.team.length).toBe(2);
      expect(portalMember1._id).toBe(expPortal[0]._id);
      expect(portalMember1.signum).toBe(expPortal[0].signum);
      expect(portalMember1.serviceOwner).toBe(expPortal[0].serviceOwner);
      expect(portalMember2._id).toBe(expPortal[1]._id);
      expect(portalMember2.signum).toBe(expPortal[1].signum);
      expect(portalMember2.serviceOwner).toBe(expPortal[1].serviceOwner);

      expect(peopleFinderMember1.mailNickname).toBe(expPplFinderMemb1.mailNickname);
      expect(peopleFinderMember1.displayName).toBe(expPplFinderMemb1.displayName);
      expect(peopleFinderMember2.mailNickname).toBe(expPplFinderMemb2.mailNickname);
      expect(peopleFinderMember2.displayName).toBe(expPplFinderMemb2.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should continue to update snapshots if the errors returned from Peoplefinder does not container 500 errirs', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    searchByMailerData.errors.push({ message: 'bad request test', code: 400 });

    const { _id: expAssetId, team: expPortal } = msListData[0];
    const expPplFinderMemb1 = searchByMailerData.members[0].peopleFinder;
    const expPplFinderMemb2 = searchByMailerData.members[1].peopleFinder;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      const result = adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam[0];

      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(1);
      expect(result._id).toBe(fetchLastSnapshotByMsIdData[0]._id);
      expect(result._rev).toBe(fetchLastSnapshotByMsIdData[0]._rev);
      expect(result.asset_id).toBe(expAssetId);
      expect((new Date(result.date_created)).getTime()).toBe(
        (new Date(getSnapshotsByIdResp.data.docs[0].date_created)).getTime(),
      );

      expect(result.date_updated).toBeDefined();

      const { portal: portalMember1, peopleFinder: peopleFinderMember1 } = result.team[0];
      const { portal: portalMember2, peopleFinder: peopleFinderMember2 } = result.team[1];

      expect(result.team.length).toBe(2);
      expect(portalMember1._id).toBe(expPortal[0]._id);
      expect(portalMember1.signum).toBe(expPortal[0].signum);
      expect(portalMember1.serviceOwner).toBe(expPortal[0].serviceOwner);
      expect(portalMember2._id).toBe(expPortal[1]._id);
      expect(portalMember2.signum).toBe(expPortal[1].signum);
      expect(portalMember2.serviceOwner).toBe(expPortal[1].serviceOwner);

      expect(peopleFinderMember1.mailNickname).toBe(expPplFinderMemb1.mailNickname);
      expect(peopleFinderMember1.displayName).toBe(expPplFinderMemb1.displayName);
      expect(peopleFinderMember2.mailNickname).toBe(expPplFinderMemb2.mailNickname);
      expect(peopleFinderMember2.displayName).toBe(expPplFinderMemb2.displayName);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should not update a new snapshot if adp.peoplefinder.RecursivePDLMembers rejects', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    searchByMailerResp.res = false;

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should not update a new snapshot if adp.peoplefinder.RecursivePDLMembers has errors with code 500', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    searchByMailerData.errors.push({ code: 500 });

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(adp.unitTestObj.bulkSnapshotUpdateCreateGivenParam.length).toBe(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('fetchLatestSnapshots: Should reject if bulk create update rejects.', (done) => {
    const {
      msListData, fetchLastSnapshotByMsIdData, searchByMailerData, getSnapshotsByIdData,
    } = testData.teamChangedTest;

    fetchLastSnapshotByMsIdResp.data = {
      lastSnapshotList: fetchLastSnapshotByMsIdData, errors: [],
    };
    searchByMailerResp.data = searchByMailerData;
    getSnapshotsByIdResp.data = getSnapshotsByIdData;
    bulkSnapshotUpdateCreateResp.data = [{ id: getSnapshotsByIdResp.data.docs[0]._id }];

    const testError = 'test';
    bulkSnapshotUpdateCreateResp.res = false;
    bulkSnapshotUpdateCreateResp.data = [{ error: testError }];

    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(msListData);
    lastestSnapContr.fetchLatestSnapshots().then((resp) => {
      expect(resp.errors.length).toBe(1);
      expect(resp.errors[0].code).toBe(500);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('fetchLatestSnapshots: Should reject if mail list is not an array', (done) => {
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController(1);
    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('fetchLatestSnapshots: Should reject if fetchLastSnapshotByMsId rejects', (done) => {
    fetchLastSnapshotByMsIdResp.res = false;
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController([]);

    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('fetchLatestSnapshots: Should reject if fetchLastSnapshotByMsId response is not and array', (done) => {
    fetchLastSnapshotByMsIdResp.data = 'Not an array';
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController([]);

    lastestSnapContr.fetchLatestSnapshots().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlMembersFetch: Should reject if the given mailers are not of type array', (done) => {
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController([]);

    lastestSnapContr.pdlMembersFetch('not an array', 'test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.errors.length).toBe(1);
      expect(error.errors[0].code).toBe(500);
      done();
    });
  });

  it('_fetchAfterBulkOperations: Should reject getSnapshotsById rejects', (done) => {
    getSnapshotsByIdResp.res = false;
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController([]);
    lastestSnapContr._fetchAfterBulkOperations([], 'test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('_fetchAfterBulkOperations: Should reject getSnapshotsById if the returning data is empty', (done) => {
    getSnapshotsByIdResp.data = { docs: [] };
    const lastestSnapContr = new adp.teamHistory.LatestSnapshotController([]);
    lastestSnapContr._fetchAfterBulkOperations([], 'test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });
});
