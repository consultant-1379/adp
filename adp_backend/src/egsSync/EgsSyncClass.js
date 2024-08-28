// ============================================================================================= //
/**
* [ adp.egsSync.EgsSyncClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* eslint-disable prefer-template */
// ============================================================================================= //
const axios = require('axios');
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class EgsSyncClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor(QUEUEOBJECTIVE) {
    this.packName = 'adp.egsSync.EgsSyncClass';
    this.queueObjective = QUEUEOBJECTIVE;
    this.egsSyncActive = false;
    this.egsSyncActiveTypes = [];
    this.egsSyncServerAddress = '';
    this.egsSyncItemsPerRequest = 0;
    this.egsSyncMaxBytesSizePerRequest = 0;
    this.wpMenuInstanceCache = null;
    this._loadWordpressMenu();
  }

  /**
   * _loadWordpressMenu [ PRIVATE ]
   * Called by the constructor, creates
   * a copy of the Wodpress Menu to be
   * used during the instance of
   * this class.
   * @author Armando Dias [zdiaarm]
   */
  async _loadWordpressMenu() {
    const wpObject = await adp.wordpress.getMenus();
    this.wpMenuInstanceCache = wpObject.menus;
  }

  /**
   * _loadSetup [ PRIVATE ]
   * Load the setup variables necessary
   * for this class. The variables are cached
   * for this class but the [ adp.egsSync.egsSyncAction ]
   * always load these variables from database.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  _loadSetup() {
    return new Promise(async (RESOLVE, REJECT) => {
      const timer = (new Date()).getTime();
      try {
        const checkMemory = adp
        && adp.egsSync
        && adp.egsSync.setup
          ? adp.egsSync.setup
          : null;
        if (!checkMemory) await adp.egsSync.egsSyncAction();
        this.egsSyncActive = adp.egsSync.setup.egsSyncActive;
        this.egsSyncActiveTypes = adp.egsSync.setup.egsSyncActiveTypes;
        this.egsSyncServerAddress = adp.egsSync.setup.egsSyncServerAddress;
        this.egsSyncItemsPerRequest = adp.egsSync.setup.egsSyncItemsPerRequest;
        this.egsSyncMaxBytesSizePerRequest = adp.egsSync.setup.egsSyncMaxBytesSizePerRequest;
        RESOLVE();
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
        const errorObject = {
          duration: `${((new Date()).getTime()) - timer}ms`,
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'loadSetup', this.packName));
      }
    });
  }


  /**
   * _getGroupFromEgsControl [ PRIVATE ]
   * Retrieve "N" items from egsControl collection.
   * @param {Array} IDARRAY with a list of ids.
   * @param {Type} TYPE of the document to retrive
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  _getGroupFromEgsControl(IDARRAY, TYPE) {
    let idArray;
    if (TYPE === 'article' || TYPE === 'tutorial') {
      idArray = IDARRAY.map(ID => Number(ID));
    } else {
      idArray = IDARRAY;
    }
    const timer = (new Date()).getTime();
    return new Promise((RESOLVE, REJECT) => {
      const egsControlModel = new adp.models.EgsControl();
      egsControlModel.getByObjectIds(idArray)
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs)) {
            if (RESULT.docs.length === 0) {
              RESOLVE([]);
              return;
            }
            RESOLVE(RESULT.docs);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            duration: `${((new Date()).getTime()) - timer}ms`,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, '_getGroupFromEgsControl', this.packName));
        });
    });
  }


  /**
   * _getGroupFromElasticSearch [ PRIVATE ]
   * Retrieve "N" items from ElasticSearch index.
   * @param {String} TYPE Type of IDs (article/tutorial).
   * @param {Array} IDARRAY with a list of ids.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  _getGroupFromElasticSearch(TYPE, IDARRAY) {
    const timer = (new Date()).getTime();
    return new Promise((RESOLVE, REJECT) => {
      const esWpModel = new adp.modelsElasticSearch.Wordpress();
      esWpModel.getByIds(IDARRAY, 0, IDARRAY.length)
        .then((ITEMS) => {
          const clearArray = [];
          const notDetectIdsFromElastic = [];
          if (ITEMS && Array.isArray(ITEMS.result)) {
            ITEMS.result.forEach((ITEM) => {
              if (IDARRAY.includes(`${ITEM._id}`)) {
                const docDate = ITEM._source.post_modified
                  ? new Date(ITEM._source.post_modified).toISOString() : null;
                const short_summary_result = ITEM && ITEM._source
                && ITEM._source.post_content_filtered
                  ? adp.stripHtmlTags(ITEM._source.post_content_filtered) : '';
                const translatedObject = {
                  external_id: `adpportal-${TYPE}-${ITEM._source.post_id}`,
                  object_id: Number(ITEM._source.post_id),
                  title: ITEM._source.post_title,
                  slug: ITEM._source.post_name,
                  type: ITEM._source.post_type === 'tutorials' ? 'tutorial' : 'article',
                  short_summary: short_summary_result.length > 250 ? short_summary_result.substring(0, 250) + '...' : short_summary_result,
                  sizeinbytes: 0,
                  document_date: docDate,
                  last_sync_status: 0,
                  last_sync_date: 'NEVER',
                  last_sync_status_message: 'NONE',
                  url: this.getURLFromObjectID(`${ITEM._source.post_id}`),
                };
                translatedObject.sizeinbytes = adp.getSizeInMemory(translatedObject);
                if (translatedObject) {
                  clearArray.push(translatedObject);
                }
              } else {
                notDetectIdsFromElastic.push(ITEM._id);
                const msg = `Document id ${ITEM._id} not found inside of this group.`;
                const obj = {
                  action: 'Check if _id of Elastic Search Index is searchable as boolean type.',
                  ids: IDARRAY,
                };
                adp.echoLog(msg, obj, 200, this.packName);
              }
            });
            const fromGroupLength = IDARRAY.length;
            const fromResultLength = ITEMS.result.length;
            const fromDetectedLength = clearArray.length;
            if (fromDetectedLength === fromGroupLength) {
              const msg = `[ ${fromDetectedLength} ] of [ ${fromGroupLength} ] IDs were retrieved from ElasticSearch in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, null, 200, this.packName);
            } else if (fromDetectedLength < fromGroupLength) {
              const found = [];
              const notFound = [];
              IDARRAY.forEach((ID) => {
                const testFound = ITEMS.result.find(ITEM => `${ITEM._id}` === `${ID}`);
                if (testFound) {
                  found.push(ID);
                } else {
                  notFound.push(ID);
                }
              });
              const msg = `Detected only [ ${fromDetectedLength} ] documents, got [ ${fromResultLength} ] from ElasticSearch and was expecting [ ${fromGroupLength} ] ids in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, { type: TYPE, notFound }, 200, this.packName);
            } else if (fromResultLength > fromDetectedLength) {
              const found = [];
              const notFound = [];
              ITEMS.result.forEach((ID) => {
                const testFound = clearArray.find(ITEM => `${ITEM.object_id}` === `${ID}`);
                if (testFound) {
                  found.push(ID);
                } else {
                  notFound.push(ID);
                }
              });
              const msg = `Got [ ${fromResultLength} ] from ElasticSearch instead but detected only [ ${fromDetectedLength} ] in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, { type: TYPE, notFound }, 200, this.packName);
            }
          }
          RESOLVE(clearArray);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            duration: `${((new Date()).getTime()) - timer}ms`,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, '_getGroupFromElasticSearch', this.packName));
        });
    });
  }

  /**
    * _getGroupFromMongoDB [ PRIVATE ]
    * Retrieve "N" items from MongoDB.
    * @param {String} TYPE Type of IDs (asset).
    * @param {Array} IDARRAY with a list of ids.
    * @returns a resolved promise if successful,
    * rejected promise if fails.
    * @author Armando Dias [zdiaarm]
  */
  _getGroupFromMongoDB(TYPE, IDARRAY) {
    const timer = (new Date()).getTime();
    return new Promise((RESOLVE, REJECT) => {
      const adpModel = new adp.models.Adp();
      adpModel.getById(IDARRAY)
        .then((ITEMS) => {
          const clearArray = [];
          const notDetectIdsFromMongoDB = [];
          if (ITEMS && Array.isArray(ITEMS.docs)) {
            ITEMS.docs.forEach((ITEM) => {
              if (IDARRAY.includes(`${ITEM._id}`)) {
                const docDate = ITEM.date_modified
                  ? new Date(ITEM.date_modified).toISOString() : null;
                const translatedObject = {
                  external_id: `adpportal-${TYPE}-${ITEM._id}`,
                  object_id: ITEM._id,
                  title: ITEM.name,
                  slug: ITEM.slug,
                  tags: ['ADP', 'PORTAL', ITEM.type.toUpperCase()],
                  type: ITEM.type,
                  sizeinbytes: 0,
                  document_date: docDate,
                  last_sync_status: 0,
                  last_sync_date: 'NEVER',
                  last_sync_status_message: 'NONE',
                  url: `${adp.config.baseSiteAddress}/marketplace/${ITEM.slug}`,
                  content: ITEM.description,
                  product_number: ITEM.product_number,
                };
                translatedObject.sizeinbytes = adp.getSizeInMemory(translatedObject);
                if (translatedObject && translatedObject.content) {
                  clearArray.push(translatedObject);
                }
              } else {
                notDetectIdsFromMongoDB.push(ITEM._id);
                const msg = `Document id ${ITEM._id} not found inside of this group.`;
                const obj = {
                  action: 'Check if _id of Mongo DB - ADP collection is searchable as boolean type.',
                  ids: IDARRAY,
                };
                adp.echoLog(msg, obj, 200, this.packName);
              }
            });
            const fromGroupLength = IDARRAY.length;
            const fromResultLength = ITEMS.docs.length;
            const fromDetectedLength = clearArray.length;
            if (fromDetectedLength === fromGroupLength) {
              const msg = `[ ${fromDetectedLength} ] of [ ${fromGroupLength} ] IDs were retrieved from MongoDB in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, null, 200, this.packName);
            } else if (fromDetectedLength < fromGroupLength) {
              const found = [];
              const notFound = [];
              IDARRAY.forEach((ID) => {
                const testFound = ITEMS.docs.find(ITEM => `${ITEM._id}` === `${ID}`);
                if (testFound) {
                  found.push(ID);
                } else {
                  notFound.push(ID);
                }
              });
              const msg = `Detected only [ ${fromDetectedLength} ] documents, got [ ${fromResultLength} ] from Mongo DB and was expecting [ ${fromGroupLength} ] ids in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, { type: TYPE, notFound }, 200, this.packName);
            } else if (fromResultLength > fromDetectedLength) {
              const found = [];
              const notFound = [];
              ITEMS.result.forEach((ID) => {
                const testFound = clearArray.find(ITEM => `${ITEM.object_id}` === `${ID}`);
                if (testFound) {
                  found.push(ID);
                } else {
                  notFound.push(ID);
                }
              });
              const msg = `Got [ ${fromResultLength} ] from Mongo DB instead but detected only [ ${fromDetectedLength} ] in ${((new Date()).getTime()) - timer}ms`;
              adp.echoLog(msg, { type: TYPE, notFound }, 200, this.packName);
            }
          }
          RESOLVE(clearArray);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            duration: `${((new Date()).getTime()) - timer}ms`,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, '_getGroupFromMongoDB', this.packName));
        });
    });
  }

  /**
   * _addThisDocumentToThePayload [ PRIVATE ]
   * Retrieve "N" items from ElasticSearch index.
   * @param {Object} ESDOCUMENT The document to be
   * added to the payload in EGSPayload collection.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  _addThisDocumentToThePayload(ESDOCUMENT) {
    return new Promise(async (RESOLVE, REJECT) => {
      const docDate = ESDOCUMENT.document_date
        ? new Date(ESDOCUMENT.document_date).toISOString() : null;
      const esDocument = {
        external_id: ESDOCUMENT.external_id,
        object_id: ESDOCUMENT.object_id,
        title: ESDOCUMENT.title,
        tags: ['ADP', 'PORTAL', ESDOCUMENT.type.toUpperCase()],
        type: ESDOCUMENT.type,
        document_date: docDate,
        sizeinbytes: 0,
        url: ESDOCUMENT.url,
        text: ESDOCUMENT.content,
        product_number: ESDOCUMENT.product_number,
        short_summary: ESDOCUMENT.short_summary,
      };
      esDocument.sizeinbytes = adp.getSizeInMemory(esDocument);
      const docType = (esDocument.type === 'article' || esDocument.type === 'tutorial') ? 'wordpress' : 'asset';
      try {
        const egsPayloadModel = new adp.models.EgsPayload(this.queueObjective);
        let payload = await egsPayloadModel.getTheOpenPayload(docType);
        const higherThanTheSizeLimit = (esDocument.sizeinbytes + payload.sizeinbytes)
          >= this.egsSyncMaxBytesSizePerRequest;
        if (higherThanTheSizeLimit === true) {
          payload = await egsPayloadModel.closePayloadAndGetANewOne(payload._id, docType);
        }
        await egsPayloadModel.addToPayload(payload._id, esDocument);
        RESOLVE(true);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
        const errorObject = {
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, '_addThisDocumentToThePayload', this.packName));
      }
    });
  }


  /**
   * checkGroup [ Called by adp.egsSync.egsSyncCheckGroups ]
   * Check the content from the given IDs to
   * decide ( using _checkThis) if the item
   * should be updated or not.
   * @param {String} TYPE Type of IDs (article/tutorial).
   * @param {Array} IDARRAY with a list of ids.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  checkGroup(TYPE, IDARRAY) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        await this._loadSetup();
        const egsControlDocuments = await this._getGroupFromEgsControl(IDARRAY, TYPE);
        let retriveDocuments;
        if (TYPE === 'asset') {
          retriveDocuments = await this._getGroupFromMongoDB(TYPE, IDARRAY);
        } else {
          retriveDocuments = await this._getGroupFromElasticSearch(TYPE, IDARRAY);
        }
        let index = 0;
        const action = async () => {
          if (IDARRAY[index]) {
            const id = IDARRAY[index];
            const pickTheEgsControlDocument = egsControlDocuments.find(ITEM => `${ITEM.object_id}` === `${id}`);
            const pickTheDocument = retriveDocuments.find(ITEM => `${ITEM.object_id}` === `${id}`);
            await this._checkThis(
              TYPE,
              IDARRAY[index],
              pickTheEgsControlDocument,
              pickTheDocument,
            );
            if (IDARRAY[index + 1]) {
              index += 1;
              return action();
            }
          }
          RESOLVE(true);
          return true;
        };
        action();
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
        const errorObject = {
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'checkGroup', this.packName));
      }
    });
  }


  /**
   * _checkThis [ PRIVATE ]
   * Compares ( One item per internal request )
   * if the item need to be updated. If yes, calls
   * _addThisDocumentToThePayload.
   * @param {String} TYPE Type of the ID.
   * @param {String} ID The ID of the item.
   * @param {Object} EGSCONTROL Item from egsControl collection.
   * @param {Object} ESDOCUMENT Item from ElasticSearch index.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  _checkThis(TYPE, ID, EGSCONTROL, ESDOCUMENT) {
    if (!ESDOCUMENT) return new Promise(RES => RES());
    return new Promise(async (RESOLVE, REJECT) => {
      const egsControlModel = new adp.models.EgsControl();
      try {
        if (EGSCONTROL) {
          const egsControl = EGSCONTROL;
          const esDocument = ESDOCUMENT;
          esDocument._id = egsControl._id;
          const checkControlStatus = egsControl.last_sync_status !== 200;
          const checkControlDateIsNever = egsControl.last_sync_date === 'NEVER';
          const checkDocumentDate = esDocument.document_date !== egsControl.document_date;
          if (checkControlStatus
            || checkControlDateIsNever
            || checkDocumentDate
          ) {
            await this._addThisDocumentToThePayload(esDocument);
            await egsControlModel.insertOrUpdateEgsControlDocument(esDocument);
          }
          RESOLVE(true);
        } else {
          const esDocument = ESDOCUMENT;
          await egsControlModel.insertOrUpdateEgsControlDocument(esDocument);
          await this._addThisDocumentToThePayload(esDocument);
          RESOLVE(true);
        }
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
        const errorObject = {
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkThis', this.packName));
      }
    });
  }


  /**
   * closePayloadsToSend
   * Used by [ adp.egsSync.egsSyncSendPayload ], this is
   * necessary to close the last open payload.
   * @returns The promise of the request.
   * @author Armando Dias [zdiaarm]
   */
  closePayloadsToSend() {
    const egsPayloadModel = new adp.models.EgsPayload(this.queueObjective);
    return egsPayloadModel.closePayloadsToSend();
  }


  /**
   * _getExternalToken [ PRIVATE ]
   * Retrieve the token from external server.
   * @returns a string with the access token if successful.
   * @author Armando Dias [zdiaarm]
   */
  _getExternalToken() {
    const {
      clientId,
      clientSecret,
      scope,
      grant,
      accessTokenURL,
    } = adp.config.egs;
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('grant_type', grant);
        params.append('scope', scope);
        const res = await axios.post(accessTokenURL, params);
        RESOLVE(res.data.access_token);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
        const errorObject = {
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'getToken', this.packName));
      }
    });
  }


  /**
   * sendPayload
   * Send the payload to the external server.
   * @param {String} PAYLOADID The ID of the payload.
   * @returns a resolved promise if successful,
   * rejected promise if fails.
   * @author Armando Dias [zdiaarm]
   */
  sendPayload(PAYLOADID) {
    const timer = (new Date()).getTime();
    return new Promise(async (RESOLVE, REJECT) => {
      let theArrayIds = null;
      let data = null;
      let size;
      const egsControlModel = new adp.models.EgsControl();
      const egsPayloadModel = new adp.models.EgsPayload(this.queueObjective);
      try {
        await this._loadSetup();
        const url = this.egsSyncServerAddress;
        const authToken = await this._getExternalToken();
        const config = { headers: { Authorization: `Bearer ${authToken}` }, timeout: 60000 };
        const fullPayload = await egsPayloadModel.getPayload(PAYLOADID);
        theArrayIds = fullPayload.array_ids;
        data = fullPayload.payload;
        size = adp.getSizeInMemory(data, true);

        await axios.post(url, data, config);

        await egsControlModel.setEgsControlAsSync(theArrayIds, 200, 'Successful synchronized!');
        await egsPayloadModel.setEgsPayloadAsSync(PAYLOADID, 200, 'Successful synchronized!');
        const msg = `${data.length} items ( ${size} ) were synchronized with external server in ${((new Date()).getTime()) - timer}ms`;
        adp.echoLog(msg, null, 200, this.packName);
        RESOLVE({ code: 200, message: 'Successful synchronized!' });
      } catch (ERROR) {
        let errorCode;
        if (ERROR && ERROR.response && ERROR.response.data && ERROR.response.data.code) {
          errorCode = Number(ERROR.response.data.code);
        } else if (ERROR && ERROR.response && ERROR.response.status) {
          errorCode = Number(ERROR.response.status);
        } else {
          errorCode = 500;
        }
        let errorMessage;
        if (ERROR && ERROR.response && ERROR.response.data && ERROR.response.data.message) {
          errorMessage = ERROR.response.data.message;
        } else if (ERROR && ERROR.message) {
          errorMessage = ERROR.message;
        } else {
          errorMessage = 'Internal Server Error';
        }
        let messageID;
        if (ERROR && ERROR.response && ERROR.response.data && ERROR.response.data.messageId) {
          messageID = ERROR.response.data.messageId;
        }
        if (Array.isArray(theArrayIds)) {
          await egsControlModel.setEgsControlAsSync(theArrayIds, errorCode, errorMessage);
        }
        if (PAYLOADID) {
          await egsPayloadModel.setEgsPayloadAsSync(PAYLOADID, errorCode, errorMessage);
        }
        const errorObject = {
          code: errorCode,
          message: errorMessage,
          messageId: messageID,
          payloadSize: size,
          error: ERROR,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'sendPayload', this.packName));
      }
    });
  }


  /**
   * getURLFromObjectID
   * Look for the menu item using object_id
   * and retrieve the portal_url.
   * @param {String} OBJECTID The ID of object_id.
   * @returns String with the URL of the document.
   * @author Armando Dias [zdiaarm]
   */
  getURLFromObjectID(OBJECTID) {
    if (!this.wpMenuInstanceCache) {
      return '';
    }
    let found = null;
    this.wpMenuInstanceCache.forEach((menu) => {
      if (!found) {
        found = menu.items.find(ITEM => `${ITEM.object_id}` === `${OBJECTID}`);
      }
    });
    if (found && found.portal_url) {
      return `${adp.config.baseSiteAddress}${found.portal_url}`;
    }
    return '';
  }
}
// ============================================================================================= //
module.exports = EgsSyncClass;
// ============================================================================================= //
