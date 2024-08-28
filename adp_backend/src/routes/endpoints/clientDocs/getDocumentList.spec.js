// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.clientDocs.getDocumentList ]
* @author Githu Jeeva Savy[ zjeegit ]
*/
// ============================================================================================= //
const mockRes = {
  statusCode: 0,
  end: (VALUE) => {
    if (!global.mockBehavior) {
      global.mockBehavior = {};
    }
    global.mockBehavior.mockEndAnswer = JSON.parse(VALUE);
  },
};
class MockEchoLog {
  createOne() {
    return new Promise(RES => RES());
  }
}
describe('Testing behaviour of [ adp.endpoints.clietDocs.getDocumentList ]', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    global.mockBehavior = {
      get: 0,
    };

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;
    adp.getSizeInMemory = () => 1;
    adp.errorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.endpoints = {};
    adp.endpoints.clientDocs = {};
    global.adp.microservice = {};
    global.adp.microservice.read = () => {
      const mockResponse = {
        _id: '1234',
        menu_auto: true,
        documentsForRendering: {
          '1.0.0': {
            versionLabel: '1.0.0',
            'release-documents': [
              {
                name: 'Sample1',
                mimer_source: true,
                category_name: 'Category 1',
                mimer_document_number: 'SAMP1',
              },
              {
                name: 'Sample2',
                mimer_source: true,
                category_name: 'Category 2',
                mimer_document_number: 'SAMP2',
              },
              {
                name: 'Sample3',
                category_name: 'Category 3',
              },
            ],
          },
        },
      };
      if (global.mockBehavior.get === 1) {
        const response = {
          _id: null,
          menu_auto: true,
          documentsForRendering: {},
        };
        return new Promise(RES => RES(response));
      }
      if (global.mockBehavior.get === 2) {
        const response = {
          _id: '1234',
          menu_auto: true,
          documentsForRendering: {},
        };
        return new Promise(RES => RES(response));
      }
      if (global.mockBehavior.get === 3) {
        const response = {};
        return new Promise((RES, REJ) => { REJ(response) });
      }
      if (global.mockBehavior.get === 4) {
        const response = {
          _id: '1234',
          menu_auto: false,
          documentsForRendering: {
            '2.0.0': {
              versionLabel: '2.0.0',
              'release-documents': [
                {
                  name: 'Sample1',
                  mimer_source: true,
                  category_name: 'Category 1',
                  mimer_document_number: 'SAMP1',
                },
                {
                  name: 'Sample2',
                  category_name: 'Category 2',
                },
              ],
            },
          },
        };
        return new Promise(RES => RES(response));
      }
      if (global.mockBehavior.get === 5) {
        const response = {
          _id: '1234',
          check_pvi: true,
          documentsForRendering: {
            '2.0.0': {
              versionLabel: '2.0.0',
              'release-documents': [
                {
                  name: 'Sample1',
                  menu_auto:true,
                  'Source': 'ADP Protal',
                  category_name: 'Release Documents',
                },
              ],
            },
          },
        };
        return new Promise(RES => RES(response));
      }
      return new Promise(RES => RES(mockResponse));
    };
    adp.setHeaders = RES => RES;
    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    global.adp.Answers = require('./../../../answers/AnswerClass');
    adp.endpoints.clientDocs.getDocumentList = require('./getDocumentList');
  });

  // =========================================================================================== //
  it('Successful Test Case.', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '1.0.0',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('200 Ok');
    expect(answer.data).toBeDefined();
    expect(answer.data[2].Source).toEqual('Artifactory');
    done();
  });
  // =========================================================================================== //
  it('Successful Test Case with Documents from Gerrit', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '2.0.0',
    };
    const RES = mockRes;
    global.mockBehavior.get = 4;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('200 Ok');
    expect(answer.data).toBeDefined();
    expect(answer.data[1].Source).toEqual('Gerrit');
    done();
  });
  // =========================================================================================== //
  it('Bad Request with no parameters', async (done) => {
    const REQ = {};
    const RES = mockRes;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(400);
    expect(answer.message).toEqual('400 Bad Request - MicroService ID is NULL or UNDEFINED...');
    done();
  });
  // =========================================================================================== //
  it('Bad Request with no microservice ID/slug', async (done) => {
    const REQ = {};
    REQ.params = {
      version: '1.0.0',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(400);
    expect(answer.message).toEqual('400 Bad Request - MicroService ID is NULL or UNDEFINED...');
    done();
  });
  // =========================================================================================== //
  it('Bad Request with no version specified', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(400);
    expect(answer.message).toEqual('400 Bad Request - MicroService ID is NULL or UNDEFINED...');
    done();
  });
  // =========================================================================================== //
  it('No Microservice with the requested ID found Case.', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '1.0.0',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    global.mockBehavior.get = 1;
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(undefined);
    done();
  });
  // =========================================================================================== //
  it('No Document with the requested version found Case.', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '2.0.0',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    global.mockBehavior.get = 2;
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(404);
    expect(answer.message).toEqual('404 Requested Version not found');
    done();
  });
  // =========================================================================================== //
  it('Error while fetching the microservice Case.', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '1.0.0',
    };
    const RES = mockRes;
    RES.setHeader = () => {};
    global.mockBehavior.get = 3;
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(500);
    expect(answer.message).toContain('Error in [ adp.microservice.read ]');
    done();
  });
  // =========================================================================================== //
  it('Successful Test Case for PVI Report.', async (done) => {
    const REQ = {};
    REQ.params = {
      id: '1234',
      version: '2.0.0',
    };
    const RES = mockRes;
    global.mockBehavior.get = 5;
    RES.setHeader = () => {};
    await adp.endpoints.clientDocs.getDocumentList(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('200 Ok');
    expect(answer.data).toBeDefined();
    expect(answer.data[0].Source).toEqual('ADP Portal');
    expect(answer.data[0]['Category Name']).toEqual('Release Documents');
    expect(answer.data[0]['Document Name']).toEqual('PVI Report');
    done();
  });
});