// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.synchronizeWithElasticSearch ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdp {
  indexAssetsGetOnlyIDs() {
    return new Promise((RES, REJ) => {
      let mockError = null;
      let ids = null;
      switch (adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs) {
        case 0:
          RES(require('./synchronizeWithElasticSearch-indexAssetsGetOnlyIDs.spec.json'));
          break;
        case 1:
          ids = require('./synchronizeWithElasticSearch-indexAssetsGetOnlyIDs.spec.json');
          ids.docs.splice(0, 1);
          ids.resultsReturned = ids.docs.length;
          RES(ids);
          break;
        default:
          mockError = 'indexAssetsGetOnlyIDs MockError';
          REJ(mockError);
          break;
      }
    });
  }
}

class MockElasticMicroservices {
  allIDs() {
    return new Promise((RES, REJ) => {
      let mockError = null;
      switch (adp.mockBehavior.MockElasticMicroservices_allIDs) {
        case 0:
          RES(require('./synchronizeWithElasticSearch-allIDs.spec.json'));
          break;
        case 1:
          RES([]);
          break;
        case -2:
          mockError = { code: 404, message: 'allIDs 404 MockError' };
          REJ(mockError);
          break;
        default:
          mockError = 'allIDs MockError';
          REJ(mockError);
          break;
      }
    });
  }


  deleteThese(VALUES) {
    return new Promise((RES, REJ) => {
      let mockError = null;
      switch (adp.mockBehavior.MockElasticMicroservices_deleteThese) {
        case 0:
          adp.results.deleteThese = VALUES;
          RES(VALUES);
          break;
        default:
          mockError = 'deleteThese MockError';
          REJ(mockError);
          break;
      }
    });
  }


  searchDocumentIDUsingMicroserviceIDOrSlug(ID) {
    let mockError = null;
    return new Promise((RES, REJ) => {
      switch (adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug) {
        case 0:
          if (ID === '17e57f6cea1b5a673f8775e6cf023344') {
            RES('GJcBqHwB5MmChlr6rR_y');
          } else {
            mockError = 'Mock Error';
            REJ(mockError);
          }
          break;
        case -2:
          mockError = { code: 200, message: 'Not found on Elastic Search means this should be inserted, not updated.' };
          REJ(mockError);
          break;
        default:
          mockError = 'Mock Error';
          REJ(mockError);
          break;
      }
    });
  }


  updateElasticSearchDocument(ELASTICID, MS) {
    return new Promise((RES, REJ) => {
      let mockError = null;
      switch (adp.mockBehavior.MockElasticMicroservices_updateElasticSearchDocument) {
        case 0:
          adp.results.updateElasticSearchDocument = { elasticID: ELASTICID, ms: MS };
          RES();
          break;
        case -2:
          mockError = { code: 200, message: 'There is no document to update. Should insert it.' };
          REJ(mockError);
          break;
        default:
          mockError = 'updateElasticSearchDocument MockError';
          REJ(mockError);
          break;
      }
    });
  }


