/**
* [ adp.models.Gitstatus ]
* gitstatus Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);

class Gitstatus {
  constructor(FORCECOLLECTION = undefined) {
    adp.models.GitstatusCollectionControl = adp.models.GitstatusCollectionControl ? adp.models.GitstatusCollectionControl : 'gitstatus';
    if (FORCECOLLECTION === true || FORCECOLLECTION === 'TAGMODE') {
      this.dbMongoCollection = 'gitstatusbytag';
    } else if (FORCECOLLECTION === false || FORCECOLLECTION === 'CLASSICMODE') {
      this.dbMongoCollection = 'gitstatus';
    } else {
      this.dbMongoCollection = adp.models.GitstatusCollectionControl;
    }
  }


  /**
   * synchronizeReleaseSetting is called during the
   * initialisation of the Backend to set the global
   * variable [ adp.models.GitstatusCollectionControl ]
   * with the value from database.
   * This is necessary to avoid duplication on database
   * access when this models is used.
   * @returns {promise} RESOLVE the promise when finished.
   * There is no way to be reject. If fails, assume the
   * default value.
   * @author Armando Dias [zdiaarm]
   */
  synchronizeReleaseSetting() {
    return new Promise((RESOLVE) => {
      const modelReleaseSettings = new adp.models.ReleaseSettings();
      modelReleaseSettings.getReleaseSettings('gitstatus-by-tag')
        .then((RESULT) => {
          if (RESULT && RESULT.docs && RESULT.docs && RESULT.docs[0] && RESULT.docs[0].key === 'gitstatus-by-tag') {
            if (RESULT.docs[0].isEnabled) {
              this.dbMongoCollection = 'gitstatusbytag';
              adp.models.GitstatusCollectionControl = 'gitstatusbytag';
              RESOLVE();
              return;
            }
            this.dbMongoCollection = 'gitstatus';
            adp.models.GitstatusCollectionControl = 'gitstatus';
            RESOLVE();
            return;
          }
          this.dbMongoCollection = 'gitstatus';
          adp.models.GitstatusCollectionControl = 'gitstatus';
          RESOLVE();
        })
        .catch(() => {
          this.dbMongoCollection = 'gitstatus';
          adp.models.GitstatusCollectionControl = 'gitstatus';
          RESOLVE();
        });
    });
  }

  /**
   * Index the Gitstatus colleciton
   * @param {integer} [skip=null] items to skip
   * @param {integer} [limit=null] limit on returning data
   * @returns {array} index of the gitstatus colleciton
   * @author Cein
   */
  index(skip = null, limit = null) {
    const mongoOptions = {};
    if (skip !== null) {
      mongoOptions.skip = skip;
    }
    if (limit !== null) {
      mongoOptions.limit = limit;
    }

    return adp.db.find(
      this.dbMongoCollection,
      {},
      mongoOptions,
    );
  }


  /**
   * Fetch git commits by the microservice slug for a period
   * @param {string} id the microservice ID
   * @param {string} date from which data is required
   * @returns {promise} response containing an array with
   * the related git commit
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getCommitsByAssetForPeriod(id, date) {
    const mongoPipeline = [
      {
        $match: {
          $and: [
            { asset_id: { $eq: id } },
            { date: { $gte: date } },
            { deleted: { $exists: false } },
          ],
        },
      },
      {
        $lookup: {
          from: 'innersourceuserhistory',
          let: { signum: '$user_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$signum', '$$signum'] }] } } },
            { $sort: { snapshot_date: -1 } },
            { $limit: 1 },
          ],
          as: 'snapshot',
        },
      },
      {
        $unwind: {
          path: '$snapshot',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          signum: '$user_id',
          name: '$user_name',
          email: '$user_email',
          organisation: '$snapshot.organisation',
          commits: 1,
          deletions: 1,
          insertions: 1,
        },
      },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }

  /**
   * Fetch git commits based on given dates
   * @param {string} fromDate from which data is required
   * @param {string} toDate to which data is required
   * @returns {promise} response containing an array with
   * the related git commit
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getDataForDates(fromDate, toDate) {
    const mongoPipeline = [
      {
        $match: {
          $and: [
            { date: { $gte: fromDate } },
            { date: { $lte: toDate } },
            { deleted: { $exists: false } },
          ],
        },
      },
      {
        $lookup: {
          from: 'innersourceuserhistory',
          let: { signum: '$user_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$signum', '$$signum'] }] } } },
            { $sort: { snapshot_date: -1 } },
            { $limit: 1 },
          ],
          as: 'snapshot',
        },
      },
      {
        $lookup: {
          from: 'adp',
          localField: 'asset_id',
          foreignField: '_id',
          as: 'assetObject',
        },
      },
      {
        $unwind: {
          path: '$snapshot',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$assetObject',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          signum: '$user_id',
          name: '$user_name',
          email: '$user_email',
          organisation: '$snapshot.organisation',
          commits: 1,
          deletions: 1,
          insertions: 1,
          asset_name: '$assetObject.name',
          asset_id: 1,
        },
      },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }

  /**
   * Fetch latest commit date for an asset
   * @param {string} id the microservice ID
   * @returns {promise} response containing an array with
   * the related git commit
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getLatestCommitForAsset(id) {
    const mongoPipeline = [
      { $match: { asset_id: { $eq: id } } },
      { $sort: { date: -1 } },
      { $project: { _id: 0, date: 1 } },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }


  /**
   * Get all commits older than a specific given date
   * @param {string} DATE String with the date
   * @returns {promise} response of the resquest
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getAssetOlderThanSpecificDate(DATE) {
    const mongoQuery = {
      date: { $lt: `${DATE}` },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get one register, just to see if this is empty ( First Run )
   * @returns {promise} response of the resquest
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getJustOneToCheckIfIsEmpty() {
    const mongoQuery = {};
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Fetch a object by _id
   * @param {array} idArr array of id strings
   * @returns {promise} response obj containing an array with
   * the related adp object
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getById(idArr) {
    const mongoQuery = {
      _id: {
        $in: idArr,
      },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get commits in a sequence
   * @param {integer} QUANT How many commits do you need
   * @param {integer} SKIP How many commits do you want to skip
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getCommitsSequentially(QUANT, SKIP) {
    const mongoQuery = {};
    const mongoOptions = { limit: QUANT, skip: SKIP };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Delete one register
   * @param {string} ID of the register that needs to be deleted
   * @returns {promise} db delete command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  deleteOne(ID) {
    return adp.db.destroy(this.dbMongoCollection, ID);
  }


  /**
   * Creates a entry into database
   * @param {object} OBJ JSON Object with details
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }


  /**
   * Updates a entry into database
   * @param {object} OBJ JSON Object with details
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  update(OBJ) {
    return adp.db.update(this.dbMongoCollection, OBJ);
  }


  /**
   * Fetch data from database to generate a report
   * @param {(array|string)} ID Array of IDs or string with unique ID
   * @param {string} fromDate the start date for contributions
   * @param {string} toDate the end date for contributions
   * @returns {promise} Return the promise with the request
   * @author Armando Dias [zdiaarm], Abhishek Singh[zihabns], Michael Coughlan [zmiccou]
   */
  getDataForReport(ID = null, fromDate, toDate) {
    let id = ID;
    if (typeof ID === 'string') {
      id = [`${ID}`];
    } else if (!Array.isArray(ID)) {
      id = null;
    }
    const mongoPipeline = [];

    if (id !== null) {
      mongoPipeline.push(
        {
          $match: {
            $and: [
              { asset_id: { $in: id } },
              { date: { $gte: fromDate } },
              { date: { $lte: toDate } },
              { deleted: { $exists: false } },
            ],
          },
        },
      );
    }
    mongoPipeline.push({
      $group: {
        _id: {
          asset_id: '$asset_id',
          user_id: '$user_id',
        },
        asset_slug: { $last: '$asset_slug' },
        user_name: { $last: '$user_name' },
        user_email: { $last: '$user_email' },
        last_date: { $last: '$date' },
        first_date: { $first: '$date' },
        commits: { $sum: '$commits' },
        insertions: { $sum: '$insertions' },
        deletions: { $sum: '$deletions' },
      },
    });
    mongoPipeline.push({
      $sort: {
        asset_slug: 1,
        insertions: -1,
      },
    });
    mongoPipeline.push({
      $lookup: {
        from: 'innersourceuserhistory',
        let: { signum: '$_id.user_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$signum', '$$signum'] }] } } },
          { $sort: { snapshot_date: -1 } },
          { $limit: 1 },
        ],
        as: 'snapshot',
      },
    },
    {
      $unwind: {
        path: '$snapshot',
        preserveNullAndEmptyArrays: true,
      },
    });
    mongoPipeline.push({
      $project: {
        _id: 0,
        asset_id: '$_id.asset_id',
        asset_slug: '$asset_slug',
        user_id: '$_id.user_id',
        user_name: '$user_name',
        user_email: '$user_email',
        date_first_commit: '$first_date',
        date_last_commit: '$last_date',
        commits: '$commits',
        insertions: '$insertions',
        deletions: '$deletions',
        organisation: '$snapshot.organisation',
        ou: '$snapshot.peopleFinder.operationalUnit',
      },
    });
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }

  /**
   * Soft Delete gitstatus ranges by asset and userid
   * @param {String} StartDate of the first commit
   * @param {String} EndDate of the last commit
   * @param {String} UserID signum of the committer
   * @param {String} msSlug asset linked to the committing user
   * @author Abhishek Singh [zihabns], Omkar Sadegaonkar [zsdgmkr]
   */
  deleteCommit(StartDate, EndDate, UserID, msSlug) {
    const filter = {
      date: {
        $gte: StartDate,
        $lte: EndDate,
      },
      user_id: UserID,
      asset_slug: msSlug,
    };
    const update = { $set: { deleted: true } };
    return adp.db.updateMany(this.dbMongoCollection, filter, update);
  }

  /**
   * innersource contributors search
   * perform match by date range
   * then group by userid and prepare all his commits list
   * then lookup of innersource using user signum
   * then lookup of adp by passing filters(domain,service_category) sent from Client
   * then filter user commits with microservices returned by adp lookup
   * calculate contribution weight as "linesadded + 0.5 * linesremoved"
   * and perform default sort using it
   * then group by user id
   * @param {array|null} [filterQuery=null]  (optional)list of filter groups with $or filter items
   * example: $and: [ { $or: [{ service_category: 1}, { service_category: 2} ] },
   * { $or: [{ domain: 1 }] } ]
   * example:
   * $and: [ { $or: [{ service_category: 1}, { service_category: 2} ] },
   *   { $or: [{ domain: 1 }] }, { $or: [{from_date : '2020=07-09'}]}]
   * @param  {string | null} [fromDate='2020-01-01'] (optional) default is '2020-01-01'
   * @param  {string | null} toDate (optional)
   * @param  {number} [limit=0] this the query limit, if 0 is passed then no limit will be applied
   * @returns {promise<array>} list of searched users with their contributed microservices
   * @author Veerender
   */
  innerSourceContributors(
    filterQuery = null,
    fromDate = '2020-01-01',
    toDate,
    limit = 0,
  ) {
    const pipelines = [];

    const adpSearchFilterPipeline = {
      $match: {
        $and: [
          { type: 'microservice' },
          { deleted: { $exists: false } },
        ],
      },
    };
    if (filterQuery) {
      adpSearchFilterPipeline.$match.$and.push(...filterQuery);
    }

    // Stage 1 Match user by date range
    const dateRangeFilterPipeline = {
      $match: {
        $and: [
          { date: { $gte: fromDate } },
          { deleted: { $exists: false } },
        ],
      },
    };
    if (toDate) {
      dateRangeFilterPipeline.$match.$and.push({ date: { $lte: toDate } });
    }
    pipelines.push(dateRangeFilterPipeline);

    // stage 2 Grouping by user id
    pipelines.push({
      $group: {
        _id: {
          user_id: '$user_id',
        },
        micro_services_commit_list: {
          $push: '$$ROOT',
        },
      },
    });

    // Stage 3: Lookups innersource for orgnisation details
    // lookup adp by passing user search filter input
    pipelines.push(
      {
        $lookup: {
          from: 'innersourceuserhistory',
          let: {
            signum: '$_id.user_id',
          },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$signum', '$$signum'] }] } } },
            { $sort: { snapshot_date: -1 } },
            { $limit: 1 },
          ],
          as: 'snapshot',
        },
      },
      {
        $lookup: {
          from: 'adp',
          pipeline: [adpSearchFilterPipeline],
          as: 'msAsset',
        },
      },
    );

    // Stage 4: destructure snapshot and microservices
    pipelines.push(
      { $unwind: { path: '$msAsset', preserveNullAndEmptyArrays: true } },
      // service category join
      {
        $lookup: {
          from: 'listoption',
          let: { servCatSelectId: '$msAsset.service_category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$select-id', '$$servCatSelectId'] },
                  ],
                },
                type: 'item',
                'group-id': 2,
              },
            },
            { $limit: 1 },
          ],
          as: 'serviceCategoryListoption',
        },
      },
      { $unwind: '$serviceCategoryListoption' },
      // domain join
      {
        $lookup: {
          from: 'listoption',
          let: { domainSelectId: '$msAsset.domain' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$select-id', '$$domainSelectId'] },
                  ],
                },
                type: 'item',
                'group-id': 3,
              },
            },
            { $limit: 1 },
          ],
          as: 'domainListoption',
        },
      },
      { $unwind: '$domainListoption' },
    );

    // Stage 5: add new field for filtering microservices commits with
    // user search filtered msAsset results
    pipelines.push({
      $addFields: {
        micro_services_listings: {
          $filter: {
            input: '$micro_services_commit_list',
            as: 'msCommits',
            cond: { $eq: ['$$msCommits.asset_id', '$msAsset._id'] },
          },
        },
      },
    },
    {
      $unwind: {
        path: '$micro_services_listings',
      },
    },
    {
      $unwind: {
        path: '$snapshot',
        preserveNullAndEmptyArrays: true,
      },
    });

    // Stage 6: Group by user details with asset details
    pipelines.push(
      {
        $group: {
          _id: {
            userEId: '$micro_services_listings.user_id',
            assetId: '$micro_services_listings.asset_id',
          },
          domain: { $last: '$domainListoption.name' },
          domain_select_id: { $last: '$msAsset.domain' },
          service_category: { $last: '$serviceCategoryListoption.name' },
          service_category_select_id: { $last: '$msAsset.service_category' },
          assetDate: { $last: '$micro_services_listings.date' },
          assetUserName: { $last: '$micro_services_listings.user_name' },
          assetUserEmail: { $last: '$micro_services_listings.user_email' },
          assetSlug: { $last: '$micro_services_listings.asset_slug' },
          assetName: { $last: '$msAsset.name' },
          assetCommits: { $sum: '$micro_services_listings.commits' },
          assetInsertions: { $sum: '$micro_services_listings.insertions' },
          assetDeletions: { $sum: '$micro_services_listings.deletions' },
          organisation: { $last: '$snapshot.organisation' },
          ou: { $last: '$snapshot.peopleFinder.operationalUnit' },
        },
      }, {
      // calculate contribution weight
        $addFields: {
          assetContributionWeight: {
            $add: [{ $sum: '$assetInsertions' }, { $multiply: [0.5, { $sum: '$assetDeletions' }] }],
          },
        },
      },
    );

    // Stage 4: by default sort by individual asset contribution
    pipelines.push({
      $sort: {
        assetContributionWeight: -1,
      },
    });

    // Stage 5: Group by user and asset details and prepare microservices details
    pipelines.push({
      $group: {
        _id: { userEId: '$_id.userEId' },
        cumulativeUserName: { $last: '$assetUserName' },
        cumulativeUserEmail: { $last: '$assetUserEmail' },
        cumulativeUserDateFrom: { $last: '$assetDate' },
        cumulativeUserDateTo: { $first: '$assetDate' },
        cumulativeUserCommits: { $sum: '$assetCommits' },
        cumulativeUserInsertions: { $sum: '$assetInsertions' },
        cumulativeUserDeletions: { $sum: '$assetDeletions' },
        organisation: { $last: '$organisation' },
        ou: { $last: '$ou' },
        microServices: {
          $push: {
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
          },
        },
      },
    });

    pipelines.push({
      $addFields: {
        mainContributionWeight: {
          $add: [{ $sum: '$cumulativeUserInsertions' },
            { $multiply: [0.5, { $sum: '$cumulativeUserDeletions' }] },
          ],
        },
      },
    });

    // Stage 6: by default sort by user overall contribution weight
    pipelines.push({
      $sort: {
        mainContributionWeight: -1,
      },
    });

    // stage 7: Projection
    pipelines.push(
      {
        $project: {
          _id: 0,
          userId: '$_id.userEId',
          userName: '$cumulativeUserName',
          userEmail: '$cumulativeUserEmail',
          dateFrom: '$cumulativeUserDateFrom',
          dateTo: '$cumulativeUserDateTo',
          totalCommits: '$cumulativeUserCommits',
          totalAddedLines: '$cumulativeUserInsertions',
          totalRemovedLines: '$cumulativeUserDeletions',
          organisation: '$organisation',
          ou: '$ou',
          contributionWeight: '$mainContributionWeight',
          micro_services: '$microServices',
        },
      },
    );

    // limit
    if (limit) {
      pipelines.push({
        $limit: +limit,
      });
    }
    return adp.db.aggregate(this.dbMongoCollection, pipelines);
  }

  /**
   * innersource organisations search
   * perform match by date range
   * then group by userid and prepare all user commits list
   * then lookup of innersourceuserhistory to get user organisation using user signum;
   * NOTE: there might be users in two different orgs, in that case remove limit
   * then lookup of adp by passing filters(domain,service_category) sent from Client
   * then filter user commits with microservices returned by adp lookup
   * calculate contribution weight of individual MS as "linesadded + 0.5 * linesremoved"
   * and perform default sort using it
   * then group by asset id and prepare commits, deletes, insertions;also users list with their orgs
   * then group by organisation and prepare microservices details using above grouping
   * calculate overall contribution weight on aggregated result and perform default sort using it
   * @param {array|null} [filterQuery=null]  (optional)list of filter groups with $or filter items
   * example: $and: [ { $or: [{ service_category: 1}, { service_category: 2} ] },
   * { $or: [{ domain: 1 }] } ]
   * example:
   * $and: [ { $or: [{ service_category: 1}, { service_category: 2} ] },
   *   { $or: [{ domain: 1 }] }, { $or: [{from_date : '2020=07-09'}]}]
   * @param  {string | null} [fromDate='2020-01-01'] (optional) default is '2020-01-01'
   * @param  {string | null} toDate (optional)
   * @param  {number} [limit=0] this the query limit, if 0 is passed then no limit will be applied
   * @returns {promise<array>} list of searched users with their contributed microservices
   * @author Veerender
   */
  innersourceOrganisations(
    filterQuery = null,
    fromDate = '2020-01-01',
    toDate,
    limit = 0,
  ) {
    const pipelines = [];

    const gitStatusRange = {
      $match: {
        $and: [
          { date: { $gte: fromDate } },
          { deleted: { $exists: false } },
          { 'innersourceUserHistorySnapshot.organisation': { $ne: null } },
        ],
      },
    };
    if (toDate) {
      gitStatusRange.$match.$and.push({ date: { $lte: toDate } });
    }
    pipelines.push(gitStatusRange);

    // ms data for reference
    pipelines.push(...[
      // asset info
      {
        $lookup: {
          from: 'adp',
          let: { varAssetId: '$asset_id' },
          pipeline: [
            {
              $match: {
                $expr: { $and: [{ $eq: ['$_id', '$$varAssetId'] }] },
              },
            },
            { $limit: 1 },
          ],
          as: 'assetInfo',
        },
      },
      { $unwind: '$assetInfo' },
      {
        $addFields: {
          service_category: '$assetInfo.service_category',
          domain: '$assetInfo.domain',
        },
      },
      // service category join
      {
        $lookup: {
          from: 'listoption',
          let: { servCatSelectId: '$assetInfo.service_category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$select-id', '$$servCatSelectId'] },
                  ],
                },
                type: 'item',
                'group-id': 2,
              },
            },
            { $limit: 1 },
          ],
          as: 'serviceCategoryListoption',
        },
      },
      { $unwind: '$serviceCategoryListoption' },
      // domain join
      {
        $lookup: {
          from: 'listoption',
          let: { domainSelectId: '$assetInfo.domain' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$select-id', '$$domainSelectId'] },
                  ],
                },
                type: 'item',
                'group-id': 3,
              },
            },
            { $limit: 1 },
          ],
          as: 'domainListoption',
        },
      },
      { $unwind: '$domainListoption' },
    ]);

    const matchMsData = {
      $match: {
        $and: [
          { 'assetInfo.deleted': { $exists: false } },
        ],
      },
    };
    if (filterQuery) {
      matchMsData.$match.$and.push(...filterQuery);
    }
    pipelines.push(matchMsData);

    // Grouping microservice+organisations and then organisations with sorting
    pipelines.push(...[
      // group orgs + ms together
      {
        $group: {
          _id: {
            organisation: '$innersourceUserHistorySnapshot.organisation',
            assetId: '$assetInfo._id',
          },
          uniqueContributors: { $addToSet: '$user_id' },
          assetName: { $last: '$assetInfo.name' },
          commits: { $sum: '$commits' },
          insertions: { $sum: '$insertions' },
          deletions: { $sum: '$deletions' },
          service_category: { $last: '$serviceCategoryListoption.name' },
          service_category_select_id: { $last: '$assetInfo.service_category' },
          domain: { $last: '$domainListoption.name' },
          domain_select_id: { $last: '$assetInfo.domain' },
        },
      },
      {
        $addFields: {
          contributors: { $size: '$uniqueContributors' },
          weight: {
            $add: [
              { $sum: '$insertions' },
              { $multiply: [0.5, { $sum: '$deletions' }] },
            ],
          },
        },
      },
      {
        $sort: { weight: -1, assetName: 1 },
      },

      // group by organisation only
      {
        $group: {
          _id: '$_id.organisation',
          organisation: { $last: '$_id.organisation' },
          contributors: { $sum: '$contributors' },
          totalCommits: { $sum: '$commits' },
          totalAddedLines: { $sum: '$insertions' },
          totalRemovedLines: { $sum: '$deletions' },
          contributionWeight: { $sum: '$weight' },
          micro_services: {
            $push: {
              assetId: '$_id.assetId',
              assetName: '$assetName',
              commits: '$commits',
              contributors: '$contributors',
              insertions: '$insertions',
              deletions: '$deletions',
              service_category: '$service_category',
              service_category_select_id: '$service_category_select_id',
              domain: '$domain',
              domain_select_id: '$domain_select_id',
              weight: '$weight',
            },
          },
        },
      },
      { $sort: { contributionWeight: -1, organisation: 1 } },
    ]);

    if (limit) {
      pipelines.push({ $limit: +limit });
    }
    return adp.db.aggregate(this.dbMongoCollection, pipelines);
  }


  /**
   * innerSourceByTagReportStatus
   * Returns an object with GitByStatusByTag Updated Status
   * @returns {Object} JSON Object with the result
   * @author Armando Dias [zdiaarm]
   */
  innerSourceByTagReportStatus() {
    this.innerSourceByTagReportStatusBoolean = true;

    const step1 = {
      $group: {
        _id: { asset_slug: '$asset_slug' },
        commits: { $sum: '$commits' },
        latest: { $last: '$date' },
        oldest: { $first: '$date' },
      },
    };

    const step2 = {
      $project: {
        _id: 0,
        microservice: '$_id.asset_slug',
        commits: '$commits',
        latest: '$latest',
        oldest: '$oldest',
      },
    };

    const step3 = {
      $sort: {
        microservice: 1,
      },
    };

    const pipeline = [];
    pipeline.push(step1);
    pipeline.push(step2);
    pipeline.push(step3);

    return adp.db.aggregate('gitstatusbytag', pipeline)
      .then((RESULT) => {
        if (RESULT && RESULT.docs && Array.isArray(RESULT.docs)) {
          const commits = RESULT.docs;
          const result = {};
          const totalObject = {
            commits: 0,
            latest: '0000-00-00',
            oldest: '9999-99-99',
          };
          commits.forEach((ITEM) => {
            totalObject.commits += ITEM.commits;
            totalObject.latest = totalObject.latest > ITEM.latest
              ? totalObject.latest : ITEM.latest;
            totalObject.oldest = totalObject.oldest < ITEM.oldest
              ? totalObject.oldest : ITEM.oldest;
          });
          result.total = totalObject;
          result.microservices = {};
          commits.forEach((ITEM) => {
            result.microservices[ITEM.microservice] = {
              commits: ITEM.commits,
              latest: ITEM.latest,
              oldest: ITEM.oldest,
            };
          });
          return result;
        }
        return {};
      })
      .catch((ERROR) => {
        throw new Error(ERROR);
      });
  }
}


module.exports = Gitstatus;
