// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.builMailSchema ]
* @author
*/
// ============================================================================================= //
describe('Testing [ global.adp.notification.buildMailSchema ] behavior', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.clone = SOURCE => JSON.parse(JSON.stringify(SOURCE));
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.dynamicSort = require('../library/dynamicSort');
    global.adp.notification.buildMailSchema = require('./buildMailSchema');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Should sort the schema and convert into appropriate format for simple object', () => {
    const test = {
      properties: {
        field1: {
          name: 'field1',
          mail_order: 1,
        },
        field2: {
          name: 'field2',
          mail_order: 2,
        },
        field3: {
          name: 'field3',
          mail_order: 3,
        },
      },
    };
    global.adp.config.schema.microservice = test;
    global.adp.notification.buildMailSchema({}).then((resp) => {
      expect(resp.mailSchema[0].mail_order).toBe(test.properties.field1.mail_order);
    });

    const test1 = {
      properties: {
        field1: {
          name: 'field1',
          mail_order: 2,
        },
        field2: {
          name: 'field2',
          mail_order: 3,
        },
        field3: {
          name: 'field3',
          mail_order: 1,
        },
      },
    };
    global.adp.config.schema.microservice = test1;
    global.adp.notification.buildMailSchema({}).then((resp) => {
      expect(resp.mailSchema[0].mail_order).toBe(test1.properties.field3.mail_order);
    });
  });

  it('Should sort the schema and convert into appropriate format for nested object', () => {
    const test = {
      properties: {
        field1: {
          name: 'field1',
          mail_order: 3,
        },
        field2: {
          name: 'field2',
          mail_order: 2,
        },
        field3: {
          name: 'field3',
          mail_order: 1,
          items: {
            properties: {
              subfield1: {
                name: 'subfield1',
                mail_order: 1,
              },
              subfield2: {
                name: 'subfield2',
                mail_order: 2,
              },
              subfield3: {
                name: 'subfield3',
                mail_order: 3,
              },
            },
          },
        },
      },
    };
    global.adp.config.schema.microservice = test;
    global.adp.notification.buildMailSchema({}).then((resp) => {
      expect(resp.mailSchema[0].mail_order).toBe(test.properties.field3.mail_order);
      expect((resp.mailSchema[0].items[0].mail_order))
        .toEqual(test.properties.field3.items.properties.subfield1.mail_order);
    });

    const test1 = {
      properties: {
        field1: {
          name: 'field1',
          mail_order: 3,
        },
        field2: {
          name: 'field2',
          mail_order: 2,
        },
        field3: {
          name: 'field3',
          mail_order: 1,
          items: {
            properties: {
              subfield1: {
                name: 'subfield1',
                mail_order: 2,
              },
              subfield2: {
                name: 'subfield2',
                mail_order: 3,
              },
              subfield3: {
                name: 'subfield3',
                mail_order: 1,
              },
            },
          },
        },
      },
    };
    global.adp.config.schema.microservice = test1;
    global.adp.notification.buildMailSchema({}).then((resp) => {
      expect(resp.mailSchema[0].mail_order).toBe(test1.properties.field3.mail_order);
      expect((resp.mailSchema[0].items[0].mail_order))
        .toEqual(test1.properties.field3.items.properties.subfield3.mail_order);
    });
  });

  it('Should sort the schema and convert into appropriate format for type object', () => {
    const test = {
      properties: {
        field1: {
          name: 'field1',
          mail_order: 3,
        },
        field2: {
          name: 'field2',
          mail_order: 2,
        },
        field3: {
          name: 'field3',
          mail_order: 1,
          properties: {
            subfield1: {
              name: 'subfield1',
              mail_order: 1,
            },
            subfield2: {
              name: 'subfield2',
              mail_order: 2,
            },
            subfield3: {
              name: 'subfield3',
              mail_order: 3,
            },
          },
        },
      },
    };
    global.adp.config.schema.microservice = test;
    global.adp.notification.buildMailSchema({}).then((resp) => {
      expect(resp.mailSchema[0].mail_order).toBe(test.properties.field3.mail_order);
      expect((resp.mailSchema[0].properties[0].mail_order))
        .toEqual(test.properties.field3.properties.subfield1.mail_order);
    });
  });
});
// ============================================================================================= //
