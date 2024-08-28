// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.buildAssetData ]
* @author
*/
// ============================================================================================= //
const mockMailObject = {
  enableHighlight: true,
  mailSchema: [],
  asset: {
  },
};
let mockTagLabelResp = 'Label';
let denormalizeResp = {};
describe('Testing [ global.adp.notification.buildAssetData ] behavior', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.tags = {};
    global.adp.tags.getLabel = () => mockTagLabelResp;
    global.adp.clone = SOURCE => JSON.parse(JSON.stringify(SOURCE));
    global.adp.microservices = {};
    global.adp.microservices.denormalize = () => new Promise((RESOLVE) => {
      RESOLVE(denormalizeResp);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.notification.processEmailObject = require('./processEmailObject');
    global.adp.notification.buildAssetData = require('./buildAssetData');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Test if the asset data has appropriate values as per mail schema without items', () => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].value)
        .toEqual(mockMailObject.asset[mockMailObject.mailSchema[0].field_name]);
    });
  });

  it('Test if the asset data has appropriate values as per mail schema without items considering denormalized values', () => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];
    denormalizeResp = {
      test1: 'denormalized test 1',
      test2: 'denormalized test 2',
    };

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].value)
        .toEqual(denormalizeResp[mockMailObject.mailSchema[0].field_name]);

      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[1].value)
        .toEqual(denormalizeResp[mockMailObject.mailSchema[1].field_name]);

      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[2].value)
        .toEqual(mockMailObject.asset[mockMailObject.mailSchema[2].field_name]);
    });
  });

  it('Test if the asset data has appropriate values as per mail schema with items', () => {
    mockMailObject.asset = {
      test1: 'test1 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      team: [
        {
          subFieldtest1: 'sub field test1 name',
        },
        {
          subFieldtest2: 'sub field test2 name',
        },
      ],
      additional_information: [
        {
          subFieldtest1: 'sub field test1 name',
        },
        {
          subFieldtest2: 'sub field test2 name',
        },
      ],
      tags: [
        {
          id: '1',
          value: 'tag 1',
        },
      ],
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      {
        field_name: 'team',
        mail_name: 'Test Teams',
        items: [
          {
            field_name: 'subFieldtest1', mail_name: 'Sub Field Test 1',
          },
          {
            field_name: 'subFieldtest2', mail_name: 'Sub Field Test 2',
          },
        ],
      },
      {
        field_name: 'additional_information',
        mail_name: 'Test Additional Information',
        items: [
          {
            field_name: 'subFieldtest1', mail_name: 'Sub Field Test 1',
          },
          {
            field_name: 'subFieldtest2', mail_name: 'Sub Field Test 2',
          },
        ],
      },
      {
        field_name: 'tags',
        mail_name: 'Tags',
        items: [
          {
            field_name: '', mail_name: '',
          },
        ],
      },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[1].field).toEqual(mockMailObject.mailSchema[1].mail_name);
      expect(resp.assetData[2].field).toEqual(mockMailObject.mailSchema[2].mail_name);
      expect(resp.assetData[3].field).toEqual(mockMailObject.mailSchema[3].mail_name);
      expect(resp.assetData[1].items.values[0][0].field)
        .toEqual(mockMailObject.mailSchema[1].items[0].mail_name);

      expect(resp.assetData[3].items.values[0][0].value)
        .toEqual(mockTagLabelResp);
    });
  });

  it('Test if the asset data tags are set to invalid in case of error', () => {
    mockMailObject.asset = {
      test1: 'test1 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      tags: [
        {
          id: '1',
          value: 'tag 1',
        },
      ],
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      {
        field_name: 'tags',
        mail_name: 'Tags',
        items: [
          {
            field_name: '', mail_name: '',
          },
        ],
      },
    ];
    mockTagLabelResp = 'ERROR';
    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[1].field).toEqual(mockMailObject.mailSchema[1].mail_name);

      expect(resp.assetData[1].items.values[0][0])
        .toEqual('INVALID TAG');
    });
  });

  it('Test if items marked to notify admins in schema result in a highlight flag being true when highlight is enabled', () => {
    mockMailObject.enableHighlight = true;
    mockMailObject.asset = {
      test1: 'test1 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1', notify_admin_on_change: true },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].highlight).toEqual(true);
    });
  });

  it('Test if items marked to notify admins in schema result in a highlight flag being false when highlight is disabled', () => {
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      test1: 'test1 name',
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1', notify_admin_on_change: true },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].highlight).toEqual(false);
    });
  });

  it('Test if the asset data has appropriate values as per mail schema with items for type Object', () => {
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      repo_urls: {
        subtest1: 'test1 name',
      },
      menu_auto: true,
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'repo_urls',
        type: 'object',
        mail_name: 'Test 1',
        notify_admin_on_change: true,
        properties: [
          {
            field_name: 'subtest1',
            type: 'string',
            mail_name: 'Sub Test 1',
          },
        ],
      },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
    });
  });

  it('Test if the asset data has no repo_urls and menu_auto in case of empty repo_urls', () => {
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      repo_urls: {
        subtest1: '',
      },
      menu_auto: true,
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'repo_urls',
        type: 'object',
        mail_name: 'Test 1',
        notify_admin_on_change: true,
        properties: [
          {
            field_name: 'subtest1',
            type: 'string',
            mail_name: 'Sub Test 1',
          },
        ],
      },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData).toEqual([]);
    });
  });

  it('Test if the asset data menu has appropriate values as per mail schema', () => {
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      menu_auto: false,
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
          release: [{
            version: '1',
            documents: [
              {
                name: 'test 1',
              },
            ],
          }],
        },
      },
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'menu',
        type: 'object',
        mail_name: 'Supporting Documentation',
        notify_admin_on_change: true,
        properties: [
          {
            type: 'object',
            mail_order: 1,
            field_name: 'manual',
            properties: [
              {
                description: 'The in development documents',
                type: 'array',
                items: [
                  {
                    field_name: 'name',
                    mail_order: 1,
                  },
                ],
                mail_name: 'In Development Documents',
                mail_order: 1,
                field_name: 'development',
              },
              {
                description: 'The released documents',
                type: 'array',
                items: [
                  {
                    field_name: 'name',
                    mail_order: 1,
                  },
                ],
                mail_name: 'Release Documents',
                mail_order: 2,
                field_name: 'release',
              },
            ],
          },
        ],
      },
    ];

    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items.values[0].length).toBeGreaterThan(0);
    });
  });

  it('Test if the asset data compliance has appropriate values as per mail schema', () => {
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      menu_auto: false,
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      compliance: [
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
      ],
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'compliance',
        type: 'object',
        mail_name: 'Complinace',
        notify_admin_on_change: false,
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
      },
    ];
    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items).toBeDefined();
    });

    denormalizeResp = {
      compliance: [
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
      ],
    };
    mockMailObject.enableHighlight = false;
    mockMailObject.asset = {
      menu_auto: false,
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      compliance: [
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
      ],
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'compliance',
        type: 'object',
        mail_name: 'Complinace',
        notify_admin_on_change: false,
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
      },
    ];
    global.adp.notification.buildAssetData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items).toBeDefined();
    });
  });
});
// ============================================================================================= //
