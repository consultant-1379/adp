/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.microservice.synchronizeWithElasticSearch';
let syncControlIDs = null;
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ recoveryDocumentRoute ] will retrieve
 * the doc_route information from the denormalized Microservice
 * from the first document ( First release, if empty, then from development ).
 * @param {object} TARGET The active menu object.
 * @returns {string} The full link. If doesn't exists, then the result will be null.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const recoveryDocumentRoute = (TARGET) => {
  if (!TARGET || !TARGET.development || !TARGET.release) {
    return null;
  }
  if (Array.isArray(TARGET.release) && TARGET.release.length > 0) {
    const docsVersion = TARGET.release[0];
    const docFullLink = docsVersion
      && docsVersion.documents
      && docsVersion.documents[0]
      && docsVersion.documents[0].doc_route
      ? docsVersion.documents[0].doc_route.join('/')
      : null;
    return docFullLink;
  }
  if (Array.isArray(TARGET.development) && TARGET.development.length > 0) {
    const firstDocument = TARGET.development[0];
    const docFullLink = firstDocument
      && firstDocument.doc_route
      ? firstDocument.doc_route.join('/')
      : null;
    return docFullLink;
  }
  return null;
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ retrieveFirstDocumentFullLink ] will select
 * the active menu and call [ recoveryDocumentRoute ] to get the fulllink.
 * @param {object} MS One microservice object.
 * @returns {string} The full link. If doesn't exists, then the result will be null.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const retrieveFirstDocumentFullLink = (MS) => {
  if (MS.menu_auto === true) {
    const target = MS && MS.menu && MS.menu.auto ? MS.menu.auto : null;
    return recoveryDocumentRoute(target);
  }
  if (MS.menu_auto === false) {
    const target = MS && MS.menu && MS.menu.manual ? MS.menu.manual : null;
    return recoveryDocumentRoute(target);
  }
  return null;
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ updateToSynchronize ] will add/change a few attributes
 * on the microservice object to be saved on Elastic Search.
 * @param {object} MS One microservice object.
 * @returns {object} The microservice object after changes.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const updateToSynchronize = async (MS) => {
  const ms = adp.clone(MS);
  if (ms.denorm === undefined) {
    ms.denorm = {};
  }
  ms.date_modified = ms.date_modified && ms.date_modified !== '' ? ms.date_modified : undefined;
  if (ms.menu && ms.menu.auto && ms.menu.auto.date_modified === '') {
    ms.menu.auto.date_modified = undefined;
  }
  if (ms.menu && ms.menu.manual && ms.menu.manual.date_modified === '') {
    ms.menu.manual.date_modified = undefined;
  }
  ms.denorm.asset_fullurl = `/marketplace/${MS.slug}`;
  ms.denorm.asset_document_fullurl = retrieveFirstDocumentFullLink(ms);
  ms.synchronization_date = new Date();
  ms.id = ms._id;
  ms.post_name = ms.id;
  delete ms._id;
  delete ms.documentsForRendering;
  delete ms.menu;
  delete ms.repo_urls;
  delete ms.menu_auto;
  delete ms.inval_secret;
  delete ms.approval;
  delete ms.compliance;
  delete ms.denorm.compliance;
  delete ms.denorm.tags;
  const componentNames = [];

  if (MS.component_service && MS.component_service.length > 0) {
    await adp.assembly.getComponentServicesFromAssembly([MS]).then((RESULT) => {
      for (const microservice of RESULT) {
        componentNames.push(microservice.name);
      }
    }).catch((ERROR) => {
      adp.echoLog('Error on adp.microservice.synchronizeWithElasticSearch at updateToSynchronize from adp.assembly.getComponentServicesFromAssembly', { error: ERROR }, 500, 'adp.errorLog', false);
    });
  }

  ms.component_services_name = componentNames;
  return ms;
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ retrieveFromDatabase ] is responsible for use the
 * command [ adp.microservice.read ] to get the Microservice denormalized
 * and calls [ updateToSynchronize ] to make some adjustments.
 * @param {string} ID Microservice ID.
 * @returns {Promise} Promise with the microservice object
 * denormalized and after the [ updateToSynchronize ] changes.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const retrieveFromDatabase = (ID, TYPE) => new Promise((RES, REJ) => {
  if (TYPE === 'assembly') {
    adp.assembly.read(ID, { signum: 'system', role: 'system' })
      .then(MS => RES(updateToSynchronize(MS)))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Trying to retrieve microservice from database';
        const errorObject = {
          error: ERROR,
          id: ID,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteContentIDsFromDatabase', packName));
      });
  } else {
    adp.microservice.read(ID, { signum: 'system', role: 'system' })
      .then(MS => RES(updateToSynchronize(MS)))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Trying to retrieve microservice from database';
        const errorObject = {
          error: ERROR,
          id: ID,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteContentIDsFromDatabase', packName));
      });
  }
});
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ synchronizeThis ] is responsible for the interaction
 * with the ElasticSearch. Creates the index if necessary, insert or
 * update the Microservice indicated by the parameter.
 * @param {string} ID Microservice ID.
 * @returns {Promise} Promise with a small report about what was done.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const synchronizeThis = (ID, TYPE) => {
  if (syncControlIDs.includes(ID)) {
    return new Promise(RES => RES());
  }
  syncControlIDs.push(ID);
  const timer = (new Date()).getTime();
  return new Promise((RES, REJ) => {
    retrieveFromDatabase(ID, TYPE)
      .then((ms) => {
        const msModel = new adp.modelsElasticSearch.Microservices();
        return msModel.searchDocumentIDUsingMicroserviceIDOrSlug(ms.id)
          .then((DOCID) => {
            msModel.updateElasticSearchDocument(DOCID, ms)
              .then(() => {
                const message = `■ ElasticSearch [ ${ms.slug} ] ( Update ) successful synchronized in ${(new Date()).getTime() - timer}ms`;
                adp.echoLog(message, null, 200, packName);
                const result = {
                  id: ID,
                  slug: ms.slug,
                  action: 'Updated',
                  timerMS: ((new Date()).getTime() - timer),
                };
                RES(result);
              })
              .catch((ERRORONUPDATE) => {
                if (ERRORONUPDATE.code === 200) {
                  msModel.insertElasticSearchDocument(ms)
                    .then(() => {
                      const message = `■ ElasticSearch [ ${ms.slug} ]( Insert ) successful synchronized in ${(new Date()).getTime() - timer}ms`;
                      adp.echoLog(message, null, 200, packName);
                      const result = {
                        id: ID,
                        slug: ms.slug,
                        action: 'Inserted',
                        timerMS: ((new Date()).getTime() - timer),
                      };
                      RES(result);
                    })
                    .catch((ERRORONINSERT) => {
                      const errorCode = ERRORONINSERT.code || 500;
                      const errorMessage = ERRORONINSERT.message || 'Error on trying to insert a new document on elasticSearch';
                      const errorObject = {
                        error: ERRORONINSERT,
                        id: ID,
                        ms,
                      };
                      REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeThis', packName));
                    });
                  return;
                }
                const errorCode = ERRORONUPDATE.code || 500;
                const errorMessage = ERRORONUPDATE.message || 'Error on trying to insert a new document on elasticSearch';
                const errorObject = {
                  error: ERRORONUPDATE,
                  id: ID,
                  ms,
                };
                REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeThis', packName));
              });
          })
          .catch((ERROR) => {
            if (ERROR.code === 200) {
              msModel.insertElasticSearchDocument(ms)
                .then(() => {
                  const message = `■ ElasticSearch [ ${ms.slug} ]( Insert ) successful synchronized in ${(new Date()).getTime() - timer}ms`;
                  adp.echoLog(message, null, 200, packName);
                  const result = {
                    id: ID,
                    slug: ms.slug,
                    action: 'Inserted',
                    timerMS: ((new Date()).getTime() - timer),
                  };
                  RES(result);
                })
                .catch((ERRORONINSERT) => {
                  const errorCode = ERRORONINSERT.code || 500;
                  const errorMessage = ERRORONINSERT.message || 'Error on trying to insert a new document on elasticSearch';
                  const errorObject = {
                    error: ERRORONINSERT,
                    id: ID,
                    ms,
                  };
                  REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeThis', packName));
                });
              return;
            }
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error on trying to check the document id from elasticSearch';
            const errorObject = {
              error: ERROR,
              id: ID,
              ms,
            };
            REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeThis', packName));
          });
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Caught an error when tried to run [ retrieveFromDatabase ]';
        const errorObject = {
          error: ERROR,
          id: ID,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeThis', packName));
      });
  });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ queueStep ] organize the queue of Microservices
 * to synchronize one by one with the Elastic Search.
 * @param {number} INDEX The position on the queue. Do the first call with zero.
 * @param {Array} IDS The Array of IDs to queue.
 * @returns {Boolean/Promise} Recursive. Answer with "true" boolean if finished it.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const queueStep = (INDEX, IDS, TYPE) => {
  if (INDEX < IDS.length) {
    const id = IDS[INDEX]._id;
    return synchronizeThis(id, TYPE)
      .then(() => queueStep(INDEX + 1, IDS, TYPE))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Error running synchronizeThis';
        const errorObject = {
          error: ERROR,
          id,
        };
        errorLog(errorCode, errorMessage, errorObject, 'queueStep', packName);
        return queueStep(INDEX + 2, IDS, TYPE);
      });
  }
  return true;
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ deleteOnElasticSearch ] is responsible for delete Microservices
 * from ElasticSearch based on an Array of Microservice IDs to be removed.
 * @param {Array} MONGOIDSTODELETE The Array of Microservices which should be deleted.
 * @returns {Promise} Solved promise with the deleted Microservice list if successful.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const deleteOnElasticSearch = (MONGOIDSTODELETE) => {
  let mongoIDsToDelete = MONGOIDSTODELETE;
  if (!Array.isArray(mongoIDsToDelete)) {
    mongoIDsToDelete = [mongoIDsToDelete];
  }
  const msModel = new adp.modelsElasticSearch.Microservices();
  return new Promise((RES, REJ) => {
    msModel.allIDs()
      .then((ALLIDS) => {
        const msIDToDelete = [];
        ALLIDS.forEach((IDOBJECT) => {
          const findIt = mongoIDsToDelete.find(ITEM => ITEM === IDOBJECT._id);
          if (findIt) {
            msIDToDelete.push(IDOBJECT.elasticID);
          }
        });
        msModel.deleteThese(msIDToDelete)
          .then(() => {
            RES({ deletedMicroservicesOnElasticSearch: msIDToDelete });
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error running [ deleteThese @ dp.modelsElasticSearch.Microservices ]';
            const errorObject = {
              error: ERROR,
              elasticSearchIDsToDelete: msIDToDelete,
              msIDToDelete: mongoIDsToDelete,
            };
            REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteOnElasticSearch', packName));
          });
      })
      .catch((ERROR) => {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        if (errorCode === 404) {
          RES({ msg: 'Index not found. Not an error because there is nothing to delete.' });
          return;
        }
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error running [ allIDs @ dp.modelsElasticSearch.Microservices ]: Not able to retrieve the ID list from ElasticSearch.';
        const errorObject = {
          error: ERROR,
          msIDToDelete: mongoIDsToDelete,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteOnElasticSearch', packName));
      });
  });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ deleteOnElasticSearchWhatDoesNotExistAnymore ] is responsible
 * for build an Array of IDs from Microservices which doesn't exists on MongoDB
 * and use this Array to call the right model function and delete them.
 * @param {Array} MONGOIDS The Array of all Microservices available on MongoDB.
 * In another words, MONGOIDS should contain the Microservice IDs to keep.
 * What exceed in ElasticSearch will be deleted.
 * @returns {Promise} Solved promise with the deleted Microservice list if successful.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const deleteOnElasticSearchWhatDoesNotExistAnymore = (MONGOIDS) => {
  const msModel = new adp.modelsElasticSearch.Microservices();
  return new Promise((RES, REJ) => {
    msModel.allIDs()
      .then((ALLIDS) => {
        const notInMongoDB = [];
        ALLIDS.forEach((IDOBJECT) => {
          const findIt = MONGOIDS.docs.find(ITEM => ITEM._id === IDOBJECT._id);
          if (!findIt) {
            notInMongoDB.push(IDOBJECT.elasticID);
          }
        });
        msModel.deleteThese(notInMongoDB)
          .then(() => {
            RES({ deletedMicroservicesOnElasticSearch: notInMongoDB });
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error running [ deleteThese @ dp.modelsElasticSearch.Microservices ]';
            const errorObject = {
              error: ERROR,
              mongoIDs: MONGOIDS,
              elasticSearchIDs: ALLIDS,
              notInMongo: notInMongoDB,
            };
            REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteOnElasticSearchWhatDoesNotExistAnymore', packName));
          });
      })
      .catch((ERROR) => {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        if (errorCode === 404) {
          RES({ msg: 'Index not found. Not an error because there is nothing to delete.' });
          return;
        }
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error running [ allIDs @ dp.modelsElasticSearch.Microservices ]: Not able to retrieve the ID list from ElasticSearch.';
        const errorObject = {
          error: ERROR,
          mongoIDs: MONGOIDS,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteOnElasticSearchWhatDoesNotExistAnymore', packName));
      });
  });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ synchronizeAll ] organizes the synchronization
 * case no ID was given. Retrieve all Microservice IDs from MongoDB,
 * checks if there is Microservice(s) to be deleted
 * ( calling [ deleteOnElasticSearchWhatDoesNotExistAnymore ] )
 * and start the queue ( calling [ queueStep ] )
 * @returns {Promise} Solved promise if successful.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const synchronizeAll = (TYPE) => {
  const fullTimer = (new Date()).getTime();
  const adpModel = new adp.models.Adp();
  return new Promise((RES, REJ) => adpModel.indexAssetsGetOnlyIDs()
    .then((IDS) => {
      if (IDS && IDS.docs) {
        deleteOnElasticSearchWhatDoesNotExistAnymore(IDS)
          .then(() => {
            queueStep(0, IDS.docs, TYPE)
              .then(() => {
                const message = `■ ElasticSearch [ all microservices ] successful synchronized in ${(new Date()).getTime() - fullTimer}ms`;
                adp.echoLog(message, null, 200, packName);
              })
              .catch((ERROR) => {
                const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on running [ queueStep ]';
                const errorObject = {
                  error: ERROR,
                };
                REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeAll', packName));
              });
            RES();
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on running [ deleteOnElasticSearchWhatDoesNotExistAnymore ]';
            const errorObject = {
              error: ERROR,
            };
            REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeAll', packName));
          });
      } else {
        const errorCode = 500;
        const errorMessage = 'Error on running [ indexAssetsGetOnlyIDs @ adp.models.Adp ]';
        const errorObject = {
          error: 'The answer from [ indexAssetsGetOnlyIDs @ adp.models.Adp ] is not as expected.',
          unexpectedResult: IDS,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeAll', packName));
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on running [ indexAssetsGetOnlyIDs @ adp.models.Adp ]';
      const errorObject = {
        error: ERROR,
      };
      REJ(errorLog(errorCode, errorMessage, errorObject, 'synchronizeAll', packName));
    }));
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * The main function of this file, checks if the ID is given
 * to run the synchronization with just one Microservice or
 * in case of null ID, a queue of all Microservices will be
 * triggered to synchronize and deleted items from MongoDB
 * will be delete from Elastic Search.
 * @returns {Promise} Solved promise if successful.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
module.exports = (ID = null, IDTOREMOVE = null, TYPE = 'microservice') => new Promise((RES, REJ) => {
  syncControlIDs = [];
  if (IDTOREMOVE) {
    deleteOnElasticSearch(IDTOREMOVE)
      .then(RESULT => RES(RESULT))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Error running deleteOnElasticSearch';
        const errorObject = {
          error: ERROR,
          id: IDTOREMOVE,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      });
    return;
  }
  if (ID) {
    synchronizeThis(ID, TYPE)
      .then(RESULT => RES(RESULT))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Error running synchronizeThis';
        const errorObject = {
          error: ERROR,
          id: ID,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      });
  } else {
    synchronizeAll(TYPE)
      .then(RESULT => RES(RESULT))
      .catch((ERROR) => {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error running synchronizeAll';
        const errorObject = {
          error: ERROR,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      });
  }
});
// ============================================================================================= //
