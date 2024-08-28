/* eslint-disable jasmine/no-promise-without-done-fail */
/* eslint-disable no-console */
const config = require('../test.config.js');
const data = require('../test.data.js');
const { mockServer } = require('../test.config.js');
const apiQueueClass = require('./apiQueue');

const {
  PortalPrivateAPI, configIntegration,
} = require('./apiClients');

const portal = new PortalPrivateAPI();
const kernelQueue = new apiQueueClass.ApiQueue();

let originalValue;

describe('Basic tests for the EGS Sync', () => {
  beforeAll(async (done) => {
    const setupConfigIntegration = await configIntegration(config.baseUrl);
    this.environmentID = setupConfigIntegration.body.environmentID;
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  const startTestLog = (ID) => {
    console.log(`\n\nStarting ${ID}`);
  };

  const getMockForEGSDocuments = () => {
    const mock = {
      httpRequest: {
        method: 'POST',
        path: '/egsSync/mockserver',
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
        }),
      },
      times: {
        unlimited: true,
      },
    };
    return mock;
  };

  it('[[EGS001]] Should check if egs payload output contains all mandatory fields', async (done) => {
    startTestLog('[[EGS001`]]');

    await mockServer.clear({ path: '/egsSync/.*' });
    await mockServer.mockAnyResponse(getMockForEGSDocuments());

    await portal.login();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemsRequired = recordedRequests[0].body.json
          .every(item => item.title !== undefined && item._id !== undefined
            && item.title !== undefined && item.document_date !== undefined
            && item.type !== undefined && item.url !== undefined);


        expect(ItemsRequired)
          .withContext(`All mandatory items should be present in output for egs payload: ${recordedRequests}`)
          .toBeTruthy();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });

  it('[[EGS002]] Should check if egs payload output contains article What is ADP with appropriate fields', async (done) => {
    startTestLog('[[EGS002]]');

    await portal.login();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const itemExpected = {
      title: 'What is ADP?',
      type: 'article',
    };

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemWhatIsADP = recordedRequests[0].body.json.filter(item => item.title === 'What is ADP?');
        const egsItemWhatisADP = JSON.parse(JSON.stringify(ItemWhatIsADP[0]));

        expect(egsItemWhatisADP)
          .withContext('Item object should include title What is ADP? and type Article')
          .toEqual(jasmine.objectContaining(itemExpected));

        expect(ItemWhatIsADP[0]._id)
          .withContext(`ItemWhatIsADP._id  should be defined: ${ItemWhatIsADP}`)
          .toBeDefined();

        expect(ItemWhatIsADP[0]._id)
          .withContext(`ItemWhatIsADP._id  should contain adpportal-article: ${ItemWhatIsADP}`)
          .toContain('adpportal-article');

        expect(ItemWhatIsADP[0].document_date)
          .withContext(`ItemWhatIsADP.document_date  should be defined: ${ItemWhatIsADP}`)
          .toBeDefined();

        expect(ItemWhatIsADP[0].title)
          .withContext(`ItemWhatIsADP.title  should be defined: ${ItemWhatIsADP}`)
          .toBeDefined();

        expect(ItemWhatIsADP[0].tags)
          .withContext(`ItemWhatIsADP.tags  should be defined: ${ItemWhatIsADP}`)
          .toBeDefined();

        expect(ItemWhatIsADP[0].url)
          .withContext(`ItemWhatIsADP._id  should contain /what_is_adp: ${ItemWhatIsADP}`)
          .toContain('/what_is_adp');
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });

  it('[[EGS003]] Should check if egs payload output contains tutorial What is ADP with appropriate fields', async (done) => {
    startTestLog('[[EGS003]]');

    await portal.login();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const itemExpected = {
      title: 'Do Not Remove - UITEST',
      type: 'tutorial',
    };

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemUITEST = recordedRequests[0].body.json.filter(item => item.title === 'Do Not Remove - UITEST');
        const egsItemWhatisADP = JSON.parse(JSON.stringify(ItemUITEST[0]));

        expect(egsItemWhatisADP)
          .withContext('Item object should include tutorial title Do Not Remove - UITEST? and type Tutorial')
          .toEqual(jasmine.objectContaining(itemExpected));

        expect(ItemUITEST[0]._id)
          .withContext(`ItemUITEST._id  should be defined: ${ItemUITEST}`)
          .toBeDefined();

        expect(ItemUITEST[0]._id)
          .withContext(`ItemUITEST._id  should contain adpportal-article: ${ItemUITEST}`)
          .toContain('adpportal-tutorial');

        expect(ItemUITEST[0].document_date)
          .withContext(`ItemUITEST.document_date  should be defined: ${ItemUITEST}`)
          .toBeDefined();

        expect(ItemUITEST[0].title)
          .withContext(`ItemUITEST.title  should be defined: ${ItemUITEST}`)
          .toBeDefined();

        expect(ItemUITEST[0].tags)
          .withContext(`ItemUITEST.tags  should be defined: ${ItemUITEST}`)
          .toBeDefined();

        expect(ItemUITEST[0].url)
          .withContext(`ItemUITEST.url  should contain do-not-remove-uitest: ${ItemUITEST}`)
          .toContain('do-not-remove-uitest');
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });

  it('[[EGS004]] Should check if egs payload output contains microservice with appropriate fields', async (done) => {
    startTestLog('[[EGS004]]');

    await portal.login();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const itemExpected = {
      title: 'Auto MS max for Report',
      type: 'microservice',
      tags: ['ADP', 'PORTAL', 'MICROSERVICE'],
    };

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemMS = recordedRequests[1].body.json.filter(item => item.title === 'Auto MS max for Report');
        const egsItemMS = JSON.parse(JSON.stringify(ItemMS[0]));

        expect(egsItemMS)
          .withContext('Item object should include title What is ADP? and type Article')
          .toEqual(jasmine.objectContaining(itemExpected));

        expect(egsItemMS[0]._id)
          .withContext(`egsItemMS._id  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].document_date)
          .withContext(`egsItemMS.document_date  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].title)
          .withContext(`egsItemMS.title  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].tags)
          .withContext(`egsItemMS.tags  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].url)
          .withContext(`egsItemMS.url  should contain /auto-ms-max-for-report: ${egsItemMS}`)
          .toContain('/auto-ms-max-for-report');
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });

  it('[[EGS005]] Should check if egs payload output contains assembly with appropriate fields', async (done) => {
    startTestLog('[[EGS005]]');

    await portal.login();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const itemExpected = {
      title: 'Assembly Auto Doc',
      type: 'assembly',
      tags: ['ADP', 'PORTAL', 'ASSEMBLY'],
    };

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemAssembly = recordedRequests[1].body.json.filter(item => item.title === 'Assembly Auto Doc');
        const egsItemAssembly = JSON.parse(JSON.stringify(ItemAssembly[0]));

        expect(egsItemAssembly)
          .withContext('Item object should include title What is ADP? and type Article')
          .toEqual(jasmine.objectContaining(itemExpected));

        expect(egsItemAssembly[0]._id)
          .withContext(`ItemWhatIsADP._id  should be defined: ${egsItemAssembly}`)
          .toBeDefined();

        expect(egsItemAssembly[0].document_date)
          .withContext(`auto-ms-max-for-report.document_date  should be defined: ${egsItemAssembly}`)
          .toBeDefined();

        expect(egsItemAssembly[0].title)
          .withContext(`auto-ms-max-for-report.title  should be defined: ${egsItemAssembly}`)
          .toBeDefined();

        expect(egsItemAssembly[0].tags)
          .withContext(`auto-ms-max-for-report.tags  should be defined: ${egsItemAssembly}`)
          .toBeDefined();

        expect(egsItemAssembly[0].url)
          .withContext(`auto-ms-max-for-report.url  should contain /what_is_adp: ${egsItemAssembly}`)
          .toContain('/assembly-auto-doc');
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });

  it('[[EGS006]] Should check if new egs payload generated with new MS when it is created after previous payload', async (done) => {
    startTestLog('[[EGS006]]');

    await portal.login();

    const msData = data.MS_EGS_Payload;
    const microserviceID = await portal.createMS(msData);

    expect(microserviceID).toBeDefined();

    const trigger = await portal.triggerEGSSync();

    expect(trigger.code)
      .withContext(`The status code after EGSSync trigger should be 200. Got ${trigger.code} instead! :: ${JSON.stringify(trigger, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const itemExpected = {
      title: 'Auto MS EGS Payload',
      type: 'microservice',
      tags: ['ADP', 'PORTAL', 'MICROSERVICE'],
    };

    mockServer.retrieveRecordedRequests({
      path: '/egsSync/mockserver',
    })
      .then((recordedRequests) => {
        const ItemMS = recordedRequests[2].body.json.filter(item => item.title === 'Auto MS EGS Payload');
        const egsItemMS = JSON.parse(JSON.stringify(ItemMS[0]));

        expect(egsItemMS)
          .withContext('Item object should include title What is ADP? and type Article')
          .toEqual(jasmine.objectContaining(itemExpected));

        expect(egsItemMS[0]._id)
          .withContext(`ItemWhatIsADP._id  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].document_date)
          .withContext(`ItemWhatIsADP.document_date  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].title)
          .withContext(`ItemWhatIsADP.title  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].tags)
          .withContext(`ItemWhatIsADP.tags  should be defined: ${egsItemMS}`)
          .toBeDefined();

        expect(egsItemMS[0].url)
          .withContext(`ItemWhatIsADP._id  should contain /what_is_adp: ${egsItemMS}`)
          .toContain('/what_is_adp');
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });

    mockServer.verify({ path: '/egsSync/mockserver' }, 0, 6)
      .then(() => {
        done();
      },
      (ERROR) => {
        console.log(ERROR);
        done.fail();
      });
  });
  // =========================================================================================== //
});
