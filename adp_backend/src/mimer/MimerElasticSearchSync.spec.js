// ============================================================================================= //
/**
* Unit test for [ adp.mimer.MimerElasticSearchSync ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
class MockModelAdp {
  update() {
    return new Promise(RES => RES('MockUpdate'));
  }

  getOneById() {
    const ms = {
      mimer_version_starter: '1.0.0',
      mimer_menu: {
        '1.0.5': { versionLabel: '1.0.5' },
        '1.0.0': { versionLabel: '1.0.0' },
        '0.0.9': { versionLabel: '0.0.9' },
      },
    };
    return new Promise(RES => RES({ docs: [ms] }));
  }

  getAssetSlugUsingID() {
    return new Promise(RES => RES('mock-asset-slug'));
  }

  getJustTheMimerVersionStarterFromAsset() {
    return new Promise(RES => RES('1.0.0'));
  }

  getMimerDevelopmentVersionFromYAML() {
    return new Promise(RES => RES('1.0.0'));
  }
}

class MockMicroserviceDocumentation {
  findDocumentsByAssetId() {
    let result;
    if (adp.mockVersion === 0) {
      result = ['MockMSID'];
    } else if (adp.mockVersion === 1) {
      result = [{
        _id: 'MockMSID',
        _source: {
          asset_id: 'MockMSID',
          version: 1,
          this_is_from_Mimer: true,
        },
      }];
    } else if (adp.mockVersion === 2) {
      result = [{
        _id: 'MockMSID',
        _source: {
          asset_id: 'MockMSID',
          version: 1,
          this_is_from_Mimer: true,
        },
      },
      {
        _id: 'MockMSID',
        _source: {
          asset_id: 'MockMSID',
          version: 1,
          this_is_from_Mimer: true,
        },
      }];
    } else {
      result = [];
    }
    return result;
  }

  removeDocuments() {
    let result;
    if (adp.mockVersion === 0) {
      result = {
        body: {
          deleted: 0,
        },
      };
    } else if (adp.mockVersion === 1) {
      result = {
        body: {
          deleted: 1,
        },
      };
    } else if (adp.mockVersion === 2) {
      result = {
        body: {
          deleted: 2,
        },
      };
    } else {
      result = {};
    }
    return result;
  }

  getThisSpecificMSDocument() {
    let result;
    if (adp.mockGetSpecificDocBehaviour === -1) {
      result = {
        code: 500,
      };
      return new Promise((reject) => {
        reject(result);
      });
    }
    if (adp.mockGetSpecificDocBehaviour === 2) {
      result = {
        code: 500,
        error: 'error',
        doc: {
          post_id: '1234_1.0.5_release-documents_10360-apr1234',
        },
        original: '',
        docESID: 'id',
      };
    } else if (adp.mockGetSpecificDocBehaviour === 0) {
      result = {
        code: 200,
        doc: {
          post_id: '1234_1.0.5_release-documents_10360-apr1234',
        },
        original: '',
        docESID: 'id',
      };
    } else {
      result = {
        code: 500,
        error: 'index_not_found_exception',
        doc: {
          post_id: '1234_1.0.5_release-documents_10360-apr1234',
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
    return new Promise(RES => RES(true));
  }
}

class MockEchoLog {
  createOne(MOCKJSON) {
    return new Promise((resolve) => {
      resolve({ ok: true, id: MOCKJSON.id });
    });
  }
}

class MockAssetDocuments {
  getMenuVersions() {
    return new Promise(RES => RES(['8.3.0']));
  }

  hardDeleteInvalidVersionsFromDatabase() {
    let version = 0;
    let result;
    if (adp.mockVersion === -1) {
      result = {
        code: 500,
      };
      return new Promise((reject) => {
        reject(result);
      });
    }
    if (adp.mockVersion > -1) {
      version = adp.mockVersion;
    }
    return new Promise(RES => RES({ n: version }));
  }

  getSpecificDocument() {
    const obj = {
      name: '10921-APR20131/7-5',
      slug: '10921-apr201317-5',
      mimer_source: true,
      mimer_document_number: '10921-APR20131/7-5',
      language: 'Uen',
      revision: 'A',
      external_link: 'http://localhost:1080/eridocpublicserver/Download?DocNo=10921-APR20131/7-5&Lang=EN&Rev=A',
      physical_file_name: null,
      physical_file_extension: null,
      physical_file_status: null,
      default: false,
      restricted: true,
      url: 'http://localhost:1080/eridocserver/d2rest/repositories/eridoca/eridocument/download?number-part=10921-APR20131%2F7-5Uen&revision=A',
      doc_route: [
        '/marketplace',
        'auto-ms-max-mimer-edition',
        'documentation',
        '8.3.0',
        'release-documents',
        '10921-apr201317-5',
      ],
      doc_link: 'https://localhost:9999/document/auto-ms-max-mimer-edition/8.3.0/release-documents/10921-apr201317-5',
      doc_mode: 'newtab',
      category_name: 'Release Documents',
      category_slug: 'release-documents',
      titlePosition: 0,
      data_retrieved_at: '2023-04-27T13:49:23.159Z',
    };
    return new Promise(RES => RES(obj));
  }
}

describe('Testing [ adp.mimer.MimerElasticSearchSync ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp = {};
    adp.models = {};
    adp.models.EchoLog = MockEchoLog;
    adp.models.Adp = MockModelAdp;
    adp.models.AssetDocuments = MockAssetDocuments;
    adp.slugIt = ms => ms;
    adp.echoLog = () => { };
    adp.mockBehavior = {
      syncAction: 0,
    };
    adp.mimer = {};
    adp.mockGetSpecificDocBehaviour = 0;
    adp.mockVersion = 0;
    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.MicroserviceDocumentation = MockMicroserviceDocumentation;
    adp.mimer.MimerElasticSearchSync = require('./MimerElasticSearchSync');
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });

  it('Successful case, [sync] function behaviour', (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    const mockID = '1234';
    const mockSlug = 'sample';
    const mockName = 'Sample';
    const mockDoc = {
      name: 'APR1234',
      slug: 'apr',
      external_link: '/external',
      default: false,
      restricted: true,
      url: '/url',
      doc_route: [
        '/sample',
        'sample-mimer-edition',
        'documentation',
        '1.0.5',
        'release-documents',
        '10360-apr1234',
      ],
      doc_link: '/doc/url',
      doc_mode: 'newtab',
      category_name: 'Docs',
      category_slug: 'docs',
      titlePosition: 0,
    };
    elasticSync.sync(mockID, mockSlug, mockName, mockDoc)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        expect(RES.message).toEqual('Document Updated');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case, [sync] function behaviour index exception case while getting documents', (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockGetSpecificDocBehaviour = 1;
    const mockID = '1234';
    const mockSlug = 'sample';
    const mockName = 'Sample';
    const mockDoc = {
      name: 'APR1234',
      slug: 'apr',
      external_link: '/external',
      default: false,
      restricted: true,
      url: '/url',
      doc_route: [
        '/sample',
        'sample-mimer-edition',
        'documentation',
        '1.0.5',
        'release-documents',
        '10360-apr1234',
      ],
      doc_link: '/doc/url',
      doc_mode: 'newtab',
      category_name: 'Docs',
      category_slug: 'docs',
      titlePosition: 0,
    };
    elasticSync.sync(mockID, mockSlug, mockName, mockDoc)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        expect(RES.message).toEqual('Document Created');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case, [sync] function behaviour Document not found', (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockGetSpecificDocBehaviour = 2;
    const mockID = '1234';
    const mockSlug = 'sample';
    const mockName = 'Sample';
    const mockDoc = {
      name: 'APR1234',
      slug: 'apr',
      external_link: '/external',
      default: false,
      restricted: true,
      url: '/url',
      doc_route: [
        '/sample',
        'sample-mimer-edition',
        'documentation',
        '1.0.5',
        'release-documents',
        '10360-apr1234',
      ],
      doc_link: '/doc/url',
      doc_mode: 'newtab',
      category_name: 'Docs',
      category_slug: 'docs',
      titlePosition: 0,
    };
    elasticSync.sync(mockID, mockSlug, mockName, mockDoc)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        expect(RES.message).toEqual('Document Created');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Error case, error caught on [sync] function', (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockGetSpecificDocBehaviour = -1;
    const mockID = '1234';
    const mockSlug = 'sample';
    const mockName = 'Sample';
    const mockDoc = {
      name: 'APR1234',
      slug: 'apr',
      external_link: '/external',
      default: false,
      restricted: true,
      url: '/url',
      doc_route: [
        '/sample',
        'sample-mimer-edition',
        'documentation',
        '1.0.5',
        'release-documents',
        '10360-apr1234',
      ],
      doc_link: '/doc/url',
      doc_mode: 'newtab',
      category_name: 'Docs',
      category_slug: 'docs',
      titlePosition: 0,
    };
    elasticSync.sync(mockID, mockSlug, mockName, mockDoc)
      .then(() => {
        done.fail();
      })
      .catch((ERR) => {
        expect(ERR.code).toEqual(500);
        done();
      });
  });

  it('Testing successful case for [ getElasticDocumentsByAssetID ]', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockVersion = 1;
    const result = await elasticSync.getElasticDocumentsByAssetID('MockMSID', 0);

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual('MockMSID');
    done();
  });


  it('Testing successful case for [ deleteElasticDocuments ]', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockVersion = 2;
    const result = await elasticSync.deleteElasticDocuments(['MockID1', 'MockID2']);

    expect(result.body.deleted).toEqual(2);
    done();
  });

  it('Testing successful case for [ mimerVersionStarterLimit ]', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    const mimerMockVersionStarter1 = '1.0.0';
    const mimerMockVersionStarter2 = '1.0.4';
    const mimerMockMenu = ['1.0.5', '1.0.0', '0.0.9'];

    await elasticSync.mimerVersionStarterLimit(mimerMockMenu, mimerMockVersionStarter1);
    await elasticSync.mimerVersionStarterLimit(mimerMockMenu, mimerMockVersionStarter2);
    done();
  });

  it('Testing successful case for  [ clearElasticDocuments ] function behaviour no documents removed', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockVersion = 0;
    elasticSync.clearElasticDocuments('MockMSID')
      .then((RES) => {
        done();

        expect(RES.statusCode).toEqual(200);
        expect(RES.msg).toEqual('No documents were removed from ElasticSearch.');
        expect(RES.deleted_count).toEqual(0);
        expect(RES.deleted_elasticsearch_ids).toEqual([]);
      }).catch(() => {
        done.fail();
      });
  });

  it('Testing successful case for  [ clearElasticDocuments ] function behaviour one document removed', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockVersion = 1;
    elasticSync.clearElasticDocuments('MockMSID')
      .then((RES) => {
        done();

        expect(RES.statusCode).toEqual(200);
        expect(RES.message).toEqual('One document was removed from ElasticSearch.');
        expect(RES.deleted_count).toEqual(1);
        expect(RES.deleted_elasticsearch_ids).toEqual(['MockMSID']);
      }).catch(() => {
        done.fail();
      });
  });

  it('Testing successful case for  [ clearElasticDocuments ] function behaviour 2 documents removed', async (done) => {
    const elasticSync = new adp.mimer.MimerElasticSearchSync();
    adp.mockVersion = 2;
    elasticSync.clearElasticDocuments('MockMSID')
      .then((RES) => {
        done();

        expect(RES.statusCode).toEqual(200);
        expect(RES.message).toEqual('2 documents were removed from ElasticSearch.');
        expect(RES.deleted_count).toEqual(2);
        expect(RES.deleted_elasticsearch_ids).toEqual(['MockMSID', 'MockMSID']);
      }).catch(() => {
        done.fail();
      });
  });
});
