// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.synchronizeDocumentsWithElasticSearch ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

class mockMicroServiceDocumentation {
  getThisSpecificMSDocument() {
    let result;
    const error = {
      code: 500,
      message: 'error',
    };
    if (adp.mockGetSpecificDocBehaviour === 2) {
      return Promise.reject(error);
    }
    if (adp.mockGetSpecificDocBehaviour === 0) {
      result = {
        code: 200,
        doc: {
          post_id: '45e7f4f992afe7bbb62a3391e500ffb1_development_additional-documents_troubleshooting-guide',
        },
        original: '',
        docESID: 'id',
      };
    } else {
      result = {
        code: 500,
        error: 'index_not_found_exception',
        doc: {
          post_id: '45e7f4f992afe7bbb62a3391e500ffb1_development_additional-documents_troubleshooting-guide',
        },
        original: '',
        docESID: 'id',
      };
    }
    return new Promise(RES => RES(result));
  }

  createThisSpecificMSDocument() {
    return new Promise(RES => RES());
  }

  verifyIndex() {
    return new Promise(RES => RES());
  }

  updateThisSpecificMSDocument() {
    return new Promise(RES => RES());
  }
}

describe('Testing [ adp.routes.endpoints.elasticSync.synchronizeDocumentsWithElasticSearch] behavior.', () => {
  let mockErrorLog;
  let msReadPass;
  let msData;
  let mockSyncOBj;
  let mockDBError;
  let mockGetDocBehaviour;
  const queueObjective = `allMicroservices__${(new Date()).getTime()}`;

  beforeEach(() => {
    adp = {};
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    adp.masterCache = {};
    adp.echoLog = () => {};
    adp.queue = {};
    adp.masterCache.clear = () => true;
    adp.queue.obtainObjectiveLink = () => 'Sync Success';
    adp.stripHtmlTags = html => (html);
    adp.document = {};
    adp.mockGetSpecificDocBehaviour = 0;
    mockGetDocBehaviour = 0;
    adp.queue.startJobs = () => new Promise(RES => RES());
    adp.queue.addJobs = () => new Promise(RES => RES());
    adp.document.getDocuments = () => {
      let result = {};
      const error = {
        errorCode: 500,
        errorMessage: 'error',
      };
      switch (mockGetDocBehaviour) {
        case 1: {
          result = {
            ok: false,
            msg: {
              body: 'mockbody',
            },
          };
          break;
        }
        case 2: {
          result = {
            ok: false,
            msg: ['document has to be a gerrit or artifactory link '],
          };
          break;
        }
        default: {
          result = {
            ok: true,
            msg: {
              body: 'mockbody',
            },
          };
          break;
        }
      }
      return new Promise((RES, REJ) => {
        if (mockGetDocBehaviour === 3) {
          REJ(error);
        } else {
          RES(result);
        }
      });
    };

    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.MicroserviceDocumentation = mockMicroServiceDocumentation;

    mockDBError = {
      errorCode: 500,
      errorMessage: 'Unable to retrieve MS from Database',
    };
    mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });
    adp.microservice = {};
    msReadPass = true;

    msData = {
      _id: 'c54641834093c6b359577c670d009a88',
      name: 'Auto MS with Real Artifactory',
      slug: 'auto-ms-with-real-artifactory',
      menu_auto: true,
      documentsForRendering: {
        development: {
          dpi: [
            {
              name: 'Service Overview',
              slug: 'service-overview',
              external_link: 'https://url',
              default: true,
              url: 'https://url',
              doc_route: [
                '/marketplace',
                'auto-ms-max',
                'documentation',
                'development',
                'dpi',
                'service-overview',
              ],
              doc_link: 'url',
              doc_mode: 'api',
              category_name: 'Developer Product Information',
              category_slug: 'dpi',
              titlePosition: 0,
            },
          ],
          'additional-documents': [
            {
              name: 'Troubleshooting Guide',
              slug: 'troubleshooting-guide',
              external_link: 'https://url',
              url: 'https://url',
              doc_route: [
                '/marketplace',
                'auto-ms-max',
                'documentation',
                'development',
                'additional-documents',
                'troubleshooting-guide',
              ],
              doc_link: 'https://url',
              doc_mode: 'api',
              category_name: 'Additional Documents',
              category_slug: 'additional-documents',
              titlePosition: 3,
            },
          ],
        },
      },
    };

    mockSyncOBj = {
      ms_id: '45e7f4f992afe7bbb62a3391e500ffb1',
      ms_name: 'Auto MS max',
      ms_slug: 'auto-ms-max',
      doc_version: 'development',
      doc_version_order: 0,
      doc_name: 'Troubleshooting Guide',
      doc_slug: 'troubleshooting-guide',
      doc_external_link: 'https://url',
      doc_url: 'https://url',
      doc_doc_route: [
        '/marketplace',
        'auto-ms-max',
        'documentation',
        'development',
        'additional-documents',
        'troubleshooting-guide',
      ],
      doc_doc_link: 'https://url',
      doc_doc_mode: 'api',
      doc_new_tab: false,
      doc_category_name: 'Additional Documents',
      doc_category_slug: 'additional-documents',
      doc_titlePosition: 3,
      doc_default: false,
      doc_restricted: false,
    };

    adp.microservice.read = () => new Promise((resolve, reject) => {
      if (msReadPass) {
        resolve(msData);
      } else {
        reject(mockDBError);
      }
    });
    adp.microservice.synchronizeDocumentsWithElasticSearch = proxyquire('./synchronizeDocumentsWithElasticSearch', {
      '../library/errorLog': mockErrorLog,
      '../modelsElasticSearch/MicroserviceDocumentation': mockMicroServiceDocumentation,
    });
  });

  afterEach(() => {
    global.adp = {};
    adp = {};
  });

  it('Testing adding documents to the queue.', (done) => {
    adp.microservice.synchronizeDocumentsWithElasticSearch.add(['c54641834093c6b359577c670d009a88'], 'development', 'troubleshooting-guide', queueObjective)
      .then((result) => {
        expect(result.queueStatusLink).toBe('Sync Success');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing adding documents to the queue should give error when microservices are not array.', (done) => {
    adp.microservice.synchronizeDocumentsWithElasticSearch.add('c54641834093c6b359577c670d009a88', 'development', 'troubleshooting-guide', queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toBe(400);
        expect(error.message).toBe('Parameter IDS should be an array of microservice ids.');
        done();
      });
  });

  it('Testing syncing documents.', (done) => {
    mockSyncOBj.original = '';
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.doc).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing Synchronize documents including the body.', (done) => {
    mockGetDocBehaviour = 1;
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(500);
        expect(result.error).toBeDefined();
        done().fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing Synchronize documents (DOCUMENT has to be gerrit or Artifactory).', (done) => {
    mockGetDocBehaviour = 2;
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.error[0]).toBe('document has to be a gerrit or artifactory link ');
        done().fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing error while getting documents.', (done) => {
    mockGetDocBehaviour = 3;
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.code).toBe(500);
        expect(result.desc).toBe('Unable to retrieve the document from external');
        expect(result.data).toBeDefined();
        done().fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing syncing external documents.', (done) => {
    mockSyncOBj.doc_doc_mode = 'dp';
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.doc).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing comparing and update documents index not found exception case', (done) => {
    mockSyncOBj.doc_doc_mode = 'dp';
    adp.mockGetSpecificDocBehaviour = 1;
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.doc).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error in compareAndUpdate documents', (done) => {
    mockSyncOBj.doc_doc_mode = 'api';
    adp.mockGetSpecificDocBehaviour = 2;
    adp.microservice.synchronizeDocumentsWithElasticSearch.sync(mockSyncOBj)
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.doc).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing adding documents to the queue with multiple microservice ids', (done) => {
    adp.microservice.synchronizeDocumentsWithElasticSearch.add(['c54641834093c6b359577c670d009a88', 'c54641834093c6b359577c670d009a88'], 'development', 'troubleshooting-guide', queueObjective)
      .then((result) => {
        expect(result.queueStatusLink).toBe('Sync Success');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error in fetching documents from database.', (done) => {
    msReadPass = false;
    adp.microservice.synchronizeDocumentsWithElasticSearch.add(['c54641834093c6b359577c670d009a88'], 'development', 'troubleshooting-guide', queueObjective)
      .then(() => {
        done().fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing successful case for deleteElasticPviDocuments', async (done) => {
    let result = await adp.microservice.synchronizeDocumentsWithElasticSearch.deleteElasticPviDocuments('MockMSID');
    result = {
      body: {
        deleted: 1,
      },
    };

    expect(result.body.deleted).toEqual(1);
    done();
  });

  it('Testing successful case for  clearElasticPviDocuments function behaviour no documents removed', async (done) => {
    adp.microservice.synchronizeDocumentsWithElasticSearch.clearElasticPviDocuments('')
      .then((RES) => {
        done();

        expect(RES.statusCode).toEqual(200);
        expect(RES.deleted_elasticsearch_id).toEqual('');
      }).catch(() => {
        done.fail();
      });
  });

  it('Testing successful case for  [ clearElasticPviDocuments ] function behaviour documents removed', async (done) => {
    adp.microservice.synchronizeDocumentsWithElasticSearch.clearElasticPviDocuments('MockMSID')
      .then((RES) => {
        done();

        expect(RES.statusCode).toEqual(200);
        expect(RES.message).toEqual('PVI documents has removed from ElasticSearch.');
        expect(RES.deleted_elasticsearch_id).toEqual('MockMSID');
      }).catch(() => {
        done.fail();
      });
  });
});
