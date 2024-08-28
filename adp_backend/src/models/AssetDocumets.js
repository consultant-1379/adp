/**
* [ adp.models.AssetDocuments ]
* Asset Documents Database Model
* @author Armando Dias [ zdiaarm ]
*/

const errorLog = require('./../library/errorLog');

class AssetDocuments {
  constructor() {
    this.packName = 'adp.models.AssetDocuments';
    this.dbMongoCollection = 'assetDocuments';
  }


  /**
   * [ getMenuVersions ]
   * Retrieve all the document version labels with no content.
   * Usefull to get the list of versions of specific asset.
   * @param {string} ASSETID The Asset Id.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @returns {Array} Returns an Array of Versions as String
   * or an empty string if empty ( which is not an error ).
   * @author Armando Dias [ zdiaarm ]
   */
  getMenuVersions(ASSETID, MENUTYPE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $eq: `${MENUTYPE}` },
      };
      const mongoOptions = { limit: 999999, skip: 0, sort: { order: 1 } };
      const mongoProjection = { _id: 0, version: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          const isValid = RESULT && RESULT.docs && Array.isArray(RESULT.docs);
          if (isValid) {
            const resultArray = RESULT.docs.map(VERSION => VERSION.version);
            if (Array.isArray(resultArray) && resultArray.length > 0) {
              RESOLVE(resultArray);
            } else {
              RESOLVE([]);
            }
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ getMenuVersions ]';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getMenuVersions', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * [ getSpecificDocument ]
   * Get a specific document from database.
   * @param {string} ASSETID The Asset Id.
   * @param {string} DOCUMENTID The Document Number.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} VERSION The documentation version.
   * @returns {...} with the result of the query.
   * @author Armando Dias [ zdiaarm ]
   */
  getSpecificDocument(ASSETID, DOCUMENTID, REVISION, LANGUAGE, MENUTYPE, VERSION) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        $and: [
          { asset_id: { $eq: `${ASSETID}` } },
          { type: { $eq: `${MENUTYPE}` } },
          { version: { $eq: `${VERSION}` } },
          {
            $or: [
              {
                'docs.release-documents': {
                  $elemMatch: {
                    mimer_document_number: `${DOCUMENTID}`,
                    language: `${LANGUAGE}`,
                    revision: `${REVISION}`,
                  },
                },
              },
            ],
          },
        ],
      };
      const mongoOptions = { limit: 999999, skip: 0, sort: { order: 1 } };
      const mongoProjection = { version: 1, 'docs.release-documents.$': 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          const isValid = RESULT
            && RESULT.docs
            && Array.isArray(RESULT.docs)
            && RESULT.docs.length > 0
            && RESULT.docs[0]
            && RESULT.docs[0].docs;
          if (isValid) {
            if (RESULT.docs.length > 0) {
              const firstLevel = RESULT.docs[0].docs;
              const category = Object.keys(firstLevel)[0];
              if (Array.isArray(firstLevel[category]) && firstLevel[category].length > 0) {
                RESOLVE(firstLevel[category][0]);
                return;
              }
              RESOLVE(RESULT);
              return;
            }
            RESOLVE(null);
          }
          if (RESULT && RESULT.docs && Array.isArray(RESULT.docs) && RESULT.docs.length === 0) {
            const errorCode = 404;
            const errorMessage = 'Expected version does not return any value from database';
            const errorObject = {
              asset_id: ASSETID,
              type: MENUTYPE,
              version: VERSION,
              object: RESULT,
            };
            const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getSpecificDocument', this.packName);
            REJECT(errorLogObject);
            return;
          }
          const errorCode = 500;
          const errorMessage = 'Got an unexpected object from database';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            version: VERSION,
            object: RESULT,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getSpecificDocument', this.packName);
          REJECT(errorLogObject);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ getSpecificDocument ]';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            version: VERSION,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getSpecificDocument', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * [ getSpecificVersion ]
   * Get a specific document from database.
   * @param {string} ASSETID The Asset Id.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} VERSION The documentation version
   * or an Array of documentation versions.
   * @returns {...} with the result of the query.
   * @author Armando Dias [ zdiaarm ]
   */
  getSpecificVersion(ASSETID, MENUTYPE, VERSION) {
    return new Promise((RESOLVE, REJECT) => {
      let mongoQuery;
      if (Array.isArray(VERSION)) {
        mongoQuery = {
          $and: [
            { asset_id: { $eq: `${ASSETID}` } },
            { type: { $eq: `${MENUTYPE}` } },
            { version: { $in: VERSION } },
          ],
        };
      } else {
        mongoQuery = {
          $and: [
            { asset_id: { $eq: `${ASSETID}` } },
            { type: { $eq: `${MENUTYPE}` } },
            { version: { $eq: `${VERSION}` } },
          ],
        };
      }
      const mongoOptions = { limit: 999999, skip: 0, sort: { order: 1 } };
      const mongoProjection = {};
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          const isValid = RESULT && RESULT.docs && Array.isArray(RESULT.docs);
          if (isValid) {
            if (RESULT.docs.length > 0) {
              RESOLVE(RESULT);
              return;
            }
            RESOLVE(null);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ getSpecificVersion ]';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            version: VERSION,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getSpecificVersion', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * [ checkIfExists ]
   * Check if the combination ASSETID x MENUTYPE x VERSION already exists.
   * @param {string} ASSETID The Asset Id.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} VERSION The documentation version.
   * @returns {...} with the result of the query.
   * @author Armando Dias [ zdiaarm ]
   */
  checkIfExists(ASSETID, MENUTYPE, VERSION) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $eq: `${MENUTYPE}` },
        version: { $eq: `${VERSION}` },
      };
      const mongoOptions = { limit: 999999, skip: 0, sort: { order: 1 } };
      const mongoProjection = { version: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          const isValid = RESULT && RESULT.docs && Array.isArray(RESULT.docs);
          if (isValid) {
            if (RESULT.docs.length > 0) {
              RESOLVE(true);
              return;
            }
            RESOLVE(false);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ checkIfExists ]';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            version: VERSION,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'checkIfExists', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * [ saveThisSpecificDocument ]
   * Save a specific document, inside of an Array into database.
   * @param {string} ASSETID The Asset Id.
   * @param {string} DOCUMENTID The Document Number.
   * @param {string} REVISION The Document Revision.
   * @param {string} LANGUAGE The Document Language.
   * @param {string} VERSION The Document Version.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} DOCUMENTOBJECT The documentation object.
   * @returns {...} with the result of the query.
   * @author Armando Dias [ zdiaarm ]
   */
  saveThisSpecificDocument(
    ASSETID,
    DOCUMENTID,
    REVISION,
    LANGUAGE,
    VERSION,
    MENUTYPE,
    DOCUMENTOBJECT,
  ) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const theVersionIfExists = await this.getSpecificVersion(ASSETID, MENUTYPE, VERSION);
        const versionObject = theVersionIfExists
          && Array.isArray(theVersionIfExists.docs)
          && theVersionIfExists.docs.length > 0
          ? theVersionIfExists.docs[0]
          : null;
        if (versionObject && versionObject.docs) {
          let found = false;
          Object.keys(versionObject.docs).forEach((CAT) => {
            if (Array.isArray(versionObject.docs[CAT])) {
              for (let index = 0; index < versionObject.docs[CAT].length; index += 1) {
                const document = versionObject.docs[CAT][index];
                const checkDocNumber = `${document.mimer_document_number}` === `${DOCUMENTID}`;
                const checkDocRevision = `${document.revision}` === `${REVISION}`;
                const checkDocLanguage = `${document.language}` === `${LANGUAGE}`;
                if (!found && checkDocNumber && checkDocRevision && checkDocLanguage) {
                  found = true;
                  versionObject.docs[CAT][index] = DOCUMENTOBJECT;
                  break;
                }
              }
            }
          });
          if (!found) {
            versionObject.docs[DOCUMENTOBJECT.category_slug].push(DOCUMENTOBJECT);
          }
          RESOLVE(adp.db.update(this.dbMongoCollection, versionObject));
          return;
        }
        const assetSlug = DOCUMENTOBJECT
          && DOCUMENTOBJECT.doc_route
          && DOCUMENTOBJECT.doc_route[1]
          ? DOCUMENTOBJECT.doc_route[1]
          : undefined;
        const docObject = {
          versionLabel: `${VERSION}`,
          'release-documents': [DOCUMENTOBJECT],
        };
        const object = {
          asset_id: ASSETID,
          asset_slug: assetSlug,
          type: MENUTYPE,
          version: VERSION,
          docs: docObject,
        };
        RESOLVE(adp.db.create(this.dbMongoCollection, object));
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ saveThisSpecificDocument ]';
        const errorObject = {
          asset_id: ASSETID,
          type: MENUTYPE,
          version: VERSION,
          error: ERROR,
          doc: DOCUMENTOBJECT,
        };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'saveThisSpecificDocument', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * [ createOrUpdate ]
   * Create or Update the menu based on the
   * combination ASSETID x MENUTYPE x VERSION.
   * @param {string} ASSETID The Asset Id.
   * @param {string} ASSETSLUG The Asset Slug.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} VERSION The documentation version.
   * @param {object} DOCS The documentation object.
   * @returns {promise} with the result of the request.
   * @author Armando Dias [ zdiaarm ]
   */
  createOrUpdate(ASSETID, ASSETSLUG, MENUTYPE, VERSION, DOCS) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const object = {
          asset_id: ASSETID,
          asset_slug: ASSETSLUG,
          type: MENUTYPE,
          version: VERSION,
          docs: DOCS,
        };
        const checkIfThisExists = await this.checkIfExists(ASSETID, MENUTYPE, VERSION);
        if (checkIfThisExists) {
          const filter = {
            asset_id: { $eq: `${ASSETID}` },
            type: { $eq: `${MENUTYPE}` },
            version: { $eq: `${VERSION}` },
          };
          RESOLVE(adp.db.updateMany(this.dbMongoCollection, filter, { $set: object }));
          return;
        }
        RESOLVE(adp.db.create(this.dbMongoCollection, object));
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ createOrUpdate ]';
        const errorObject = {
          asset_id: ASSETID,
          type: MENUTYPE,
          version: VERSION,
          error: ERROR,
          docs: DOCS,
        };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'createOrUpdate', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * [ hardDeleteInvalidVersionsFromDatabase ]
   * Hard delete versions from database, except
   * what is mentioned in VERSIONSTOKEEP parameter.
   * Also, to respect the logic, this only deletes
   * versions if TYPE is "raw" or "mimer".
   * @param {string} ASSETID The Asset Id.
   * @param {Array} VERSIONSTOKEEP The valid versions to not delete.
   * @returns {promise} with the result of the request.
   * @author Armando Dias [ zdiaarm ]
   */
  hardDeleteInvalidVersionsFromDatabase(ASSETID, VERSIONSTOKEEP) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoFilter = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $in: ['raw', 'mimer'] },
        version: { $nin: VERSIONSTOKEEP },
      };
      adp.db.destroyMany(this.dbMongoCollection, mongoFilter)
        .then(RESULT => RESOLVE(RESULT.result))
        .catch(ERROR => REJECT(ERROR));
    });
  }

  /**
   * [ hardDeleteThoseVersionsFromDatabase ]
   * Hard delete versions from database, except
   * what is mentioned in VERSIONSTOKEEP parameter.
   * Also, to respect the logic, this only deletes
   * versions if TYPE is "raw" or "mimer".
   * @param {string} ASSETID The Asset Id.
   * @param {string} TYPE The Menu Type.
   * @param {Array} VERSIONSTODELETE The invalid versions to delete.
   * @returns {promise} with the result of the request.
   * @author Armando Dias [ zdiaarm ]
   */
  hardDeleteThoseVersionsFromDatabase(ASSETID, TYPE, VERSIONSTODELETE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoFilter = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $eq: `${TYPE}` },
        version: { $in: VERSIONSTODELETE },
      };
      adp.db.destroyMany(this.dbMongoCollection, mongoFilter)
        .then(RESULT => RESOLVE(RESULT.result))
        .catch(ERROR => REJECT(ERROR));
    });
  }

  /**
   * [ hardDeleteFromDatabaseByType ]
   * Hard delete all versions from database by type.
   * @param {string} ASSETID The Asset Id.
   * @param {Array} TYPEARRAY The Menu Type.
   * @returns {promise} with the result of the request.
   * @author Armando Dias [ zdiaarm ]
   */
  hardDeleteFromDatabaseByType(ASSETID, TYPEARRAY) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoFilter = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $in: TYPEARRAY },
      };
      adp.db.destroyMany(this.dbMongoCollection, mongoFilter)
        .then(RESULT => RESOLVE(RESULT.result))
        .catch(ERROR => REJECT(ERROR));
    });
  }

  /**
   * [ hardDeleteFromDatabaseByType ]
   * Hard delete for latest version and mimer_development from database by type.
   * @param {string} ASSETID The Asset Id.
   * @param {string} version ms version.
   * @returns {promise} with the result of the request.
   * @author Vinod [ zvinrac ]
   */
  hardDeleteFromDatabaseByVersion(ASSETID, VERSION) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoFilter = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $in: ['raw', 'mimer'] },
        version: { $eq: `${VERSION}` },
      };
      adp.db.destroyMany(this.dbMongoCollection, mongoFilter)
        .then(RESULT => RESOLVE(RESULT.result))
        .catch(ERROR => REJECT(ERROR));
    });
  }

  /**
   * [ getFullMenuByType ]
   * Retrieve all versions of the document menu
   * based on Asset ID and the Menu Type.
   * @param {string} ASSETID The Asset Id.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @param {string} VERSION Asset version.
   * @returns {Object} Returns the document object.
   * @author Armando Dias [ zdiaarm ]
   */
  getFullMenuByType(ASSETID, MENUTYPE, VERSION) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        asset_id: { $eq: `${ASSETID}` },
        type: { $eq: `${MENUTYPE}` },
        version: { $eq: `${VERSION}` },
      };
      if (VERSION === null || VERSION === undefined) {
        delete mongoQuery.version;
      }
      const mongoOptions = { limit: 999999, skip: 0, sort: { order: 1 } };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((RESULT) => {
          const isValid = RESULT && RESULT.docs && Array.isArray(RESULT.docs);
          if (isValid) {
            RESOLVE(RESULT.docs.sort(adp.versionSort('-version')));
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ getFullMenuByType ]';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getFullMenuByType', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * [ getSpecificDocumentBySlug ]
   * Get a specific document from database, using the document slug.
   * @param {string} ASSETID The Asset Id.
   * @param {string} DOCSLUG The Document Slug.
   * @param {string} DOCCAT The Document Category.
   * @param {string} VERSION The documentation version.
   * @param {string} MENUTYPE Expected to be "raw", "mimer" or "merged".
   * @returns {object} with the document object.
   * @author Armando Dias [ zdiaarm ]
   */
  getSpecificDocumentBySlug(ASSETID, DOCSLUG, DOCCAT, VERSION, MENUTYPE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        $and: [
          { asset_id: { $eq: `${ASSETID}` } },
          { type: { $eq: `${MENUTYPE}` } },
          { version: { $eq: `${VERSION}` } },
        ],
      };
      const mongoOptions = { limit: 1, skip: 0 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((RESULT) => {
          let objShortcut = RESULT
              && RESULT.docs
              && Array.isArray(RESULT.docs)
              && RESULT.docs.length === 1
              && RESULT.docs[0]
              && RESULT.docs[0].docs
            ? RESULT.docs[0].docs
            : null;
          if (objShortcut && objShortcut.docs) {
            objShortcut = objShortcut.docs;
          }
          if (!objShortcut) {
            RESOLVE(null);
            return;
          }
          let document;
          Object.keys(objShortcut).forEach((KEY) => {
            if (KEY === DOCCAT) {
              if (objShortcut[KEY] && Array.isArray(objShortcut[KEY])) {
                objShortcut[KEY].forEach((ITEM) => {
                  if (ITEM.slug === DOCSLUG) {
                    document = ITEM;
                  }
                });
              }
            }
          });
          RESOLVE(document);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 400;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Bad Request';
          const errorObject = {
            asset_id: ASSETID,
            type: MENUTYPE,
            version: VERSION,
            doc_category: DOCCAT,
            doc_slug: DOCSLUG,
            error: ERROR,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'getSpecificDocumentBySlug', this.packName);
          REJECT(errorLogObject);
        });
    });
  }
}

module.exports = AssetDocuments;
