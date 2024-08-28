/**
* [ adp.modelsElasticSearch.MsDocumentationSearch ]
* Microservice Documentation Elastic Search Database Model
* @author Ravikiran G [zgarsri]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class MsDocumentationSearch {
  // ------------------------------------------------------------------------------------------ //
  /**
   * Constructor prepares the object
   * and set the index which should
   * be used by this Model.
   * @author Ravikiran G [zgarsri]
   */
  constructor() {
    this.packName = 'adp.modelsElasticSearch.MsDocumentationSearch';
    this.elasticSearch = adp.elasticSearch;
    this.index = adp.config.elasticSearchMsDocumentationIndex;
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
   * @param {Integer} [HIGHLIGHSIZE = 300] The maximum number of characteres each
   *                               highlight should return.
   *                               Default is 300.
   * @param {boolean} [isHighlightedContentIncluded = true] defines if highlights are
   *                                                        included in result
   * @param {string} TITLESLUG Microservice-Documentation title slug
   * @param {string} ASSETSLUG Microservice slug
   * @param {string} VERSION Microservice-Documentation version
   *
   * @returns {promise} response of the request.
   * @author Ravikiran G [zgarsri], Tirth [zpiptir]
   */
  searchDocuments(
    WORD,
    AUTHARRAY = [],
    SKIP = 0,
    SIZE = 20,
    isHighlightedContentIncluded = true,
    HIGHLIGHSIZE = 300,
    TITLESLUG,
    ASSETSLUG,
    VERSION,
  ) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearchQueryObject = {
        index: this.index,
        body: {
          _source: [
            'asset_name',
            'asset_slug',
            'category',
            'category_slug',
            'title_slug',
            'version',
            'restricted',
            'external_link',
            'document_url',
            'post_type',
            'asset_id',
            'post_new_tab',
          ],
          from: SKIP,
          size: SIZE,
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: WORD,
                    type: 'best_fields',
                    fields: ['title', 'raw_text'],
                    tie_breaker: 0.3,
                  },
                },
              ],
              filter: [
                {
                  terms: {
                    asset_id: AUTHARRAY,
                  },
                },
              ],
            },
          },
          highlight: {
            type: 'unified',
            no_match_size: HIGHLIGHSIZE,
            fragment_size: HIGHLIGHSIZE,
            number_of_fragments: 1,
            pre_tags: ['<strong>'],
            post_tags: ['</strong>'],
            fields: {
              title: {},
              raw_text: {},
            },
          },
          collapse: {
            field: 'post_name.raw',
            inner_hits: {
              name: 'versions',
              size: 10000,
              collapse: {
                field: 'version.keyword',
              },
              sort: {
                post_name_version_order: 'asc',
              },
              _source: ['version'],
            },
          },
          aggs: {
            total_results: {
              cardinality: {
                field: 'post_name.raw',
              },
            },
          },

        },
      };
      // delete the highlighted content if not required
      if (!isHighlightedContentIncluded) {
        delete elasticSearchQueryObject.body.highlight;
        // add highlight contents to source
      }

      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }
      // Query for Verion Selection
      if (ASSETSLUG && VERSION && TITLESLUG) {
        delete elasticSearchQueryObject.body.aggs;
        delete elasticSearchQueryObject.body.query.bool;
        elasticSearchQueryObject.body.query.bool = {

          must: [
            {
              multi_match: {
                query: WORD,
                type: 'best_fields',
                fields: ['title', 'raw_text'],
              },
            },
            {
              bool: {
                must: [
                  {
                    term: {
                      'asset_slug.keyword': {
                        value: ASSETSLUG,
                      },
                    },
                  },
                ],
                filter: [
                  {
                    term: {
                      'version.keyword': VERSION,
                    },
                  },
                ],
              },
            },
          ],
          filter: [
            {
              term: {
                'title_slug.keyword': TITLESLUG,
              },
            },
          ],
        };
        elasticSearchQueryObject.body.size = 1;
        elasticSearchQueryObject.body._source = [
          'asset_name',
          'asset_slug',
          'category',
          'category_slug',
          'title_slug',
          'version',
          'restricted',
          'external_link',
          'document_url',
          'post_type',
          'asset_id',
          'post_new_tab',
        ];
        elasticSearchQueryObject.body.highlight = {
          type: 'unified',
          no_match_size: HIGHLIGHSIZE,
          fragment_size: HIGHLIGHSIZE,
          number_of_fragments: 1,
          pre_tags: ['<strong>'],
          post_tags: ['</strong>'],
          fields: {
            title: {},
            raw_text: {},
          },
        };
      }
      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.MsDocumentationSearch';
          const errorObject = {
            error: ERROR,
            keyword: WORD,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
            highLightSize: HIGHLIGHSIZE,
            titleSlug: TITLESLUG,
            assetSlug: ASSETSLUG,
            version: VERSION,
          };
          const errorOrigin = 'MsDocumentationSearch';
          REJECT(errorLog(errorCode, errorMessage, errorObject, errorOrigin, this.packName));
        } else {
          let result;
          let total;

          if (TITLESLUG && VERSION && ASSETSLUG) {
            result = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.hits
              ? RESULT.body.hits.hits
              : null;

            total = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.total
            && RESULT.body.hits.total.value
              ? RESULT.body.hits.total.value
              : null;
          } else {
            result = RESULT
            && RESULT.body
            && RESULT.body.hits
            && RESULT.body.hits.hits
              ? RESULT.body.hits.hits
              : null;
            total = RESULT
            && RESULT.body
            && RESULT.body.aggregations
            && RESULT.body.aggregations.total_results
              ? RESULT.body.aggregations.total_results.value
              : null;
          }
          if (!result) {
            const errorCode = 500;
            const errorMessage = 'Error occured due to invalid answer from ElasticSearch';
            const errorObject = {
              error: { errorMessage, error: ERROR },
              result: RESULT,
              keyword: WORD,
              authArray: AUTHARRAY,
              skip: SKIP,
              size: SIZE,
              highLightSize: HIGHLIGHSIZE,
              titleSlug: TITLESLUG,
              assetSlug: ASSETSLUG,
              version: VERSION,
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
module.exports = MsDocumentationSearch;
// ============================================================================================= //
