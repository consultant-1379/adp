// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.buildAssetUpdateData ]
* @author
*/
// ============================================================================================= //
const mockMailObject = {
  mailSchema: [],
  asset: {
  },
};
let denormalizeResp = {};
const mockTagLabelResp = 'LABEL';
let denormalizeError = false;
describe('Testing [ global.adp.notification.buildAssetUpdateData ] behavior', () => {
  beforeAll(() => {
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
    global.adp.microservices = {};
    global.adp.microservices.denormalize = () => new Promise((RESOLVE, REJECT) => {
      if (denormalizeError) {
        REJECT();
        return;
      }
      RESOLVE(denormalizeResp);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.notification.processEmailObject = require('./processEmailObject');
    global.adp.notification.buildAssetUpdateData = require('./buildAssetUpdateData');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  beforeEach(() => {
    denormalizeError = false;
    denormalizeResp = {};
  });

  afterAll(() => {
    global.adp = null;
  });

  it('Should not send any data if nothing is updated', (done) => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];

    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData.length).toEqual(0);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Should send only updated fields', (done) => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name changed',
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];

    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData.length).toEqual(1);
      expect(resp.assetData[0].value).toEqual(mockMailObject.asset.test3);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Should send only updated fields in case if any denormalized field present', (done) => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name changed',
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];

    denormalizeResp = {
      test3: 'denormalized test 3',
    };
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData.length).toEqual(1);
      expect(resp.assetData[0].value).toEqual(denormalizeResp.test3);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Should send only updated fields and not any denormalized field present in case of error', (done) => {
    mockMailObject.asset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name changed',
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      test2: 'test2 name',
      test3: 'test3 name',
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
      { field_name: 'test3', mail_name: 'Test 3' },
    ];

    denormalizeResp = {
      test3: 'denormalized test 3',
    };
    denormalizeError = true;
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData.length).toEqual(1);
      expect(resp.assetData[0].value).toEqual(mockMailObject.asset.test3);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if it sets old documentation as empty and show repo_urls if menu_auto is true', (done) => {
    mockMailObject.asset = {
      menu_auto: true,
      test2: 'test2 name',
      test3: 'test3 name changed',
      test1: {
        subtest1: 'test updated',
      },
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
        },
      },
    };
    mockMailObject.oldAsset = {
      menu_auto: false,
      test2: 'test2 name',
      test3: 'test3 name',
      test1: {
        subtest1: '',
      },
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
        },
      },
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'menu_auto',
        type: 'boolean',
        mail_name: 'Menu Auto',
        notify_admin_on_change: true,
      },
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
            ],
          },
        ],
      },
      {
        field_name: 'test1',
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

    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData.find(item => item.field === 'Menu Auto')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Documentation')).not.toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation').items.oldValues.length).toEqual(1);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if it sets repo urls as empty and show documentation if menu_auto is made false', (done) => {
    mockMailObject.asset = {
      menu_auto: false,
      test2: 'test2 name',
      test3: 'test3 name changed',
      repo_urls: {
        development: 'test',
      },
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
        },
      },
    };
    mockMailObject.oldAsset = {
      menu_auto: true,
      test2: 'test2 name',
      test3: 'test3 name',
      repo_urls: {
        development: 'test',
      },
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
        },
      },
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'menu_auto',
        type: 'boolean',
        mail_name: 'Menu Auto',
        notify_admin_on_change: true,
      },
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
            ],
          },
        ],
      },
      {
        field_name: 'repo_urls',
        type: 'object',
        mail_name: 'Repo Urls',
        notify_admin_on_change: true,
        properties: [
          {
            field_name: 'development',
            type: 'string',
            mail_name: 'Development URL',
          },
        ],
      },
    ];

    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData.find(item => item.field === 'Menu Auto')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Documentation')).not.toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation').items.values.length).toEqual(1);
      expect(resp.assetData.find(item => item.field === 'Repo Urls')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Repo Urls').items.values[0].length).toEqual(0);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if it shows documentation if changed', (done) => {
    mockMailObject.asset = {
      menu_auto: false,
      test2: 'test2 name',
      test3: 'test3 name changed',
      repo_urls: {
        development: 'test',
      },
      menu: {
        manual: {
          development: [
            {
              name: 'test 1',
            },
          ],
        },
      },
    };
    mockMailObject.oldAsset = {
      menu_auto: false,
      test2: 'test2 name',
      test3: 'test3 name',
      repo_urls: {
        development: 'test',
      },
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
        field_name: 'menu_auto',
        type: 'boolean',
        mail_name: 'Menu Auto',
        notify_admin_on_change: true,
      },
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
      {
        field_name: 'repo_urls',
        type: 'object',
        mail_name: 'Repo Urls',
        notify_admin_on_change: true,
        properties: [
          {
            field_name: 'development',
            type: 'string',
            mail_name: 'Development URL',
          },
        ],
      },
    ];

    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[1].mail_name);
      expect(resp.assetData.find(item => item.field === 'Menu Auto')).not.toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Documentation')).not.toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation')).toBeDefined();
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation').items.values.length).toEqual(1);
      expect(resp.assetData.find(item => item.field === 'Supporting Documentation').items.oldValues.length).toEqual(2);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if the asset data tags delta is added to assetData in case its changed', (done) => {
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
    mockMailObject.oldAsset = {
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
        {
          id: '2',
          value: 'tag 2',
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
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[1].mail_name);
      expect(resp.assetData[0].items.values[0].length).toEqual(1);
      expect(resp.assetData[0].items.oldValues[0].length).toEqual(2);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if the asset data teams data is added to assetData in case its changed', (done) => {
    mockMailObject.asset = {
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
    };
    mockMailObject.oldAsset = {
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      team: [
        {
          subFieldtest1: 'sub field test1 name changed',
        },
        {
          subFieldtest2: 'sub field test2 name',
        },
      ],
    };
    mockMailObject.mailSchema = [
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
    ];
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items.values[0].length).toEqual(2);
      expect(resp.assetData[0].items.oldValues[0].length).toEqual(2);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('Test if the asset data additional information data is added to assetData in case its changed', (done) => {
    mockMailObject.asset = {
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      additional_information: [
        {
          field_name: 'subFieldtest1', mail_name: 'Sub Field Test 1',
        },
      ],
    };
    mockMailObject.oldAsset = {
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      additional_information: [
        {
          field_name: 'subFieldtest1', mail_name: 'Sub Field Test 1 changed',
        },
      ],
    };
    mockMailObject.mailSchema = [
      {
        field_name: 'additional_information',
        mail_name: 'Test Additional Information',
        items: [
          {
            field_name: 'category', mail_name: 'Category',
          },
        ],
      },
    ];
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items.values[0].length).toEqual(1);
      expect(resp.assetData[0].items.oldValues[0].length).toEqual(1);
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
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

    mockMailObject.oldAsset = {
      menu_auto: false,
      menu: {
        manual: {
          development: [],
          release: [],
        },
      },
      compliance: [
        {
          group: 2,
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
    global.adp.notification.buildAssetUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[0].mail_name);
      expect(resp.assetData[0].items).toBeDefined();
    });
  });
});
// ============================================================================================= //
