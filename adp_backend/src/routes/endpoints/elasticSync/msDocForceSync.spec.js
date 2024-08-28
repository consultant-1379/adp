const proxyquire = require('proxyquire');

/**
* Unit test for [ adp.endpoints.elasticSync.microservicesElasticsearchDocumentationForceSync ]
* @author Githu Jeeva Savy [zjeegit]
*/

describe('Testing [ adp.routes.endpoints.elasticSync.microservicesElasticsearchDocumentationForceSync] behavior.', () => {
  beforeEach(() => {
    adp = {};
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    adp.setHeaders = () => {
      const obj = {
        statusCode: 0,
        end: (theAwnswer) => {
          global.answerFromRes = theAwnswer;
        },
      };
      return obj;
    };
    adp.endFunction = {};
    adp.queue = {
      startJobs: () => new Promise(RES => RES(adp.endFunction())),
      addJob: () => new Promise(RES => RES([{ queueStatusLink: 'mockLink' }])),
    };
  });

  afterEach(() => {
    global.adp = {};
    adp = {};
  });

  // xit('Testing whether microservicesElasticsearchDocumentationForceSync return the report.', (done) => {
  //   const microservicesElasticsearchDocumentationForceSync = proxyquire('./microservicesElasticsearchDocumentationForceSync', {
  //     '../../../microservice/elastic/documentation/SyncController': class MicroserviceElasticsearchDocumentationSync {
  //       sync() {
  //         return Promise.resolve({});
  //       }
  //     },
  //     '../../../library/echoLog': () => {},
  //   });
  //   adp.Answers = {
  //     answerWith: (code, RES, timer, msg, result) => {
  //       expect(code).toEqual(200);
  //       expect(result).toBeDefined();
  //       done();
  //     },
  //   };
  //   microservicesElasticsearchDocumentationForceSync({
  //     body: ['17e57f6cea1b5a673f8775e6cf023344', '33c39ceb47b28842c3a728c89300026f'],
  //   });
  // });

  // xit('Testing if Microservices sync gives an error', (done) => {
  //   const microservicesElasticsearchDocumentationForceSync = proxyquire('./microservicesElasticsearchDocumentationForceSync', {
  //     '../../../microservice/elastic/documentation/SyncController': class MicroserviceElasticsearchDocumentationSync {
  //       sync() {
  //         return Promise.reject();
  //       }
  //     },
  //   });
  //   adp.Answers = {
  //     answerWith: (code, RES, timer, msg) => {
  //       expect(code).toEqual(500);
  //       expect(msg).toEqual('Microservice Documentation Sync Failure.');
  //       done();
  //     },
  //   };
  //   microservicesElasticsearchDocumentationForceSync({
  //     body: ['17e57f6cea1b5a673f8775e6cf023344', '33c39ceb47b28842c3a728c89300026f'],
  //   });
  // });
});
