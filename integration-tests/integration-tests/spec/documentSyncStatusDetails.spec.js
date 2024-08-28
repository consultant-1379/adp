/**
 * Testing DocumentSyncStatus /documentSyncStatus
 * @author zdiaarm
 */

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing Document Sync Status Details endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('[[DOCSYNCSTATUS001]] Should request DocumentSyncStatus and check successful case', async (done) => {
    portal.startTestLog('[[DOCSYNCSTATUS001]] Should request DocumentSyncStatus and check successful case');
    const queueObjective = 'auto-ms-with-mock-artifactory-doc-1__1664965295886';

    const response = await portal.documentSyncStatusDetails(queueObjective);
    const debug = portal.answer({
      param: {
        queueObjective,
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    const data = response
      && response.body
      && Array.isArray(response.body.data)
      && response.body.data.length > 0
      ? response.body.data[0]
      : null;

    expect(data.msName)
      .withContext(`[ response.body.data.msName ] should be 'Auto MS with Mock Artifactory Doc 1', got ${data.msName} instead: ${debug}`)
      .toEqual('Auto MS with Mock Artifactory Doc 1');

    expect(data.status)
      .withContext(`[ response.body.data.status ] should be 'Completed', got ${data.status} instead: ${debug}`)
      .toEqual('Completed');

    expect(data.objective)
      .withContext(`[ response.body.data.objective ] should be ${queueObjective}, got ${data.objective} instead: ${debug}`)
      .toEqual(queueObjective);

    expect(data.errorOrWarnings)
      .withContext(`[ response.body.data.errorOrWarnings ] should be undefined: ${debug}`)
      .toBeUndefined();

    done();
  });

  it('[[DOCSYNCSTATUS002]] Should request DocumentSyncStatus and check errors', async (done) => {
    portal.startTestLog('[[DOCSYNCSTATUS002]] Should request DocumentSyncStatus and check errors');
    const queueObjective = 'auto-ms-with-mock-artifactory-doc-1__1664964343123';

    const response = await portal.documentSyncStatusDetails(queueObjective);
    const debug = portal.answer({
      param: {
        queueObjective,
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    const data = response
      && response.body
      && Array.isArray(response.body.data)
      && response.body.data.length > 0
      ? response.body.data[0]
      : null;

    expect(data.msName)
      .withContext(`[ response.body.data.msName ] should be 'Auto MS with Mock Artifactory Doc 1', got ${data.msName} instead: ${debug}`)
      .toEqual('Auto MS with Mock Artifactory Doc 1');

    expect(data.status)
      .withContext(`[ response.body.data.status ] should be 'Completed', got ${data.status} instead: ${debug}`)
      .toEqual('Failed');

    expect(data.objective)
      .withContext(`[ response.body.data.objective ] should be ${queueObjective}, got ${data.objective} instead: ${debug}`)
      .toEqual(queueObjective);

    expect(data.errorOrWarnings[0].yamlErrorsQuant)
      .withContext(`[ response.body.data.errorOrWarnings.yamlErrorsQuant ] should be 2, got ${data.errorOrWarnings[0].yamlErrorsQuant} instead: ${debug}`)
      .toEqual(2);

    expect(data.errorOrWarnings[0].yamlWarningsQuant)
      .withContext(`[ response.body.data.errorOrWarnings.yamlWarningsQuant ] should be 0, got ${data.errorOrWarnings[0].yamlWarningsQuant} instead: ${debug}`)
      .toEqual(0);

    done();
  });

  it('[[DOCSYNCSTATUS003]] Should request DocumentSyncStatus and check warnings', async (done) => {
    portal.startTestLog('[[DOCSYNCSTATUS003]] Should request DocumentSyncStatus and check warnings');
    const queueObjective = 'auto-ms-with-mock-artifactory-doc-1__1664964341234';

    const response = await portal.documentSyncStatusDetails(queueObjective);
    const debug = portal.answer({
      param: {
        queueObjective,
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    const data = response
      && response.body
      && Array.isArray(response.body.data)
      && response.body.data.length > 0
      ? response.body.data[0]
      : null;

    expect(data.msName)
      .withContext(`[ response.body.data.msName ] should be 'Auto MS with Mock Artifactory Doc 1', got ${data.msName} instead: ${debug}`)
      .toEqual('Auto MS with Mock Artifactory Doc 1');

    expect(data.status)
      .withContext(`[ response.body.data.status ] should be 'Completed', got ${data.status} instead: ${debug}`)
      .toEqual('Completed');

    expect(data.objective)
      .withContext(`[ response.body.data.objective ] should be ${queueObjective}, got ${data.objective} instead: ${debug}`)
      .toEqual(queueObjective);

    expect(data.errorOrWarnings[0].yamlErrorsQuant)
      .withContext(`[ response.body.data.errorOrWarnings.yamlErrorsQuant ] should be 0, got ${data.errorOrWarnings[0].yamlErrorsQuant} instead: ${debug}`)
      .toEqual(0);

    expect(data.errorOrWarnings[0].yamlWarningsQuant)
      .withContext(`[ response.body.data.errorOrWarnings.yamlWarningsQuant ] should be 1, got ${data.errorOrWarnings[0].yamlWarningsQuant} instead: ${debug}`)
      .toEqual(1);

    done();
  });
});
