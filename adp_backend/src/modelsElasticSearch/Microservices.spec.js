/**
* Unit test for [ adp.modelsElasticSearch.Microservices ]
* @author Tirth Pipalia [zpiptir]
*/
const proxyquire = require('proxyquire');

describe('Testing behavior of [ adp.modelsElasticSearch.Microservices ] ', () => {
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
        default:
          result = require('./Microservices_Content.spec.json');
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

    adp.echoLog = () => {};

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.MockElasticSearch = 0;
    global.mockBehavior.ErrorLog = {};
    adp.elasticSearch = new MockElasticSearch();

    adp.config = {};
    adp.config.elasticSearchMicroservicesIndex = 'mockIndex';

    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.Microservices = proxyquire('./Microservices', {
      './../library/errorLog': mockErroLog,
      './../contentSearch/ESearchClass': MockElasticSearch,
    });
  });

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful simple case with super admin user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Microservices();
    contentSearch.microserviceSearch('auto')
      .then((RESULT) => {
        const query = global.mockExpect
              && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('auto');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['name', 'based_on', 'description', 'product_number']);
        expect(query.body.query.bool.filter).toBeUndefined();
        expect(query.body._source).toEqual(['name', 'description', 'denorm.asset_document_fullurl', 'denorm.asset_fullurl', 'based_on', 'type', 'slug']);
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

  it('Successful simple case with regular user.', (done) => {
    const contentSearch = new adp.modelsElasticSearch.Microservices();
    contentSearch.microserviceSearch('auto', ['1', '2', '3', 'x-1', 'y-2', 'z-3?'])
      .then((RESULT) => {
        const query = global.mockExpect
          && global.mockExpect.query
          ? global.mockExpect.query
          : undefined;

        expect(query).toBeDefined();
        expect(query.index).toEqual('mockIndex');
        expect(query.body.query.bool.must[0].multi_match.query).toEqual('auto');
        expect(query.body.query.bool.must[0].multi_match.fields).toEqual(['name', 'based_on', 'description', 'product_number']);
        expect(query.body.query.bool.filter.terms.id).toEqual(['1', '2', '3', 'x-1', 'y-2', 'z-3?']);
        expect(query.body._source).toEqual(['name', 'description', 'denorm.asset_document_fullurl', 'denorm.asset_fullurl', 'based_on', 'type', 'slug']);
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

  it('Negative Case if [ microserviceSearch @ adp.elasticSearch ] returns an invalid answer.', (done) => {
    global.mockBehavior.MockElasticSearch = 1;
    const contentSearch = new adp.modelsElasticSearch.Microservices();
    contentSearch.microserviceSearch('auto', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got because got an invalid answer from ElasticSearch');
        done();
      });
  });

  it('Negative Case if [ microserviceSearch @ adp.elasticSearch ] break.', (done) => {
    global.mockBehavior.MockElasticSearch = 2;
    const contentSearch = new adp.modelsElasticSearch.Microservices();
    contentSearch.microserviceSearch('auto', ['1', '2', '3'])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.microservices');
        done();
      });
  });
});
