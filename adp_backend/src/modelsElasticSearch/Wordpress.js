/**
* [ adp.modelsElasticSearch.Wordpress ]
* Wordpress Elastic Search Database Model
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class Wordpress {
  // ------------------------------------------------------------------------------------------ //
  /**
   * Constructor prepares the object
   * and set the index which should
   * be used by this Model.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.modelsElasticSearch.Wordpress';
    this.elasticSearch = adp.elasticSearch;
    this.index = adp.config.elasticSearchWordpressIndex;
    this.realtimeIndex = `${adp.config.elasticSearchWordpressIndex},${adp.config.elasticSearchMicroservicesIndex}`;
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ search ] - Search by words ( independent ) with
   * Highlights with support to RBAC Content Permission IDs Array.
   * @param {string} WORD One or more words for searching
   * @param {Array} [AUTHARRAY = []] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   * @param {Integer} [SKIP = 0] How many register the result should skip.
   *                       Default is zero.
   * @param {Integer} [SIZE = 20] How many registers should return per request.
   *                       Default is 20.
   * @param {Integer} [HIGHLIGHSIZE = 20] The maximum number of characteres each
   *                               highlight should return.
   *                               Default is 300.
   * @param {boolean} [isHighlightedContentIncluded = true] defines if highlights are
   *                                                        included in result
   * @param {string} TYPE To filter search result based on the selected tab type where post_type for
   *                      Articles = page, Tutorials = tutorials
   *
   * @returns {promise} response of the request.
   * @author Armando Dias [zdiaarm], Michael Coughlan [zmiccou], Tirth Pipalia [zpiptir]
   */
  searchWordpress(
    WORD,
    AUTHARRAY = [],
    SKIP = 0,
    SIZE = 20,
    HIGHLIGHSIZE = 300,
    isHighlightedContentIncluded = true,
    TYPE,
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
                  fields: ['post_title', 'post_content_filtered'],
                  tie_breaker: 0.3,
                },
              },
              {
                bool: {
                  must_not: {
                    match: { 'post_type.raw': 'post' },
                  },
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
          _source: ['post_id', 'post_title', 'post_name', 'terms', 'post_type'],
          highlight: {
            type: 'unified',
            number_of_fragments: 1,
            fragment_size: HIGHLIGHSIZE,
            no_match_size: HIGHLIGHSIZE,
            pre_tags: ['<strong>'],
            post_tags: ['</strong>'],
            fields: {
              post_title: {},
              post_content_filtered: {},
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

      // Super Admin user with/without specific tab type
      if ((Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) && (TYPE === 'page' || TYPE === 'tutorials')) {
        elasticSearchQueryObject.body.query.bool.filter = {
          term: { 'post_type.raw': TYPE },
        };
      } else if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }
      // Normal User with/without specific tab type
      if ((Array.isArray(AUTHARRAY) && AUTHARRAY.length > 0) && (TYPE === 'page' || TYPE === 'tutorials')) {
        elasticSearchQueryObject.body.query.bool.must[1] = {
          bool: {
            must_not: {
              match: { 'post_type.raw': 'post' },
            },
            filter: {
              term: { 'post_type.raw': TYPE },
            },
          },
        };
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.wordpress';
          const errorObject = {
            error: ERROR,
            keyword: WORD,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
            highLightSize: HIGHLIGHSIZE,
          };
          const errorOrigin = 'search';
          REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
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
            const errorCode = 500;
            const errorMessage = 'Error got because got an invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              keyword: WORD,
              authArray: AUTHARRAY,
              skip: SKIP,
              size: SIZE,
              highLightSize: HIGHLIGHSIZE,
            };
            const errorOrigin = 'search';
            REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
            return;
          }
          RESOLVE({ result, total });
        }
      });
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * [ realtimesearch ] - Search by words ( independent ) with
   * Highlights with support to RBAC Content Permission IDs Array,
   * used in the search suggestion box.
   * @param {string} WORD One or more words for searching
   * @param {Array} [AUTHARRAY = [] ] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   *
   * @returns {promise} response of the request.
   * @author Ravikiran G [zgarsri], Tirth Pipalia [zpiptir]
   */
  realtimesearch(
    WORD,
    AUTHARRAY = [],
  ) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearchQueryObject = {
        index: this.realtimeIndex,
        body: {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: WORD,
                  type: 'best_fields',
                  fields: [
                    'post_title',
                    'post_content_filtered',
                    'name',
                    'based_on',
                    'product_number',
                    'description',
                  ],
                  tie_breaker: 0.3,
                },
              },
              must_not: {
                term: {
                  'post_type.raw': 'post',
                },
              },
              filter: {},
            },
          },
          size: 0,
          aggs: {
            myResult: {
              terms: {
                field: '_index',
                size: 4,
              },
              aggs: {
                myGroups: {
                  terms: {
                    field: 'post_type.raw',
                    size: 4,
                    missing: 'microservice',
                    order: {
                      _key: 'asc',
                    },
                  },
                  aggs: {
                    top: {
                      top_hits: {
                        size: 4,
                        _source: [
                          'type',
                          'name',
                          'slug',
                          'post_type',
                          'post_id',
                          'post_title',
                          'post_name',
                          'terms',
                          'denorm.asset_document_fullurl',
                          'denorm.asset_fullurl',
                        ],
                        highlight: {
                          type: 'unified',
                          number_of_fragments: 1,
                          no_match_size: 300,
                          pre_tags: [
                            '<strong>',
                          ],
                          post_tags: [
                            '</strong>',
                          ],
                          fields: {
                            name: {},
                            post_title: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      } else {
        const terms = [];
        AUTHARRAY.forEach((ID) => {
          if (ID === `${parseInt(ID, 10)}`) {
            terms.push({ term: { _id: ID } });
          } else {
            terms.push({ term: { id: ID } });
          }
        });
        elasticSearchQueryObject.body.query.bool.filter = {
          bool: {
            should: terms,
          },
        };
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.wordpress';
          const errorObject = {
            error: ERROR,
            keyword: WORD,
            authArray: AUTHARRAY,
          };
          const errorOrigin = 'realtime search';
          REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
        } else {
          const allBuckets = RESULT
            && RESULT.body
            && RESULT.body.aggregations
            && RESULT.body.aggregations.myResult
            ? RESULT.body.aggregations.myResult.buckets
            : null;

          if (!allBuckets) {
            const errorCode = 500;
            const errorMessage = 'Error got because got an invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              keyword: WORD,
              authArray: AUTHARRAY,
            };
            const errorOrigin = 'realtime search';
            REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
            return;
          }

          const allResults = [];

          allBuckets.forEach((BUCKET) => {
            const levelOneBucket = BUCKET;
            const levelTwoBucket = levelOneBucket.myGroups.buckets;
            levelTwoBucket.forEach((RESULTS) => {
              allResults.push(RESULTS);
            });
          });

          const total = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.total
            && RESULT.body.hits.total.value
            ? RESULT.body.hits.total.value
            : null;

          RESOLVE({ result: allResults, total });
        }
      });
    });
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ getByIds ] - Get documents from IDs.
   * @param {Array} [AUTHARRAY = []] The permission array. If empty,
   *                          returns all ( Super Admin/Auto All Content Permission ).
   * @param {Integer} [SKIP = 0] How many register the result should skip.
   *                       Default is zero.
   * @param {Integer} [SIZE = 20] How many registers should return per request.
   *                       Default is 20.
   * @returns {promise} response of the request.
   * @author Armando Dias [zdiaarm]
   */
  getByIds(
    IDARRAY = [],
    SKIP = 0,
    SIZE = 20,
  ) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearchQueryObject = {
        index: this.index,
        body: {
          query: {
            bool: {
              filter: {
                ids: {
                  values: IDARRAY,
                },
              },
            },
          },
          _source: ['post_id', 'post_title', 'post_name', 'post_modified', 'post_type', 'post_content_filtered'],
          from: SKIP,
          size: SIZE,
        },
      };

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.wordpress';
          const errorObject = {
            error: ERROR,
            authArray: IDARRAY,
            skip: SKIP,
            size: SIZE,
          };
          const errorOrigin = 'getByIds';
          REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
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
            const errorCode = 500;
            const errorMessage = 'Error got because got an invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              idArray: IDARRAY,
              skip: SKIP,
              size: SIZE,
            };
            const errorOrigin = 'search';
            REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
            return;
          }
          RESOLVE({ result, total });
        }
      });
    });
  }
}
// ============================================================================================= //
module.exports = Wordpress;
// ============================================================================================= //
