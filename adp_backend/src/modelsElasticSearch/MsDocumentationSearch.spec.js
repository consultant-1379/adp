/**
 * Unit test for [ adp.modelsElasticSearch.MSDocumentationSearch ]
 * @author Tirth Pipalia [zpiptir] | Ravikiran G [zgarsri]
 */
const proxyquire = require('proxyquire');

describe('Testing behavior of [ adp.modelsElasticSearch.MsDocumentationSearch ] ', () => {
  class MockElasticSearch {
    search(QUERY, CALLBACK) {
      global.mockExpect.query = QUERY;
      let error = null;
      let result = null;
      switch (global.mockBehavior.MockElasticSearch) {
        case 1:
          result = { body: { hits: {} } };
          CALLBACK(error, result);
          break;
        case 2:
          error = {};
          CALLBACK(error, result);
          break;
        case 3:
          result = require('./MsDocumentationSearchVersion.spec.json');
          CALLBACK(error, result);
          break;
        default:
          result = require('./MsDocumentationSearch.spec.json');
          CALLBACK(error, result);
          break;
      }
    }
  }
  const mockErroLog = (code, desc, data, origin, packName) => {
    global.mockBehavior.ErrorLog.args = {
      code, desc, data, origin, packName,
    };
    return global.mockBehavior.ErrorLog.args;
  };

  beforeEach(() => {
    global.adp = {};
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.MockElasticSearch = 0;
    global.mockBehavior.ErrorLog = {};
    adp.elasticSearch = new MockElasticSearch();

    adp.config = {};
    adp.config.elasticSearchMsDocumentationIndex = 'mockedIndex';

    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.MsDocumentationSearch = proxyquire('./MsDocumentationSearch', {
      './../library/errorLog': mockErroLog,
      './../contentSearch/ESearchClass': MockElasticSearch,
    });
  });

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful simple case with admin user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.MsDocumentationSearch();
    contentSearch.searchDocuments('test')
      .then((RESULT) => {
        const query = global.mockExpect
              && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockedIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('test');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['title', 'raw_text']);
        expect(query.body.query.bool.filter).toBeUndefined();
        expect(query.body._source).toEqual(['asset_name',
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
          'post_new_tab']);

        expect(query.body.collapse).toBeDefined();
        expect(query.body.collapse.field).toBe('post_name.raw');
        expect(query.body.collapse.inner_hits).toBeDefined();
        expect(query.body.collapse.inner_hits.name).toBe('versions');
        expect(query.body.collapse.inner_hits.collapse.field).toBe('version.keyword');
        expect(query.body.collapse.inner_hits.sort.post_name_version_order).toBe('asc');
        expect(query.body.collapse.inner_hits._source).toEqual(['version']);

        expect(query.body.aggs.total_results.cardinality.field).toBeDefined();
        expect(query.body.aggs.total_results.cardinality.field).toBe('post_name.raw');
        expect(query.body.size).toEqual(20);

        expect(RESULT.result.length).toEqual(22);
        expect(RESULT.result[0].inner_hits).toBeDefined();
        expect(RESULT.result[0]._index).toBe('microservice-documentation');
        expect(RESULT.result[0]._source.asset_name).toBeDefined();
        expect(RESULT.result[0]._source.asset_id).toBeDefined();
        expect(RESULT.result[0]._source.asset_slug).toBeDefined();
        expect(RESULT.result[0]._source.post_new_tab).toBeDefined();
        expect(RESULT.result[0]._source.title_slug).toBeDefined();
        expect(RESULT.result[0]._source.category_slug).toBeDefined();
        expect(RESULT.result[0]._source.restricted).toBeDefined();
        expect(RESULT.result[0]._source.post_type).toBeDefined();
        expect(RESULT.result[0]._source.document_url).toBeDefined();
        expect(RESULT.result[0].highlight.raw_text).toBeDefined();
        expect(RESULT.result[0].highlight.title).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Successful simple case with regular user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.MsDocumentationSearch();
    contentSearch.searchDocuments('test', [1, 2])
      .then((RESULT) => {
        const query = global.mockExpect
              && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query.body.query.bool.filter[0].terms.asset_id).toEqual([1, 2]);
        expect(query).toBeDefined();
        expect(query.index).toEqual('mockedIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('test');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['title', 'raw_text']);
        expect(query.body.query.bool.filter).toBeDefined();
        expect(query.body.query.bool.filter[0].terms.asset_id).toEqual([1, 2]);
        expect(query.body._source).toEqual(['asset_name',
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
        ]);

        expect(query.body.collapse).toBeDefined();
        expect(query.body.collapse.field).toBe('post_name.raw');
        expect(query.body.collapse.inner_hits).toBeDefined();
        expect(query.body.collapse.inner_hits.name).toBe('versions');
        expect(query.body.collapse.inner_hits.collapse.field).toBe('version.keyword');
        expect(query.body.collapse.inner_hits.sort.post_name_version_order).toBe('asc');
        expect(query.body.collapse.inner_hits._source).toEqual(['version']);

        expect(query.body.aggs.total_results.cardinality.field).toBeDefined();
        expect(query.body.aggs.total_results.cardinality.field).toBe('post_name.raw');
        expect(query.body.size).toEqual(20);
        expect(RESULT.result.length).toEqual(22);
        expect(RESULT.result[0].inner_hits).toBeDefined();
        expect(RESULT.result[0]._index).toBe('microservice-documentation');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful simple case for version change with title_slug, asse_slug, version', (done) => {
    global.mockBehavior.MockElasticSearch = 3;
    const contentSearch = new adp.modelsElasticSearch.MsDocumentationSearch();
    contentSearch.searchDocuments('test', [], 0, 20, true, 300, 'title_slug', 'asset_slug', 'version')
      .then((RESULT) => {
        const query = global.mockExpect
              && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query.index).toEqual('mockedIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('test');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['title', 'raw_text']);
        expect(query.body.query.bool.must[1].bool.must[0].term).toEqual({ 'asset_slug.keyword': { value: 'asset_slug' } });
        expect(query.body.query.bool.filter[0].term).toEqual({ 'title_slug.keyword': 'title_slug' });
        expect(query.body.query.bool.must[1].bool.filter[0]).toEqual({ term: { 'version.keyword': 'version' } });
        expect(query.body._source).toEqual(['asset_name',
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
        ]);

        expect(RESULT.result.length).toEqual(1);
        expect(RESULT.result[0]._source.asset_name).toBeDefined();
        expect(RESULT.result[0]._source.asset_id).toBeDefined();
        expect(RESULT.result[0]._source.title).toBeDefined();
        expect(RESULT.result[0]._source.title_slug).toBeDefined();
        expect(RESULT.result[0]._source.asset_slug).toBeDefined();
        expect(RESULT.result[0]._source.version).toBeDefined();
        expect(RESULT.result[0]._source.asset_name).toBeDefined();
        expect(RESULT.result[0]._source.document_url).toBeDefined();
        expect(RESULT.result[0]._source.post_type).toBeDefined();
        expect(RESULT.result[0]._source.category).toBeDefined();
        expect(RESULT.result[0].highlight.raw_text).toBeDefined();
        expect(RESULT.result[0].highlight.title).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case when elasticsearch throws error', (done) => {
    global.mockBehavior.MockElasticSearch = 2;
    const contentSearch = new adp.modelsElasticSearch.MsDocumentationSearch();
    contentSearch.searchDocuments('test')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.MsDocumentationSearch');
        expect(ERROR.data).toBeDefined();
        done();
      });
  });

  it('Negative case when elasticsearch provides invalid response', (done) => {
    global.mockBehavior.MockElasticSearch = 1;
    const contentSearch = new adp.modelsElasticSearch.MsDocumentationSearch();
    contentSearch.searchDocuments('test')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error occured due to invalid answer from ElasticSearch');
        expect(ERROR.data).toBeDefined();
        done();
      });
  });
});
