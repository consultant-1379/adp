const errorLog = require('../library/errorLog');

/**
 * [ adp.modelsElasticSearch.MicroservicesWordpress ]
 * Microservice - Wordpress Elastic Search Database Model
 * [ microserviceSearch ] - Search by words ( independent ) with
 * Highlights with support to RBAC Content Permission IDs Array.
 * @author Tirth Pipalia [zpiptir]
 */
class MicroservicesWordpress {
  constructor() {
    this.packName = 'adp.modelsElasticSearch.MicroservicesWordpress';
    this.elasticSearch = adp.elasticSearch;
    this.index = `${adp.config.elasticSearchWordpressIndex},${adp.config.elasticSearchMicroservicesIndex},${adp.config.elasticSearchMsDocumentationIndex}`;
  }

  /**
  * Highlights with support to RBAC Content Permission IDs Array.
  * @param {string} WORD One or more words for searching
  * @param {Array} [AUTHARRAY = [] ] The permission array. If empty,
  *                          returns all ( Super Admin/Auto All Content Permission ).
  * @param {Integer} [SKIP = 0] How many register the result should skip.
  *                       Default is zero.
  * @param {Integer} [SIZE = 20] How many registers should return per request.
  *                       Default is 20.
  * @param {Integer} [HIGHLIGHSIZE = 300] The maximum number of characteres each
  *                               highlight should return.
  *                               Default is 300.
  * @param {boolean} [isHighlightedContentIncluded = true] defines if highlights
  * are included in result.
  *
  * @returns {promise} response of the request.
  * @author Tirth Pipalia [zpiptir] | Ravikiran [zgarsri]
  */

  searchMicroservicesWordpress(
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
          _source: [
            'asset_slug',
            'asset_name',
            'version',
            'category',
            'category_slug',
            'title_slug',
            'title',
            'asset_id',
            'post_id',
            'post_title',
            'post_name',
            'post_new_tab',
            'terms',
            'post_type',
            'name',
            'description',
            'denorm.asset_document_fullurl',
            'denorm.asset_fullurl',
            'document_url',
            'external_link',
            'restricted',
            'based_on',
            'type',
            'slug',
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
                    fields: [
                      'title',
                      'raw_text',
                      'name',
                      'based_on',
                      'post_title',
                      'post_content_filtered',
                      'product_number',
                      'component_service_name',
                      'description',
                    ],
                    tie_breaker: 0.3,
                  },
                },
                {
                  bool: {
                    must_not: {
                      match: {
                        'post_type.raw': 'post',
                      },
                    },
                  },
                },
              ],
              filter: {
                bool: {
                  should: [{
                    terms: {
                      _id: AUTHARRAY,
                    },
                  },
                  {
                    terms: {
                      id: AUTHARRAY,
                    },
                  },
                  {
                    terms: {
                      asset_id: AUTHARRAY,
                    },
                  },
                  ],
                },
              },
            },
          },
          highlight: {
            type: 'unified',
            fragment_size: HIGHLIGHSIZE,
            no_match_size: HIGHLIGHSIZE,
            number_of_fragments: 1,
            pre_tags: ['<strong>'],
            post_tags: ['</strong>'],
            fields: {
              post_title: {},
              title: {},
              raw_text: {},
              name: {},
              post_content_filtered: {},
              description: {},
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
              _source: [
                'version',
              ],
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

      if (!isHighlightedContentIncluded) {
        delete elasticSearchQueryObject.body.highlight;
      }

      if (Array.isArray(AUTHARRAY) && AUTHARRAY.length === 0) {
        delete elasticSearchQueryObject.body.query.bool.filter;
      }

      this.elasticSearch.search(elasticSearchQueryObject, (ERROR, RESULT) => {
        if (ERROR) {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on adp.modelsElasticSearch.MicroservicesWordpress';
          const errorObject = {
            error: ERROR,
            keyword: WORD,
            authArray: AUTHARRAY,
            skip: SKIP,
            size: SIZE,
            highLightSize: HIGHLIGHSIZE,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'searchMicroservicesWordpress', this.packName));
        } else {
          const result = RESULT
          && RESULT.body
          && RESULT.body.hits
          && RESULT.body.hits.hits
            ? RESULT.body.hits.hits
            : null;
          const total = RESULT
          && RESULT.body
          && RESULT.body.aggregations
          && RESULT.body.aggregations.total_results
          && RESULT.body.aggregations.total_results.value
            ? RESULT.body.aggregations.total_results.value
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
            REJECT(errorLog(500, 'Error got because got an invalid answer from ElasticSearch', errorObject, 'searchMicroservicesWordpress', this.packName));
            return;
          }
          RESOLVE({ result, total });
        }
      });
    });
  }
}

module.exports = MicroservicesWordpress;
