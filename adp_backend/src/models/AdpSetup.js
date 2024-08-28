/**
* [ adp.models.AdpSetup ]
* AdpSetup Database Model
* @author Armando Dias [zdiaarm]
*/
adp.docs.list.push(__filename);

class AdpSetup {
  constructor() {
    this.dbMongoCollection = 'adpSetup';
  }

  /**
   * getSetupByName
   * Used to retrieve the setup parameters from database.
   * @param {string} SETUPNAME The name of the setup parameters.
   * @returns {promise} response of the request.
   * @author Armando Dias [zdiaarm]
   */
  getSetupByName(SETUPNAME) {
    const mongoQuery = {
      setup_name: { $eq: SETUPNAME },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }
}

module.exports = AdpSetup;
