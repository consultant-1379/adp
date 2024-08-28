// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.buildAssetAdminUpdateData ]
* @author xjohdol
*/
// ============================================================================================= //
const mockMailObject = {
  mailSchema: [],
  asset: {
  },
};
describe('Testing [ global.adp.notification.buildAssetAdminUpdateData ] behavior', () => {
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
    global.adp.microservices = {};
    global.adp.microservices.denormalize = () => new Promise((RESOLVE) => {
      RESOLVE({});
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.notification.buildAssetAdminUpdateData = require('./buildAssetAdminUpdateData');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Test to show that a change not registered in notify fields results in no update data', () => {
    mockMailObject.asset = {
      test1: 'test1 name unimportant change',
      test2: 'test2 name',
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      test2: 'test2 name',
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'test2', mail_name: 'Test 2' },
    ];
    mockMailObject.notifyFields = [];

    global.adp.notification.buildAssetAdminUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData.length).toEqual(0);
    });
  });

  it('Test if the asset data has values only for notify fields', () => {
    mockMailObject.asset = {
      test1: 'test1 name',
      category: 1,
    };
    mockMailObject.oldAsset = {
      test1: 'test1 name',
      category: 2,
    };
    mockMailObject.mailSchema = [
      { field_name: 'test1', mail_name: 'Test 1' },
      { field_name: 'category', mail_name: 'Category' },
    ];
    mockMailObject.notifyFields = [{
      slug: 'category',
      dirty: true,
    }];

    global.adp.notification.buildAssetAdminUpdateData(mockMailObject).then((resp) => {
      expect(resp.assetData[0].field).toEqual(mockMailObject.mailSchema[1].mail_name);
      expect(resp.assetData[0].value)
        .toEqual(mockMailObject.asset[mockMailObject.mailSchema[1].field_name]);
    });
  });
});
// ============================================================================================= //
