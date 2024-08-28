/* eslint-disable global-require */
/**
* Unit test for [ global.adp.compliance.validator ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
const mockData = require('./readComplianceOptions.spec.json');

describe('Testing results of [ global.adp.compliance.validator ] ', () => {
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
    global.adp.complianceOptions.validator = require('./validator');
  });

  beforeEach(() => {
    global.adp.complianceOptions.cache.options = JSON.stringify(mockData.complianceOptions);
  });

  afterAll(() => {
    global.adp = null;
  });

  it('validate: Send negative response with error in case of duplicate compliance groups', () => {
    const mockComplianceArray = [
      {
        group: 1,
        fields: [],
      },
      {
        group: 1,
        fields: [],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual('Duplicate compliance groups are not allowed');
  });

  it('validate: Send negative response with error in case unavailability of complianceoptions', () => {
    global.adp.complianceOptions.cache.options = null;
    const mockComplianceArray = [
      {
        group: 1,
        fields: [],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance - Invalid group '1'");
  });

  it('validate: Send negative response with error in case of duplicate compliance fields', () => {
    const mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: '',
          },
          {
            field: 1,
            answer: 1,
            comment: '',
          }],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Duplicate fields in group '1' are not allowed");
  });

  it('validate: Send negative response with error in case comment not provided but required', () => {
    let mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 2,
            comment: '',
          },
        ],
      },
    ];
    let result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance group '1' field '1' requires comment");

    mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 2,
          },
        ],
      },
    ];
    result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance group '1' field '1' requires comment");

    mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 2,
            comment: '   ',
          },
        ],
      },
    ];
    result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance group '1' field '1' requires comment");
  });

  it('validate: Send negative response with error in case of invalid answer', () => {
    const mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 3,
            comment: '',
          },
        ],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance group '1' field '1' - Invalid answer '3'");
  });

  it('validate: Send negative response with error in case of invalid field', () => {
    const mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 4,
            answer: 2,
            comment: '',
          },
        ],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance group '1' - Invalid field '4'");
  });

  it('validate: Send negative response with error in case of invalid group', () => {
    const mockComplianceArray = [
      {
        group: 3,
        fields: [
          {
            field: 1,
            answer: 2,
            comment: '',
          },
        ],
      },
    ];
    const result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeFalsy();
    expect(result.validationResult).toEqual("Compliance - Invalid group '3'");
  });

  it('validate: Send positive response with formatted array in case of no errors', () => {
    let mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: 'test comment',
          },
        ],
      },
    ];
    let result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeTruthy();
    expect(result.formattedArray[0].fields[0]).toBeDefined();

    mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: 'test comment  ',
          },
        ],
      },
    ];
    result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeTruthy();
    expect(result.formattedArray[0].fields[0]).toBeDefined();
    expect(result.formattedArray[0].fields[0].comment).toEqual('test comment');

    mockComplianceArray = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
          },
        ],
      },
    ];
    result = global.adp.complianceOptions.validator.validate(mockComplianceArray);

    expect(result).toBeDefined();
    expect(result.valid).toBeTruthy();
    expect(result.formattedArray[0].fields[0].comment).toBeDefined();
    expect(result.formattedArray[0].fields[0].comment).toEqual('');
  });
});
