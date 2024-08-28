// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.buildAssetHTML ]
* @author Cein
*/
// ============================================================================================= //
describe('Testing [ global.adp.notification.buildAssetHTML ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.baseSiteAddress = 'https://base-address';
    /* eslint-disable global-require */
    global.adp.notification.buildAssetHTML = require('./buildAssetHTML');
    /* eslint-enable global-require */
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should reject if asset data is undefined or empty', () => {
    const mailObj = {
      assetData: [],
    };

    global.adp.notification.buildAssetHTML({}).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    global.adp.notification.buildAssetHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should reject if the action is undefined or empty', () => {
    const mailObj = {
      assetData: ['test'],
    };

    global.adp.notification.buildAssetHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    mailObj.action = '  ';
    global.adp.notification.buildAssetHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should reject if the usr array is undefined or empty', () => {
    const mailObj = {
      assetData: ['test'],
      action: 'test',
    };

    global.adp.notification.buildAssetHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    mailObj.usr = [];
    global.adp.notification.buildAssetHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should return html containing the users information, asset data and the action layout for create or delete.', () => {
    let mailObj = {
      asset: { name: 'assetName' },
      assetData: [
        {
          field: 'testAssetFieldName',
          value: 'testAssetFieldValue',
          oldvalue: 'testAssetFieldValueOld',
          items: { values: [], oldValues: [] },
        },
        {
          field: 'testAssetFieldName2',
          value: 'testAssetFieldValue2',
          oldvalue: 'testAssetFieldValueOld2',
          items: {
            values: [[{ field: 'testchildFieldName', value: 'testchildFieldValue' }]],
            oldValues: [[{ field: 'testchildFieldNameOld', value: 'testchildFieldValueOld' }]],
          },
        },
      ],
      action: 'create',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildAssetHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.usr[0].name);
      expect(htmlResult).toContain(mailObj.usr[0].email);
      expect(htmlResult).toContain(mailObj.usr[0].signum);

      expect(htmlResult).toContain(mailObj.assetData[0].field);
      expect(htmlResult).toContain(mailObj.assetData[0].value);
      expect(htmlResult).not.toContain(mailObj.assetData[0].oldvalue);

      expect(htmlResult).toContain(mailObj.assetData[1].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].value);
      expect(htmlResult).not.toContain(mailObj.assetData[1].items.oldValues[0][0].field);
      expect(htmlResult).not.toContain(mailObj.assetData[1].items.oldValues[0][0].value);
      expect(htmlResult).toContain('Link');
    });

    // delete
    mailObj = {
      asset: { name: 'assetName' },
      assetData: [
        {
          field: 'testAssetFieldName',
          value: 'testAssetFieldValue',
          oldvalue: 'testAssetFieldValueOld',
          items: { values: [], oldValues: [] },
        },
        {
          field: 'testAssetFieldName2',
          value: 'testAssetFieldValue2',
          oldvalue: 'testAssetFieldValueOld2',
          items: {
            values: [[{ field: 'testchildFieldName', value: 'testchildFieldValue' }]],
            oldValues: [[{ field: 'testchildFieldNameOld', value: 'testchildFieldValueOld' }]],
          },
        },
      ],
      action: 'delete',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildAssetHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.usr[0].name);
      expect(htmlResult).toContain(mailObj.usr[0].email);
      expect(htmlResult).toContain(mailObj.usr[0].signum);

      expect(htmlResult).toContain(mailObj.assetData[0].field);
      expect(htmlResult).toContain(mailObj.assetData[0].value);
      expect(htmlResult).not.toContain(mailObj.assetData[0].oldvalue);

      expect(htmlResult).toContain(mailObj.assetData[1].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].value);
      expect(htmlResult).not.toContain(mailObj.assetData[1].items.oldValues[0][0].field);
      expect(htmlResult).not.toContain(mailObj.assetData[1].items.oldValues[0][0].value);
      expect(htmlResult).not.toContain('Link');
    });
  });


  it('Should return html containing the users information, asset data and the action layout for update.', () => {
    const mailObj = {
      asset: { name: 'assetName' },
      assetData: [
        {
          field: 'testAssetFieldName',
          value: 'testAssetFieldValue',
          oldvalue: 'testAssetFieldValueOld',
          items: { values: [], oldValues: [] },
        },
        {
          field: 'testAssetFieldName2',
          value: 'testAssetFieldValue2',
          oldvalue: 'testAssetFieldValueOld2',
          items: {
            values: [[{ field: 'testchildFieldName', value: 'testchildFieldValue' }]],
            oldValues: [[{ field: 'testchildFieldNameOld', value: 'testchildFieldValueOld' }]],
          },
        },
      ],
      action: 'update',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildAssetHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.usr[0].name);
      expect(htmlResult).toContain(mailObj.usr[0].email);
      expect(htmlResult).toContain(mailObj.usr[0].signum);

      expect(htmlResult).toContain(mailObj.assetData[0].field);
      expect(htmlResult).toContain(mailObj.assetData[0].value);
      expect(htmlResult).toContain(mailObj.assetData[0].oldvalue);

      expect(htmlResult).toContain(mailObj.assetData[1].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.values[0][0].value);
      expect(htmlResult).toContain(mailObj.assetData[1].items.oldValues[0][0].field);
      expect(htmlResult).toContain(mailObj.assetData[1].items.oldValues[0][0].value);
      expect(htmlResult).toContain('Link');
    });
  });
});
