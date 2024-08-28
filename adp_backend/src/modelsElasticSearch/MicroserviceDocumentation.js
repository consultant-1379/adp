/**
* [ adp.modelsElasticSearch.MicroserviceDocumentation ]
* Microservice Documentation Elastic Search Database Model
*
* @author Michael Coughlan [zmiccou]
*/
// ============================================================================================= //
const errorLog = require('../library/errorLog');
// ============================================================================================= //
const pviConstant = require('./../library/utils/constants').PVI;
// ============================================================================================= //

class MicroserviceDocumentation {
  constructor() {
    this.packName = 'adp.modelsElasticSearch.MicroserviceDocumentation';
    this.elasticSearch = adp.elasticSearch;
    this.index = adp.config.elasticSearchMsDocumentationIndex;
  }


  /**
   * Verifies the index exists, if it doesn't it will create it
   * @returns {Object} With { code, message } if successful or
   * { code, error } if fails. If the code crashes,
   * an errorLog object will be returned.
   * @author Cein, Armando Dias [ zdiaarm ]
   */
  async verifyIndex() {
    const indexObj = { index: this.index };
    const type = 'microserviceDocument';
    // === MAPPING ============================================================================= //
    const body = {
      properties: {
        post_id: { type: 'keyword', similarity: 'boolean', ignore_above: 512 },
        post_name: {
          type: 'text',
          fields: {
            post_name: {
              type: 'text',
            },
            raw: {
              type: 'keyword',
              ignore_above: 10922,
            },
          },
        },
        post_type: { type: 'text' },
      },
    };
    // === MAPPING ============================================================================= //
    try {
      const exists = await this.elasticSearch.indices.exists(indexObj);
      if (exists && exists.statusCode === 404) {
        const afterCreated = await this.elasticSearch.indices.create(indexObj);
        if (afterCreated && afterCreated.statusCode !== 200) {
          return { code: afterCreated.statusCode, error: 'Error when creating an Index on ElasticSearch' };
        }
        const afterMapped = await this.elasticSearch.indices.putMapping({
          index: this.index,
          type,
          body,
          include_type_name: true,
        });
        if (afterMapped && afterMapped.statusCode !== 200) {
          return { code: afterMapped.statusCode, error: 'Error when updating Index Mapping on ElasticSearch' };
        }
        return { code: 201, message: `Index [ ${this.index} ] created and mapped` };
      }
      if (exists && exists.statusCode === 200) {
        return { code: 200, message: `Index [ ${this.index} ] already exists` };
      }
      return Promise.reject(errorLog(
        exists && exists.statusCode ? exists.statusCode : 500,
        'Failure to check if index exists',
        { error: exists, indexObj },
        'verifyIndex',
        this.packName,
      ));
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * getThisSpecificMSDocument()
   * Retrieves a specific Microservice Document.
   * @returns {Object/Null} Returns the document
   * object if found or null if not found or if
   * get an error.
   * @author Armando Dias [zdiaarm]
   */
  getThisSpecificMSDocument(SYNCOBJECT) {
    const syncObject = SYNCOBJECT;
    const elasticSearchQueryObject = {
      index: this.index,
      body: {
        query: {
          bool: { filter: [{ term: { post_id: syncObject.post_id } }] },
        },
        from: 0,
        size: 1,
      },
    };
    return new Promise((RESOLVE) => {
      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          adp.echoLog('Error on getThisSpecificMSDocument', { error: ERROR }, 500, 'adp.errorLog', false);
          const errorCode = ERROR
            && ERROR.meta
            && ERROR.meta.statusCode
            ? ERROR.meta.statusCode
            : 500;
          const errorMessage = ERROR
            && ERROR.body
            && ERROR.body.error
            && ERROR.body.error.type
            ? `${ERROR.body.error.type} :: ${ERROR.body.error.reason}`
            : '';
          RESOLVE({ code: errorCode, error: errorMessage });
        }
        const result = RESULT
          && RESULT.body
          && RESULT.body.hits
          && Array.isArray(RESULT.body.hits.hits)
          && RESULT.body.hits.hits.length === 1
          ? {
            code: 200,
            docESID: RESULT.body.hits.hits[0]._id,
            doc: RESULT.body.hits.hits[0]._source,
          }
          : { code: 404, error: `Document not found! [ ${syncObject.post_id} ]` };
        RESOLVE(result);
      });
    });
  }


  /**
   * createThisSpecificMSDocument()
   * Creates one document in ElastiSearch.
   * @param {Object} SYNCOBJECT Document Object
   * to be created on Elastic Search.
   * @returns {Object} Returns the answer
   * of Elastic Search after creation.
   * @author Armando Dias [zdiaarm]
   */
  async createThisSpecificMSDocument(SYNCOBJECT) {
    const syncObject = SYNCOBJECT;
    const document = await this.elasticSearch.index({
      index: this.index,
      body: syncObject,
    });
    if (document && document.statusCode === 201) {
      return { code: 201, docESID: document.body._id, message: 'Successful created!' };
    }
    return document;
  }


  /**
   * updateThisSpecificMSDocument()
   * Updates one document in ElastiSearch.
   * @param {String} ELASTICID ESearch ID of the Document
   * @param {Object} SYNCOBJECT Document Object
   * to be updated on Elastic Search.
   * @returns {Object} Returns the answer
   * of Elastic Search after creation.
   * @author Armando Dias [zdiaarm]
   */
  async updateThisSpecificMSDocument(ELASTICID, SYNCOBJECT) {
    const syncObject = SYNCOBJECT;
    const document = await this.elasticSearch.update({
      index: this.index,
      id: ELASTICID,
      body: { doc: syncObject },
    });
    return document;
  }


  /**
   * Get all the documents from the ElasticSearch
   * @param {Array} [AUTHARRAY = []] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   * @param {Integer} [SKIP = 0] How many register the result should skip.
   *                       Default is zero.
   * @param {Integer} [SIZE = 20] How many registers should return per request.
   *                       Default is 20.
   * @author Tirth Pipalia [zpiptir]
   */

  findAllDocuments(
    AUTHARRAY = [],
    SKIP = 0,
    SIZE = 20,
  ) {
    return new Promise((resolve, reject) => {
      const elasticSearchQueryObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              filter: {
                ids: {
                  values: AUTHARRAY,
                },
              },
            },
          },
          from: SKIP,
          size: SIZE,
        },
      };

      // Super Admin user with/without specific tab type
      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.MicroserviceDocumentation';
          const errorObject = {
            error: ERROR,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
          };
          reject(errorLog(errorCode, errorMessage, errorObject, 'findAllDocuments', this.packName));
        } else {
          const result = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.hits
            ? RESULT.body.hits.hits
            : null;

          if (!result) {
            const errorMessage = 'Error got because got an invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              authArray: AUTHARRAY,
              skip: SKIP,
              size: SIZE,
            };
            reject(errorLog(500, errorMessage, errorObject, 'findAllDocuments', this.packName));
            return;
          }
          resolve({ result });
        }
      });
    });
  }

  /**
   * Get all the documents from the ElasticSearch
   * @param {Array} [ELASTICSEARCH_ID = []] List of _id for searching
   * @param {Array} [AUTHARRAY = []] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   * @param {Integer} [SKIP = 0] How many register the result should skip.
   *                       Default is zero.
   * @param {Integer} [SIZE = 20] How many registers should return per request.
   *                       Default is 20.
   * @author Tirth Pipalia [zpiptir]
   */

  findDocumentByIds(
    ELASTICSEARCH_ID = [],
    AUTHARRAY = [],
    SKIP = 0,
    SIZE = 20,
  ) {
    return new Promise((resolve, reject) => {
      const elasticSearchQueryObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              must: [
                {
                  terms: {
                    _id: ELASTICSEARCH_ID,
                  },
                },
              ],
              filter: {
                ids: {
                  values: AUTHARRAY,
                },
              },
            },
          },
          from: SKIP,
          size: SIZE,
        },
      };

      // Super Admin user with/without specific tab type
      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.MicroserviceDocumentation';
          const errorObject = {
            error: ERROR,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
          };
          reject(errorLog(errorCode, errorMessage, errorObject, 'findDocumentById', this.packName));
        } else {
          const result = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.hits
            ? RESULT.body.hits.hits
            : null;

          if (!result) {
            const errorMessage = 'Error got because got an invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              authArray: AUTHARRAY,
              skip: SKIP,
              size: SIZE,
            };
            reject(errorLog(500, errorMessage, errorObject, 'findDocumentById', this.packName));
            return;
          }
          resolve({ result });
        }
      });
    });
  }

  /**
   * Accept microservice ids and retrieve all of their documents
   *
   * @param {string} assetId the microservice id
   * @param {number} size the limit of the query's response
   * @param {number} skip the number of results we want to skip
   * @author Michael Coughlan [zmiccou]
   */
  findDocumentsByAssetId(assetId, searchAfter, size = 100) {
    return new Promise((resolve, reject) => {
      if (assetId.trim().length === 0) {
        return reject(errorLog(400, 'You must supply one ID', null, 'findDocumentsByAssetId', this.packName, false));
      }
      if (size > 10000) {
        return reject(errorLog(400, 'The size of the page cannot be bigger than 10000', null, 'findDocumentsByAssetId', this.packName, false));
      }
      const esObject = {
        index: this.index,
        body: {
          query: {
            wildcard: {
              post_id: {
                value: `${assetId}*`,
                boost: 1.0,
                rewrite: 'constant_score',
              },
            },
          },
          sort: [
            {
              sync_date: 'asc',
            },
          ],
          size,
        },
      };

      if (searchAfter !== undefined && Array.isArray(searchAfter) && searchAfter.length > 0) {
        esObject.body.search_after = searchAfter;
      }

      return this.elasticSearch.search(esObject, (error, result) => {
        if (error) {
          const errorCode = error && error.meta && error.meta.statusCode
            ? error.meta.statusCode
            : 500;

          const errorMessage = error && error.message
            ? error.message
            : 'Error on this.elasticSearch.search';

          return reject(
            errorLog(
              errorCode,
              errorMessage,
              {
                error,
                index: this.index,
                assetId,
              },
              'findDocumentsByAssetId',
              this.packName,
              errorCode === 500,
            ),
          );
        }
        // Check the structure of the response is correct before returning it
        return resolve((result && result.body && result.body.hits && result.body.hits.hits) || []);
      });
    });
  }

  /**
   * Accept a document object and save it in ElasticSearch
   *
   * @param {array} documentsPayload the document to be saved
   * @author Michael Coughlan [zmiccou]
   */
  createDocuments(documentsPayload) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(documentsPayload)) {
        return reject(errorLog(400, 'You must provide an array of IDs', null, 'createDocuments', this.packName, false));
      }

      if (documentsPayload.length === 0) {
        return reject(errorLog(400, 'You must supply at least one ID', null, 'createDocuments', this.packName, false));
      }

      const requestBody = documentsPayload.flatMap(document => [{
        index: { _index: this.index },
      }, document]);

      return this.elasticSearch.bulk({ refresh: true, body: requestBody })
        .then((bulkResponse) => {
          if (bulkResponse.errors) {
            const erroredDocuments = [];

            bulkResponse.items.forEach((action, i) => {
              const operation = Object.keys(action)[0];

              if (action[operation].error) {
                erroredDocuments.push({
                  status: action[operation].status,
                  error: action[operation].error,
                  operation: requestBody[i * 2],
                  document: requestBody[i * 2 + 1],
                });
              }
            });

            return reject(erroredDocuments);
          }

          return resolve(bulkResponse);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error got on trying to createDocuments in Elasticsearch';
          const errorObject = {
            error: ERROR,
          };
          reject(errorLog(errorCode, errorMessage, errorObject, 'createDocuments', this.packName));
        });
    });
  }

  /**
   * Accept a document object and update it in ElasticSearch
   * @param {array} documentPayload Array of object for bulk API
   * @author Tirth Pipalia [zpiptir]
   */

  updateDocument(documentPayload) {
    return new Promise((resolve, reject) => {
      this.elasticSearch.bulk({ refresh: true, body: documentPayload })
        .then((bulkResponse) => {
          if (bulkResponse.errors) {
            return reject(bulkResponse);
          }
          return resolve(bulkResponse);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error got on trying to updateDocument in Elasticsearch';
          const errorObject = {
            error: ERROR,
          };
          reject(errorLog(errorCode, errorMessage, errorObject, 'updateDocument', this.packName));
        });
    });
  }


  /**
   * Accept an array of IDs and delete them from the Elasticsearch database
   *
   * @param {array} ids an array of IDs
   * @author Michael Coughlan [zmiccou]
   */
  removeDocuments(ids) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(ids)) {
        return reject(errorLog(400, 'You must provide an array of IDs', null, 'removeDocuments', this.packName, false));
      }

      if (ids.length === 0) {
        return reject(errorLog(400, 'You must supply at least one ID', null, 'removeDocuments', this.packName, false));
      }

      const esObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              filter: {
                ids: {
                  values: ids,
                },
              },
            },
          },
        },
      };

      return this.elasticSearch.deleteByQuery(esObject, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }

  /**
   * Accept an ID and delete pvi documents from the Elasticsearch database
   *
   * @param {array} ids an array of IDs
   * @author Anil Chaurasiya [zchiana]
   */
  removePviDocuments(assetId) {
    return new Promise((resolve, reject) => {
      if (assetId == null) {
        return reject(errorLog(400, 'You must supply assetId', null, 'removePviDocuments', this.packName, false));
      }
      const esObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    asset_id: `${assetId}*`,
                  },
                },
                {
                  match: {
                    title_slug: `${pviConstant.DOC_SLUG}`,
                  },
                },
              ],
            },
          },
        },
      };

      return this.elasticSearch.deleteByQuery(esObject, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
}
// ============================================================================================= //
module.exports = MicroserviceDocumentation;
// ============================================================================================= //
