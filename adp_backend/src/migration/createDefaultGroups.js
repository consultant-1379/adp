const { RBAC } = require('../library/utils/constants');

// ============================================================================================= //
/**
* [ global.adp.migration.createDefaultGroups ]
* Create Default Internal Users Group
* @author Omkar Sadegaonkar [zsdgmkr], Veerender
*/
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.migration.createDefaultGroups';
  const dbMongoCollection = 'rbacgroups';
  await adp.mongoDatabase.collection(dbMongoCollection).drop().then(() => true)
    .catch((error) => {
      const errorObj = {
        message: 'Failed to drop collection',
        code: 500,
        data: {
          error, origin: 'migration.createDefaultGroups',
        },
      };
      adp.echoLog('Error in [ dp.migration.createDefaultGroups ]', errorObj, 500, packName, true);
    });
  await adp.mongoDatabase.createCollection(dbMongoCollection);
  const { DEFAULT_GROUPID } = RBAC;
  const defaultID = {
    _id: new adp.MongoObjectID(DEFAULT_GROUPID),
    type: 'group',
    name: 'Internal Users Group',
    permission: [
      {
        _id: new adp.MongoObjectID('603e49f6369e66969a7bfe7e'),
        type: 'asset',
        name: 'Allow all assets perm',
        dynamic: [],
        exception: [],
        static: null,
      },
    ],
    undeletable: true,
  };

  const createGroupPromises = [
    adp.mongoDatabase.collection(dbMongoCollection).insertOne(defaultID),
  ];
  Promise.all(createGroupPromises)
    .then(() => {
      RESOLVE();
    }).catch((error) => {
      const errorObj = {
        message: 'Failed to create groups',
        code: 500,
        data: {
          error, origin: 'migration.createDefaultGroups',
        },
      };
      REJECT(errorObj);
    });
});
// ============================================================================================= //
