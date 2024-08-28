// ============================================================================================= //
/**
* [ global.adp.microservice.read ]
* Retrieve a MicroService for reading.
* @param {String} ID A simple String with the ID of the MicroService.
* @param {String} requestedVersion Microservice version needs to provided as a string.
* @return {JSON} Returns a JSON Object containing the information of the MicroService.
* @author Armando Schiavon Dias [escharm]
*/
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const feRendering = require('../feRendering/prepareDocStructureForRendering');
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (ID, USEROBJECT, requestedVersion) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp(['microservice']);
  const timer = new Date();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.microservice.read';
  const cacheObject = 'ALLASSETS';
  let cacheObjectID = `${ID}`;
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.allAssets * 1000;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let realID = null;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const readThisAsset = () => {
    let readThisTimer = new Date();
    global.adp.masterCache.get(cacheObject, null, cacheObjectID)
      .then((CACHE) => {
        const readThisEndTimer = (new Date()).getTime() - (readThisTimer.getTime());
        adp.echoLog(`Fetch cached asset [${ID}] successfully in ${readThisEndTimer}ms`, null, 200, packName);
        deliveryThisAsset(CACHE);
      })
      .catch(() => {
        dbModel.getAssetByIDorSLUG(ID)
          .then(async (ANSWER) => {
            // fetching only specifc version for a microservice to increase the performance
            let answer;
            if (requestedVersion !== null && requestedVersion !== undefined) {
              const DocsArray = ANSWER.docs[0];
              const autoObjKey = (DocsArray && DocsArray.menu_auto ? 'auto' : 'manual');
              if (DocsArray && DocsArray.menu) {
                if (DocsArray.menu && DocsArray.menu.auto && DocsArray.menu.manual) {
                  if (requestedVersion === 'latest') {
                    if (DocsArray.menu[autoObjKey].release.length > 0) {
                      // eslint-disable-next-line no-param-reassign
                      requestedVersion = DocsArray.menu[autoObjKey].release[0].version;
                    }
                  }
                  // eslint-disable-next-line arrow-parens
                  const versionsOnly = DocsArray.menu[autoObjKey].release.map((ver) => ({
                    version: ver.version,
                    documents: requestedVersion === ver.version ? ver.documents : [],
                  }));
                  DocsArray.menu[autoObjKey].release = [...versionsOnly];
                  if (requestedVersion === 'development') {
                    if (DocsArray.menu_auto) {
                      DocsArray.menu.manual.release = [];
                    } else {
                      DocsArray.menu.auto.release = [];
                    }
                  }
                }
              }
              // eslint-disable-next-line no-param-reassign
              ANSWER.docs[0] = DocsArray;
              answer = await adp.mimer.loadFullMergedMenu(ANSWER, requestedVersion);

              if (DocsArray && DocsArray.menu && DocsArray.menu[autoObjKey]) {
                // eslint-disable-next-line arrow-parens
                DocsArray.menu[autoObjKey].release.forEach(element => {
                  // replacing with empty object otherthan specificversion.
                  if (element.version !== requestedVersion) {
                    const verLabel = {};
                    verLabel.versionLabel = element.version;
                    if ('menu_merged' in answer.docs[0]) {
                      answer.docs[0].menu_merged[element.version] = verLabel;
                    }
                  }
                });

                if ('menu_merged' in answer.docs[0] && requestedVersion !== 'development') {
                  const verLabel = {};
                  verLabel.versionLabel = 'development';
                  answer.docs[0].menu_merged.development = verLabel;
                }
              }
            } else {
              answer = await adp.mimer.loadFullMergedMenu(ANSWER);
            }
            if (answer.docs.length > 0) {
              let readThisEndTimer = (new Date()).getTime() - (readThisTimer.getTime());
              adp.echoLog(`Fetch database asset [${ID}] successfully in ${readThisEndTimer}ms`, null, 200, packName);
              readThisTimer = new Date();
              realID = answer.docs[0]._id;
              if (cacheObjectID !== realID) {
                cacheObjectID = realID;
              }
              global.adp.migration.slugItNow(answer.docs[0])
                .then((assetSluged) => {
                  if (assetSluged === true) {
                    readThisEndTimer = (new Date()).getTime() - (readThisTimer.getTime());
                    adp.echoLog(`Asset [${ID}] slug check complete in ${readThisEndTimer}ms`, null, 200, packName);
                    deliveryThisAsset(answer.docs[0]);
                  } else {
                    dbModel.update(assetSluged)
                      .then((afterUpdate) => {
                        if (afterUpdate.ok === true) {
                          readThisEndTimer = (new Date()).getTime() - (readThisTimer.getTime());
                          adp.echoLog(`Asset [${ID}] slug updated in ${readThisEndTimer}ms`, null, 200, packName);
                          deliveryThisAsset(assetSluged);
                        } else {
                          const errorCode = 500;
                          const errorMessage = 'Error updating a slug of an asset into database.';
                          const errorObject = {
                            error: 'Result from database [ afterUpdate.ok === true ] fails.',
                            returnFromDatabase: afterUpdate,
                            objectToUpdate: assetSluged,
                          };
                          REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
                          global.adp.masterCache
                            .set(cacheObject, null, cacheObjectID, 1000, errorCode);
                        }
                      })
                      .catch((ERROR) => {
                        const errorCode = ERROR.code || 500;
                        const errorMessage = ERROR.message || 'Error trying to update a slug of an asset into database.';
                        const errorObject = {
                          error: ERROR,
                          when: 'Error got on running [ dbModel.update ]',
                          objectToUpdate: assetSluged,
                        };
                        REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
                        global.adp.masterCache
                          .set(cacheObject, null, cacheObjectID, 1000, errorCode);
                      });
                  }
                })
                .catch((ERROR) => {
                  const errorCode = ERROR.code || 500;
                  const errorMessage = ERROR.message || 'Error trying to update a slug.';
                  const errorObject = {
                    error: ERROR,
                    when: 'Error got on running [ adp.migration.slugItNow ]',
                    parameter: answer.docs[0],
                  };
                  REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
                  global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, errorCode);
                });
            } else {
              const errorCode = 404;
              const errorMessage = 'Asset not found.';
              const errorObject = {
                error: 'Expecting an asset. Got none.',
                when: 'Error happen when got no results for [ dbModel.getAssetByIDorSLUG @ adp.models.Adp() ]',
                parameter: ID,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
              global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, errorCode);
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error trying to find an asset.';
            const errorObject = {
              error: ERROR,
              when: 'Error got when running [ dbModel.getAssetByIDorSLUG @ adp.models.Adp() ]',
              parameter: ID,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
            global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, errorCode);
          });
      });
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const deliveryThisAsset = async (ASSET) => {
    let deliveryTimer = new Date();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    let asset = global.adp.clone(ASSET);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    // Checking Documents
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

    asset = await global.adp.microservice.updateAssetDocSettings(asset);
    let deliveryEndTimer = (new Date()).getTime() - (deliveryTimer.getTime());
    adp.echoLog(`Asset [${ASSET.slug}] built document settings in ${deliveryEndTimer}ms`, null, 200, packName);
    deliveryTimer = new Date();

    if (asset
      && asset.menu_merged
      && asset.mimer_version_starter
      && ((`${asset.mimer_version_starter}`).trim().length > 0)
    ) {
      asset.documentsForRendering = adp.clone(asset.menu_merged);
      delete asset.mimer_menu_in_progress;
      delete asset.mimer_menu;
      delete asset.menu_merged;
    } else {
      asset = await feRendering.prepareDocStructureForRendering(asset);
    }
    deliveryEndTimer = (new Date()).getTime() - (deliveryTimer.getTime());
    adp.echoLog(`Asset [${ASSET.slug}] built menu structure in ${deliveryEndTimer}ms`, null, 200, packName);
    deliveryTimer = new Date();

    await global.adp.microservices.denormalize(asset)
      .then((DENORMALIZED) => {
        deliveryEndTimer = (new Date()).getTime() - (deliveryTimer.getTime());
        adp.echoLog(`Asset [${ASSET.slug}] denormalised in ${deliveryEndTimer}ms`, null, 200, packName);
        asset.denorm = DENORMALIZED;
      })
      .catch(() => {
        asset.denorm = {};
      });
    if (asset.tags !== null && asset.tags !== undefined) {
      const fullTags = [];
      await asset.tags.forEach((tag) => {
        if (typeof tag === 'string') {
          const myLabel = global.adp.tags.getLabel(tag);
          const obj = {
            id: tag,
            label: myLabel,
          };
          fullTags.push(obj);
        } else {
          fullTags.push(tag);
        }
      });
      asset.tags = fullTags;
    }
    deliveryTimer = new Date();
    const allUsersOfThisProcess = {};
    const shouldCheckNameAndEmail = ID !== asset.slug;
    await adp.microservices.userTeamFullData(asset, allUsersOfThisProcess, shouldCheckNameAndEmail);
    deliveryEndTimer = (new Date()).getTime() - (deliveryTimer.getTime());
    adp.echoLog(`Asset [${ASSET.slug}] denormalised in ${deliveryEndTimer}ms`, null, 200, packName);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    // Checking Tags
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    if (Array.isArray(asset.tags)) {
      const fullTags = [];
      asset.tags.forEach((ELEMENT) => {
        let id = null;
        if (typeof ELEMENT === 'string') {
          id = ELEMENT;
        } else if (ELEMENT.id !== undefined) {
          id = ELEMENT.id;
        }
        const myLabel = global.adp.tags.getLabel(id);
        const obj = {
          id,
          label: myLabel,
        };
        fullTags.push(obj);
      });
      asset.tags = fullTags;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const situation1 = USEROBJECT === undefined;
    const situation2 = USEROBJECT === null;
    let situation3 = false;
    if (!situation1 && !situation2) {
      situation3 = USEROBJECT.role === 'admin';
    }
    if (situation1 || situation2 || situation3) {
      if (asset.length > 0) {
        asset.readonlyfields = [];
      }
      const endTimer = (new Date()).getTime() - (timer.getTime());
      adp.echoLog(`Read asset [ ${asset.name} ] was successfully Completed in ${endTimer}ms!`, null, 200, packName);
      RESOLVE(asset);
      global.adp.masterCache.set(
        cacheObject,
        null,
        cacheObjectID,
        asset,
        cacheHolderInMilliseconds,
      );
      global.adp.masterCache.shortcut(cacheObject, null, cacheObjectID, asset);
    } else {
      const sig = USEROBJECT.signum;
      deliveryTimer = new Date();
      global.adp.permission.fieldIsEditableByPermissionRules(asset, sig)
        .then((READONLYFIELDS) => {
          asset.readonlyfields = READONLYFIELDS;
          deliveryEndTimer = (new Date()).getTime() - (deliveryTimer.getTime());
          adp.echoLog(`Asset [${ASSET.slug}] adding editable permission rules in ${deliveryEndTimer}ms`, null, 200, packName);
          RESOLVE(asset);
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            asset,
            cacheHolderInMilliseconds,
          );
          global.adp.masterCache.shortcut(cacheObject, null, cacheObjectID, asset);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error trying to set the permissions over an asset.';
          const errorObject = {
            error: ERROR,
            when: 'Error got when running [ adp.permission.fieldIsEditableByPermissionRules ]',
            parameters: {
              signum: sig,
              asset,
            },
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
          global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, errorCode);
        });
    }
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.tags.reload()
    .then(() => {
      readThisAsset();
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error trying to reload the tags before read an asset.';
      const errorObject = {
        error: ERROR,
        when: 'Error got when running [ adp.tags.reload ]',
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, errorCode);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
