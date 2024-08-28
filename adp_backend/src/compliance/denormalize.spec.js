/* eslint-disable global-require */
/**
* Unit test for [ global.adp.compliance.denormalize ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
const mockData = require('./readComplianceOptions.spec.json');

describe('Testing results of [ global.adp.compliance.denormalize ] ', () => {
  beforeAll(() => {
    global.adp = {};
    adp.clone = data => data;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.getSizeInMemory = () => 123456;
    global.adp.timeStepNext = () => '';
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.complianceOptions = {};
    global.adp.complianceOptions.cache = {};
    global.adp.complianceOptions.denormalize = require('./denormalize');
  });

  beforeEach(() => {
    global.adp.complianceOptions.cache.options = JSON.stringify(mockData.complianceOptions);
  });

  afterAll(() => {
    global.adp = null;
  });

  it('validate: Send denormalized compliance data', () => {
    const mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: '',
          },
        ],
      },
    ];
    const result = global.adp.complianceOptions.denormalize.denormalizeFields(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result[0].group).toEqual('Group 1');
    expect(result[0].fields[0].field).toEqual('Test 1');
    expect(result[0].fields[0].answer).toEqual('Test 2');
  });

  it('validate: Send empty array in case of unavailability of complianceoptions', () => {
    global.adp.complianceOptions.cache.options = null;
    const mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: '',
          },
        ],
      },
    ];
    const result = global.adp.complianceOptions.denormalize.denormalizeFields(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result[0].group).toEqual(1);
    expect(result[0].fields[0].field).toEqual(1);
    expect(result[0].fields[0].answer).toEqual(1);
  });
});
