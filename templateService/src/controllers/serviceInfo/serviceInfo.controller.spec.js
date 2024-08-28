const proxyquire = require('proxyquire');

const mockPJson = {
  version: '1',
  name: 'test',
  description: 'testDesc',
};

const serviceInfoContr = proxyquire('./serviceInfo.controller', {
  '../../../package.json': mockPJson,
});

describe('Service Info Controller, ', () => {
  it('getVersion: Should return a version.', () => {
    expect(serviceInfoContr.getVersion()).toBe(mockPJson.version);
  });

  it('getInformation: Should return a name and description.', () => {
    const { name: expName, description: expDesc } = serviceInfoContr.getInformation();

    expect(expName).toBe(mockPJson.name);
    expect(expDesc).toBe(mockPJson.description);
  });
});
