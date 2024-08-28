// ============================================================================================= //
/**
* [ global.adp.releaseSettings.ReleaseSettingsController ]
* Get the current list of features which can be switched on or off.
* @author Michael Coughlan [zmiccou]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('../library/errorLog');


class ReleaseSettingsController {
  constructor() {
    this.packname = 'adp.releaseSettings.ReleaseSettingsController';
    this.releaseSettingsCacheKey = 'RELEASESETTINGS';
    this.releaseSettings = new adp.models.ReleaseSettings();
  }

  /**
   * Call the correct model function depending on the passed parameters.
   *
   * @param {string} key the identifier for the release setting
   * @returns {array} An array containing the one or many release settings
   * @author Michael Coughlan [zmiccou]
   */
  getReleaseSettings(key) {
    return new Promise((RESOLVE, REJECT) => {
      this.releaseSettings.getReleaseSettings(key)
        .then((releaseSettingsDocuments) => {
          // If we supplied a key and got no results, return a 404 error
          if (key && releaseSettingsDocuments.docs.length < 1) {
            REJECT(errorLog(
              404,
              'No release setting with this key was found.',
              {
                key,
                error: `There are no release settings stored in our database with this key: ${key}`,
              },
              'getReleaseSettings',
              this.packname,
            ));
          } else {
            RESOLVE(releaseSettingsDocuments.docs);
          }
        })
        .catch((error) => {
          REJECT(errorLog(
            error.code || 500,
            error.message || 'Error in Model while fetching ReleaseSettings',
            {
              key,
              error,
            },
            'getReleaseSettings',
            this.packname,
          ));
        });
    });
  }

  /**
   * Call the function to get the correct key value from the cache.
   * If not found cache is set and value is fetched from database
   *
   * @param {string} key the identifier for the release setting
   * @returns {array} An array containing the one or many release settings
   * @author Githu Jeeva Savy [zjeegit]
   */
  getReleaseSettingsCache(key) {
    const cacheTimeoutMs = global.adp.masterCacheTimeOut.releaseSettings * 1000;

    return new Promise((resolve, reject) => {
      global.adp.masterCache.get(this.releaseSettingsCacheKey, null, key)
        .then((releaseArray) => {
          resolve(releaseArray);
        })
        .catch(() => {
          this.getReleaseSettings(key).then((releaseArray) => {
            global.adp.masterCache.set(
              this.releaseSettingsCacheKey, null, key, releaseArray, cacheTimeoutMs,
            );
            resolve(releaseArray);
          }).catch((error) => {
            reject(errorLog(
              error.code || 500,
              error.message || 'Failed to fetch the alert banner',
              {
                error, key, cacheKey: this.releaseSettingsCacheKey, cacheTimeoutMs,
              },
              'getReleaseSettingsCache',
              this.packname,
            ));
          });
        });
    });
  }


  /**
   * Changes the status of a Release Setting on Database.
   * If the key doesn't exist, this function will create it.
   * If the key exists, this function will update it.
   * @param {string} key the identifier for the release setting
   * @param {boolean} enabled if this release setting is enabled (true) or disabled (false).
   * @param {string} target where this release setting is used.
   * @param {object} object where you can add/read additional parameters. Can be undefined/null.
   * @returns {promise} Promise will be resolved if successful or rejected with an error if fails.
   * @author Armando Dias [zdiaarm]
   */
  change(key, enabled, target = 'backend', object) {
    return new Promise((RESOLVE, REJECT) => {
      const settingsModel = new adp.models.ReleaseSettings();
      settingsModel.getReleaseSettings(key)
        .then((RESULT) => {
          if (RESULT && RESULT.docs && RESULT.docs[0] && RESULT.docs[0].key === key) {
            const obj = RESULT.docs[0];
            obj.isEnabled = enabled;
            obj.target = target;
            if (object) {
              obj.value = object;
            }
            settingsModel.updateReleaseSettings(obj)
              .then((UPDATERESULT) => {
                if (UPDATERESULT.ok === true) {
                  RESOLVE();
                  return;
                }
                const errorCode = UPDATERESULT
                  && UPDATERESULT.code
                  ? UPDATERESULT.code
                  : 500;
                const errorMessage = UPDATERESULT
                  && UPDATERESULT.message
                  ? UPDATERESULT.message
                  : `Error when it was trying to update the release settings for "${key}"`;
                const errorObject = {
                  error: UPDATERESULT,
                };
                REJECT(errorLog(errorCode, errorMessage, errorObject, 'change', this.packname));
              })
              .catch((ERROR) => {
                const errorCode = ERROR
                  && ERROR.code
                  ? ERROR.code
                  : 500;
                const errorMessage = ERROR
                  && ERROR.message
                  ? ERROR.message
                  : `Error when it was trying to update the release settings for "${key}"`;
                const errorObject = {
                  error: ERROR,
                };
                REJECT(errorLog(errorCode, errorMessage, errorObject, 'change', this.packname));
              });
          } else {
            const objectToCreate = {
              key,
              isEnabled: enabled,
              target,
            };
            if (object) {
              objectToCreate.value = object;
            }
            settingsModel.createReleaseSettings(objectToCreate)
              .then((CREATERESULT) => {
                if (CREATERESULT.ok === true) {
                  RESOLVE();
                  return;
                }
                const errorCode = CREATERESULT
                  && CREATERESULT.code
                  ? CREATERESULT.code
                  : 500;
                const errorMessage = CREATERESULT
                  && CREATERESULT.message
                  ? CREATERESULT.message
                  : `Error when it was trying to create the release settings for "${key}"`;
                const errorObject = {
                  error: CREATERESULT,
                };
                REJECT(errorLog(errorCode, errorMessage, errorObject, 'change', this.packname));
              })
              .catch((ERROR) => {
                const errorCode = ERROR
                  && ERROR.code
                  ? ERROR.code
                  : 500;
                const errorMessage = ERROR
                  && ERROR.message
                  ? ERROR.message
                  : `Error when it was trying to create the release settings for "${key}"`;
                const errorObject = {
                  error: ERROR,
                };
                REJECT(errorLog(errorCode, errorMessage, errorObject, 'change', this.packname));
              });
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR
            && ERROR.code
            ? ERROR.code
            : 500;
          const errorMessage = ERROR
            && ERROR.message
            ? ERROR.message
            : `Error when it was trying to retrieve the "${key}" release settings from database `;
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'change', this.packname));
        });
    });
  }
}
module.exports = ReleaseSettingsController;
// ============================================================================================= //
