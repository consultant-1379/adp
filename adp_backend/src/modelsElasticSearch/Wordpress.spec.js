// ============================================================================================= //
/**
* Unit test for [ adp.modelsElasticSearch.Wordpress ]
* @author Armando Dias [zdiaarm] || Ravikiran G [zgarsri] || Tirth Pipalia [zpiptir]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.modelsElasticSearch.Wordpress ] ', () => {
  // =========================================================================================== //


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
          error = 'MockError';
          CALLBACK(error, result);
          break;
        case 3:
          result = require('./Wordpress_RealtimeContentSearch.spec.json');
          CALLBACK(error, result);
          break;
        case 4:
          result = { body: { aggs: { myResult: { buckets: [] } } } };
          CALLBACK(error, result);
          break;
        default:
          result = require('./Wordpress_Content.spec.json');
          CALLBACK(error, result);
          break;
      }
    }
  }


  class MockEchoLog {
    createOne() {
      return new Promise(RES => RES());
    }
  }


  beforeEach(() => {
    global.adp = {};
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.MockElasticSearch = 0;

    adp.elasticSearch = new MockElasticSearch();

    adp.config = {};
    adp.config.elasticSearchWordpressIndex = 'mockIndex';
    adp.config.elasticSearchMicroservicesIndex = 'mockIndex';

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;
    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.Wordpress = require('./Wordpress');
  });


  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });


  it('Successful simple case with super admin user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP')
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['post_title', 'post_content_filtered']);
        expect(query.body.query.bool.filter).toBeUndefined();
        expect(query.body.query.bool.must[1].bool.must_not.match['post_type.raw']).toEqual('post');
        expect(query.body._source).toEqual(['post_id', 'post_title', 'post_name', 'terms', 'post_type']);
        expect(query.body.highlight).toBeDefined();
        expect(query.body.from).toEqual(0);
        expect(query.body.size).toEqual(20);
        expect(RESULT.result[0]._index).toBeDefined();
        expect(RESULT.result[0]._id).toBeDefined();
        expect(RESULT.result[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful simple case with super admin user with selected tab(type).', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP', [], 0, 20, 300, true, 'tutorials')
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['post_title', 'post_content_filtered']);
        expect(query.body.query.bool.must[1].bool.must_not.match['post_type.raw']).toEqual('post');
        expect(query.body.query.bool.filter.term['post_type.raw']).toEqual('tutorials');
        expect(query.body._source).toEqual(['post_id', 'post_title', 'post_name', 'terms', 'post_type']);
        expect(query.body.highlight).toBeDefined();
        expect(query.body.from).toEqual(0);
        expect(query.body.size).toEqual(20);
        expect(RESULT.result[0]._index).toBeDefined();
        expect(RESULT.result[0]._id).toBeDefined();
        expect(RESULT.result[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // Search suggestion mock case 1
  it('Simple case with super admin user for search suggestions using realtimesearch method.', (done) => {
    global.mockBehavior.MockElasticSearch = 3;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.realtimesearch('ADP')
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex,mockIndex');
        expect(query.body.query.bool.must.multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must.multi_match.fields).toEqual(['post_title', 'post_content_filtered', 'name', 'based_on', 'product_number', 'description']);
        expect(query.body.query.bool.must_not.term['post_type.raw']).toEqual('post');
        expect(query.body.query.bool.filter).toBeUndefined();
        expect(query.body.aggs.myResult.terms.field).toEqual('_index');
        expect(query.body.aggs.myResult.aggs.myGroups.terms.field).toEqual('post_type.raw');
        expect(query.body.aggs.myResult.aggs.myGroups.terms.missing).toEqual('microservice');
        expect(query.body.aggs.myResult.terms.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.terms.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.terms.order._key).toEqual('asc');
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits._source).toEqual(['type', 'name', 'slug', 'post_type', 'post_id', 'post_title', 'post_name', 'terms', 'denorm.asset_document_fullurl', 'denorm.asset_fullurl']);
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits.highlight).toBeDefined();
        expect(query.body.size).toEqual(0);
        expect(RESULT.result[0].key).toEqual('page');
        expect(RESULT.result[1].key).toEqual('tutorials');
        expect(RESULT.result[2].key).toEqual('microservice');
        expect(RESULT.result[0].doc_count).toBeDefined();
        expect(RESULT.result[1].doc_count).toBeDefined();
        expect(RESULT.result[2].doc_count).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._index).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._id).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._source).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._index).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._id).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful simple case with regular user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP', ['1', '2', '3'])
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['post_title', 'post_content_filtered']);
        expect(query.body.query.bool.filter.ids.values).toEqual(['1', '2', '3']);
        expect(query.body._source).toEqual(['post_id', 'post_title', 'post_name', 'terms', 'post_type']);
        expect(query.body.query.bool.must[1].bool.must_not.match['post_type.raw']).toEqual('post');
        expect(query.body.highlight).toBeDefined();
        expect(query.body.from).toEqual(0);
        expect(query.body.size).toEqual(20);
        expect(RESULT.result[0]._index).toBeDefined();
        expect(RESULT.result[0]._id).toBeDefined();
        expect(RESULT.result[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful simple case with regular user selecting tab(type)', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP', ['1', '2', '3'], 0, 20, 300, true, 'page')
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['post_title', 'post_content_filtered']);
        expect(query.body.query.bool.filter.ids.values).toEqual(['1', '2', '3']);
        expect(query.body._source).toEqual(['post_id', 'post_title', 'post_name', 'terms', 'post_type']);
        expect(query.body.query.bool.must[1].bool.must_not.match['post_type.raw']).toEqual('post');
        expect(query.body.query.bool.must[1].bool.filter.term['post_type.raw']).toEqual('page');
        expect(query.body.highlight).toBeDefined();
        expect(query.body.from).toEqual(0);
        expect(query.body.size).toEqual(20);
        expect(RESULT.result[0]._index).toBeDefined();
        expect(RESULT.result[0]._id).toBeDefined();
        expect(RESULT.result[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // search suggestion box for regular user test case
  it('Sucessfully show the suggestions case with respect to regular user.', (done) => {
    global.mockBehavior.MockElasticSearch = 3;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.realtimesearch('ADP', ['1ss', '2', '3sd'])
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex,mockIndex');
        expect(query.body.query.bool.must.multi_match.query).toEqual('ADP');
        expect(query.body.query.bool.must.multi_match.fields).toEqual(['post_title', 'post_content_filtered', 'name', 'based_on', 'product_number', 'description']);
        expect(query.body.query.bool.must_not.term['post_type.raw']).toEqual('post');
        expect(query.body.query.bool.filter.bool.should[0].term.id).toEqual('1ss');
        expect(query.body.query.bool.filter.bool.should[1].term._id).toEqual('2');
        expect(query.body.query.bool.filter.bool.should[2].term.id).toEqual('3sd');
        expect(query.body.aggs.myResult.terms.field).toEqual('_index');
        expect(query.body.aggs.myResult.aggs.myGroups.terms.field).toEqual('post_type.raw');
        expect(query.body.aggs.myResult.aggs.myGroups.terms.missing).toEqual('microservice');
        expect(query.body.aggs.myResult.terms.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.terms.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits.size).toEqual(4);
        expect(query.body.aggs.myResult.aggs.myGroups.terms.order._key).toEqual('asc');
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits._source).toEqual(['type', 'name', 'slug', 'post_type', 'post_id', 'post_title', 'post_name', 'terms', 'denorm.asset_document_fullurl', 'denorm.asset_fullurl']);
        expect(query.body.aggs.myResult.aggs.myGroups.aggs.top.top_hits.highlight).toBeDefined();
        expect(query.body.size).toEqual(0);
        expect(RESULT.result[0].key).toEqual('page');
        expect(RESULT.result[1].key).toEqual('tutorials');
        expect(RESULT.result[2].key).toEqual('microservice');
        expect(RESULT.result[0].doc_count).toBeDefined();
        expect(RESULT.result[1].doc_count).toBeDefined();
        expect(RESULT.result[2].doc_count).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._index).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._id).toBeDefined();
        expect(RESULT.result[0].top.hits.hits[0]._source).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._index).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._id).toBeDefined();
        expect(RESULT.result[2].top.hits.hits[0]._source).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // search suggestion box negative test case
  it('Negative Case if realtime search returns an invalid answer.', (done) => {
    global.mockBehavior.MockElasticSearch = 4;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.realtimesearch('ADP', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got because got an invalid answer from ElasticSearch');
        done();
      });
  });

  it('Negative Case if [ search @ adp.elasticSearch ] returns an invalid answer.', (done) => {
    global.mockBehavior.MockElasticSearch = 1;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got because got an invalid answer from ElasticSearch');
        done();
      });
  });

  // search suggestion box negative test case
  it('Negative Case if realtime search break.', (done) => {
    global.mockBehavior.MockElasticSearch = 2;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.realtimesearch('ADP', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.wordpress');
        done();
      });
  });

  it('Negative Case if [ search @ adp.elasticSearch ] break.', (done) => {
    global.mockBehavior.MockElasticSearch = 2;
    const contentSearch = new adp.modelsElasticSearch.Wordpress();
    contentSearch.searchWordpress('ADP', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.wordpress');
        done();
      });
  });
  // =========================================================================================== //
});
