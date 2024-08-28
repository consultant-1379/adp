// ============================================================================================= //
/**
* Unit test for [ adp.mimer.MimerControl ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockFSClass {
  existsSync() {
    return adp.mockBehavior.existsSync;
  }

  readFileSync() {
    return adp.mockBehavior.readFileSync;
  }

  writeFileSync() {
    if (adp.mockBehavior.writeFileSync === 'crash') {
      throw new Error('Mock Crash Error');
    }
    return adp.mockBehavior.writeFileSync;
  }

  mkdirSync() {
    return adp.mockBehavior.mkdirSync;
  }

  unlinkSync() {
    if (adp.mockBehavior.unlinkSync === 'crash') {
      throw new Error('Mock Crash Error');
    }
    return adp.mockBehavior.unlinkSync;
  }
}
// ============================================================================================= //
describe('Testing [ adp.mimer.getVersion ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.fs = new MockFSClass();
    adp.config = {};
    adp.config.mimerServer = 'https://mockMimerServer/';
    adp.config.muninServer = 'https://mockMuninServer/';
    adp.urljoin = require('url-join');
    // - - - - - - - - - - - - - - - - - - - - //
    adp.mockBehavior = {
      existsSync: true,
      readFileSync: JSON.stringify({
        token: 'mockRefreshToken',
        saved_at: '2022-05-19T09:00:40.093Z',
      }),
      writeFileSync: true,
      mkdirSync: true,
      unlinkSync: true,
      axiosRefreshToken: 0,
      axiosGetProduct: 0,
      axiosGetVersion: 0,
    };
    // - - - - - - - - - - - - - - - - - - - - //
    const mockAxios = OBJ => new Promise((RES, REJ) => {
      let answerObject;
      switch (OBJ.url) {
        case 'https://mockMimerServer/authn/api/v2/refresh-token':
          if (adp.mockBehavior.axiosRefreshToken === 0) {
            answerObject = {
              statusCode: 200,
              data: {
                results: [{
                  operation: 'Authentication',
                  code: 'OK',
                  correlationId: '123',
                  messages: [],
                  data: {
                    access_token: 'accessTokenTest',
                    signum: `${OBJ.headers['X-On-Behalf-Of']}`,
                    refresh_token: 'tokenRefreshTest',
                    ext_expires_in: 1000,
                    token_type: 'Bearer',
                    expires_in: 1000,
                  },
                }],
              },
            };
            RES(answerObject);
          } else if (adp.mockBehavior.axiosRefreshToken === 1) {
            answerObject = {
              statusCode: 200,
              data: { results: [] },
            };
            RES(answerObject);
          } else if (adp.mockBehavior.axiosRefreshToken === 2) {
            answerObject = {
              statusCode: 200,
              data: {
                results: [{
                  operation: 'Wrong Operation',
                  code: 'OK',
                  correlationId: '123',
                  messages: [],
                  data: {},
                }],
              },
            };
            RES(answerObject);
          } else if (adp.mockBehavior.axiosRefreshToken === 3) {
            answerObject = {
              code: 500,
              message: 'Mock Rejection Error',
            };
            REJ(answerObject);
          } else {
            answerObject = {};
            REJ(answerObject);
          }
          break;
        case 'https://mockMuninServer/api/v1/products/APR20131':
          if (adp.mockBehavior.axiosGetProduct === 0) {
            answerObject = {
              status: 200,
              statusCode: 200,
              data: {
                results: [{
                  status: 200,
                  data: {
                    schemaVersion: '9.0.1',
                    productVersions: [
                      {
                        productVersionLabel: '8.3.1',
                        productVersionUrl: 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1',
                      },
                      {
                        productVersionLabel: '8.3.0',
                        productVersionUrl: 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0',
                      },
                    ],
                    productVersioningSchema: 'SemVer2.0.0',
                    designation: 'Auto MS Max',
                    productNumber: 'APR20131',
                    designResponsible: 'BDGSLBM',
                  },
                }],
              },
            };
            RES(answerObject);
          } else if (adp.mockBehavior.axiosGetProduct === 1) {
            answerObject = {
              status: 200,
              statusCode: 200,
              data: {
                results: [],
              },
            };
            RES(answerObject);
          } else {
            answerObject = {
              status: 500,
              response: {
                status: 500,
              },
            };
            REJ(answerObject);
          }
          break;
        case 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1':
          if (adp.mockBehavior.axiosGetVersion === 0) {
            answerObject = {
              status: 200,
              statusCode: 200,
              data: {
                results: [{
                  data: {
                    lifecycleStage: 'InWork',
                    designationAlias: [
                      'eric-fh-alarm-handler',
                    ],
                    schemaVersion: '6.0.2',
                    productIdentifier: {
                      productVersionLabel: '8.3.0',
                      productVersioningSchema: 'SemVer2.0.0',
                      productNumber: 'APR20131',
                    },
                    description: 'TODO Replace this text.',
                    designation: 'Auto MS Max',
                    relations: {
                      includes: [
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '15283-APR20131/7-6',
                            language: 'Uen',
                            revision: 'A',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/1597-APR20131/7',
                            language: 'Uen',
                            revision: 'F',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/1553-APR20131/7',
                            language: 'Uen',
                            revision: 'E',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '7.5.0',
                            productNumber: 'CXU1010087',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '7.5.0',
                            productNumber: 'CXU1010364',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '7.5.0',
                            productNumber: 'CXD1010365',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/00664-APR20131/7',
                            language: 'Uen',
                            revision: 'E',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          primTargetIdentifier: {
                            productRstate: 'R1A',
                            referenceProductNumber: '1/FAL1153215',
                          },
                          systemOfRecord: 'PRIM',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/19817-APR20131/7',
                            language: 'Uen',
                            revision: 'E',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/15241-APR20131/7',
                            language: 'Uen',
                            revision: 'F',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '1/0360-APR20131/7',
                            language: 'Uen',
                            revision: 'E',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '1.9.0',
                            productNumber: 'CXU1010039',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          eridocTargetIdentifier: {
                            documentNumber: '10921-APR20131/7-5',
                            language: 'Uen',
                            revision: 'A',
                          },
                          systemOfRecord: 'Eridoc',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '1.9.0',
                            productNumber: 'CXU1010038',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          muninTargetIdentifier: {
                            productVersionLabel: '7.3.0',
                            productNumber: 'CXU1010642',
                          },
                          systemOfRecord: 'Munin',
                        },
                        {
                          primTargetIdentifier: {
                            productRstate: 'R1A',
                            referenceProductNumber: '3/FAL1153215',
                          },
                          systemOfRecord: 'PRIM',
                        },
                        {
                          primTargetIdentifier: {
                            productRstate: 'R1A',
                            referenceProductNumber: '7/FAL1153215',
                          },
                          systemOfRecord: 'PRIM',
                        },
                        {
                          primTargetIdentifier: {
                            productRstate: 'R1A',
                            referenceProductNumber: '5/FAL1153215',
                          },
                          systemOfRecord: 'PRIM',
                        },
                      ],
                    },
                    artifactCategory: 'Abstract',
                  },
                }],
              },
            };
            RES(answerObject);
          } else if (adp.mockBehavior.axiosGetVersion === 1) {
            answerObject = {
              status: 200,
              statusCode: 200,
              data: {
                results: [],
              },
            };
            RES(answerObject);
          } else {
            answerObject = {};
            REJ(answerObject);
          }
          break;
        default:
          //
          break;
      }
    });

    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = (E1, E2, E3) => ({ code: E1, message: E2, object: E3 });
    adp.mimer = {};
    adp.mimer.MimerControl = proxyquire('./MimerControl', {
      './../library/errorLog': adp.erroLog,
      axios: mockAxios,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] successful case.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._refreshToken()
      .then(() => {
        expect(mimerControl.mimerAccessToken).toEqual('accessTokenTest');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] successful case saving new Refresh Token.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl.mimerRefreshTokenSavedAt = new Date('2022-05-23T08:00:00.000Z');
    adp.mockInterceptor = {};
    adp.mockInterceptor.mimerControlAcceptRefreshToken = false;
    mimerControl.acceptRefreshToken = NEWTOKEN => new Promise((RES) => {
      const object = {
        token: `${NEWTOKEN}`,
        saved_at: new Date(),
      };
      adp.mockInterceptor.mimerControlAcceptRefreshToken = true;
      RES(object);
    });
    mimerControl._refreshToken()
      .then(() => {
        expect(mimerControl.mimerAccessToken).toEqual('accessTokenTest');
        expect(adp.mockInterceptor.mimerControlAcceptRefreshToken).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] successful case without save the Refresh Token because previous is still valid.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl.mimerRefreshTokenSavedAt = new Date('5022-05-23T08:00:00.000Z');
    adp.mockInterceptor = {};
    adp.mockInterceptor.mimerControlAcceptRefreshToken = false;
    mimerControl.acceptRefreshToken = NEWTOKEN => new Promise((RES) => {
      const object = {
        token: `${NEWTOKEN}`,
        saved_at: new Date(),
      };
      adp.mockInterceptor.mimerControlAcceptRefreshToken = true;
      RES(object);
    });
    mimerControl._refreshToken()
      .then(() => {
        expect(mimerControl.mimerAccessToken).toEqual('accessTokenTest');
        expect(adp.mockInterceptor.mimerControlAcceptRefreshToken).toEqual(false);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] case [ this.acceptRefreshToken() ] rejects.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl.mimerRefreshTokenSavedAt = new Date('2022-05-23T08:00:00.000Z');
    adp.mockInterceptor = {};
    adp.mockInterceptor.mimerControlAcceptRefreshToken = false;
    mimerControl.acceptRefreshToken = () => new Promise((RES, REJ) => {
      const object = {
        code: 500,
        message: 'Mock [ this.acceptRefreshToken() ] error',
      };
      adp.mockInterceptor.mimerControlAcceptRefreshToken = true;
      REJ(object);
    });
    mimerControl._refreshToken()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.mockInterceptor.mimerControlAcceptRefreshToken).toEqual(true);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] case request returns an empty answer.', (done) => {
    adp.mockBehavior.axiosRefreshToken = 1;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._refreshToken()
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Unexpected answer from Mimer Server.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] case request returns an invalid answer.', (done) => {
    adp.mockBehavior.axiosRefreshToken = 2;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._refreshToken()
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('The access_token was not found in answer as expected.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] case request rejects.', (done) => {
    adp.mockBehavior.axiosRefreshToken = 3;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._refreshToken()
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Mock Rejection Error');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _refreshToken() ] case request rejects without details.', (done) => {
    adp.mockBehavior.axiosRefreshToken = 4;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._refreshToken()
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Request reject when trying to access the Mimer Server.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _checkIfExpired() ] should returns true because [ this.mimerAccessTokenExpiresIn ] is null/undefined.', async (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const isExpired = await mimerControl._checkIfExpired();

    expect(isExpired).toEqual(true);
    done();
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _checkIfExpired() ] should returns true because [ this.mimerAccessTokenExpiresIn ] is outdated.', async (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerAccessTokenExpiresIn = new Date('2022-05-23T08:00:00.000Z');
    const isExpired = await mimerControl._checkIfExpired();

    expect(isExpired).toEqual(true);
    done();
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _checkIfExpired() ] should returns false because [ this.mimerAccessTokenExpiresIn ] is valid.', async (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerAccessTokenExpiresIn = new Date('5022-05-23T08:00:00.000Z');
    const isExpired = await mimerControl._checkIfExpired();

    expect(isExpired).toEqual(false);
    done();
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveProduct() ] successful case.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerAccessToken = 'accessTokenTest';
    mimerControl._retrieveProduct('APR20131')
      .then((RESULT) => {
        const document0 = RESULT
          && RESULT.productVersions
          && RESULT.productVersions[0]
          ? RESULT.productVersions[0]
          : { productVersionLabel: 'INVALID', productVersionUrl: 'INVALID' };
        const document1 = RESULT
          && RESULT.productVersions
          && RESULT.productVersions[1]
          ? RESULT.productVersions[1]
          : { productVersionLabel: 'INVALID', productVersionUrl: 'INVALID' };

        expect(document0.productVersionLabel).toEqual('8.3.1');
        expect(document0.productVersionUrl).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1');
        expect(document1.productVersionLabel).toEqual('8.3.0');
        expect(document1.productVersionUrl).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveProduct() ] case request returns an empty answer.', (done) => {
    adp.mockBehavior.axiosGetProduct = 1;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerAccessToken = 'accessTokenTest';
    mimerControl._retrieveProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Unexpected answer from Munin Server.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveProduct() ] case request rejects.', (done) => {
    adp.mockBehavior.axiosGetProduct = 2;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerAccessToken = 'accessTokenTest';
    mimerControl._retrieveProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Request reject when trying to access the Munin Server during _retrieveProduct().');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _productParser() ] successful case.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const productToParse = {
      schemaVersion: '9.0.1',
      productVersions: [
        {
          productVersionLabel: '8.3.1',
          productVersionUrl: 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1',
        },
        {
          productVersionLabel: '8.3.0',
          productVersionUrl: 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0',
        },
      ],
      productVersioningSchema: 'SemVer2.0.0',
      designation: 'Auto MS Max',
      productNumber: 'APR20131',
      designResponsible: 'BDGSLBM',
    };
    mimerControl._productParser(productToParse)
      .then((RESULT) => {
        const document0 = RESULT
          && RESULT[0]
          ? RESULT[0]
          : {};
        const document1 = RESULT
          && RESULT[1]
          ? RESULT[1]
          : {};

        expect(document0.number).toEqual('APR20131');
        expect(document0.product).toEqual('Auto MS Max');
        expect(document0.version).toEqual('8.3.1');
        expect(document0.url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1');

        expect(document1.number).toEqual('APR20131');
        expect(document1.product).toEqual('Auto MS Max');
        expect(document1.version).toEqual('8.3.0');
        expect(document1.url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0');

        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _productParser() ] case Product Object is invalid.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const productToParse = {
      schemaVersion: '9.0.1',
      productVersions: 'Not an array',
    };
    mimerControl._productParser(productToParse)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Unexpected format of the parameter: PRODUCT.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveVersion() ] successful case.', (done) => {
    const versionURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._retrieveVersion(versionURL)
      .then((RESULT) => {
        const documents = RESULT
          && RESULT.relations
          && RESULT.relations.includes
          ? RESULT.relations.includes
          : [];
        const eriDocsQuantity = (documents.filter(DOC => DOC.systemOfRecord === 'Eridoc')).length;

        expect(eriDocsQuantity).toEqual(8);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveVersion() ] case request returns an empty answer.', (done) => {
    adp.mockBehavior.axiosGetVersion = 1;
    const versionURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._retrieveVersion(versionURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Request reject when trying to access the Munin Server during _retrieveVersion().');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _retrieveVersion() ] case request rejects.', (done) => {
    adp.mockBehavior.axiosGetVersion = 2;
    const versionURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.mimerRefreshToken = 'refreshMockToken';
    mimerControl._retrieveVersion(versionURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Request reject when trying to access the Munin Server during _retrieveVersion().');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _checkRefreshToken() ] should returns null if Token does not exists.', (done) => {
    adp.mockBehavior.existsSync = false;
    adp.path = '/mock';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkRefreshToken()
      .then((RESULT) => {
        expect(RESULT).toBeNull();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _checkRefreshToken() ] should returns the value if Token exists.', (done) => {
    adp.path = '/mock';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkRefreshToken()
      .then((RESULT) => {
        if (!RESULT) {
          expect(RESULT).toBeDefined();
          done.fail();
        } else {
          expect(RESULT.token).toEqual('mockRefreshToken');
          expect(RESULT.saved_at).toBeDefined();
          done();
        }
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Private [ _documentListParser() ] with invalid parameters.', async (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const result = mimerControl._documentListParser();

    expect(result).toBeUndefined();
    done();
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ acceptRefreshToken() ] successful case, case the file already exists.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.acceptRefreshToken('newMockTokenTest')
      .then((RESULT) => {
        expect(RESULT).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ acceptRefreshToken() ] successful case, case the file does not exist.', (done) => {
    adp.mockBehavior.existsSync = false;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.acceptRefreshToken('newMockTokenTest')
      .then((RESULT) => {
        expect(RESULT).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ acceptRefreshToken() ] case [ this.fs.writeFileSync ] fail.', (done) => {
    adp.mockBehavior.writeFileSync = 'crash';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.acceptRefreshToken('newMockTokenTest')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error caught when savind file in disk.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ deleteToken() ] successful case.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.deleteToken()
      .then((RESULT) => {
        expect(RESULT).toEqual({ result: 'Token deleted.' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ deleteToken() ] successful case, if the file is already deleted.', (done) => {
    adp.mockBehavior.existsSync = false;
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.deleteToken()
      .then((RESULT) => {
        expect(RESULT).toEqual({ result: 'Token already deleted.' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ deleteToken() ] case [ this.fs.unlinkSync ] fail.', (done) => {
    adp.mockBehavior.unlinkSync = 'crash';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.deleteToken()
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error caught when deleting a file in disk.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] successful case.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.getVersion(mockURL)
      .then((RESULT) => {
        expect(RESULT.documents.length).toEqual(18);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] successful case, if [ this._checkIfExpired ] returns false.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkIfExpired = () => false;
    mimerControl.getVersion(mockURL)
      .then((RESULT) => {
        expect(RESULT.documents.length).toEqual(18);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] case [ this._checkRefreshToken ] rejects.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    const mockError = 'Mock Error';
    mimerControl._checkRefreshToken = () => new Promise((RES, REJ) => REJ(mockError));
    mimerControl.getVersion(mockURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error caught while retrieving data from remote.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] case [ this._checkRefreshToken ] returns null.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkRefreshToken = () => new Promise(RES => RES(null));
    mimerControl.getVersion(mockURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Refresh Token not found. This feature is locked.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] case [ this._documentListParser ] rejects.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    const rejectMockError = 'Mock Reject Error';
    mimerControl._documentListParser = () => new Promise((RES, REJ) => REJ(rejectMockError));
    mimerControl.getVersion(mockURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error when it was trying to refresh the access token.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getVersion() ] case [ this._documentListParser ] rejects when [ this._checkIfExpired ] returns false.', (done) => {
    const mockURL = 'https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1';
    const mimerControl = new adp.mimer.MimerControl();
    const rejectMockError = 'Mock Reject Error';
    mimerControl._documentListParser = () => new Promise((RES, REJ) => REJ(rejectMockError));
    mimerControl._checkIfExpired = () => false;
    mimerControl.getVersion(mockURL)
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error was caught when it was retrieving the Product from the Mimer Server.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] successful case.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl.getProduct('APR20131')
      .then((RESULT) => {
        expect(RESULT[0].url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1');
        expect(RESULT[1].url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] case [ this._checkRefreshToken ] rejects.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const mockError = 'Mock Error';
    mimerControl._checkRefreshToken = () => new Promise((RES, REJ) => REJ(mockError));
    mimerControl.getProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error caught while retrieving data from remote.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] case [ this._checkRefreshToken ] returns null.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkRefreshToken = () => new Promise(RES => RES(null));
    mimerControl.getProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Refresh Token not found. This feature is locked.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] case [ this._checkIfExpired ] returns false.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    mimerControl._checkIfExpired = () => false;
    mimerControl.getProduct('APR20131')
      .then((RESULT) => {
        expect(RESULT[0].url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.1');
        expect(RESULT[1].url).toEqual('https://mockMuninServer/api/v1/products/APR20131/versions/8.3.0');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] case [ this._productParser ] rejects when [ this._checkIfExpired ] returns true.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const rejectMockError = 'Mock Reject Error';
    mimerControl._productParser = () => new Promise((RES, REJ) => REJ(rejectMockError));
    mimerControl._checkIfExpired = () => true;
    mimerControl.getProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Request reject when trying to access the Munin Server at getProduct().');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Public [ getProduct() ] case [ this._productParser ] rejects when [ this._checkIfExpired ] returns false.', (done) => {
    const mimerControl = new adp.mimer.MimerControl();
    const rejectMockError = 'Mock Reject Error';
    mimerControl._productParser = () => new Promise((RES, REJ) => REJ(rejectMockError));
    mimerControl._checkIfExpired = () => false;
    mimerControl.getProduct('APR20131')
      .then(() => {
        done.fail();
      })
      .catch((REJ) => {
        expect(REJ.code).toEqual(500);
        expect(REJ.message).toEqual('Error was caught when it was retrieving the Product from the Mimer Server.');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