  insertElasticSearchDocument(MS) {
    return new Promise((RES, REJ) => {
      let mockError = null;
      switch (adp.mockBehavior.MockElasticMicroservices_insertElasticSearchDocument) {
        case 0:
          adp.results.insertElasticSearchDocument = { ms: MS };
          RES();
          break;
        default:
          mockError = 'updateElasticSearchDocument MockError';
          REJ(mockError);
          break;
      }
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.microservice.synchronizeWithElasticSearch ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mockBehavior = {
      microservice_read: 0,
      MockAdp_indexAssetsGetOnlyIDs: 0,
      MockElasticMicroservices_allIDs: 0,
      MockElasticMicroservices_deleteThese: 0,
      MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug: 0,
      MockElasticMicroservices_updateElasticSearchDocument: 0,
      MockElasticMicroservices_insertElasticSearchDocument: 0,
    };
    adp.results = {
      deleteThese: [],
    };
    adp.clone = JOBJECT => JSON.parse(JSON.stringify(JOBJECT));
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.Microservices = MockElasticMicroservices;

    adp.echoLog = () => {};

    const mockErrorLog = (code, desc, data, origin, packName) => {
      if (data && data.error && data.error.code) {
        return data.error;
      }
      return {
        code,
        message: desc,
        error: data,
        origin,
        packName,
      };
    };

    adp.microservice = {};

    adp.microservice.read = (ID) => {
      let mockError;
      switch (ID) {
        case '17e57f6cea1b5a673f8775e6cf023344':
          return new Promise(RES => RES(require('./synchronizeWithElasticSearch-read.spec.json')[adp.mockBehavior.microservice_read]));
        default:
          return new Promise((RES, REJ) => {
            mockError = 'Mock Error';
            REJ(mockError);
          });
      }
    };

    adp.microservice.synchronizeWithElasticSearch = proxyquire('./synchronizeWithElasticSearch', {
      '../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });


  it('Testing a full successful synchronization process with an empty ElasticSearch database.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_allIDs = 1;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing a full successful synchronization process with an non empty ElasticSearch database.', (done) => {
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a full successful synchronization process where one microservice should be deleted from ElasticSearch.', (done) => {
    adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs = 1;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        expect(adp.results.deleteThese).toEqual(['GJcBqHwB5MmChlr6rR_y']);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing what if [ adp.models.Adp.indexAssetsGetOnlyIDs ] breaks.', (done) => {
    adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs = -1;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('synchronizeAll');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing what if [ adp.modelsElasticSearch.deleteThese ] breaks at a full synchronization process.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_deleteThese = -1;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('deleteOnElasticSearchWhatDoesNotExistAnymore');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing what if [ adp.modelsElasticSearch.Microservices.allIDs ] breaks at a full synchronization process.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_allIDs = -1;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('deleteOnElasticSearchWhatDoesNotExistAnymore');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing what if [ adp.modelsElasticSearch.Microservices.allIDs ] returns a 404 error at a full synchronization process.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_allIDs = -2;
    adp.microservice.synchronizeWithElasticSearch()
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });


  it('Testing what if [ adp.modelsElasticSearch.Microservices.updateElasticSearchDocument ] breaks.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug = -1;
    adp.mockBehavior.microservice_read = 0;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('synchronizeThis');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing a single successful synchronization process with an empty ElasticSearch database ( MS with Manual Menu ).', (done) => {
    adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug = -2;
    adp.mockBehavior.microservice_read = 0;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        expect(adp.results.insertElasticSearchDocument.ms.id).toEqual('17e57f6cea1b5a673f8775e6cf023344');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a single successful synchronization process with an empty ElasticSearch database ( MS with Auto Menu ).', (done) => {
    adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug = -2;
    adp.mockBehavior.microservice_read = 1;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        expect(adp.results.insertElasticSearchDocument.ms.id).toEqual('17e57f6cea1b5a673f8775e6cf023344');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a single successful synchronization process with an empty ElasticSearch database ( MS with invalid Auto Menu ).', (done) => {
    adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug = -2;
    adp.mockBehavior.microservice_read = 2;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        expect(adp.results.insertElasticSearchDocument.ms.id).toEqual('17e57f6cea1b5a673f8775e6cf023344');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing what if [ adp.microservice.read ] breaks during a single synchronization process.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_searchDocumentIDUsingMicroserviceIDOrSlug = -2;
    adp.mockBehavior.microservice_read = -1;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('synchronizeThis');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing what if [ updateElasticSearchDocument ] need to call [ insertElasticSearchDocument ].', (done) => {
    adp.mockBehavior.MockElasticMicroservices_updateElasticSearchDocument = -2;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        expect(adp.results.insertElasticSearchDocument.ms.id).toEqual('17e57f6cea1b5a673f8775e6cf023344');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing what if [ updateElasticSearchDocument ] need to call [ insertElasticSearchDocument ] and this last one breaks.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_updateElasticSearchDocument = -2;
    adp.mockBehavior.MockElasticMicroservices_insertElasticSearchDocument = -1;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.message).toEqual('Error on trying to insert a new document on elasticSearch');
        expect(ERROR.origin).toEqual('synchronizeThis');
        expect(ERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing what if [ updateElasticSearchDocument ] breaks.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_updateElasticSearchDocument = -1;
    adp.microservice.synchronizeWithElasticSearch('17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.message).toEqual('Error on trying to insert a new document on elasticSearch');
        expect(ERROR.origin).toEqual('synchronizeThis');
        expect(ERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing a successful direct delete.', (done) => {
    adp.microservice.synchronizeWithElasticSearch(null, '17e57f6cea1b5a673f8775e6cf023344')
      .then((ANSWER) => {
        expect(ANSWER.deletedMicroservicesOnElasticSearch).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a direct delete case [ adp.modelsElasticSearch.Microservices.deleteThese ] breaks.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_deleteThese = -1;
    adp.microservice.synchronizeWithElasticSearch(null, '17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('deleteOnElasticSearch');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });


  it('Testing a direct delete case [ adp.modelsElasticSearch.Microservices.allIDs ] breaks.', (done) => {
    adp.mockBehavior.MockElasticMicroservices_allIDs = -1;
    adp.microservice.synchronizeWithElasticSearch(null, '17e57f6cea1b5a673f8775e6cf023344')
      .then(() => {
        done.fail();
      })
      .catch((MOCKERROR) => {
        expect(MOCKERROR.code).toEqual(500);
        expect(MOCKERROR.origin).toEqual('deleteOnElasticSearch');
        expect(MOCKERROR.packName).toEqual('adp.microservice.synchronizeWithElasticSearch');
        done();
      });
  });
});
// ============================================================================================= //
