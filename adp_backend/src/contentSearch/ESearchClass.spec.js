const proxyquire = require('proxyquire');
const dataSearchWithHighLightsMicroservices = require('./ESearchClass_searchWithHighLightsMicroservices.spec.json');
const dataSearchWithHighLightsAll = require('./ESearchClass_searchWithHighLights.spec.json');

/**
* Unit test for [ adp.contentSearch.ESearchClass ]
* @author Armando Dias [zdiaarm] | Ravikiran G [zgarsri]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.contentSearch.ESearchClass ] ', () => {
  class MockMicroservicesModel {
    microserviceSearch() {
      if (global.mockBehavior.modelsElasticSearchMicroservices === true) {
        const result = dataSearchWithHighLightsMicroservices;
        return new Promise(RES => RES({ result, total: result.length }));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }

  class MockDocumentationsModel {
    searchDocuments() {
      if (global.mockBehavior.MSDocumentationModel === true) {
        const result = require('./ESearchClass_MsDocument.spec.json');
        return new Promise(RES => RES(result));
      }
      const error = {};
      return new Promise((RES, REJ) => REJ(error));
    }
  }
  class MockWordpressModel {
    searchWordpress() {
      if (global.mockBehavior.modelsElasticSearchWordpress === true) {
        const result = dataSearchWithHighLightsAll.filter(searchItem => searchItem._index === '1921685610223309-post-1');
        return new Promise(RES => RES({ result, total: dataSearchWithHighLightsAll.length }));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }

    realtimesearch() {
      if (global.mockBehavior.modelsElasticSearchWordpress === true) {
        const result = require('./ESearchClass_realtimesearchWithHighLights.spec.json');
        return new Promise(RES => RES({ result }));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }

  class MockMicroservicesWordpressModel {
    searchMicroservicesWordpress() {
      const { data, res } = global.mockBehavior.MockMicroservicesWordpressModel;
      if (res) {
        return Promise.resolve(data);
      }
      return Promise.reject(data);
    }
  }

  const mockErroLog = (code, desc, data, origin, packName) => {
    global.mockBehavior.ErrorLog.args = {
      code, desc, data, origin, packName,
    };
    return global.mockBehavior.ErrorLog.args;
  };

  class MockRBACContentPreparationClass {
    loadAllContentIDs() {
      if (global.mockBehavior.RBACContentPreparationClass === true) {
        this.req = {};
        this.req.wpcontent = {};
        this.req.wpcontent.allContent = require('./ESearchClass_loadAllContentIDs.spec.json');
        this.req.asset = {};
        this.req.asset.allContent = require('./ESearchClass_loadMicroservicesAllContentIDs.spec.json');
        if (global.mockBehavior.RBACContentPreparationClassRemoveID) {
          const id = global.mockBehavior.RBACContentPreparationClassRemoveID;
          delete this.req.wpcontent.allContent[id];
        }
        return new Promise(RES => RES());
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }


  beforeEach(() => {
    global.adp = {};
    adp = {};
    adp.config = {};
    adp.config.elasticSearchMicroservicesIndex = 'microservices';
    adp.config.elasticSearchMsDocumentationIndex = 'microservice-documentation';
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.middleware = {};
    adp.middleware.RBACContentPreparationClass = MockRBACContentPreparationClass;

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.modelsElasticSearchWordpress = true;
    global.mockBehavior.MSDocumentationModel = true;
    global.mockBehavior.modelsElasticSearchMicroservices = true;
    global.mockBehavior.RBACContentPreparationClass = true;
    global.mockBehavior.RBACContentPreparationClassRemoveID = null;
    global.mockBehavior.ErrorLog = {
      args: {},
    };
    global.mockBehavior.MockMicroservicesWordpressModel = {
      data: { result: dataSearchWithHighLightsAll, total: 0 },
      res: true,
    };

    adp.contentSearch = {};
    adp.contentSearch.ESearchClass = proxyquire('./ESearchClass', {
      './../library/errorLog': mockErroLog,
      '../modelsElasticSearch/MicroservicesWordpress': MockMicroservicesWordpressModel,
      '../modelsElasticSearch/Microservices': MockMicroservicesModel,
      '../modelsElasticSearch/Wordpress': MockWordpressModel,
      '../modelsElasticSearch/MsDocumentationSearch': MockDocumentationsModel,
    });
    adp.getSizeInMemory = () => 1;
  });


  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case for documentSearch version', (done) => {
    global.mockBehavior.MSDocumentationModel = true;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('testWord', [], 'ms_documentation', 0, 20, true, 300, 'title_slug', 'asset_slug', 'version')
      .then((RESULT) => {
        expect(Array.isArray(RESULT.result)).toEqual(true);
        expect(RESULT.result.length).toEqual(2);
        expect(RESULT.result[0]._id).toBeDefined();
        expect(RESULT.result[0].highlight.title).toBeDefined();
        expect(RESULT.result[0].asset_name).toBeDefined();
        expect(RESULT.result[0].asset_slug).toBeDefined();
        expect(RESULT.result[0].version).toBeDefined();
        expect(RESULT.result[0].title_slug).toBeDefined();
        expect(RESULT.result[0].category_slug).toBeDefined();
        expect(RESULT.result[0].highlight.raw_text).toBeDefined();
        expect(RESULT.result[0].restricted).toBeDefined();
        expect(RESULT.result[0].link).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case for documentSearch when model throws error', (done) => {
    global.mockBehavior.MSDocumentationModel = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [], 'ms_documentation')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got on trying to perform a document search');
        expect(ERROR.origin).toEqual('documentsearch');
        expect(ERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        expect(ERROR.data.error).toEqual({});
        done();
      });
  });

  it('Should return microservice documentation, microservice and wordpress results for a full search.', (done) => {
    const search = new adp.contentSearch.ESearchClass();
    search.search('test', [])
      .then((RESULT) => {
        const checkObj = {
          page: false,
          tutorials: false,
          microservice: false,
          ms_documentation: false,
        };
        RESULT.result.every((resultObj) => {
          if (!checkObj[resultObj.type] && (resultObj.type === 'page' || resultObj.type === 'tutorials')) {
            expect(resultObj.object_id).toBeDefined();
            expect(resultObj.title).toBeDefined();
            expect(resultObj.slug).toBeDefined();
            expect(resultObj.category).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.url).toBeDefined();
            expect(resultObj.type).toBeDefined();
            checkObj[resultObj.type] = true;
            return true;
          }
          if (!checkObj[resultObj.type] && resultObj.type === 'microservice') {
            expect(resultObj._id).toBeDefined();
            expect(resultObj.name).toBeDefined();
            expect(resultObj.slug).toBeDefined();
            expect(resultObj.based_on).toBeDefined();
            expect(resultObj.description).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.asset_fullurl).toBeDefined();
            expect(resultObj.asset_document_fullurl).toBeDefined();
            expect(resultObj.type).toBeDefined();
            checkObj.microservice = true;
            return true;
          }
          if (!checkObj[resultObj.type] && resultObj.type === 'ms_documentation') {
            expect(resultObj._id).toBeDefined();
            expect(resultObj.asset_name).toBeDefined();
            expect(resultObj.asset_slug).toBeDefined();
            expect(resultObj.category).toBeDefined();
            expect(resultObj.category_slug).toBeDefined();
            expect(resultObj.title_slug).toBeDefined();
            expect(resultObj.version).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.restricted).toBeDefined();
            expect(resultObj.type).toBeDefined();
            expect(resultObj.new_tab).toBeDefined();
            expect(resultObj.link).toBeDefined();
            expect(resultObj.versions).toBeDefined();
            checkObj.ms_documentation = true;
            return true;
          }
          if (checkObj.page
            && checkObj.tutorials
            && checkObj.microservice
            && checkObj.ms_documentation) {
            return false;
          }
          return true;
        });

        expect(checkObj.page).toBeTruthy();
        expect(checkObj.tutorials).toBeTruthy();
        expect(checkObj.microservice).toBeTruthy();
        expect(checkObj.ms_documentation).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should return type content only for a full search.', (done) => {
    global.mockBehavior.MockMicroservicesWordpressModel.data.result = dataSearchWithHighLightsAll;
    const search = new adp.contentSearch.ESearchClass();
    search.search('adp', [], 'page', 0, 20, true)
      .then((RESULT) => {
        const checkObj = {
          page: false,
          tutorials: false,
          microservice: false,
          ms_documentation: false,
        };
        RESULT.result.every((resultObj) => {
          if (!checkObj[resultObj.type] && (resultObj.type === 'page' || resultObj.type === 'tutorials')) {
            expect(resultObj.object_id).toBeDefined();
            expect(resultObj.title).toBeDefined();
            expect(resultObj.slug).toBeDefined();
            expect(resultObj.category).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.url).toBeDefined();
            expect(resultObj.type).toBeDefined();
            checkObj[resultObj.type] = true;
            return true;
          }
          if (!checkObj[resultObj.type] && resultObj.type === 'microservice') {
            checkObj.microservice = true;
            return false;
          }
          if (!checkObj[resultObj.type] && resultObj.type === 'ms_documentation') {
            checkObj.ms_documentation = true;
            return false;
          }
          return true;
        });

        expect(checkObj.page).toBeTruthy();
        expect(checkObj.tutorials).toBeTruthy();
        expect(checkObj.microservice).toBeFalsy();
        expect(checkObj.ms_documentation).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should return type microservice only for a full search.', (done) => {
    global.mockBehavior.MockMicroservicesWordpressModel.data.result = dataSearchWithHighLightsAll;
    const search = new adp.contentSearch.ESearchClass();
    search.search('adp', [], 'assets', 0, 20, true)
      .then((RESULT) => {
        RESULT.result.every((resultObj) => {
          if (resultObj.type === 'microservice') {
            expect(resultObj._id).toBeDefined();
            expect(resultObj.name).toBeDefined();
            expect(resultObj.slug).toBeDefined();
            expect(resultObj.description).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.asset_fullurl).toBeDefined();
            expect(resultObj.asset_document_fullurl).toBeDefined();
            expect(resultObj.type).toBeDefined();
            return true;
          }

          expect(false).toBeTruthy();
          return false;
        });

        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should return type ms_documentation only for a full search.', (done) => {
    global.mockBehavior.MockMicroservicesWordpressModel.data.result = dataSearchWithHighLightsAll;
    const search = new adp.contentSearch.ESearchClass();
    search.search('adp', [], 'ms_documentation', 0, 20, true)
      .then((RESULT) => {
        RESULT.result.every((resultObj) => {
          if (resultObj.type === 'ms_documentation') {
            expect(resultObj._id).toBeDefined();
            expect(resultObj.asset_name).toBeDefined();
            expect(resultObj.asset_slug).toBeDefined();
            expect(resultObj.category).toBeDefined();
            expect(resultObj.category_slug).toBeDefined();
            expect(resultObj.title_slug).toBeDefined();
            expect(resultObj.version).toBeDefined();
            expect(resultObj.restricted).toBeDefined();
            expect(resultObj.type).toBeDefined();
            expect(resultObj.highlight).toBeDefined();
            expect(resultObj.new_tab).toBeDefined();
            expect(resultObj.link).toBeDefined();
            expect(resultObj.versions).toBeDefined();
            return true;
          }

          expect(false).toBeTruthy();
          return false;
        });

        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // search suggestions (realtime search method) case
  it('Successful simple realtime search case.', (done) => {
    const keyword = 'adp';
    const authArray = [];
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.realtimesearch(keyword, authArray)
      .then((RESULT) => {
        expect(Array.isArray(RESULT.result)).toEqual(true);
        expect(RESULT.result.length).toEqual(3);
        expect(RESULT.result[0].filteredArray.length).toEqual(2);
        expect(RESULT.result[1].filteredArray.length).toEqual(4);
        expect(RESULT.result[0].filteredArray[0].object_id).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].title).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].slug).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].category).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].highlight).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].url).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].object_id).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].title).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].slug).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].category).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].highlight).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].url).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case where one link was not found.', (done) => {
    const rmId = '3365';
    global.mockBehavior.RBACContentPreparationClassRemoveID = rmId;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [])
      .then((RESULT) => {
        const matchecRemoveId = RESULT.result.some(resultItem => resultItem._id === rmId);

        expect(RESULT.result.length).toEqual(49);
        expect(matchecRemoveId).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // search suggestions (realtime search method) case
  it('Successful case where one link was not found in realtime search', (done) => {
    const keyword = 'adp';
    const authArray = [];
    global.mockBehavior.RBACContentPreparationClassRemoveID = '3365';
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.realtimesearch(keyword, authArray)
      .then((RESULT) => {
        expect(Array.isArray(RESULT.result)).toEqual(true);
        expect(RESULT.result[0].filteredArray.length).toEqual(2);
        expect(RESULT.result[1].filteredArray.length).toEqual(4);
        expect(RESULT.result[0].filteredArray[0].object_id).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].title).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].slug).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].category).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].highlight).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].url).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].object_id).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].title).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].slug).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].category).toBeDefined();
        expect(RESULT.result[1].filteredArray[0].highlight).toBeDefined();
        expect(RESULT.result[0].filteredArray[0].url).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should reject if the elastic MicroservicesWordpressModel rejects.', (done) => {
    global.mockBehavior.MockMicroservicesWordpressModel = {
      data: '"mockError"',
      res: false,
    };
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [])
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to perform a Microservices and Wordpress Search');
        expect(MOCKERROR.data.error).toEqual('"mockError"');
        expect(MOCKERROR.origin).toEqual('searchMicroservicesWordpress');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  it('Should reject if the elastic microservice model rejects.', (done) => {
    global.mockBehavior.modelsElasticSearchMicroservices = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [], 'assets', 0, 20, true)
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to perform a Microservices Search');
        expect(MOCKERROR.data.error).toEqual('mockError');
        expect(MOCKERROR.origin).toEqual('searchMicroservices');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  it('Should reject if the elastic wordpress model rejects.', (done) => {
    global.mockBehavior.modelsElasticSearchWordpress = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [], 'page', 0, 20, true)
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to perform a Wordpress search');
        expect(MOCKERROR.data.error).toEqual('mockError');
        expect(MOCKERROR.origin).toEqual('searchWP');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  // search suggestions (realtime search method) case
  it('Negative case if [ realtime search @ adp.modelsElasticSearch.Wordpress ] break.', (done) => {
    const keyword = 'adp';
    const authArray = [];
    global.mockBehavior.modelsElasticSearchWordpress = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.realtimesearch(keyword, authArray)
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to perform a realtime search');
        expect(MOCKERROR.data.error).toEqual('mockError');
        expect(MOCKERROR.origin).toEqual('realtimesearch');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  it('Negative case if [ loadAllContentIDs @ adp.middleware.RBACContentPreparationClass ] break.', (done) => {
    global.mockBehavior.RBACContentPreparationClass = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.search('adp', [], 0, 20, true)
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to retrieve the links');
        expect(MOCKERROR.origin).toEqual('_processWPSearchResults');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  // search suggestions (realtime search method) case
  it('Negative case if [ loadAllContentIDs @ adp.middleware.RBACContentPreparationClass ] break for realtime search', (done) => {
    global.mockBehavior.RBACContentPreparationClass = false;
    const contentSearch = new adp.contentSearch.ESearchClass();
    contentSearch.realtimesearch('adp', [])
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.desc).toEqual('Error got on trying to retrieve the links for realtime search');
        expect(MOCKERROR.origin).toEqual('realtimesearch');
        expect(MOCKERROR.packName).toEqual('adp.contentSearch.ESearchClass');
        done();
      });
  });

  it('Testing [ removeTagsFromHighlight ] in an isolated way (No Highlights).', (done) => {
    const items = [
      { item: { test: true } },
    ];
    const contentSearch = new adp.contentSearch.ESearchClass();
    const result = contentSearch.removeTagsFromHighlight(items);

    expect(result).toEqual([{ item: { test: true } }]);
    done();
  });


  it('Testing [ removeTagsFromHighlight ] in an isolated way (No closed HTML Tags and no content with square brackets).', (done) => {
    const items = [
      {
        highlight: {
          htmlStartWithOpenTag: ['/><b>something <sub>test</sub> </b>'],
          htmlEndsWithOpenTag: ['<b>something <i>else</i></b><a'],
          htmlWithSquareBrackets: ['<b>something in [Square]brackets</b><a'],
        },
      },
    ];

    const contentSearch = new adp.contentSearch.ESearchClass();
    const result = contentSearch.removeTagsFromHighlight(items);

    expect(result).toEqual([
      {
        highlight: {
          htmlStartWithOpenTag: ['something <sub>test</sub>'],
          htmlEndsWithOpenTag: ['something else'],
          htmlWithSquareBrackets: ['something in brackets'],
        },
      },
    ]);
    done();
  });
});
