/* eslint-disable prefer-destructuring */
const errorLog = require('./../library/errorLog');
const MicroservicesWordpressModel = require('../modelsElasticSearch/MicroservicesWordpress');
const MicroservicesModel = require('../modelsElasticSearch/Microservices');
const WordpressModel = require('../modelsElasticSearch/Wordpress');
const DocumentationsModel = require('../modelsElasticSearch/MsDocumentationSearch');

/**
* [ adp.contentSearch.ESearchClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
class ESearchClass {
  // ------------------------------------------------------------------------------------------ //
  constructor() {
    this.packName = 'adp.contentSearch.ESearchClass';
    this.htmlRegExp = new RegExp(/(<(?!\/?strong|\/?sub|\/?sup)([\s\S])+?>)/gim);
    this.breakLine = new RegExp(/(\s)+/gim);
    this.removeSquareBrackets = new RegExp(/ *\[[^\]]*]/gim);
    this.theLastOpenedTag = new RegExp(/(<(?![\s\S]*>))(?!.*\1)/gim);
    this.theFirstOpenedTag = new RegExp(/^((?!<strong|<sub|<sup)([\s\S]))*?(>)/gim);
    this.findHttpRegExp = new RegExp(/http(s)?:\/\//gim);
    this.findAllDomainRegExp = new RegExp(/http(s)?:\/\/([\s\S])+?\//gim);
    this.findFirstSlash = new RegExp(/^(\/)/gim);
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * The removeTagsFromHighlight method just removes HTML tags from the
   * result we got from Elastic Search.
   * Be careful with incomplete tags.
   * @param {Array} ELASTICITEMS Array from Elastic Search Hits.
   * @return {Array} Same valeus without HTML Tags.
   * @author Armando Dias [zdiaarm]
   */
  removeTagsFromHighlight(ELASTICITEMS) {
    ELASTICITEMS.forEach((ITEM) => {
      if (ITEM.highlight) {
        Object.keys(ITEM.highlight).forEach((HIGHLIGHT) => {
          if ((HIGHLIGHT !== 'post_title' && HIGHLIGHT !== 'name')
          || (HIGHLIGHT !== 'asset_name')
          || (HIGHLIGHT !== 'title')
          || (HIGHLIGHT !== 'raw_text')
          || (HIGHLIGHT !== 'description')
          ) {
            const highlightArray = ITEM.highlight[HIGHLIGHT];
            for (let index = 0; index < highlightArray.length; index += 1) {
              highlightArray[index] = highlightArray[index]
                .replace(this.htmlRegExp, '')
                .replace(this.breakLine, ' ')
                .replace(this.removeSquareBrackets, ' ')
                .replace(this.theFirstOpenedTag, '')
                .trim();
              const lastOpenedTag = this.theLastOpenedTag.exec(highlightArray[index]);
              if (lastOpenedTag) {
                highlightArray[index] = highlightArray[index]
                  .substr(0, lastOpenedTag.index).trim();
              }
            }
          }
        });
      }
    });
    return ELASTICITEMS;
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * The prepareLink method is responsible for
   * and the first slash on the link.
   * @param {string} LINK The link to be prepared.
   * @return {string} The link after preparation.
   * @author Armando Dias [zdiaarm]
   */
  prepareLink(LINK) {
    let result = '';
    if (!LINK.match(this.findFirstSlash)) {
      result = `${result}/`;
    }
    result = `${result}${LINK}`;
    return result;
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * The getMenuLinksAndPrepareResult method is responsible for
   * add links from Worpress Menu and change the object
   * to become more friendly to the FrontEnd.
   * @param {string} SEARCHRESULT Array from Elastic Search hits.
   * @return {Array} Array with the optmized result.
   * @author Armando Dias [zdiaarm]
   */
  getMenuLinksAndPrepareResult(SEARCHRESULT) {
    return new Promise((RESOLVE, REJECT) => {
      const retrieveMenuObject = new adp.middleware.RBACContentPreparationClass();
      retrieveMenuObject.loadAllContentIDs()
        .then(() => {
          const links = retrieveMenuObject.req.wpcontent.allContent;
          const resultArray = [];
          SEARCHRESULT.forEach((DOCUMENT) => {
            if (DOCUMENT._index !== adp.config.elasticSearchMicroservicesIndex
                && DOCUMENT._index !== adp.config.elasticSearchMsDocumentationIndex) {
              const foundLinks = [];
              if (links[`${DOCUMENT._source.post_id}`]) {
                const contentOnMenu = links[`${DOCUMENT._source.post_id}`];
                const urlArray = contentOnMenu.url;
                urlArray.forEach((URL) => {
                  let clearPath = URL;
                  if (URL.match(this.findHttpRegExp)) {
                    clearPath = `/${URL.replace(this.findAllDomainRegExp, '')}`;
                  }
                  foundLinks.push(this.prepareLink(clearPath));
                });
              }
              if (foundLinks.length > 0) {
                const category = [];
                if (DOCUMENT
                && DOCUMENT._source
                && DOCUMENT._source.terms
                && Array.isArray(DOCUMENT._source.terms.category)
                ) {
                  DOCUMENT._source.terms.category.forEach((CATEGORY) => {
                    const categoryObject = {
                      category_id: CATEGORY.term_id,
                      category_name: CATEGORY.name,
                      category_slug: CATEGORY.slug,
                    };
                    category.push(categoryObject);
                  });
                }

                const docObject = {
                  object_id: DOCUMENT._source.post_id,
                  title: DOCUMENT._source.post_title,
                  slug: DOCUMENT._source.post_name,
                  category,
                  highlight: DOCUMENT.highlight,
                  url: foundLinks,
                  type: DOCUMENT._source.post_type,
                };

                resultArray.push(docObject);
              }
            } else {
              let docObjMS = {};
              if (DOCUMENT._source
                && DOCUMENT._source.denorm
                && DOCUMENT._source.denorm.asset_fullurl) {
                docObjMS = {
                  _id: DOCUMENT._id,
                  name: DOCUMENT._source.name,
                  slug: DOCUMENT._source.slug,
                  based_on: DOCUMENT._source.based_on,
                  description: DOCUMENT._source.description,
                  highlight: DOCUMENT.highlight,
                  asset_fullurl: DOCUMENT._source.denorm.asset_fullurl,
                  asset_document_fullurl: DOCUMENT._source.denorm.asset_document_fullurl,
                  type: DOCUMENT._source.type,
                };
                resultArray.push(docObjMS);
              } else if (DOCUMENT._source
                && DOCUMENT._source.asset_name
                && DOCUMENT.highlight.title) {
                docObjMS = {
                  _id: DOCUMENT._id,
                  asset_name: DOCUMENT._source.asset_name,
                  asset_slug: DOCUMENT._source.asset_slug,
                  category: DOCUMENT._source.category,
                  category_slug: DOCUMENT._source.category_slug,
                  title_slug: DOCUMENT._source.title_slug,
                  version: DOCUMENT._source.version,
                  restricted: DOCUMENT._source.restricted,
                  type: DOCUMENT._source.post_type,
                  highlight: DOCUMENT.highlight,
                  new_tab: DOCUMENT._source.post_new_tab,
                };
                let link = '';
                if (DOCUMENT._source.post_new_tab) {
                  link = DOCUMENT._source.external_link;
                } else {
                  link = `/marketplace/${DOCUMENT._source.asset_slug}/documentation/${DOCUMENT._source.version}/${DOCUMENT._source.category_slug}/${DOCUMENT._source.title_slug}`;
                }
                if (DOCUMENT.inner_hits
                  && DOCUMENT.inner_hits.versions
                  && DOCUMENT.inner_hits.versions.hits
                  && DOCUMENT.inner_hits.versions.hits.hits) {
                  const versions = [];
                  DOCUMENT.inner_hits.versions.hits.hits.forEach((ITEM) => {
                    const version = ITEM.fields['version.keyword'];
                    versions.push(version[0]);
                  });
                  docObjMS.versions = versions;
                }
                docObjMS.link = link;
                resultArray.push(docObjMS);
              }
            }
          });
          RESOLVE(resultArray);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getMenuLinksAndPrepareResult', this.packName));
        });
    });
  }

  /**
   * The microserviceSearchObject method is responsible for the
   * creating microservices data object
   * to become more friendly to the FrontEnd.
   * @param {string} SEARCHRESULT Array from Elastic Search hits for Microservices.
   * @return {Array} Array with the optmized result.
   * @author Tirth Pipalia [zpiptir]
   */

  microserviceSearchObject(SEARCHRESULT) {
    return new Promise((RESOLVE, REJECT) => {
      const resultArray = [];
      SEARCHRESULT.forEach((DOCUMENT) => {
        if (DOCUMENT._source && DOCUMENT._source.denorm) {
          const docObj = {
            _id: DOCUMENT._id,
            name: DOCUMENT._source.name,
            slug: DOCUMENT._source.slug,
            based_on: DOCUMENT._source.based_on,
            description: DOCUMENT._source.description,
            highlight: DOCUMENT.highlight,
            asset_fullurl: DOCUMENT._source.denorm.asset_fullurl,
            asset_document_fullurl: DOCUMENT._source.denorm.asset_document_fullurl,
            type: DOCUMENT._source.type,
          };
          resultArray.push(docObj);
        }
      });
      if (Array.isArray(resultArray)) {
        RESOLVE(resultArray);
      } else {
        const errorCode = 500;
        const errorMessage = 'Error while creating Microservices Search Object';
        REJECT(errorLog(errorCode, errorMessage, 'microserviceSearchObject', this.packName));
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * The getMenuLinksAndPrepareResultRealtimeSearch method is responsible for
   * add links from Worpress Menu and change the object
   * to become more friendly to the FrontEnd.
   * @param {string} SEARCHRESULT Array from Elastic Search hits.
   * @return {Array} Array with the optmized result.
   * @author Ravikiran G [zgarsri], Tirth [zpiptir]
   */
  getMenuLinksAndPrepareResultRealtimeSearch(SEARCHRESULT) {
    return new Promise((RESOLVE, REJECT) => {
      const retrieveMenuObject = new adp.middleware.RBACContentPreparationClass();
      retrieveMenuObject.loadAllContentIDs()
        .then(() => {
          const links = retrieveMenuObject.req.wpcontent.allContent;
          const resultArray = [];
          SEARCHRESULT.forEach((DOCUMENT) => {
            if (DOCUMENT.key !== 'microservice') {
              let thisLink = null;
              const filteredArray = [];
              DOCUMENT.top.hits.hits.forEach((DOCUMENTBUCKET) => {
                if (links[`${DOCUMENTBUCKET._source.post_id}`]) {
                  const contentOnMenu = links[`${DOCUMENTBUCKET._source.post_id}`];
                  const urlArray = contentOnMenu.url;
                  urlArray.forEach((URL) => {
                    let clearPath = URL;
                    if (URL.match(this.findHttpRegExp)) {
                      clearPath = `/${URL.replace(this.findAllDomainRegExp, '')}`;
                    }
                    thisLink = this.prepareLink(clearPath);
                  });
                }
                if (thisLink) {
                  const category = [];
                  if (DOCUMENTBUCKET
              && DOCUMENTBUCKET._source
              && DOCUMENTBUCKET._source.terms
              && Array.isArray(DOCUMENTBUCKET._source.terms.category)
                  ) {
                    DOCUMENTBUCKET._source.terms.category.forEach((CATEGORY) => {
                      const categoryObject = {
                        category_id: CATEGORY.term_id,
                        category_name: CATEGORY.name,
                        category_slug: CATEGORY.slug,
                      };
                      category.push(categoryObject);
                    });
                  }
                  const docObject = {
                    object_id: DOCUMENTBUCKET._source.post_id,
                    title: DOCUMENTBUCKET._source.post_title,
                    slug: DOCUMENTBUCKET._source.post_name,
                    category,
                    highlight: DOCUMENTBUCKET.highlight,
                    url: thisLink,
                  };
                  filteredArray.push(docObject);
                }
              });
              const filteredData = {
                post_type: DOCUMENT.key,
                filteredArray,
              };
              resultArray.push(filteredData);
            } else {
              const filteredArray = [];
              let iter = 0;
              while (iter < 2 && DOCUMENT.top.hits.hits[iter]) {
                const DOCUMENTBUCKET = DOCUMENT.top.hits.hits[iter];
                if (DOCUMENTBUCKET._source.denorm.asset_fullurl) {
                  const docObjectMS = {
                    object_id: DOCUMENTBUCKET._id,
                    title: DOCUMENTBUCKET._source.name,
                    slug: DOCUMENTBUCKET._source.slug,
                    asset_document_fullurl: DOCUMENTBUCKET._source.denorm.asset_document_fullurl,
                    category: [],
                    highlight: { post_title: DOCUMENTBUCKET.highlight.name },
                    url: DOCUMENTBUCKET._source.denorm.asset_fullurl,
                    type: DOCUMENTBUCKET._source.type,
                  };
                  filteredArray.push(docObjectMS);
                }
                iter += 1;
              }

              const filteredData = {
                post_type: DOCUMENT.key,
                filteredArray,
              };
              resultArray.unshift(filteredData);
            }
          });
          RESOLVE(resultArray);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a realtime search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getMenuLinksAndPrepareResultRealtimeSearch', this.packName));
        });
    });
  }

  /**
   * Main elastic search entry point
   * @param {string} THEKEYWORD the search term
   * @param {array} AUTHARRAY the rbac auth array
   * @param {int} [SKIP=0] the number to skip by
   * @param {int} [SIZE=20] the limit of the result
   * @param {boolean} [isHighlightedContentIncluded=true] true if highlights must be set
   * @param {string} TAB search focus items(page, tutorials, microservice)
   * @param {string} TITLESLUG slug of Microservice Document Title
   * @param {string} ASSETSLUG slug of Microservice name
   * @param {string} VERSION Version of Microservice Document
   * @returns {Promise<object>} {array} obj.result list of search results
   * {int} obj.total the total of search results
   * @author Tirth [zpiptir]
   */
  search(THEKEYWORD, AUTHARRAY, TAB, SKIP = 0, SIZE = 20, isHighlightedContentIncluded = true,
    TITLESLUG, ASSETSLUG, VERSION) {
    if (TAB === 'page' || TAB === 'tutorials') {
      return this.searchWP(THEKEYWORD, AUTHARRAY, TAB, SKIP, SIZE, isHighlightedContentIncluded);
    }

    if (TAB === 'assets') {
      return this.searchMicroservices(THEKEYWORD, AUTHARRAY, SKIP, SIZE,
        isHighlightedContentIncluded);
    }

    if (TAB === 'ms_documentation') {
      return this.searchDocuments(THEKEYWORD, AUTHARRAY, SKIP, SIZE,
        isHighlightedContentIncluded, TITLESLUG, ASSETSLUG, VERSION);
    }

    return this.searchMicroservicesWordpress(THEKEYWORD, AUTHARRAY, SKIP, SIZE,
      isHighlightedContentIncluded);
  }

  /**
   * Search through microservices only
   * @param {string} THEKEYWORD the search term
   * @param {array} AUTHARRAY the rbac auth array
   * @param {int} [SKIP=0] the number to skip by
   * @param {int} [SIZE=20] the limit of the result
   * @param {boolean} [isHighlightedContentIncluded=true] true if highlights must be set
   * @returns {Promise<object>} {array} obj.result list of search results
   * {int} obj.total the total of search results
   * @author Tirth [zpiptir]
   */
  searchMicroservices(THEKEYWORD, AUTHARRAY, SKIP = 0, SIZE = 20,
    isHighlightedContentIncluded = true) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearch = new MicroservicesModel();

      elasticSearch.microserviceSearch(THEKEYWORD, AUTHARRAY, SKIP, SIZE, 300,
        isHighlightedContentIncluded)
        .then((RESULT) => {
          const { total } = RESULT;
          this.microserviceSearchObject(RESULT.result)
            .then((RESP) => {
              RESOLVE({ result: RESP, total });
            }).catch(err => REJECT(err));
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a Microservices Search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'searchMicroservices', this.packName));
        });
    });
  }

  /**
   * Search through microservices and wordpress content
   * @param {string} THEKEYWORD the search term
   * @param {array} AUTHARRAY the rbac auth array
   * @param {int} [SKIP=0] the number to skip by
   * @param {int} [SIZE=20] the limit of the result
   * @param {boolean} [isHighlightedContentIncluded=true] true if highlights must be set
   * @returns {Promise<object>} {array} obj.result list of search results
   * {int} obj.total the total of search results
   * @author Tirth [zpiptir]
   */
  searchMicroservicesWordpress(THEKEYWORD, AUTHARRAY, SKIP = 0, SIZE = 20,
    isHighlightedContentIncluded = true) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearch = new MicroservicesWordpressModel();

      elasticSearch.searchMicroservicesWordpress(THEKEYWORD, AUTHARRAY, SKIP, SIZE, 300,
        isHighlightedContentIncluded)
        .then((RESULT) => {
          const { total } = RESULT;
          this._processWPSearchResults(RESULT.result)
            .then((RESP) => {
              RESOLVE({ result: RESP, total });
            }).catch(err => REJECT(err));
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a Microservices and Wordpress Search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'searchMicroservicesWordpress', this.packName));
        });
    });
  }

  /**
   * Prepares WP links and remove tags from the highlights
   * @param {object} RESULT the model response from wordpress
   * @returns {object} {object} obj.result the updated result object
   * {number} obj.total the total of the search results
   * @author Armando
   */
  _processWPSearchResults(RESULT) {
    const result = this.removeTagsFromHighlight(RESULT);
    return this.getMenuLinksAndPrepareResult(result)
      .then(RESULTWITHLINKS => (RESULTWITHLINKS))
      .catch((ERROR) => {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Error got on trying to retrieve the links';
        const errorObject = {
          error: ERROR,
        };
        return Promise.reject(
          errorLog(errorCode, errorMessage, errorObject, '_processWPSearchResults', this.packName),
        );
      });
  }

  /**
   * Search through Wordpress content
   * @param {string} THEKEYWORD What you need to search.
   * @param {Array} AUTHARRAY Authorisation with the content
   * array which the user can access.
   * If empty, the user is super admin.
   * @param {Number} [SKIP = 0] How many documents you want to skip
   * in the result ( Pagination ). Default value is zero.
   * @param {Number} [SIZE = 20] How many documents you want per
   * result ( Pagination ). Default value is 20.
   * @param {boolean} [isHighlightedContentIncluded = true] will the highlighted content be included
   * @param {string} TAB Indicates if search is for Articles or Tutorials
   * i.e. page = Articles, tutorials = Tutorials.
   * @return {Array} Array with the result of the search.
   * @author Armando Dias [zdiaarm] Tirth Pipalia [zpiptir]
   */
  searchWP(THEKEYWORD, AUTHARRAY, TAB, SKIP = 0, SIZE = 20, isHighlightedContentIncluded = true) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearch = new WordpressModel();

      elasticSearch.searchWordpress(THEKEYWORD, AUTHARRAY, SKIP, SIZE, 300,
        isHighlightedContentIncluded, TAB)
        .then((RESULT) => {
          const { total } = RESULT;
          this._processWPSearchResults(RESULT.result)
            .then((RESP) => {
              RESOLVE({ result: RESP, total });
            }).catch(err => REJECT(err));
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a Wordpress search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'searchWP', this.packName));
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Fetches relevant documents which matches passed parameters.
   * @param {string} THEKEYWORD What you need to search.
   * @param {Array} AUTHARRAY Authorisation with the content
   * array which a user can access.
   * If empty, then user is super admin.
   * @param {string} TITLESLUG which title slug you need to search.
   * @param {string} ASSETSLUG Which asset slug you need to search.
   * @param {string} VERSION Which Versions you need to search.
   * @param {boolean} isHighlightedContentIncluded will return the highlighted content
   * @return {Array} Array with the result of the search.
   * @author Ravikiran G [zgarsri]
   */
  searchDocuments(
    THEKEYWORD,
    AUTHARRAY,
    SKIP = 0,
    SIZE = 20,
    isHighlightedContentIncluded = true,
    TITLESLUG,
    ASSETSLUG,
    VERSION,
  ) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearch = new DocumentationsModel();
      elasticSearch.searchDocuments(
        THEKEYWORD,
        AUTHARRAY,
        SKIP,
        SIZE,
        isHighlightedContentIncluded,
        300,
        TITLESLUG,
        ASSETSLUG,
        VERSION,
      )
        .then((RESULT) => {
          const { total } = RESULT;
          this._processWPSearchResults(RESULT.result)
            .then((RESP) => {
              RESOLVE({ result: RESP, total });
            }).catch(err => REJECT(err));
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a document search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'documentsearch', this.packName));
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * The search method is responsible for execute the search.
   * @param {string} THEKEYWORD What you need to search.
   * @param {Array} AUTHARRAY Authorisation with the content
   * array which the user can access.
   * If empty, the user is super admin.
   * @param {boolean} isHighlightedContentIncluded will the highlighted content be included
   * @return {Array} Array with the result of the search.
   * @author Ravikiran G [zgarsri], Tirth Pipalia [zpiptir]
   */

  realtimesearch(THEKEYWORD, AUTHARRAY) {
    return new Promise((RESOLVE, REJECT) => {
      const elasticSearch = new WordpressModel();
      elasticSearch.realtimesearch(THEKEYWORD, AUTHARRAY)
        .then((RESULT) => {
          const result = this.removeTagsFromHighlight(RESULT.result);
          const { total } = RESULT;
          this.getMenuLinksAndPrepareResultRealtimeSearch(result)
            .then((RESULTWITHLINKS) => {
              RESOLVE({ result: RESULTWITHLINKS, total });
            })
            .catch((ERROR) => {
              const errorCode = ERROR.code || 500;
              const errorMessage = ERROR.message || 'Error got on trying to retrieve the links for realtime search';
              const errorObject = {
                error: ERROR,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'realtimesearch', this.packName));
            });
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error got on trying to perform a realtime search';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'realtimesearch', this.packName));
        });
    });
  }
}

module.exports = ESearchClass;
