// ============================================================================================= //
module.exports = () => {
  // ------------------------------------------------------------------------------------------- //
  const ObjectID = adp.MongoObjectID;
  const adpSetupDB = [
    {
      _id: new ObjectID('6405c5f96206c200084968bb'),
      setup_name: 'egsSync',
      parameters: {
        egsSyncActive: true,
        egsSyncActiveTypes: ['article', 'tutorial', 'microservice', 'assembly'],
        egsSyncServerAddress: `${adp.config.mockServer}/egsSync/mockserver`,
        egsSyncItemsPerRequest: 10,
        egsSyncMaxBytesSizePerRequest: 204800,
      },
    },
  ];
  return adpSetupDB;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
