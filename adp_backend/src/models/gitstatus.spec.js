/**
* Unit test for [ adp.models.Gitstatus ]
* @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm], Veerender Voskula[zvosvee], Michael
*/

const MockReleaseSettings = class {
  getReleaseSettings() {
    if (adp.mock.getReleaseSettings === 0) {
      return new Promise((RES) => {
        RES({});
      });
    }
    if (adp.mock.getReleaseSettings === 1) {
      return new Promise((RES) => {
        RES({ docs: [{ key: 'gitstatus-by-tag', isEnabled: true }] });
      });
    }
    if (adp.mock.getReleaseSettings === 2) {
      return new Promise((RES) => {
        RES({ docs: [{ key: 'gitstatus-by-tag', isEnabled: false }] });
      });
    }
    return new Promise((RES, REJ) => {
      REJ(new Error('mockError'));
    });
  }
};

describe('Testing [ adp.models.Gitstatus ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mock = {};
    adp.mock.getReleaseSettings = 0;
    adp.check = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.models = {};
    adp.models.ReleaseSettings = MockReleaseSettings;
    adp.models.GitstatusCollectionControl = 'gitstatus';
    adp.models.Gitstatus = require('./Gitstatus');
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(resolve => resolve(true));
    };
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.destroy = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.update = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.updateMany = (dbName, dbfilter, dbupdate) => {
      adp.check.dbName = dbName;
      adp.check.dbfilter = dbfilter;
      adp.check.dbupdate = dbupdate;
      return new Promise(resolve => resolve(true));
    };
  });


  afterEach(() => {
    global.adp = null;
  });


  it('getCommitsByAssetForPeriod: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getCommitsByAssetForPeriod('MockID', '2021-01-26')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector[0].$match.$and[0].asset_id.$eq).toBe('MockID');
        expect(adp.check.dbSelector[1].$lookup.from).toBe('innersourceuserhistory');
        expect(adp.check.dbSelector[1].$lookup.as).toBe('snapshot');
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLatestCommitForAsset: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    const step1 = {
      $match: {
        asset_id: {
          $eq: 'MockID',
        },
      },
    };
    const step2 = { $sort: { date: -1 } };
    const step3 = { $project: { _id: 0, date: 1 } };
    const arrayToCompare = [step1, step2, step3];
    adpModel.getLatestCommitForAsset('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector).toEqual(arrayToCompare);
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetOlderThanSpecificDate: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getAssetOlderThanSpecificDate('2021-01-26')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector).toEqual({ date: { $lt: '2021-01-26' } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getJustOneToCheckIfIsEmpty: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getJustOneToCheckIfIsEmpty()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getById: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getById(['MockID1', 'MockID2'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['MockID1', 'MockID2'] } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getCommitsSequentially: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getCommitsSequentially(2, 0)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 2, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteOne: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.deleteOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('update: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.update('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getDataForReport: testing with no parameters.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getDataForReport()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        const short0 = adp.check.dbSelector[0].$group;
        const short1 = adp.check.dbSelector[1].$sort;
        const short2 = adp.check.dbSelector[4].$project;

        expect(short0._id).toEqual({ asset_id: '$asset_id', user_id: '$user_id' });
        expect(short0.asset_slug).toEqual({ $last: '$asset_slug' });
        expect(short0.user_name).toEqual({ $last: '$user_name' });
        expect(short0.user_email).toEqual({ $last: '$user_email' });
        expect(short0.last_date).toEqual({ $last: '$date' });
        expect(short0.first_date).toEqual({ $first: '$date' });
        expect(short0.commits).toEqual({ $sum: '$commits' });
        expect(short0.insertions).toEqual({ $sum: '$insertions' });
        expect(short0.deletions).toEqual({ $sum: '$deletions' });

        expect(short1.asset_slug).toEqual(1);
        expect(short1.insertions).toEqual(-1);

        expect(short2._id).toEqual(0);
        expect(short2.asset_id).toEqual('$_id.asset_id');
        expect(short2.asset_slug).toEqual('$asset_slug');
        expect(short2.user_id).toEqual('$_id.user_id');
        expect(short2.user_name).toEqual('$user_name');
        expect(short2.user_email).toEqual('$user_email');
        expect(short2.date_first_commit).toEqual('$first_date');
        expect(short2.date_last_commit).toEqual('$last_date');
        expect(short2.commits).toEqual('$commits');
        expect(short2.insertions).toEqual('$insertions');
        expect(short2.deletions).toEqual('$deletions');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getDataForReport: testing using a string as parameter.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getDataForReport('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        const short0 = adp.check.dbSelector[0].$match;
        const short1 = adp.check.dbSelector[1].$group;
        const short2 = adp.check.dbSelector[2].$sort;
        const short3 = adp.check.dbSelector[5].$project;

        expect(short0.$and[0].asset_id).toEqual({ $in: ['mockID'] });

        expect(short1._id).toEqual({ asset_id: '$asset_id', user_id: '$user_id' });
        expect(short1.asset_slug).toEqual({ $last: '$asset_slug' });
        expect(short1.user_name).toEqual({ $last: '$user_name' });
        expect(short1.user_email).toEqual({ $last: '$user_email' });
        expect(short1.last_date).toEqual({ $last: '$date' });
        expect(short1.first_date).toEqual({ $first: '$date' });
        expect(short1.commits).toEqual({ $sum: '$commits' });
        expect(short1.insertions).toEqual({ $sum: '$insertions' });
        expect(short1.deletions).toEqual({ $sum: '$deletions' });

        expect(short2.asset_slug).toEqual(1);
        expect(short2.insertions).toEqual(-1);

        expect(short3._id).toEqual(0);
        expect(short3.asset_id).toEqual('$_id.asset_id');
        expect(short3.asset_slug).toEqual('$asset_slug');
        expect(short3.user_id).toEqual('$_id.user_id');
        expect(short3.user_name).toEqual('$user_name');
        expect(short3.user_email).toEqual('$user_email');
        expect(short3.date_first_commit).toEqual('$first_date');
        expect(short3.date_last_commit).toEqual('$last_date');
        expect(short3.commits).toEqual('$commits');
        expect(short3.insertions).toEqual('$insertions');
        expect(short3.deletions).toEqual('$deletions');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getDataForReport: testing using an array as parameter.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getDataForReport(['mockID1', 'mockID2'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        const short0 = adp.check.dbSelector[0].$match;
        const short1 = adp.check.dbSelector[1].$group;
        const short2 = adp.check.dbSelector[2].$sort;
        const short3 = adp.check.dbSelector[5].$project;

        expect(short0.$and[0].asset_id).toEqual({ $in: ['mockID1', 'mockID2'] });

        expect(short1._id).toEqual({ asset_id: '$asset_id', user_id: '$user_id' });
        expect(short1.asset_slug).toEqual({ $last: '$asset_slug' });
        expect(short1.user_name).toEqual({ $last: '$user_name' });
        expect(short1.user_email).toEqual({ $last: '$user_email' });
        expect(short1.last_date).toEqual({ $last: '$date' });
        expect(short1.first_date).toEqual({ $first: '$date' });
        expect(short1.commits).toEqual({ $sum: '$commits' });
        expect(short1.insertions).toEqual({ $sum: '$insertions' });
        expect(short1.deletions).toEqual({ $sum: '$deletions' });

        expect(short2.asset_slug).toEqual(1);
        expect(short2.insertions).toEqual(-1);

        expect(short3._id).toEqual(0);
        expect(short3.asset_id).toEqual('$_id.asset_id');
        expect(short3.asset_slug).toEqual('$asset_slug');
        expect(short3.user_id).toEqual('$_id.user_id');
        expect(short3.user_name).toEqual('$user_name');
        expect(short3.user_email).toEqual('$user_email');
        expect(short3.date_first_commit).toEqual('$first_date');
        expect(short3.date_last_commit).toEqual('$last_date');
        expect(short3.commits).toEqual('$commits');
        expect(short3.insertions).toEqual('$insertions');
        expect(short3.deletions).toEqual('$deletions');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getDataForDates: testing using an array as parameter.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.getDataForDates('01-04-2021', '07-04-2021')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        const short0 = adp.check.dbSelector[0].$match;

        expect(short0).toEqual({
          $and: [{ date: { $gte: '01-04-2021' } },
            { date: { $lte: '07-04-2021' } },
            { deleted: { $exists: false } }],
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteCommit: Should return true for deleted commit.', (done) => {
    const adpModel = new adp.models.Gitstatus();
    adpModel.deleteCommit('2020-12-18', '2021-03-21', 'esupuse', 'auto-ms-with-mock-artifactory')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbfilter).toEqual({
          date: {
            $gte: '2020-12-18',
            $lte: '2021-03-21',
          },
          user_id: 'esupuse',
          asset_slug: 'auto-ms-with-mock-artifactory',
        });

        expect(adp.check.dbupdate).toEqual({ $set: { deleted: true } });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('innerSourceContributors: testing with no parameters.', (done) => {
    const gitStatusModel = new adp.models.Gitstatus();
    gitStatusModel.innerSourceContributors()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');

        const [
          msDateMatch,
          userIdGroup,
          innersourceLookup,
          adpLookup,
          msAssetUnwind,
          servCatListopsLookup,
          servCatUnwind,
          domainListopsLookup,
          domainUnwind,
          msSerListAddField,
          msSerListUnwind,
          snapshotUnwind,
          userIdAssetIdGroup,
          assetContrWeiAddField,
          assetContrWeiSort,
          userId2ndGroup,
          mainContrWeiAddField,
          mainContrWeiSort,
          finalProj,
        ] = adp.check.dbSelector;


        expect(msDateMatch.$match.$and[0].date).toEqual({ $gte: '2020-01-01' });
        expect(msDateMatch.$match.$and[1].deleted.$exists).toBeFalsy();

        expect(userIdGroup.$group._id).toEqual({ user_id: '$user_id' });
        expect(userIdGroup.$group.micro_services_commit_list).toEqual({ $push: '$$ROOT' });

        expect(innersourceLookup.$lookup.from).toEqual('innersourceuserhistory');
        expect(innersourceLookup.$lookup.let.signum).toEqual('$_id.user_id');
        expect(innersourceLookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(innersourceLookup.$lookup.pipeline[1].$sort.snapshot_date).toBe(-1);
        expect(innersourceLookup.$lookup.pipeline[2].$limit).toBe(1);
        expect(innersourceLookup.$lookup.as).toEqual('snapshot');

        expect(adpLookup.$lookup.from).toEqual('adp');
        expect(adpLookup.$lookup.pipeline[0].$match.$and[0].type).toBe('microservice');
        expect(adpLookup.$lookup.pipeline[0].$match.$and[1].deleted.$exists).toBeFalsy();
        expect(adpLookup.$lookup.as).toEqual('msAsset');

        expect(msAssetUnwind.$unwind.path).toEqual('$msAsset');
        expect(msAssetUnwind.$unwind.preserveNullAndEmptyArrays).toBeTruthy();

        expect(servCatListopsLookup.$lookup.from).toEqual('listoption');
        expect(servCatListopsLookup.$lookup.let.servCatSelectId).toEqual('$msAsset.service_category');
        expect(servCatListopsLookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(servCatListopsLookup.$lookup.pipeline[0].$match.type).toBe('item');
        expect(servCatListopsLookup.$lookup.pipeline[0].$match['group-id']).toBe(2);
        expect(servCatListopsLookup.$lookup.pipeline[1].$limit).toBe(1);
        expect(servCatListopsLookup.$lookup.as).toEqual('serviceCategoryListoption');

        expect(servCatUnwind.$unwind).toEqual('$serviceCategoryListoption');

        expect(domainListopsLookup.$lookup.from).toEqual('listoption');
        expect(domainListopsLookup.$lookup.let.domainSelectId).toEqual('$msAsset.domain');
        expect(domainListopsLookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(domainListopsLookup.$lookup.pipeline[0].$match.type).toBe('item');
        expect(domainListopsLookup.$lookup.pipeline[0].$match['group-id']).toBe(3);
        expect(domainListopsLookup.$lookup.pipeline[1].$limit).toBe(1);
        expect(domainListopsLookup.$lookup.as).toEqual('domainListoption');

        expect(domainUnwind.$unwind).toEqual('$domainListoption');

        expect(msSerListAddField.$addFields.micro_services_listings.$filter.input).toEqual('$micro_services_commit_list');
        expect(msSerListAddField.$addFields.micro_services_listings.$filter.as).toEqual('msCommits');
        expect(msSerListAddField.$addFields.micro_services_listings.$filter.cond.$eq).toEqual(['$$msCommits.asset_id', '$msAsset._id']);

        expect(msSerListUnwind.$unwind.path).toEqual('$micro_services_listings');
        expect(msSerListUnwind.$unwind.preserveNullAndEmptyArrays).toBeUndefined();

        expect(snapshotUnwind.$unwind.path).toEqual('$snapshot');
        expect(snapshotUnwind.$unwind.preserveNullAndEmptyArrays).toBeTruthy();

        expect(userIdAssetIdGroup.$group._id.userEId).toEqual('$micro_services_listings.user_id');
        expect(userIdAssetIdGroup.$group._id.assetId).toEqual('$micro_services_listings.asset_id');
        expect(userIdAssetIdGroup.$group.assetDate).toEqual({ $last: '$micro_services_listings.date' });
        expect(userIdAssetIdGroup.$group.assetUserName).toEqual({ $last: '$micro_services_listings.user_name' });
        expect(userIdAssetIdGroup.$group.assetUserEmail).toEqual({ $last: '$micro_services_listings.user_email' });
        expect(userIdAssetIdGroup.$group.assetSlug).toEqual({ $last: '$micro_services_listings.asset_slug' });
        expect(userIdAssetIdGroup.$group.assetName).toEqual({ $last: '$msAsset.name' });
        expect(userIdAssetIdGroup.$group.assetCommits).toEqual({ $sum: '$micro_services_listings.commits' });
        expect(userIdAssetIdGroup.$group.assetInsertions).toEqual({ $sum: '$micro_services_listings.insertions' });
        expect(userIdAssetIdGroup.$group.assetDeletions).toEqual({ $sum: '$micro_services_listings.deletions' });
        expect(userIdAssetIdGroup.$group.organisation).toEqual({ $last: '$snapshot.organisation' });
        expect(userIdAssetIdGroup.$group.ou).toEqual({ $last: '$snapshot.peopleFinder.operationalUnit' });

        expect(assetContrWeiAddField.$addFields.assetContributionWeight).toEqual({
          $add: [{ $sum: '$assetInsertions' },
            { $multiply: [0.5, { $sum: '$assetDeletions' }] }],
        });

        expect(assetContrWeiSort.$sort.assetContributionWeight).toEqual(-1);

        expect(userId2ndGroup.$group._id.userEId).toEqual('$_id.userEId');
        expect(userId2ndGroup.$group.cumulativeUserName).toEqual({ $last: '$assetUserName' });
        expect(userId2ndGroup.$group.cumulativeUserEmail).toEqual({ $last: '$assetUserEmail' });
        expect(userId2ndGroup.$group.cumulativeUserDateFrom).toEqual({ $last: '$assetDate' });
        expect(userId2ndGroup.$group.cumulativeUserDateTo).toEqual({ $first: '$assetDate' });
        expect(userId2ndGroup.$group.cumulativeUserCommits).toEqual({ $sum: '$assetCommits' });
        expect(userId2ndGroup.$group.cumulativeUserInsertions).toEqual({ $sum: '$assetInsertions' });
        expect(userId2ndGroup.$group.cumulativeUserDeletions).toEqual({ $sum: '$assetDeletions' });
        expect(userId2ndGroup.$group.organisation).toEqual({ $last: '$organisation' });
        expect(userId2ndGroup.$group.ou).toEqual({ $last: '$ou' });
        expect(userId2ndGroup.$group.microServices.$push).toEqual({
          assetId: '$_id.assetId',
          assetName: '$assetName',
          assetSlug: '$assetSlug',
          commits: '$assetCommits',
          insertions: '$assetInsertions',
          deletions: '$assetDeletions',
          service_category: '$service_category',
          service_category_select_id: '$service_category_select_id',
          domain: '$domain',
          domain_select_id: '$domain_select_id',
          weight: '$assetContributionWeight',
        });

        expect(mainContrWeiAddField.$addFields.mainContributionWeight).toEqual({
          $add: [{ $sum: '$cumulativeUserInsertions' },
            { $multiply: [0.5, { $sum: '$cumulativeUserDeletions' }] }],
        });

        expect(mainContrWeiSort.$sort.mainContributionWeight).toEqual(-1);

        expect(finalProj.$project._id).toEqual(0);
        expect(finalProj.$project.userId).toEqual('$_id.userEId');
        expect(finalProj.$project.userName).toEqual('$cumulativeUserName');
        expect(finalProj.$project.userEmail).toEqual('$cumulativeUserEmail');
        expect(finalProj.$project.dateFrom).toEqual('$cumulativeUserDateFrom');
        expect(finalProj.$project.dateTo).toEqual('$cumulativeUserDateTo');
        expect(finalProj.$project.totalCommits).toEqual('$cumulativeUserCommits');
        expect(finalProj.$project.totalAddedLines).toEqual('$cumulativeUserInsertions');
        expect(finalProj.$project.totalRemovedLines).toEqual('$cumulativeUserDeletions');
        expect(finalProj.$project.organisation).toEqual('$organisation');
        expect(finalProj.$project.contributionWeight).toEqual('$mainContributionWeight');
        expect(finalProj.$project.micro_services).toEqual('$microServices');

        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('innerSourceOrganisations: testing with no parameters.', (done) => {
    const gitStatusModel = new adp.models.Gitstatus();
    gitStatusModel.innersourceOrganisations()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');

        const [
          matchDateDeleted,
          lookupAdp,
          unwindAssetInfo,
          addAssetInfoFields,
          lookupServCatListOpts,
          unwindServCatListops,
          lookupDomain,
          unwindDomain,
          matchAssetInfoDeleted,
          groupAssetInfoOrganisation,
          addFieldsContributors,
          sortAssetWeightName,
          groupContribution,
          sortContributionWeightOrganisation,
        ] = adp.check.dbSelector;

        expect(matchDateDeleted.$match.$and[0].date).toEqual({ $gte: '2020-01-01' });
        expect(matchDateDeleted.$match.$and[1].deleted.$exists).toBeFalsy();

        expect(lookupAdp.$lookup.from).toEqual('adp');
        expect(lookupAdp.$lookup.let.varAssetId).toEqual('$asset_id');
        expect(lookupAdp.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupAdp.$lookup.pipeline[1].$limit).toBe(1);
        expect(lookupAdp.$lookup.as).toEqual('assetInfo');

        expect(unwindAssetInfo.$unwind).toBe('$assetInfo');

        expect(addAssetInfoFields.$addFields.service_category).toBe('$assetInfo.service_category');
        expect(addAssetInfoFields.$addFields.domain).toBe('$assetInfo.domain');

        expect(lookupServCatListOpts.$lookup.from).toEqual('listoption');
        expect(lookupServCatListOpts.$lookup.let.servCatSelectId).toEqual('$assetInfo.service_category');
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match.type).toBe('item');
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match['group-id']).toBe(2);
        expect(lookupServCatListOpts.$lookup.as).toEqual('serviceCategoryListoption');

        expect(unwindServCatListops.$unwind).toBe('$serviceCategoryListoption');

        expect(lookupDomain.$lookup.from).toEqual('listoption');
        expect(lookupDomain.$lookup.let.domainSelectId).toEqual('$assetInfo.domain');
        expect(lookupDomain.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupDomain.$lookup.pipeline[0].$match.type).toBe('item');
        expect(lookupDomain.$lookup.pipeline[0].$match['group-id']).toBe(3);
        expect(lookupDomain.$lookup.as).toEqual('domainListoption');

        expect(unwindDomain.$unwind).toBe('$domainListoption');

        expect(matchAssetInfoDeleted.$match.$and[0]['assetInfo.deleted'].$exists).toBeFalsy();

        expect(groupAssetInfoOrganisation.$group._id.organisation).toBe('$innersourceUserHistorySnapshot.organisation');
        expect(groupAssetInfoOrganisation.$group._id.assetId).toBe('$assetInfo._id');
        expect(groupAssetInfoOrganisation.$group.uniqueContributors.$addToSet).toBe('$user_id');
        expect(groupAssetInfoOrganisation.$group.assetName.$last).toBe('$assetInfo.name');
        expect(groupAssetInfoOrganisation.$group.commits.$sum).toBe('$commits');
        expect(groupAssetInfoOrganisation.$group.insertions.$sum).toBe('$insertions');
        expect(groupAssetInfoOrganisation.$group.deletions.$sum).toBe('$deletions');
        expect(groupAssetInfoOrganisation.$group.service_category.$last).toBe('$serviceCategoryListoption.name');
        expect(groupAssetInfoOrganisation.$group.service_category_select_id.$last).toBe('$assetInfo.service_category');
        expect(groupAssetInfoOrganisation.$group.domain.$last).toBe('$domainListoption.name');
        expect(groupAssetInfoOrganisation.$group.domain_select_id.$last).toBe('$assetInfo.domain');

        expect(addFieldsContributors.$addFields.contributors.$size).toBe('$uniqueContributors');
        expect(addFieldsContributors.$addFields.weight.$add[0].$sum).toBe('$insertions');
        expect(addFieldsContributors.$addFields.weight.$add[1].$multiply[0]).toEqual(0.5);
        expect(addFieldsContributors.$addFields.weight.$add[1].$multiply[1].$sum).toBe('$deletions');

        expect(sortAssetWeightName.$sort.weight).toEqual(-1);
        expect(sortAssetWeightName.$sort.assetName).toEqual(1);

        expect(groupContribution.$group._id).toBe('$_id.organisation');
        expect(groupContribution.$group.organisation.$last).toBe('$_id.organisation');
        expect(groupContribution.$group.contributors.$sum).toBe('$contributors');
        expect(groupContribution.$group.totalCommits.$sum).toBe('$commits');
        expect(groupContribution.$group.totalAddedLines.$sum).toBe('$insertions');
        expect(groupContribution.$group.totalRemovedLines.$sum).toBe('$deletions');
        expect(groupContribution.$group.contributionWeight.$sum).toBe('$weight');
        expect(groupContribution.$group.micro_services.$push.assetId).toBe('$_id.assetId');
        expect(groupContribution.$group.micro_services.$push.assetName).toBe('$assetName');
        expect(groupContribution.$group.micro_services.$push.commits).toBe('$commits');
        expect(groupContribution.$group.micro_services.$push.contributors).toBe('$contributors');
        expect(groupContribution.$group.micro_services.$push.insertions).toBe('$insertions');
        expect(groupContribution.$group.micro_services.$push.deletions).toBe('$deletions');
        expect(groupContribution.$group.micro_services.$push.service_category).toBe('$service_category');
        expect(groupContribution.$group.micro_services.$push.service_category_select_id).toBe('$service_category_select_id');
        expect(groupContribution.$group.micro_services.$push.domain).toBe('$domain');
        expect(groupContribution.$group.micro_services.$push.domain_select_id).toBe('$domain_select_id');
        expect(groupContribution.$group.micro_services.$push.weight).toBe('$weight');

        expect(sortContributionWeightOrganisation.$sort.contributionWeight).toEqual(-1);
        expect(sortContributionWeightOrganisation.$sort.organisation).toEqual(1);

        done();
      }).catch(error => done.fail(error));
  });

  it('innerSourceContributors: testing with filters and date range', (done) => {
    const gitStatusModel = new adp.models.Gitstatus();
    const filterQuery = [{ $or: [{ domain: 1 }, { domain: 2 }, { domain: 3 }] },
      { $or: [{ service_category: 1 }, { service_category: 2 }, { service_category: 3 }] }];
    const limit = 1;

    gitStatusModel.innerSourceContributors(filterQuery, '2020-01-09', '2021-03-08', limit)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        const [
          msDateMatch,
          userIdGroup,
          innersourceLookup,
          adpLookup,
          msAssetUnwind,
          servCatListopsLookup,
          servCatUnwind,
          domainListopsLookup,
          domainUnwind,
          msSerListAddField,
          msSerListUnwind,
          snapshotUnwind,
          userIdAssetIdGroup,
          assetContrWeiAddField,
          assetContrWeiSort,
          userId2ndGroup,
          mainContrWeiAddField,
          mainContrWeiSort,
          finalProj,
          finalLimit,
        ] = adp.check.dbSelector;

        expect(msDateMatch.$match.$and[0].date.$gte).toEqual('2020-01-09');
        expect(msDateMatch.$match.$and[1].deleted.$exists).toBeFalsy();
        expect(msDateMatch.$match.$and[2].date.$lte).toEqual('2021-03-08');

        expect(userIdGroup.$group._id).toEqual({ user_id: '$user_id' });
        expect(userIdGroup.$group.micro_services_commit_list).toEqual({ $push: '$$ROOT' });

        expect(innersourceLookup.$lookup.from).toEqual('innersourceuserhistory');
        expect(innersourceLookup.$lookup.let.signum).toEqual('$_id.user_id');
        expect(innersourceLookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(innersourceLookup.$lookup.pipeline[1].$sort.snapshot_date).toBe(-1);
        expect(innersourceLookup.$lookup.pipeline[2].$limit).toBe(1);
        expect(innersourceLookup.$lookup.as).toEqual('snapshot');

        expect(adpLookup.$lookup.from).toEqual('adp');
        expect(adpLookup.$lookup.pipeline[0].$match.$and[0].type).toBe('microservice');
        expect(adpLookup.$lookup.pipeline[0].$match.$and[1].deleted.$exists).toBeFalsy();
        expect(adpLookup.$lookup.pipeline[0].$match.$and[2].$or[0].domain).toBe(1);
        expect(adpLookup.$lookup.pipeline[0].$match.$and[3].$or[0].service_category).toBe(1);
        expect(adpLookup.$lookup.as).toEqual('msAsset');

        expect(msAssetUnwind.$unwind.path).toEqual('$msAsset');
        expect(msAssetUnwind.$unwind.preserveNullAndEmptyArrays).toBeTruthy();

        const servCatLookupMatch = servCatListopsLookup.$lookup.pipeline[0].$match;

        expect(servCatListopsLookup.$lookup.from).toBe('listoption');
        expect(servCatLookupMatch.$expr.$and[0].$eq[0]).toBe('$select-id');
        expect(servCatLookupMatch.$expr.$and[0].$eq[1]).toBe('$$servCatSelectId');
        expect(servCatLookupMatch.type).toBe('item');
        expect(servCatLookupMatch['group-id']).toBe(2);

        expect(servCatUnwind.$unwind).toEqual('$serviceCategoryListoption');

        const domainLookupMatch = domainListopsLookup.$lookup.pipeline[0].$match;

        expect(domainListopsLookup.$lookup.from).toBe('listoption');
        expect(domainLookupMatch.$expr.$and[0].$eq[0]).toBe('$select-id');
        expect(domainLookupMatch.$expr.$and[0].$eq[1]).toBe('$$domainSelectId');
        expect(domainLookupMatch.type).toBe('item');
        expect(domainLookupMatch['group-id']).toBe(3);

        expect(domainUnwind.$unwind).toEqual('$domainListoption');

        const msSerListFilters = msSerListAddField.$addFields.micro_services_listings.$filter;

        expect(msSerListFilters.input).toEqual('$micro_services_commit_list');
        expect(msSerListFilters.as).toEqual('msCommits');
        expect(msSerListFilters.cond.$eq).toEqual(['$$msCommits.asset_id', '$msAsset._id']);

        expect(msSerListUnwind.$unwind.path).toEqual('$micro_services_listings');
        expect(msSerListUnwind.$unwind.preserveNullAndEmptyArrays).toBeUndefined();

        expect(snapshotUnwind.$unwind.path).toEqual('$snapshot');
        expect(snapshotUnwind.$unwind.preserveNullAndEmptyArrays).toBeTruthy();

        expect(userIdAssetIdGroup.$group._id.userEId).toEqual('$micro_services_listings.user_id');
        expect(userIdAssetIdGroup.$group._id.assetId).toEqual('$micro_services_listings.asset_id');
        expect(userIdAssetIdGroup.$group.domain).toEqual({ $last: '$domainListoption.name' });
        expect(userIdAssetIdGroup.$group.domain_select_id.$last).toBe('$msAsset.domain');
        expect(userIdAssetIdGroup.$group.service_category).toEqual({ $last: '$serviceCategoryListoption.name' });
        expect(userIdAssetIdGroup.$group.service_category_select_id).toEqual({ $last: '$msAsset.service_category' });
        expect(userIdAssetIdGroup.$group.assetDate).toEqual({ $last: '$micro_services_listings.date' });
        expect(userIdAssetIdGroup.$group.assetUserName).toEqual({ $last: '$micro_services_listings.user_name' });
        expect(userIdAssetIdGroup.$group.assetUserEmail).toEqual({ $last: '$micro_services_listings.user_email' });
        expect(userIdAssetIdGroup.$group.assetSlug).toEqual({ $last: '$micro_services_listings.asset_slug' });
        expect(userIdAssetIdGroup.$group.assetName).toEqual({ $last: '$msAsset.name' });
        expect(userIdAssetIdGroup.$group.assetCommits).toEqual({ $sum: '$micro_services_listings.commits' });
        expect(userIdAssetIdGroup.$group.assetInsertions).toEqual({ $sum: '$micro_services_listings.insertions' });
        expect(userIdAssetIdGroup.$group.assetDeletions).toEqual({ $sum: '$micro_services_listings.deletions' });
        expect(userIdAssetIdGroup.$group.organisation).toEqual({ $last: '$snapshot.organisation' });
        expect(userIdAssetIdGroup.$group.ou).toEqual({ $last: '$snapshot.peopleFinder.operationalUnit' });

        expect(assetContrWeiAddField.$addFields.assetContributionWeight).toEqual({
          $add: [{ $sum: '$assetInsertions' },
            { $multiply: [0.5, { $sum: '$assetDeletions' }] }],
        });

        expect(assetContrWeiSort.$sort.assetContributionWeight).toEqual(-1);

        expect(userId2ndGroup.$group._id.userEId).toEqual('$_id.userEId');
        expect(userId2ndGroup.$group.cumulativeUserName).toEqual({ $last: '$assetUserName' });
        expect(userId2ndGroup.$group.cumulativeUserEmail).toEqual({ $last: '$assetUserEmail' });
        expect(userId2ndGroup.$group.cumulativeUserDateFrom).toEqual({ $last: '$assetDate' });
        expect(userId2ndGroup.$group.cumulativeUserDateTo).toEqual({ $first: '$assetDate' });
        expect(userId2ndGroup.$group.cumulativeUserCommits).toEqual({ $sum: '$assetCommits' });
        expect(userId2ndGroup.$group.cumulativeUserInsertions).toEqual({ $sum: '$assetInsertions' });
        expect(userId2ndGroup.$group.cumulativeUserDeletions).toEqual({ $sum: '$assetDeletions' });
        expect(userId2ndGroup.$group.organisation).toEqual({ $last: '$organisation' });
        expect(userId2ndGroup.$group.ou).toEqual({ $last: '$ou' });
        expect(userId2ndGroup.$group.microServices.$push).toEqual({
          assetId: '$_id.assetId',
          assetName: '$assetName',
          assetSlug: '$assetSlug',
          commits: '$assetCommits',
          insertions: '$assetInsertions',
          deletions: '$assetDeletions',
          service_category: '$service_category',
          service_category_select_id: '$service_category_select_id',
          domain: '$domain',
          domain_select_id: '$domain_select_id',
          weight: '$assetContributionWeight',
        });

        expect(mainContrWeiAddField.$addFields.mainContributionWeight).toEqual({
          $add: [{ $sum: '$cumulativeUserInsertions' },
            { $multiply: [0.5, { $sum: '$cumulativeUserDeletions' }] }],
        });

        expect(mainContrWeiSort.$sort.mainContributionWeight).toEqual(-1);

        expect(finalProj.$project._id).toEqual(0);
        expect(finalProj.$project.userId).toEqual('$_id.userEId');
        expect(finalProj.$project.userName).toEqual('$cumulativeUserName');
        expect(finalProj.$project.userEmail).toEqual('$cumulativeUserEmail');
        expect(finalProj.$project.dateFrom).toEqual('$cumulativeUserDateFrom');
        expect(finalProj.$project.dateTo).toEqual('$cumulativeUserDateTo');
        expect(finalProj.$project.totalCommits).toEqual('$cumulativeUserCommits');
        expect(finalProj.$project.totalAddedLines).toEqual('$cumulativeUserInsertions');
        expect(finalProj.$project.totalRemovedLines).toEqual('$cumulativeUserDeletions');
        expect(finalProj.$project.organisation).toEqual('$organisation');
        expect(finalProj.$project.contributionWeight).toEqual('$mainContributionWeight');
        expect(finalProj.$project.micro_services).toEqual('$microServices');

        expect(finalLimit.$limit).toEqual(limit);

        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('innerSourceOrganisations: testing with filters and date range.', (done) => {
    const gitStatusModel = new adp.models.Gitstatus();
    const filterQuery = [{ $or: [{ domain: 1 }, { domain: 2 }, { domain: 3 }] },
      { $or: [{ service_category: 1 }, { service_category: 2 }, { service_category: 3 }] }];
    const limit = 1;

    gitStatusModel.innersourceOrganisations(filterQuery, '2020-01-09', '2021-03-08', limit)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');

        const [
          matchDateOrg,
          lookupAdp,
          unwindAssetInfo,
          addServiceCategoryDomain,
          lookupServCatListOpts,
          unwindServCatListops,
          lookupDomain,
          unwindDomain,
          matchDomains,
          assetContributions,
          addContributorsWeight,
          sortAssetWeightName,
          groupContribution,
          sortOrganisationWeight,
          queryLimit,
        ] = adp.check.dbSelector;

        expect(matchDateOrg.$match.$and[0].date).toEqual({ $gte: '2020-01-09' });
        expect(matchDateOrg.$match.$and[1].deleted.$exists).toBeFalsy();
        expect(matchDateOrg.$match.$and[2]['innersourceUserHistorySnapshot.organisation'].$ne).toBeFalsy();
        expect(matchDateOrg.$match.$and[3].date.$lte).toEqual('2021-03-08');

        expect(lookupAdp.$lookup.from).toEqual('adp');
        expect(lookupAdp.$lookup.let.varAssetId).toEqual('$asset_id');
        expect(lookupAdp.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupAdp.$lookup.pipeline[1].$limit).toBe(1);
        expect(lookupAdp.$lookup.as).toEqual('assetInfo');

        expect(unwindAssetInfo.$unwind).toBe('$assetInfo');

        expect(addServiceCategoryDomain.$addFields.service_category).toEqual('$assetInfo.service_category');
        expect(addServiceCategoryDomain.$addFields.domain).toBe('$assetInfo.domain');

        expect(lookupServCatListOpts.$lookup.from).toEqual('listoption');
        expect(lookupServCatListOpts.$lookup.let.servCatSelectId).toEqual('$assetInfo.service_category');
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match.type).toBe('item');
        expect(lookupServCatListOpts.$lookup.pipeline[0].$match['group-id']).toBe(2);
        expect(lookupServCatListOpts.$lookup.as).toEqual('serviceCategoryListoption');

        expect(unwindServCatListops.$unwind).toBe('$serviceCategoryListoption');

        expect(lookupDomain.$lookup.from).toEqual('listoption');
        expect(lookupDomain.$lookup.let.domainSelectId).toEqual('$assetInfo.domain');
        expect(lookupDomain.$lookup.pipeline[0].$match.$expr.$and[0].$eq.length).toBe(2);
        expect(lookupDomain.$lookup.pipeline[0].$match.type).toBe('item');
        expect(lookupDomain.$lookup.pipeline[0].$match['group-id']).toBe(3);
        expect(lookupDomain.$lookup.as).toEqual('domainListoption');

        expect(unwindDomain.$unwind).toBe('$domainListoption');

        expect(matchDomains.$match.$and[0]['assetInfo.deleted'].$exists).toBeFalsy();
        expect(matchDomains.$match.$and[1].$or.length).toEqual(3);
        expect(matchDomains.$match.$and[2].$or.length).toEqual(3);

        expect(assetContributions.$group._id.organisation).toBe('$innersourceUserHistorySnapshot.organisation');
        expect(assetContributions.$group._id.assetId).toBe('$assetInfo._id');
        expect(assetContributions.$group.uniqueContributors.$addToSet).toBe('$user_id');
        expect(assetContributions.$group.assetName.$last).toBe('$assetInfo.name');
        expect(assetContributions.$group.commits.$sum).toBe('$commits');
        expect(assetContributions.$group.insertions.$sum).toBe('$insertions');
        expect(assetContributions.$group.deletions.$sum).toBe('$deletions');
        expect(assetContributions.$group.service_category.$last).toBe('$serviceCategoryListoption.name');
        expect(assetContributions.$group.service_category_select_id.$last).toBe('$assetInfo.service_category');
        expect(assetContributions.$group.domain.$last).toBe('$domainListoption.name');
        expect(assetContributions.$group.domain_select_id.$last).toBe('$assetInfo.domain');

        expect(addContributorsWeight.$addFields.contributors.$size).toBe('$uniqueContributors');
        expect(addContributorsWeight.$addFields.weight.$add[0].$sum).toBe('$insertions');
        expect(addContributorsWeight.$addFields.weight.$add[1].$multiply[0]).toEqual(0.5);
        expect(addContributorsWeight.$addFields.weight.$add[1].$multiply[1].$sum).toBe('$deletions');

        expect(sortAssetWeightName.$sort.weight).toEqual(-1);
        expect(sortAssetWeightName.$sort.assetName).toEqual(1);

        expect(groupContribution.$group._id).toBe('$_id.organisation');
        expect(groupContribution.$group.organisation.$last).toBe('$_id.organisation');
        expect(groupContribution.$group.contributors.$sum).toBe('$contributors');
        expect(groupContribution.$group.totalCommits.$sum).toBe('$commits');
        expect(groupContribution.$group.totalAddedLines.$sum).toBe('$insertions');
        expect(groupContribution.$group.totalRemovedLines.$sum).toBe('$deletions');
        expect(groupContribution.$group.contributionWeight.$sum).toBe('$weight');
        expect(groupContribution.$group.micro_services.$push.assetId).toBe('$_id.assetId');
        expect(groupContribution.$group.micro_services.$push.assetName).toBe('$assetName');
        expect(groupContribution.$group.micro_services.$push.commits).toBe('$commits');
        expect(groupContribution.$group.micro_services.$push.contributors).toBe('$contributors');
        expect(groupContribution.$group.micro_services.$push.insertions).toBe('$insertions');
        expect(groupContribution.$group.micro_services.$push.deletions).toBe('$deletions');
        expect(groupContribution.$group.micro_services.$push.service_category).toBe('$service_category');
        expect(groupContribution.$group.micro_services.$push.service_category_select_id).toBe('$service_category_select_id');
        expect(groupContribution.$group.micro_services.$push.domain).toBe('$domain');
        expect(groupContribution.$group.micro_services.$push.domain_select_id).toBe('$domain_select_id');
        expect(groupContribution.$group.micro_services.$push.weight).toBe('$weight');

        expect(sortOrganisationWeight.$sort.contributionWeight).toEqual(-1);
        expect(sortOrganisationWeight.$sort.organisation).toEqual(1);

        expect(queryLimit.$limit).toEqual(1);

        done();
      }).catch(error => done.fail(error));
  });


  it('Testing case if "gitstatus" is forced on constructor.', (done) => {
    adp.models.GitstatusCollectionControl = null;
    const adpModel = new adp.models.Gitstatus(false);
    adpModel.getCommitsByAssetForPeriod('MockID', '2021-01-26')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatus');
        expect(adp.check.dbSelector[0].$match.$and[0].asset_id.$eq).toBe('MockID');
        expect(adp.check.dbSelector[1].$lookup.from).toBe('innersourceuserhistory');
        expect(adp.check.dbSelector[1].$lookup.as).toBe('snapshot');
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing case if "gitstatusbytag" is forced on constructor.', (done) => {
    const adpModel = new adp.models.Gitstatus(true);
    adpModel.getCommitsByAssetForPeriod('MockID', '2021-01-26')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatusbytag');
        expect(adp.check.dbSelector[0].$match.$and[0].asset_id.$eq).toBe('MockID');
        expect(adp.check.dbSelector[1].$lookup.from).toBe('innersourceuserhistory');
        expect(adp.check.dbSelector[1].$lookup.as).toBe('snapshot');
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "index" command in a successful case, without parameters.', (done) => {
    const adpModel = new adp.models.Gitstatus(true);
    adpModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('gitstatusbytag');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({});
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "index" command in a successful case, with parameters.', (done) => {
    const adpModel = new adp.models.Gitstatus(true);
    adpModel.index(0, 10)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('gitstatusbytag');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ skip: 0, limit: 10 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "synchronizeReleaseSetting" if the flag in database is true.', (done) => {
    adp.mock.getReleaseSettings = 1;
    const adpModel = new adp.models.Gitstatus();
    adpModel.synchronizeReleaseSetting()
      .then(() => {
        expect(adp.models.GitstatusCollectionControl).toEqual('gitstatusbytag');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "synchronizeReleaseSetting" if the flag in database is false.', (done) => {
    adp.mock.getReleaseSettings = 2;
    const adpModel = new adp.models.Gitstatus();
    adpModel.synchronizeReleaseSetting()
      .then(() => {
        expect(adp.models.GitstatusCollectionControl).toEqual('gitstatus');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "synchronizeReleaseSetting" if there is no flag in database.', (done) => {
    adp.mock.getReleaseSettings = 0;
    const adpModel = new adp.models.Gitstatus();
    adpModel.synchronizeReleaseSetting()
      .then(() => {
        expect(adp.models.GitstatusCollectionControl).toEqual('gitstatus');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing "synchronizeReleaseSetting" if getReleaseSettings crashes.', (done) => {
    adp.mock.getReleaseSettings = -1;
    const adpModel = new adp.models.Gitstatus();
    adpModel.synchronizeReleaseSetting()
      .then(() => {
        expect(adp.models.GitstatusCollectionControl).toEqual('gitstatus');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
