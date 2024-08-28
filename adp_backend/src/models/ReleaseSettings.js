/**
* [ adp.models.ReleaseSettings ]
* ReleaseSettings Database Model
* @author Armando Dias [zdiaarm]
* @author Michael Coughlan [zmiccou]
*/
adp.docs.list.push(__filename);

class ReleaseSettings {
  constructor() {
    this.dbMongoCollection = 'releasesettings';
  }


  /**
   * Short version of getReleaseSettings
   * @param {string} releaseSettingsKey the key we will search by
   * @returns {boolean} Just true or false.
   * If does not find, returns false.
   * If gets error, returns false.
   * @author Armando Dias [zdiaarm]
   */
  async get(releaseSettingsKey) {
    const mongoQuery = {};
    if (releaseSettingsKey) {
      mongoQuery.key = releaseSettingsKey;
    }
    try {
      const fullResult = await adp.db.find(this.dbMongoCollection, mongoQuery);
      if (!fullResult
        || !fullResult.docs
        || !Array.isArray(fullResult.docs)
        || fullResult.docs.length <= 0) {
        return false;
      }
      if (fullResult
        && fullResult.docs
        && Array.isArray(fullResult.docs)
        && fullResult.docs.length > 0
      ) {
        const authorization = fullResult.docs[0].isEnabled;
        return authorization;
      }
      return false;
    } catch (error) {
      return false;
    }
  }


  /**
   * Retrieve one release setting with the matching key
   * @param {string} releaseSettingsKey the key we will search by
   * @returns {promise} Promise object with the requested query
   * @author Michael Coughlan [zmiccou]
   */
  getReleaseSettings(releaseSettingsKey) {
    const mongoQuery = {};

    if (releaseSettingsKey) {
      mongoQuery.key = releaseSettingsKey;
    }

    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Creates a new release setting.
   * Note: Check before if this key already exists!
   * @param {object} releaseSettingsObject the object prepared by the controller
   * @returns {promise} Promise object with the requested action
   * @author Armando Dias [zdiaarm]
   */
  createReleaseSettings(releaseSettingsObject) {
    return adp.db.create(this.dbMongoCollection, releaseSettingsObject);
  }

  /**
   * Update a specific release setting.
   * Note: Read the target object before call this update!
   * @param {object} releaseSettingsObject the updated object prepared by the controller
   * @returns {promise} Promise object with the requested action
   * @author Armando Dias [zdiaarm]
   */
  updateReleaseSettings(releaseSettingsObject) {
    return adp.db.update(this.dbMongoCollection, releaseSettingsObject, true);
  }
}

module.exports = ReleaseSettings;
