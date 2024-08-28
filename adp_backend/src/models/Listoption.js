/**
* [ adp.models.Listoption ]
* listoption Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);


class Listoption {
  constructor() {
    this.dbMongoCollection = 'listoption';
  }


  /**
   * Lists all objects
   * @returns {promise} response obj containing an array of all objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  index() {
    const mongoQuery = {};
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all groups objects
   * @returns {promise} response obj containing an array of all group objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  indexGroups() {
    const mongoQuery = { type: { $eq: 'group' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all groups objects
   * @returns {promise} response obj containing an array of all group objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  indexItems() {
    const mongoQuery = { type: { $eq: 'item' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * fetches denormalised group to child items listoption data by one or more group id.
   * If no id is given all groups will be returned
   * @param {string[]} [idArr] list of listoption group ids, will index all if nothing is given
   * @returns {Promise<object[]>} all denormalised group and related item listoption data
   * @author Cein
   */
  groupItemsByGroupId(idArr = []) {
    const query = [
      {
        $sort: { order: 1 },
      },
    ];

    if (Array.isArray(idArr) && idArr.length) {
      query.push(
        {
          $match: {
            $and: [
              { type: 'group' },
              { _id: { $in: idArr } },
              { deleted: { $exists: false } },
            ],
          },
        },
      );
    } else {
      query.push(
        {
          $match: {
            type: 'group',
            deleted: { $exists: false },
          },
        },
      );
    }

    query.push(
      {
        $lookup: {
          from: 'listoption',
          let: { groupId: '$group-id' },
          pipeline: [
            {
              $sort: { order: 1 },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$group-id', '$$groupId'] },
                    { $eq: ['$type', 'item'] },
                  ],
                },
              },
            },
            {
              $match: { deleted: { $exists: false } },
            },
          ],
          as: 'items',
        },
      },
    );

    return adp.mongoDatabase.collection(this.dbMongoCollection).aggregate(query).toArray();
  }

  /**
   * Get listoptions objects by id
   * @param {array} idArr list of listoption ids
   * @param {boolean} [showDeletedItems=false] show deleted items
   * @returns {promise<object>} response object with matched listoption objects
   * @author Cein
   */
  getById(idArr, showDeletedItems = false) {
    const mongoQuery = { _id: { $in: idArr }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };

    if (showDeletedItems) {
      delete mongoQuery.deleted;
    }

    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Get Groups by IDs
   * @param {Array} IDS Array with the IDs of the Groups
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getManyByGroupID(IDS) {
    const mongoQuery = {
      $or: [],
      deleted: { $exists: false },
    };
    IDS.forEach((ID) => {
      mongoQuery.$or.push({ 'group-id': ID });
    });
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all items objects for a group
   * @param {string} groupId ID of the group
   * @returns {promise} response obj containing an array of all items for group
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getItemsForGroup(groupId) {
    const mongoQuery = { 'group-id': { $eq: groupId }, type: { $eq: 'item' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Create one object
   * @param {object} OBJ that needs to be created
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }
}


module.exports = Listoption;
