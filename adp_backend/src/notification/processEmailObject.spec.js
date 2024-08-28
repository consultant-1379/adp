/* eslint-disable global-require */
/**
* Unit test for [ global.adp.notification.processEmailObject ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/

describe('Testing results of [ global.adp.notification.processEmailObject ] ', () => {
  let mockField;
  beforeAll(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.getSizeInMemory = () => 123456;
    global.adp.timeStepNext = () => '';
    global.adp.notification = {};
    global.adp.notification.processEmailObject = require('./processEmailObject');
  });

  beforeEach(() => {
    mockField = {
      items: [
        {
          field_name: 'group',
          mail_name: 'Group',
        },
        {
          field_name: 'fields',
          items: {
            properties: {
              field: {
                mail_name: 'Field',
              },
              answer: {
                mail_name: 'Answer',
              },
              comment: {
                mail_name: 'Comment',
              },
            },
          },
        },
      ],
    };
  });

  afterAll(() => {
    global.adp = null;
  });

  it('processComplianceData: Send processed compliance object', () => {
    let mockComplinaceArray = [
      {
        group: 'Group 1',
        fields: [
          {
            field: 'Field 1',
            answer: 'Answer 1',
            comment: 'Mock Comment',
          },
        ],
      },
    ];
    let result = global.adp.notification.processEmailObject
      .processComplianceData(mockComplinaceArray, mockField);

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].length).toEqual(4);
    expect(result[0][0].field).toEqual('Group');
    expect(result[0][0].value).toEqual('Group 1');
    expect(result[0][1].field).toEqual('Field');
    expect(result[0][1].value).toEqual('Field 1');
    expect(result[0][2].field).toEqual('Answer');
    expect(result[0][2].value).toEqual('Answer 1');
    expect(result[0][3].field).toEqual('Comment');
    expect(result[0][3].value).toEqual('Mock Comment');

    mockComplinaceArray = [
      {
        group: 'Group 1',
        fields: [
          {
            field: 'Field 1',
            answer: 'Answer 1',
            comment: 'Mock Comment',
          },
          {
            field: 'Field 2',
            answer: 'Answer 2',
            comment: 'Mock Comment 1',
          },
        ],
      },
    ];
    result = global.adp.notification.processEmailObject
      .processComplianceData(mockComplinaceArray, mockField);

    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].length).toEqual(4);
    expect(result[1].length).toEqual(4);
    expect(result[0][0].field).toEqual('Group');
    expect(result[0][0].value).toEqual('Group 1');
    expect(result[0][1].field).toEqual('Field');
    expect(result[0][1].value).toEqual('Field 1');
    expect(result[0][2].field).toEqual('Answer');
    expect(result[0][2].value).toEqual('Answer 1');
    expect(result[0][3].field).toEqual('Comment');
    expect(result[0][3].value).toEqual('Mock Comment');
    expect(result[1][0].field).toEqual('Group');
    expect(result[1][0].value).toEqual('Group 1');
    expect(result[1][1].field).toEqual('Field');
    expect(result[1][1].value).toEqual('Field 2');
    expect(result[1][2].field).toEqual('Answer');
    expect(result[1][2].value).toEqual('Answer 2');
    expect(result[1][3].field).toEqual('Comment');
    expect(result[1][3].value).toEqual('Mock Comment 1');

    mockComplinaceArray = [
      {
        group: 'Group 1',
        fields: [
          {
            field: 'Field 1',
            answer: 'Answer 1',
            comment: 'Mock Comment',
          },
        ],
      },
      {
        group: 'Group 2',
        fields: [
          {
            field: 'Field 1',
            answer: 'Answer 1',
            comment: 'Mock Comment 1',
          },
        ],
      },
    ];
    result = global.adp.notification.processEmailObject
      .processComplianceData(mockComplinaceArray, mockField);

    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].length).toEqual(4);
    expect(result[1].length).toEqual(4);
    expect(result[0][0].field).toEqual('Group');
    expect(result[0][0].value).toEqual('Group 1');
    expect(result[0][1].field).toEqual('Field');
    expect(result[0][1].value).toEqual('Field 1');
    expect(result[0][2].field).toEqual('Answer');
    expect(result[0][2].value).toEqual('Answer 1');
    expect(result[0][3].field).toEqual('Comment');
    expect(result[0][3].value).toEqual('Mock Comment');
    expect(result[1][0].field).toEqual('Group');
    expect(result[1][0].value).toEqual('Group 2');
    expect(result[1][1].field).toEqual('Field');
    expect(result[1][1].value).toEqual('Field 1');
    expect(result[1][2].field).toEqual('Answer');
    expect(result[1][2].value).toEqual('Answer 1');
    expect(result[1][3].field).toEqual('Comment');
    expect(result[1][3].value).toEqual('Mock Comment 1');
  });
});
