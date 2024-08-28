const proxyquire = require('proxyquire');

/**
* Unit test for [ adp.modelsElasticSearch.MicroserviceDocumentation ]
* @author Michael Coughlan [zmiccou]
*/
describe('Testing behaviour of [ adp.modelsElasticSearch.MicroserviceDocumentation', () => {
  class MockEchoLog {
    createOne() {
      return Promise.resolve();
    }
  }

  class MockElasticSearch {
    bulk() {
      return new Promise((resolve, reject) => {
        switch (global.mockBehaviour.bulk) {
          case 0:
            resolve({
              errors: true,
              items: [
                {
                  index: {
                    _index: 'mocked-index',
                    type: '_doc',
                    _id: '1',
                    _version: 1,
                    result: 'created',
                    forced_refresh: false,
                    status: 500,
                    error: {
                      type: 'A mocked error',
                      reason: 'Mocked result',
                      index_uuid: 'mocked-error',
                      shard: 'mocked-shared',
                      index: 'mocked-index',
                    },
                  },
                },
              ],
            });

            break;
          case 1:
            resolve({
              items: [
                {
                  index: {
                    _index: 'mocked-index',
                    type: '_doc',
                    _id: '1',
                    _version: 1,
                    result: 'created',
                    status: 201,
                  },
                },
              ],
            });
            break;
          case 2:
            resolve({
              items: [
                {
                  update: {
                    _index: 'mocked-index',
                    _type: '_doc',
                    _id: '103',
                    _version: 3,
                    result: 'noop',
                    _shards: {
                      total: 2,
                      successful: 1,
                      failed: 0,
                    },
                    _seq_no: 5,
                    _primary_term: 1,
                    status: 200,
                  },
                },
                {
                  update: {
                    _index: 'mocked-index',
                    _type: '_doc',
                    _id: '101',
                    _version: 3,
                    result: 'noop',
                    _shards: {
                      total: 2,
                      successful: 1,
                      failed: 0,
                    },
                    _seq_no: 4,
                    _primary_term: 1,
                    status: 200,
                  },
                },
              ],
            });
            break;
          case 3:
            resolve({
              errors: true,
              items: [
                {
                  update: {
                    _index: 'mocked-index',
                    _type: '_doc',
                    _id: '1',
                    status: 404,
                    error: {
                      type: 'document_missing_exception',
                      reason: '[_doc][1]: document missing',
                      index_uuid: '1zQkJf1YRTiyJrBXled2CA',
                      shard: '0',
                      index: 'mocked-index',
                    },
                  },
                },
                {
                  update: {
                    _index: 'mocked-index',
                    _type: '_doc',
                    _id: '111',
                    status: 404,
                    error: {
                      type: 'document_missing_exception',
                      reason: '[_doc][111]: document missing',
                      index_uuid: '1zQkJf1YRTiyJrBXled2CA',
                      shard: '0',
                      index: 'mocked-index',
                    },
                  },
                },
              ],
            });
            break;
          case 4:
            reject();
            break;
          default:
            break;
        }
      });
    }

    deleteByQuery(esObject, callback) {
      global.mockExpect.query = esObject;

      switch (global.mockBehaviour.deleteByQuery) {
        case 0:
          callback({
            meta: {
              statusCode: 500,
            },
            message: 'An error occurred in the deleteByQuery function',
          }, null);

          break;
        case 1:
          callback(null, {
            body: {
              hits: {
                hits: [
                  {
                    _source: {
                      id: '1',
                    },
                  }, {
                    _source: {
                      id: '2',
                    },
                  }, {
                    _source: {
                      id: '3',
                    },
                  },
                ],
              },
            },
          });

          break;
        default:
          break;
      }
    }

    index() {
      return new Promise((resolve, reject) => {
        switch (global.mockBehaviour.index) {
          case 0:
            resolve({
              statusCode: 200,
            });
            break;
          case 1:
            resolve({});
            break;
          case 2:
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              statusCode: 500,
              message: 'An internal error occurred when creating the document index',
            });
            break;
          default:
            break;
        }
      });
    }

    search(esObject, callback) {
      global.mockExpect.query = esObject;

      switch (global.mockBehaviour.search) {
        case 0:
          callback({
            message: 'Error on this.elasticSearch.search',
            meta: {
              statusCode: 500,
            },
          }, null);
          break;
        case 1:
          callback(null, {
            body: {
              hits: {
                hits: [],
              },
            },
          });
          break;
        case 2:
          callback(null, {
            body: {
              hits: {
                hits: [
                  {
                    _source: {
                      id: '1',
                    },
                  }, {
                    _source: {
                      id: '2',
                    },
                  }, {
                    _source: {
                      id: '3',
                    },
                  },
                ],
              },
            },
          });
          break;
        case 3:
          callback(null, { body: {} });
          break;
        case 4:
          callback('MockError', null);
          break;
        default:
          break;
      }
    }

    get indices() {
      return {
        exists: () => {
          if (global.mockBehaviour.indices.exists.res) {
            return Promise.resolve(global.mockBehaviour.indices.exists.data);
          }
          return Promise.reject(global.mockBehaviour.indices.exists.data);
        },
        create: () => {
          if (global.mockBehaviour.indices.create.res) {
            return Promise.resolve(global.mockBehaviour.indices.create.data);
          }
          return Promise.reject(global.mockBehaviour.indices.create.data);
        },
      };
    }
  }

  class MockElasticSearchIndices {
    refresh() {
      return new Promise((resolve, reject) => {
        switch (global.mockBehaviour.refresh) {
          case 0:
            resolve({
              statusCode: 200,
            });
            break;
          case 1:
            resolve({});
            break;
          case 2:
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              statusCode: 500,
              message: 'An internal error occurred when refreshing the index',
            });
            break;
          default:
            break;
        }
      });
    }
  }

  beforeEach(() => {
    global.adp = {};

    global.mockExpect = {};
    global.mockBehaviour = {};
    global.mockBehaviour.bulk = 0;
    global.mockBehaviour.deleteByQuery = 0;
    global.mockBehaviour.index = 0;
    global.mockBehaviour.refresh = 0;
    global.mockBehaviour.search = 0;
    global.mockBehaviour.indices = {
      exists: {
        res: true,
        data: {
          statusCode: 200,
        },
      },
      create: {
        res: true,
        data: 'Created',
      },
    };

    global.mockResult = {};

    adp = {};

    adp.config = {};
    adp.config.elasticSearchMsDocumentationIndex = 'microservice-documentation';

    adp.echoLog = () => {};

    adp.elasticSearch = new MockElasticSearch();
    adp.elasticSearch.indices = new MockElasticSearchIndices();

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    adp.modelsElasticSearch = {};
    const MicroserviceDocumentation = proxyquire('./MicroserviceDocumentation', {
      '../library/errorLog': (code, desc, data, origin, packName) => ({
        code, desc, data, origin, packName,
      }),
    });

    adp.modelsElasticSearch.MicroserviceDocumentation = new MicroserviceDocumentation();
  });

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  describe('verifyIndex', () => {
    // it('should resolve successfully if index exists', (done) => {
    //   adp.modelsElasticSearch.MicroserviceDocumentation.verifyIndex().then((resp) => {
    //     expect(resp.statusCode).toBe(200);
    //     done();
    //   }).catch(() => {
    //     done.fail();
    //   });
    // });

    // it('should resolve successfully if the index does not exist but creates successfully result'
    // , (done) => {
    //   global.mockBehaviour.indices.exists.data.statusCode = 404;
    //   adp.modelsElasticSearch.MicroserviceDocumentation.verifyIndex().then((resp) => {
    //     expect(resp).toBe('Created');
    //     done();
    //   }).catch(() => {
    //     done.fail();
    //   });
    // });

    it('should reject if the indices.exists rejects', (done) => {
      global.mockBehaviour.indices.exists.res = false;
      global.mockBehaviour.indices.exists.data = 'testError';
      adp.modelsElasticSearch.MicroserviceDocumentation.verifyIndex().then(() => {
        done.fail();
      }).catch((err) => {
        expect(err).toBe('testError');
        done();
      });
    });

    it('should reject if the index does not exist and the create rejects', (done) => {
      global.mockBehaviour.indices.exists.data.statusCode = 404;
      global.mockBehaviour.indices.create.res = false;
      global.mockBehaviour.indices.create.data = 'testError';
      adp.modelsElasticSearch.MicroserviceDocumentation.verifyIndex().then(() => {
        done.fail();
      }).catch((err) => {
        expect(err).toBe('testError');
        done();
      });
    });

    it('should reject if exists statusCode is not 200 or 404', (done) => {
      global.mockBehaviour.indices.exists.data.statusCode = 500;
      adp.modelsElasticSearch.MicroserviceDocumentation.verifyIndex().then(() => {
        done.fail();
      }).catch((err) => {
        expect(err.data.error.statusCode).toBe(500);
        done();
      });
    });
  });

  // describe('findDocumentsByAssetId', () => {
  //   it('should return a 400 error if an array is not provided', (done) => {
  //     adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentsByAssetId('test-id')
  //       .then(() => done.fail())
  //       .catch((error) => {
  //         expect(error).toEqual({
  //           code: 400,
  //           desc: 'You must provide an array of IDs',
  //           data: null,
  //           origin: 'findDocumentsByAssetId',
  //           packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
  //         });

  //         done();
  //       });
  //   });

  //   it('should return a 400 error if an empty array is provided', (done) => {
  //     adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentsByAssetId([])
  //       .then(() => done.fail())
  //       .catch((error) => {
  //         expect(error).toEqual({
  //           code: 400,
  //           desc: 'You must supply at least one ID',
  //           data: null,
  //           origin: 'findDocumentsByAssetId',
  //           packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
  //         });

  //         done();
  //       });
  //   });

  //   it('should return an error if there were
  //  problems in the ElasticSearch search class', (done) => {
  //     adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentsByAssetId(['test-id'])
  //       .then(() => done.fail())
  //       .catch((error) => {
  //         expect(error).toEqual({
  //           code: 500,
  //           desc: 'Error on this.elasticSearch.search',
  //           data: {
  //             error: { message: 'Error on this.elasticSearch.search',
  //   meta: { statusCode: 500 } },
  //             index: 'microservice-documentation',
  //             assetIds: ['test-id'],
  //           },
  //           origin: 'findDocumentsByAssetId',
  //           packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
  //         });

  //         done();
  //       });
  //   });

  //   it('should return an empty array if no documents were found', (done) => {
  //     global.mockBehaviour.search = 1;

  //     adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentsByAssetId(['test-id'])
  //       .then((response) => {
  //         expect(response.length).toBe(0);

  //         done();
  //       })
  //       .catch(() => done.fail());
  //   });

  //   it('should return the documents as an array if they were found with an asset id', (done) => {
  //     global.mockBehaviour.search = 2;

  //     adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentsByAssetId(['test-id'])
  //       .then((response) => {
  //         expect(response.length).toBe(3);

  //         done();
  //       })
  //       .catch(() => done.fail());
  //   });
  // });

  describe('createDocuments', () => {
    it('should respond with a 400 error if an array isn\'t provided', (done) => {
      adp.modelsElasticSearch.MicroserviceDocumentation.createDocuments({})
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            code: 400,
            desc: 'You must provide an array of IDs',
            data: null,
            origin: 'createDocuments',
            packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
          });

          done();
        });
    });

    it('should respond with a 400 error if an empty array is provided', (done) => {
      adp.modelsElasticSearch.MicroserviceDocumentation.createDocuments([])
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            code: 400,
            desc: 'You must supply at least one ID',
            data: null,
            origin: 'createDocuments',
            packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
          });

          done();
        });
    });

    it('should correctly handle an error in the ElasticSearch class on creation', (done) => {
      global.mockBehaviour.bulk = 0;

      adp.modelsElasticSearch.MicroserviceDocumentation.createDocuments([{ _id: 'mocked-id', fieldA: 'mocked-field' }])
        .then(() => done.fail())
        .catch((error) => {
          expect(error[0]).toEqual({
            status: 500,
            error: {
              type: 'A mocked error',
              reason: 'Mocked result',
              index_uuid: 'mocked-error',
              shard: 'mocked-shared',
              index: 'mocked-index',
            },
            operation: { index: { _index: 'microservice-documentation' } },
            document: { _id: 'mocked-id', fieldA: 'mocked-field' },
          });

          done();
        });
    });

    it('should successfully add a microservice document to the index', (done) => {
      global.mockBehaviour.bulk = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.createDocuments([{ _id: 'mocked-id', fieldA: 'mocked-field' }])
        .then((response) => {
          expect(response).toEqual({
            items: [
              {
                index: {
                  _index: 'mocked-index',
                  type: '_doc',
                  _id: '1',
                  _version: 1,
                  result: 'created',
                  status: 201,
                },
              },
            ],
          });

          done();
        })
        .catch(() => done.fail());
    });

    it('Negative case if createDocuments() breaks', (done) => {
      global.mockBehaviour.bulk = 4;

      adp.modelsElasticSearch.MicroserviceDocumentation.createDocuments([{ _id: 'mocked-id', fieldA: 'mocked-field' }])
        .then(() => done.fail())
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.desc).toEqual('Error got on trying to createDocuments in Elasticsearch');
          done();
        });
    });
  });

  describe('removeDocuments', () => {
    it('should return a validation error if we don\'t provide an array for deletion', (done) => {
      const ids = '1';

      adp.modelsElasticSearch.MicroserviceDocumentation.removeDocuments(ids)
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            code: 400,
            desc: 'You must provide an array of IDs',
            data: null,
            origin: 'removeDocuments',
            packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
          });

          done();
        });
    });

    it('should return a validation error if the array we provide is empty', (done) => {
      const ids = [];

      adp.modelsElasticSearch.MicroserviceDocumentation.removeDocuments(ids)
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            code: 400,
            desc: 'You must supply at least one ID',
            data: null,
            origin: 'removeDocuments',
            packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
          });

          done();
        });
    });

    it('should correctly handle an error in the ElasticSearch class on deletion', (done) => {
      const ids = ['1', '2', '3'];

      adp.modelsElasticSearch.MicroserviceDocumentation.removeDocuments(ids)
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            meta: { statusCode: 500 },
            message: 'An error occurred in the deleteByQuery function',
          });

          done();
        });
    });

    it('should return hits from ElasticSearch', (done) => {
      const ids = ['1', '2', '3'];
      global.mockBehaviour.deleteByQuery = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.removeDocuments(ids)
        .then((response) => {
          expect(response).toEqual({
            body: {
              hits: {
                hits: [
                  {
                    _source: {
                      id: '1',
                    },
                  }, {
                    _source: {
                      id: '2',
                    },
                  }, {
                    _source: {
                      id: '3',
                    },
                  },
                ],
              },
            },
          });

          done();
        })
        .catch(() => done.fail());
    });
  });

  describe('updateDocument', () => {
    it('Successfully update multiple/single document in ElasticSearch using bullk API', (done) => {
      global.mockBehaviour.bulk = 2;
      const payLoad = [
        { update: { _index: 'mocked-index', _id: '103' } },
        { doc: { mocked_key: 'mocked-field' } },
        { update: { _index: 'mocked-index', _id: '101' } },
        { doc: { mocked_key: 'mocked-field' } },
      ];
      adp.modelsElasticSearch.MicroserviceDocumentation.updateDocument(payLoad)
        .then((RESULT) => {
          expect(RESULT).toEqual({
            items: [
              {
                update: {
                  _index: 'mocked-index',
                  _type: '_doc',
                  _id: '103',
                  _version: 3,
                  result: 'noop',
                  _shards: {
                    total: 2,
                    successful: 1,
                    failed: 0,
                  },
                  _seq_no: 5,
                  _primary_term: 1,
                  status: 200,
                },
              },
              {
                update: {
                  _index: 'mocked-index',
                  _type: '_doc',
                  _id: '101',
                  _version: 3,
                  result: 'noop',
                  _shards: {
                    total: 2,
                    successful: 1,
                    failed: 0,
                  },
                  _seq_no: 4,
                  _primary_term: 1,
                  status: 200,
                },
              },
            ],
          });
          done();
        })
        .catch(() => done.fail());
    });

    it('should correctly throw an error response from ElasticSearch if incorrect _id is provided', (done) => {
      global.mockBehaviour.bulk = 3;
      const payLoad = [
        { update: { _index: 'mocked-indexx', _id: '1' } },
        { doc: { mocked_key: 'mocked-field' } },
        { update: { _index: 'mocked-index', _id: '111' } },
        { doc: { mocked_key: 'mocked-field' } },
      ];
      adp.modelsElasticSearch.MicroserviceDocumentation.updateDocument(payLoad)
        .then(() => done.fail())
        .catch((ERROR) => {
          expect(ERROR.errors).toEqual(true);
          expect(ERROR.items).toEqual(
            [
              {
                update: {
                  _index: 'mocked-index',
                  _type: '_doc',
                  _id: '1',
                  status: 404,
                  error: {
                    type: 'document_missing_exception',
                    reason: '[_doc][1]: document missing',
                    index_uuid: '1zQkJf1YRTiyJrBXled2CA',
                    shard: '0',
                    index: 'mocked-index',
                  },
                },
              },
              {
                update: {
                  _index: 'mocked-index',
                  _type: '_doc',
                  _id: '111',
                  status: 404,
                  error: {
                    type: 'document_missing_exception',
                    reason: '[_doc][111]: document missing',
                    index_uuid: '1zQkJf1YRTiyJrBXled2CA',
                    shard: '0',
                    index: 'mocked-index',
                  },
                },
              },
            ],
          );
          done();
        });
    });

    it('Negative case if updateDocument() breaks', (done) => {
      global.mockBehaviour.bulk = 4;
      adp.modelsElasticSearch.MicroserviceDocumentation.updateDocument('payLoad')
        .then(() => done.fail())
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.desc).toEqual('Error got on trying to updateDocument in Elasticsearch');
          done();
        });
    });
  });

  describe('findAllDocuments', () => {
    it('Successful simple case with super admin user for findAllDocuments.', (done) => {
      global.mockBehaviour.search = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.findAllDocuments()
        .then((RESULT) => {
          const query = global.mockExpect
        && global.mockExpect.query
            ? global.mockExpect.query
            : undefined;

          expect(query).toBeDefined();
          expect(query.index).toEqual('microservice-documentation');
          expect(query.body.query.bool).toBeDefined();
          expect(query.body.query.bool.filter).toBeUndefined();
          expect(query.body.from).toEqual(0);
          expect(query.body.size).toEqual(20);
          expect(RESULT.result).toBeDefined();
          done();
        })
        .catch(() => done.fail());
    });

    it('Successful simple case with regular user for findAllDocuments.', (done) => {
      global.mockBehaviour.search = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.findAllDocuments(['1m', '2', '5'])
        .then((RESULT) => {
          const query = global.mockExpect
        && global.mockExpect.query
            ? global.mockExpect.query
            : undefined;

          expect(query).toBeDefined();
          expect(query.index).toEqual('microservice-documentation');
          expect(query.body.query.bool).toBeDefined();
          expect(query.body.query.bool.filter).toBeDefined();
          expect(query.body.query.bool.filter.ids.values[0]).toEqual('1m');
          expect(query.body.query.bool.filter.ids.values[1]).toEqual('2');
          expect(query.body.query.bool.filter.ids.values[2]).toEqual('5');
          expect(query.body.from).toEqual(0);
          expect(query.body.size).toEqual(20);
          expect(RESULT.result).toBeDefined();
          done();
        })
        .catch(() => done.fail());
    });

    it('Negative Case if [ findAllDocuments @ adp.elasticSearch ] returns an invalid answer.', (done) => {
      global.mockBehaviour.search = 4;
      adp.modelsElasticSearch.MicroserviceDocumentation.findAllDocuments()
        .then(() => {
          done.fail();
        })
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.origin).toEqual('findAllDocuments');
          expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.MicroserviceDocumentation');
          done();
        });
    });

    it('Negative Case if [ findAllDocuments @ adp.elasticSearch ] break.', (done) => {
      global.mockBehaviour.search = 3;
      adp.modelsElasticSearch.MicroserviceDocumentation.findAllDocuments()
        .then(() => {
          done.fail();
        })
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.origin).toEqual('findAllDocuments');
          expect(ERROR.desc).toEqual('Error got because got an invalid answer from ElasticSearch');
          done();
        });
    });
  });

  describe('findDocumentById', () => {
    it('Successful simple case with super admin user for findDocumentById.', (done) => {
      global.mockBehaviour.search = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentByIds(['ad', 'ad3', '12'])
        .then((RESULT) => {
          const query = global.mockExpect
        && global.mockExpect.query
            ? global.mockExpect.query
            : undefined;

          expect(query).toBeDefined();
          expect(query.index).toEqual('microservice-documentation');
          expect(query.body.query.bool.must).toBeDefined();
          expect(query.body.query.bool.must[0].terms._id[0]).toEqual('ad');
          expect(query.body.query.bool.must[0].terms._id[1]).toEqual('ad3');
          expect(query.body.query.bool.must[0].terms._id[2]).toEqual('12');
          expect(query.body.query.bool.filter).toBeUndefined();
          expect(query.body.from).toEqual(0);
          expect(query.body.size).toEqual(20);
          expect(RESULT.result).toBeDefined();
          done();
        })
        .catch(() => done.fail());
    });

    it('Successful simple case with regular user for findDocumentById.', (done) => {
      global.mockBehaviour.search = 1;

      adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentByIds(['ad', 'ad3', '12'], ['m2', '4', 6])
        .then((RESULT) => {
          const query = global.mockExpect
        && global.mockExpect.query
            ? global.mockExpect.query
            : undefined;

          expect(query).toBeDefined();
          expect(query.index).toEqual('microservice-documentation');
          expect(query.body.query.bool.must).toBeDefined();
          expect(query.body.query.bool.must[0].terms._id[0]).toEqual('ad');
          expect(query.body.query.bool.must[0].terms._id[1]).toEqual('ad3');
          expect(query.body.query.bool.must[0].terms._id[2]).toEqual('12');
          expect(query.body.query.bool.filter).toBeDefined();
          expect(query.body.query.bool.filter.ids.values[0]).toEqual('m2');
          expect(query.body.query.bool.filter.ids.values[1]).toEqual('4');
          expect(query.body.query.bool.filter.ids.values[2]).toEqual(6);
          expect(query.body.from).toEqual(0);
          expect(query.body.size).toEqual(20);
          expect(RESULT.result).toBeDefined();
          done();
        })
        .catch(() => done.fail());
    });

    it('Negative Case if [ findDocumentById @ adp.elasticSearch ] returns an invalid answer.', (done) => {
      global.mockBehaviour.search = 4;
      adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentByIds()
        .then(() => {
          done.fail();
        })
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.origin).toEqual('findDocumentById');
          expect(ERROR.desc).toEqual('Error got on adp.modelsElasticSearch.MicroserviceDocumentation');
          done();
        });
    });

    it('Negative Case if [ findDocumentById @ adp.elasticSearch ] break.', (done) => {
      global.mockBehaviour.search = 3;
      adp.modelsElasticSearch.MicroserviceDocumentation.findDocumentByIds()
        .then(() => {
          done.fail();
        })
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.origin).toEqual('findDocumentById');
          expect(ERROR.desc).toEqual('Error got because got an invalid answer from ElasticSearch');
          done();
        });
    });
  });

  describe('removePviDocuments', () => {
    it('should return a validation error if the assetId we provide is null', (done) => {
      const assetId = null;

      adp.modelsElasticSearch.MicroserviceDocumentation.removePviDocuments(assetId)
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            code: 400,
            desc: 'You must supply assetId',
            data: null,
            origin: 'removePviDocuments',
            packName: 'adp.modelsElasticSearch.MicroserviceDocumentation',
          });

          done();
        });
    });

    it('should correctly handle an error in the ElasticSearch class on pvi deletion', (done) => {
      const assetId = '1';

      adp.modelsElasticSearch.MicroserviceDocumentation.removePviDocuments(assetId)
        .then(() => done.fail())
        .catch((error) => {
          expect(error).toEqual({
            meta: { statusCode: 500 },
            message: 'An error occurred in the deleteByQuery function',
          });

          done();
        });
    });
  });
});
