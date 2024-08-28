/**
* [ adp.modelsElasticSearch.Microservices ]
* Microservices Elastic Search Database Model
* @author Armando Dias [zdiaarm], Tirth [zpiptir]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class Microservices {
  // ------------------------------------------------------------------------------------------- //
  /**
   * Constructor prepares the object
   * and set the index which should
   * be used by this Model.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------- //
  constructor() {
    this.packName = 'adp.modelsElasticSearch.Microservices';
    this.elasticSearch = adp.elasticSearch;
    this.index = adp.config.elasticSearchMicroservicesIndex;
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Verifies the index exists, if it doesn't it will create it
   * @returns {Object} With { code, message } if successful or
   * { code, error } if fails. If the code crashes,
   * an errorLog object will be returned.
   * @author Armando Dias [ zdiaarm ]
   */
  // ------------------------------------------------------------------------------------------- //
  async verifyIndex() {
    const indexObj = { index: this.index };
    const type = 'microservice';
    // === MAPPING ============================================================================= //
    const body = {
      properties: {
        id: { type: 'keyword', similarity: 'boolean', ignore_above: 512 },
        slug: { type: 'keyword', similarity: 'boolean', ignore_above: 512 },
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
        post_type: { type: 'constant_keyword' },
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
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Search Elastic Search Documents ID using Microservice ID or Microservice Slug.
   * @param {string} IDORSLUG Microservice ID or Microservice Slug.
   * @returns {Promise} Promise with the requested object
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------- //
  searchDocumentIDUsingMicroserviceIDOrSlug(IDORSLUG) {
    return new Promise((RES, REJ) => {
      const esObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              should: [
                {
                  term: {
                    id: IDORSLUG,
                  },
                },
                {
                  term: {
                    slug: IDORSLUG,
                  },
                },
              ],
            },
          },
          _source: ['id', 'slug'],
        },
      };
      this.elasticSearch.search(esObject, async (ERROR, RESULT) => {
        if (ERROR) {
          const errorCodeFrom3PP = ERROR
            && ERROR.meta
            && ERROR.meta.statusCode
            ? ERROR.meta.statusCode
            : 500;
          const errorMessageFrom3PP = ERROR
            && ERROR.message
            ? ERROR.message
            : 'Error got on this.elasticSearch.search';
          if (errorCodeFrom3PP === 404 && errorMessageFrom3PP.substr(0, 25) === 'index_not_found_exception') {
            const specialSituation = {
              code: 200,
              message: 'Not an error: Index not found, should be created.',
            };
            await this.verifyIndex();
            REJ(specialSituation);
            return;
          }
          const errorCode = errorCodeFrom3PP;
          const errorMessage = errorMessageFrom3PP;
          const errorObject = {
            error: ERROR,
            elasticSearchIndex: this.index,
            microserviceIDOrSlug: IDORSLUG,
          };
          REJ(errorLog(errorCode, errorMessage, errorObject, 'searchDocumentIDUsingMicroserviceIDOrSlug', this.packName));
          return;
        }
        let elasticSearchDocumentID = null;
        let elasticSearchLen = null;
        if (RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits) {
          elasticSearchLen = RESULT.body.hits.hits.length;
        }
        if (RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits
          && RESULT.body.hits.hits[0]
          && RESULT.body.hits.hits[0]._id) {
          elasticSearchDocumentID = RESULT.body.hits.hits[0]._id;
        }
        if (!elasticSearchDocumentID) {
          if (elasticSearchLen === 0) {
            const specialSituation = {
              code: 200,
              message: 'Not an error: Index found, but the document should be created.',
            };
            REJ(specialSituation);
            return;
          }
          const errorCode = 500;
          const errorMessage = 'The elasticSearch document ID not found.';
          const errorObject = {
            error: 'The elasticSearch document ID not found after validation.',
            elasticSearchIndex: this.index,
            resultFromElasticSearch: RESULT,
            microserviceIDOrSlug: IDORSLUG,
          };
          REJ(errorLog(errorCode, errorMessage, errorObject, 'searchDocumentIDUsingMicroserviceIDOrSlug', this.packName));
          return;
        }
        RES(elasticSearchDocumentID);
      });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Search all Microservice IDs stored in Elastic Search.
   * Microservice ID =/= Elastic Search Document ID
   * @returns {Promise} Promise with the requested object
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------- //
  allIDs() {
    return new Promise((RES, REJ) => {
      const esObject = {
        index: this.index,
        body: {
          _source: ['id'],
          from: 0,
          size: 10000,
        },
      };
      this.elasticSearch.search(esObject, async (ERROR, RESULT) => {
        if (ERROR) {
          const errorCodeFrom3PP = ERROR
            && ERROR.meta
            && ERROR.meta.statusCode
            ? ERROR.meta.statusCode
            : 500;
          const errorMessageFrom3PP = ERROR
            && ERROR.message
            ? ERROR.message
            : 'Error got on this.elasticSearch.search';
          if (errorCodeFrom3PP === 404 && errorMessageFrom3PP.substr(0, 25) === 'index_not_found_exception') {
            const specialSituation = {
              code: 404,
              message: 'Index/Table/Collection not found.',
            };
            REJ(specialSituation);
            return;
          }
          const errorCode = errorCodeFrom3PP;
          const errorMessage = errorMessageFrom3PP;
          const errorObject = {
            error: ERROR,
            elasticSearchIndex: this.index,
          };
          REJ(errorLog(errorCode, errorMessage, errorObject, 'allIDs', this.packName));
          return;
        }
        const ids = [];
        if (RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits) {
          RESULT.body.hits.hits.forEach((ID) => {
            ids.push({ elasticID: ID._id, _id: ID._source.id });
          });
        }
        RES(ids);
      });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Delete "these" Microservices from Elastic Search.
   * @param {Array} IDSTODELETE Array with Microservice IDs to be deleted.
   * @returns {Promise} Promise with an Array with deleted IDs.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------- //
  deleteThese(IDSTODELETE) {
    if (!Array.isArray(IDSTODELETE) || IDSTODELETE.length === 0) {
      return new Promise((RES) => {
        RES([]);
      });
    }
    return new Promise((RES, REJ) => {
      const esObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              filter: {
                ids: {
                  values: IDSTODELETE,
                },
              },
            },
          },
        },
      };
      this.elasticSearch.deleteByQuery(esObject, async (ERROR, RESULT) => {
        if (ERROR) {
          const errorCodeFrom3PP = ERROR
            && ERROR.meta
            && ERROR.meta.statusCode
            ? ERROR.meta.statusCode
            : 500;
          const errorMessageFrom3PP = ERROR
            && ERROR.message
            ? ERROR.message
            : 'Error got on this.elasticSearch.deleteByQuery';
          const errorCode = errorCodeFrom3PP;
          const errorMessage = errorMessageFrom3PP;
          const errorObject = {
            error: ERROR,
            elasticSearchIndex: this.index,
          };
          REJ(errorLog(errorCode, errorMessage, errorObject, 'deleteThese', this.packName));
          return;
        }
        const ids = [];
        if (RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits) {
          RESULT.body.hits.hits.forEach((ID) => {
            ids.push({ _id: ID._source.id });
          });
        }
        RES(ids);
      });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Insert a Microservice Denormalized Object into Elastic Search.
   * If the Elastic Search Index doesn't exist, it will be created.
   * @param {object} MS Microservice Denormalized Object.
   * @returns {Promise} Promise with a small report about what was done.
   * @author Armando Dias [zdiaarm] | Ravikiran [zgarsri]
   */
  // ------------------------------------------------------------------------------------------- //
  insertElasticSearchDocument(MS) {
    return new Promise(async (RES, REJ) => {
      const added = await this.elasticSearch.index({
        index: this.index,
        body: MS,
      });
      const createIndexStatus = added && added.statusCode ? added.statusCode : 500;
      if (createIndexStatus !== 200 && createIndexStatus !== 201) {
        const errorCode = createIndexStatus;
        const errorMessage = 'Error on trying to create a index on elasticSearch.';
        const errorObject = {
          error: added,
          elasticSearchIndex: this.index,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'insertElasticSearchDocument', this.packName));
        return;
      }
      const refreshed = await this.elasticSearch.indices.refresh({ index: this.index });
      const refreshStatus = refreshed && refreshed.statusCode ? refreshed.statusCode : 500;
      if (refreshStatus !== 200) {
        const errorCode = refreshStatus;
        const errorMessage = 'Error on trying to refresh the index on elasticSearch.';
        const errorObject = {
          error: refreshed,
          elasticSearchIndex: this.index,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'insertElasticSearchDocument', this.packName));
        return;
      }
      RES({ id: MS.id, slug: MS.slug, action: 'inserted' });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Update a Microservice Denormalized Object into Elastic Search.
   * @param {string} DOCID ElasticSearch document ID.
   * @param {object} MS Microservice Denormalized Object.
   * @returns {Promise} Promise with a small report about what was done.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------- //
  updateElasticSearchDocument(DOCID, MS) {
    return new Promise(async (RES, REJ) => {
      const updated = await this.elasticSearch.update({
        index: this.index,
        id: DOCID,
        body: { doc: MS },
      });
      const updateIndexStatus = updated && updated.statusCode ? updated.statusCode : 500;
      if (updateIndexStatus !== 200) {
        const errorCode = updated;
        const errorMessage = 'Error on trying to update a document on elasticSearch.';
        const errorObject = {
          error: updated,
          elasticSearchIndex: this.index,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'updateElasticSearchDocument', this.packName));
        return;
      }
      const refreshed = await this.elasticSearch.indices.refresh({ index: this.index });
      const refreshStatus = refreshed && refreshed.statusCode ? refreshed.statusCode : 500;
      if (refreshStatus !== 200) {
        const errorCode = refreshStatus;
        const errorMessage = 'Error on trying to refresh the index on elasticSearch.';
        const errorObject = {
          error: refreshed,
          elasticSearchIndex: this.index,
        };
        REJ(errorLog(errorCode, errorMessage, errorObject, 'updateElasticSearchDocument', this.packName));
        return;
      }
      RES({ id: MS.id, slug: MS.slug, action: 'updated' });
    });
  }

  /**
   * Search by words ( independent ) with
   * Highlights with support to RBAC Content Permission IDs Array.
   * @param {string} WORD One or more words for searching
   * @param {Array} [AUTHARRAY = []] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   * @param {Integer} [SKIP = 0] How many register the result should skip.
   *                       Default is zero.
   * @param {Integer} [SIZE = 20] How many registers should return per request.
   *                       Default is 20.
   * @param {Integer} [HIGHLIGHSIZE = 300] The maximum number of characteres each
   *                               highlight should return.
   *                               Default is 300.
   * @param {boolean} [isHighlightedContentIncluded = true] defines if highlights
   * are included in result
   * @returns {promise} response of the request.
   * @author Tirth Pipalia [zpiptir]
   */

  microserviceSearch(
    WORD,
    AUTHARRAY = [],
    SKIP = 0,
    SIZE = 20,
    HIGHLIGHSIZE = 300,
    isHighlightedContentIncluded = true,
  ) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearchQueryObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              must: [{
                multi_match: {
                  query: WORD,
                  type: 'best_fields',
                  fields: ['name', 'based_on', 'description', 'product_number'],
                  tie_breaker: 0.3,
                },
              },
              ],
              filter: {
                terms: {
                  id: AUTHARRAY,
                },
              },
            },
          },
          _source: ['name', 'description', 'denorm.asset_document_fullurl', 'denorm.asset_fullurl', 'based_on', 'type', 'slug'],
          highlight: {
            type: 'unified',
            number_of_fragments: 1,
            fragment_size: HIGHLIGHSIZE,
            no_match_size: HIGHLIGHSIZE,
            pre_tags: ['<strong>'],
            post_tags: ['</strong>'],
            fields: {
              name: {},
              description: {},
            },
          },
          from: SKIP,
          size: SIZE,
        },
      };

      // Add the highlighted content if required
      if (isHighlightedContentIncluded) {
        elasticSearchQueryObject.body.highlight.fields.post_content_filtered = {};
      }

      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.microservices';
          const errorObject = {
            error: ERROR,
            keyword: WORD,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
            highLightSize: HIGHLIGHSIZE,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'microserviceSearch', this.packName));
        } else {
          const result = RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits
            ? RESULT.body.hits.hits
            : null;

          const total = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.total
            && RESULT.body.hits.total.value
            ? RESULT.body.hits.total.value
            : null;

          if (!result) {
            const errorObject = {
              error: { errorMessage: 'Error got because got an invalid answer from ElasticSearch', error: ERROR },
              result: RESULT,
              keyword: WORD,
              authArray: AUTHARRAY,
              skip: SKIP,
              size: SIZE,
              highLightSize: HIGHLIGHSIZE,
            };
            REJECT(errorLog(500, 'Error got because got an invalid answer from ElasticSearch', errorObject, 'microserviceSearch', this.packName));
            return;
          }
          RESOLVE({ result, total });
        }
      });
    });
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = Microservices;
// ============================================================================================= //
