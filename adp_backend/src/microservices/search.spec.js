const { search, inMemorySearch, rbacPermissions } = require('./search');

/**
* Unit test for [ global.adp.search ]
* @author Cein
*/

describe('Testing results of [ global.adp.search ] ', () => {
  class mockAdpModel {
    msSearch(
      filters,
      sortBeforeGrouping,
      groupByKey,
      sortAfterGrouping,
      skip,
      limit,
      removePrivateKeys,
      getAllAttributes,
    ) {
      return new Promise((resolve, reject) => {
        global.adp.models.testObj.givenParams = {
          filters,
          sortBeforeGrouping,
          groupByKey,
          sortAfterGrouping,
          skip,
          limit,
          removePrivateKeys,
          getAllAttributes,
        };
        if (global.adp.models.testObj.res) {
          resolve(global.adp.models.testObj.resp);
        } else {
          reject(global.adp.models.testObj.resp);
        }
      });
    }
  }

  const mockSchema = {
    search_test: {
      searchIndexable: true,
    },
    search_nested_test: {
      items: {
        properties: {
          nested_item: {
            searchIndexable: true,
          },
        },
      },
    },
    search_nested_items_only_test: {
      items: {
        searchIndexable: true,
      },
    },
    search_lookup_standard_test: {
      searchableLookupKeys: ['search_lookup_test1', 'search_lookup_test2'],
    },
    search_lookup_denorm_test: {
      searchableLookupKeys: ['denorm.search_lookup_test1', 'denorm.search_lookup_test2'],
    },
    sort_item_test: {
      sortableKey: 'test_item',
    },
    empty: {},
    group_and_sort_test: {
      groupable: true,
      sortableKey: 'group_and_sort_test',
    },
    filter_test1: {},
    filter_test2: {},
  };

  beforeAll(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;

    global.adp.models = {};
    global.adp.models.Adp = mockAdpModel;

    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {};

    global.adp.microservices = {};
    global.adp.microservices.checkIfDontHaveInSchema = key => !(key === 'filter_test1' || key === 'filter_test2');

    global.adp.microservices.search = search;
  });

  beforeEach(() => {
    global.adp.models.testObj = {
      res: true,
      resp: { docs: [] },
      givenParams: {},
    };

    global.adp.config.schema.microservice.properties = mockSchema;
  });

  afterAll(() => {
    global.adp = null;
  });

  it('Should generate all possible combination of successful pipelines besides the in memory search.', (done) => {
    const page = 2;
    const sortLookup = 'sort_item_test';

    const expectedFilterGroup1 = [1, 2];
    const expectedFilterGroup2 = [3, 4];

    const expectedSortGroup = 'group_and_sort_test';
    const expectedLimit = 10;

    const query = {
      sort: `-${sortLookup},${expectedSortGroup}`,
      groupby: 'group_and_sort_test',
      filter_test1: `${expectedFilterGroup1[0]},${expectedFilterGroup1[1]}`,
      filter_test2: `${expectedFilterGroup2[0]},${expectedFilterGroup2[1]}`,
      page: `${page}`,
      limit: `${expectedLimit}`,
    };

    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query,
      headers: {
        'x-prune-microservice': 'off',
      },
    };

    global.adp.microservices.search(mockRequest)
      .then(() => {
        const {
          filters, sortBeforeGrouping, groupByKey, sortAfterGrouping, skip, limit,
        } = global.adp.models.testObj.givenParams;

        const filterOr1Arr = filters[0].$or;
        const filterOr2Arr = filters[1].$or;

        expect(filters.length).toBe(2);
        expect(filterOr1Arr.length).toBe(2);
        expect(filterOr1Arr[0].filter_test1).toBe(expectedFilterGroup1[0]);
        expect(filterOr1Arr[1].filter_test1).toBe(expectedFilterGroup1[1]);
        expect(filterOr2Arr.length).toBe(2);
        expect(filterOr2Arr[0].filter_test2).toBe(expectedFilterGroup2[0]);
        expect(filterOr2Arr[1].filter_test2).toBe(expectedFilterGroup2[1]);

        expect(sortBeforeGrouping[mockSchema[sortLookup].sortableKey]).toBeDefined();
        expect(sortBeforeGrouping[mockSchema[sortLookup].sortableKey]).toBe(-1);


        expect(groupByKey).toBe(query.groupby);

        expect(sortAfterGrouping[`microservices.${expectedSortGroup}`]).toBeDefined();
        expect(sortAfterGrouping[`microservices.${expectedSortGroup}`]).toBe(1);

        expect(skip).toBe(expectedLimit);
        expect(limit).toBe(expectedLimit);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should return all possible in memory search matches related to word order, full ms match, partial words, case sensitivity.', async (done) => {
    const searchFullWord = 'fullword';
    const searchPartialWord = 'part';
    const searchCaseSentitive = 'CAP';
    const searchStr = `${searchFullWord} ${searchPartialWord} ${searchCaseSentitive}`;

    const matchStandard = {
      name: 'matchStandard',
      search_test: `${searchPartialWord}ial test sentence ${searchCaseSentitive.toUpperCase()} test sentence, ${searchFullWord}`,
    };
    const matchOverKeys = {
      name: 'matchOverKeys',
      search_nested_items_only_test: `test sentence ${searchCaseSentitive.toLowerCase()} test sentence`,
      search_nested_test: { nested_item: `test sentence ${searchPartialWord}ial test sentence ${searchFullWord}` },
      notSearchableKey: 'test',
    };
    const matchWithDefinedSchemaKeys = {
      name: 'matchWithDefinedSchemaKeys',
      search_lookup_standard_test: {
        search_lookup_test1: `test sentence ${searchCaseSentitive.toUpperCase()} test sentence`,
        search_lookup_test2: 'Non matching string',
      },
      denorm: {
        search_lookup_test1: `test sentence ${searchPartialWord}ial test sentence`,
        search_lookup_test2: searchFullWord,
        notSearchableKey: 'test',
      },
      notSearchableKey: 'test',
    };
    const nonMatchAllSearchTermsNotPresent = {
      name: 'nonMatchAllSearchTermsNotPresent',
      search_nested_test: { nested_item: `test sentence ${searchPartialWord} test sentence ${searchFullWord}` },
      search_lookup_test1: 'test',
    };
    const nonMatch = {
      name: 'nonMatch',
      search_test: 'test',
    };

    const group1 = {
      microservices: [matchStandard, matchOverKeys, nonMatchAllSearchTermsNotPresent], total: 3,
    };
    const group2 = { microservices: [matchWithDefinedSchemaKeys, nonMatch], total: 2 };
    const group3 = { microservices: [nonMatch], total: 1 };

    global.adp.models.testObj.resp.docs = [group1, group2, group3];

    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: { search: searchStr },
      headers: {
        'x-prune-microservice': 'off',
      },
    };

    const result = await global.adp.microservices.search(mockRequest);
    const groupResults = result.data.docs;

    expect(result.total).toBe(3);
    expect(groupResults.length).toBe(2);
    expect(groupResults[0].total).toBe(2);
    expect(groupResults[0].microservices[0].name).toBe(matchStandard.name);
    expect(groupResults[0].microservices[1].name).toBe(matchOverKeys.name);
    expect(groupResults[1].total).toBe(1);
    expect(groupResults[1].microservices[0].name).toBe(matchWithDefinedSchemaKeys.name);

    done();
  });

  it('Should reject if the model query fails.', (done) => {
    global.adp.models.testObj.res = false;

    global.adp.microservices.search({ headers: { 'x-prune-microservice': 'off' } }).then(() => {
      expect(true).toBeFalsy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('Should return a 400 error if a search term only contains some illegal punctuation.', (done) => {
    const searchTerm = '!%*^#"';
    const data = [{
      microservices: [{ search_test: searchTerm }],
      total: 1,
    }];
    global.adp.models.testObj.resp.docs = data;

    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: { search: searchTerm },
      headers: {
        'x-prune-microservice': 'off',
      },
    };

    global.adp.microservices.search(mockRequest).then(() => {
      expect(true).toBeFalsy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('Should reject if the sort keys does not exist to the schema.', (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: { sort: '-not_sortable1,not_sortable2' },
      headers: {
        'x-prune-microservice': 'off',
      },
    };
    global.adp.microservices.search(mockRequest).then(() => {
      expect(true).toBeFalsy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('Should reject if the groupby key does not exist to the schema.', (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: { groupby: 'not_a_group' },
      headers: {
        'x-prune-microservice': 'off',
      },
    };
    global.adp.microservices.search(mockRequest).then(() => {
      expect(true).toBeFalsy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('Should reject if the filter key does not exist to the schema.', (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: { not_a_filter: '1,2' },
      headers: {
        'x-prune-microservice': 'off',
      },
    };
    global.adp.microservices.search(mockRequest).then(() => {
      expect(true).toBeFalsy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('inMemorySearch: Should return a 500 error if dbDocData is empty.', (done) => {
    global.adp.config.schema.microservice.properties = {};
    const result = inMemorySearch(['test'], '');

    expect(result.errors[0].code).toBe(500);
    done();
  });

  it('[ rbacPermissions ] Behavior if the user is admin.', (done) => {
    const signum = 'esupuse';
    const rbac = { esupuse: { admin: true } };
    const pipeline = {};

    rbacPermissions(signum, rbac, pipeline);

    expect(pipeline).toEqual({ filters: [] });
    done();
  });

  it('[ rbacPermissions ] Behavior if the user is not admin.', (done) => {
    const signum = 'emesuse';
    const rbac = { emesuse: { admin: false, allowed: { assets: ['mockAssetID'] } } };
    const pipeline = {};

    rbacPermissions(signum, rbac, pipeline);

    expect(pipeline).toEqual({ filters: [{ $and: [{ _id: { $in: ['mockAssetID'] } }] }] });
    done();
  });
});
