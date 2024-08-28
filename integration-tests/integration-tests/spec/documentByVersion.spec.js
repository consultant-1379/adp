const urljoin = require('url-join');

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing getdocumentbyversion endpoint', () => {
  beforeAll(async (done) => {
    await portal.userLogin();
    done();
  });

  it('Should provide documentation information for valid microservice ID and version from Mimer', async (done) => {
    const response = await portal.getDocumentByVersion('auto-ms-mimer-arm-fulltest', '1.0.2');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'clientDocs/microservice'),
        microservice: 'auto-ms-mimer-arm-fulltest',
        version: '1.0.2',
      },
      response,
    });

    const allItems = response.body.data;
    const foundDoc = allItems.filter(item => (item['Document Name'] === 'Secure Coding Report'));

    let foundItem = false;
    allItems.filter((item) => {
      if (item['Document Name'] === 'Secure Coding Report') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Secure Coding Report name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(1);

    expect(foundDoc[0].Source)
      .withContext(`[ foundMS.added ] should be defined: ${debug}`)
      .toEqual('Mimer');

    expect(foundDoc[0]['Category Name'])
      .withContext(`[ foundMS.added ] should be defined: ${debug}`)
      .toEqual('Release Documents');

    expect(foundDoc[0]['Document Number'])
      .withContext(`[ foundMS.added ] should be defined: ${debug}`)
      .toEqual('0360-APR20131/7-6');

    expect(response.body.data[0]['Document Name'])
      .withContext(`[ response.body.data[0][Document Name] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Category Name'])
      .withContext(`[ response.body.data[0][Category Name] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].Source)
      .withContext(`[ response.body.data[0][Source] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Document Number'])
      .withContext(`[ response.body.data[0][Document Number] ] should be defined: ${debug}`)
      .toBeDefined();
    done();
  });

  it('Should provide documentation information for valid microservice ID and version from ARM', async (done) => {
    const response = await portal.getDocumentByVersion('auto-ms-doc-sync-mock-artifactory-2', '1.0.2');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'clientDocs/microservice'),
        microservice: 'auto-ms-doc-sync-mock-artifactory-2',
        version: '1.0.2',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(1);

    expect(response.body.data[0]['Document Name'])
      .withContext(`[ response.body.data[0][Document Name] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Category Name'])
      .withContext(`[ response.body.data[0][Category Name] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].Source)
      .withContext(`[ response.body.data[0][Source] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Document Number'])
      .withContext(`[ response.body.data[0][Document Number] ] should be defined: ${debug}`)
      .toBeUndefined();
    done();
  });

  it('Should provide documentation information for valid microservice ID and version from gerrit', async (done) => {
    const response = await portal.getDocumentByVersion('auto-ms-with-docs', '3.2.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'clientDocs/microservice'),
        microservice: 'auto-ms-with-docs',
        version: '3.2.1',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(1);

    expect(response.body.data[0]['Document Name'])
      .withContext(`[ response.body.data[0][Document Name] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Category Name'])
      .withContext(`[ response.body.data[0][Category Name] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].Source)
      .withContext(`[ response.body.data[0][Source] ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0]['Document Number'])
      .withContext(`[ response.body.data[0][Document Number] ] should be defined: ${debug}`)
      .toBeUndefined();
    done();
  });

  it('Should fail to provide documentation information for valid microservice ID and not existing version', async (done) => {
    const response = await portal.getDocumentByVersion('auto-ms-with-docs', '3.3.3');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
        microservice: 'auto-ms-with-docs',
        version: '1.0.1',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(404);
    done();
  });

  it('Should fail to provide documentation information for invalid microservice ID and version', async (done) => {
    const response = await portal.getDocumentByVersion('auto-ms-with-docs-notexisting', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
        microservice: 'auto-ms-with-docs-notexisting',
        version: '1.0.1',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 404: ${debug}`)
      .toEqual(404);
    done();
  });

  it('Should fail to provide documentation information for deleted microservice ID', async (done) => {
    const response = await portal.getDocumentByVersion('ms-deleted', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
        microservice: 'ms-deleted',
        version: '1.0.1',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 404: ${debug}`)
      .toEqual(404);
    done();
  });

  it('Should fail to provide documentation information without msID', async (done) => {
    const response = await portal.getDocumentByVersion('', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
        microservice: 'auto-ms-with-docs',
        version: '1.0.1',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 404: ${debug}`)
      .toEqual(404);
    done();
  });
});
