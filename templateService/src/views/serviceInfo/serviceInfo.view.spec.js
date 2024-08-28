const proxyquire = require('proxyquire');

const mockServiceInfoContrData = {
  version: '1',
  name: 'test',
  description: 'testDesc',
};

const mockServiceInfoController = {
  getVersion: () => mockServiceInfoContrData.version,
  getInformation: () => {
    const { name, description } = mockServiceInfoContrData;
    return { name, description };
  },
};

const mockRes = { json: data => data };

const serviceInfoView = proxyquire('./serviceInfo.view', {
  '../../controllers/serviceInfo/serviceInfo.controller': mockServiceInfoController,
});

describe('Service Info View, ', () => {
  it('getBaseInformation: Should return a version, name and description.', () => {
    const result = serviceInfoView.getBaseInformation({}, mockRes);

    expect(result.version).toBe(mockServiceInfoContrData.version);
    expect(result.name).toBe(mockServiceInfoContrData.name);
    expect(result.description).toBe(mockServiceInfoContrData.description);
  });
});
