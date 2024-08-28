// ============================================================================================= //
/**
* Unit test for [ adp.assetValidation.AssetValidationclass ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class mockTeamHistoryController {
  fetchLatestSnapshotsMsList() {
    return new Promise(RES => RES());
  }
}
class mockAdp {
  getByNameIfIsNotTheIDByType() {
    return new Promise((RESOLVE, REJECT) => {
      if (!global.adp.mockAdpBehaviour) {
        const res = {
          docs: [{ _id: 'doc1' }, { _id: 'doc2' }, { _id: 'doc3' }],
        };
        RESOLVE(res);
      } else {
        const ERR = false;
        REJECT(ERR);
      }
    });
  }
}
describe('Creating a class from [ adp.assetValidation.AssetValidationclass ] and testing... ', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.models = {};
    global.adp.models.Adp = mockAdp;
    global.adp.echoLog = () => true;
    global.adp.tags = {};
    global.adp.tags.checkIt = obj => new Promise((RESOLVE, REJECT) => {
      if (obj.length > 0) {
        RESOLVE(true);
      } else {
        const ERR = false;
        REJECT(ERR);
      }
    });
    global.adp.mockNotificationBehaviour = 0;
    global.adp.mockAdpBehaviour = 0;
    global.adp.notification = {};
    global.adp.notification.processEmailObject = require('../notification/processEmailObject');
    global.adp.notification.sendAssetMail = () => new Promise((RESOLVE, REJECT) => {
      if (!global.adp.mockNotificationBehaviour) {
        RESOLVE(true);
      } else {
        const ERR = false;
        REJECT(ERR);
      }
    });
    adp.behavior = {};
    global.adp.microservice = {};
    global.adp.microservice.CRUDLog = () => true;
    global.adp.microservice.checkName = assetName => new Promise((RESOLVE, REJECT) => {
      if (assetName !== 'DUPLICATE') {
        RESOLVE(assetName);
      } else {
        const ERR = 'DUPLICATE';
        REJECT(ERR);
      }
    });
    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = mockTeamHistoryController;
    adp.assetValidation = {};
    adp.assetValidation.AssetValidationclass = proxyquire('./AssetValidationclass', {
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('Testing [domainValidation] behaviour', () => {
    it('Successful case of domainValidation', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { assembly_category: 1, domain: 1 };

      expect(asset.domainValidation(obj)).toEqual(true);
      done();
    });

    it('with invalid domain and assemblycategory 1', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { assembly_category: 1, domain: 2 };

      expect(asset.domainValidation(obj)).toEqual(false);
      done();
    });

    it('with assembly category not 1 domain is 1', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { assembly_category: 2, domain: 1 };

      expect(asset.domainValidation(obj)).toEqual(false);
      done();
    });

    it('with undefined domain', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { assembly_category: 2 };

      expect(asset.domainValidation(obj)).toEqual(false);
      done();
    });

    it('for Assembly_category other than 1 and  domain  not 1', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { assembly_category: 2, domain: 2 };

      expect(asset.domainValidation(obj)).toEqual(true);
      done();
    });
  });

  describe('Testing [gitValidation] behaviour', () => {
    it('for microservice with valid service maturity and git url', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5, giturl: 'sample.git/url' };

      expect(asset.gitValidation(obj)).toEqual(true);
      done();
    });

    it('for microservice with valid service maturity and git url undefined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5 };

      expect(asset.gitValidation(obj)).toEqual(false);
      done();
    });

    it('for Assembly with valid git url', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { giturl: 'sample.git/url' };

      expect(asset.gitValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with git url undefined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = {};

      expect(asset.gitValidation(obj)).toEqual(false);
      done();
    });

    it('default case', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('unknown');
      const obj = {};

      expect(asset.gitValidation(obj)).toBeUndefined();
      done();
    });
  });

  describe('Testing [helmUrlValidation] behaviour', () => {
    it('for microservice with valid service maturity and helm url', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5, helmurl: 'sample.helm/url' };

      expect(asset.helmUrlValidation(obj)).toEqual(true);
      done();
    });

    it('for microservice with valid service maturity and helm url undefined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5 };

      expect(asset.helmUrlValidation(obj)).toEqual(false);
      done();
    });

    it('for Assembly with valid helm url', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_maturity: 1, helmurl: 'sample.helm/url' };

      expect(asset.helmUrlValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with helm url undefined and assembly_maturity 2', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_maturity: 2 };

      expect(asset.helmUrlValidation(obj)).toEqual(false);
      done();
    });

    it('default case helmurlvalidation', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('unknown');
      const obj = {};

      expect(asset.helmUrlValidation(obj)).toBeUndefined();
      done();
    });
  });

  describe('Testing [helmChartNameValidation] behaviour', () => {
    it('for microservice with valid service maturity and helm_chartname', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5, helm_chartname: 'sample helm_chartname' };

      expect(asset.helmChartNameValidation(obj)).toEqual(true);
      done();
    });

    it('for microservice with valid service maturity and helm_chartname undefined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5 };

      expect(asset.helmChartNameValidation(obj)).toEqual(false);
      done();
    });

    it('for Assembly with valid helm_chartname', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_maturity: 1, helm_chartname: 'sample helm_chartname' };

      expect(asset.helmChartNameValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with helm_chartname undefined and assembly_maturity 2', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_maturity: 2 };

      expect(asset.helmChartNameValidation(obj)).toEqual(false);
      done();
    });

    it('default case helmChartNameValidation', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('unknown');
      const obj = {};

      expect(asset.helmChartNameValidation(obj)).toBeUndefined();
      done();
    });
  });

  describe('Testing [restrictedvalidation] behaviour', () => {
    it('for asset with valid service maturity and restrcted is set', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 5, restricted: true };

      expect(asset.restrictedvalidation(obj)).toEqual(true);
      done();
    });

    it('for asset with valid service maturity 6', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { service_maturity: 6, restricted: undefined };

      expect(asset.restrictedvalidation(obj)).toEqual(false);
      done();
    });
  });

  describe('Testing [restrictedDescriptionValidation] behaviour', () => {
    it('for asset restriction not 1', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { restricted: '2' };

      expect(asset.restrictedDescriptionValidation(obj)).toEqual(true);
      done();
    });

    it('for asset with restriction 1 and restricted_description present', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { restricted_description: 'sample', restricted: '1' };

      expect(asset.restrictedDescriptionValidation(obj)).toEqual(true);
      done();
    });

    it('for asset with restriction 1 and restricted_description not present', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { restricted: '1' };

      expect(asset.restrictedDescriptionValidation(obj)).toEqual(false);
      done();
    });
  });

  describe('Testing [additionalInfoValidation] behaviour', () => {
    it('for asset with  no additional info provided', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = {
        additional_information: [
          {
            category: '',
            title: '',
            link: '',
          },
        ],
      };

      expect(asset.additionalInfoValidation(obj)).toBeDefined();
      done();
    });

    it('for asset with  no additional info is not an array', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { additional_information: {} };

      expect(asset.additionalInfoValidation(obj)).toEqual(null);
      done();
    });
  });

  describe('Testing [checkCPIValidation] behaviour', () => {
    it('for microservice', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = {};

      expect(asset.checkCPIValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with assembly_category 1', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_category: 1 };

      expect(asset.checkCPIValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with assembly_category not 1 and CPI undefined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_category: 2 };

      expect(asset.checkCPIValidation(obj)).toEqual(true);
      done();
    });

    it('for Assembly with assembly_category not 1 and CPI defined', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('assembly');
      const obj = { assembly_category: 2, check_cpi: true };

      expect(asset.checkCPIValidation(obj)).toEqual(false);
      done();
    });

    it('default case checkCPIValidation', (done) => {
      const asset = new adp.assetValidation.AssetValidationclass('unknown');
      const obj = {};

      expect(asset.checkCPIValidation(obj)).toBeUndefined();
      done();
    });
  });

  describe('Testing [tagsValidation] behaviour', () => {
    it('for assets when no tags are provided ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = {};

      expect(await asset.tagsValidation(obj)).toEqual(null);
      done();
    });

    it('for assets when tags are provided positive case ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { tags: ['123', 'abc'] };

      expect(await asset.tagsValidation(obj)).toEqual(true);
      done();
    });

    it('for assets when tags are provided negative case ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const obj = { tags: [] };

      expect(await asset.tagsValidation(obj)).toEqual(false);
      done();
    });
  });

  describe('Testing [componentServiceValidation] behaviour', () => {
    it('successful componentserviceValidation case', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const assetObj = { component_service: 'sample' };

      expect(await asset.componentServiceValidation(assetObj)).toEqual(['doc1', 'doc2', 'doc3']);
      done();
    });

    it('Error case componentserviceValidation', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const assetObj = { component_service: 'sample' };
      global.adp.mockAdpBehaviour = 1;

      expect(await asset.componentServiceValidation(assetObj)).toEqual([]);
      done();
    });
  });

  describe('Testing [uniqueAssetNameCheck] behaviour', () => {
    it('check whether the name is unique ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const assetName = 'UNIQUE';

      expect(await asset.uniqueAssetNameCheck(assetName)).toEqual(true);
      done();
    });

    it('when the asset name is duplicate ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const assetName = 'DUPLICATE';

      expect(await asset.uniqueAssetNameCheck(assetName)).toEqual(false);
      done();
    });
  });

  describe('Testing [notifyAndLogIt] behaviour', () => {
    it('sending the asset Email and logging it', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const ID = '1';
      const ASSET = { name: 'sample' };
      const USR = { signum: 'sig' };

      expect(await asset.notifyAndLogIt(ID, ASSET, USR)).toEqual(ID);
      done();
    });

    it('Error in sending asset email and logging ', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const ID = '1';
      const ASSET = { name: 'sample' };
      const USR = { signum: 'sig' };
      global.adp.mockNotificationBehaviour = 1;

      expect(await asset.notifyAndLogIt(ID, ASSET, USR)).toEqual(ID);
      done();
    });
  });

  describe('Testing [teamHistoryCheck] behaviour', () => {
    it('test team history beahviour', async (done) => {
      const asset = new adp.assetValidation.AssetValidationclass();
      const OLD = { team: ['sample1', 'sample2'], team_mailers: ['mail1', 'mail2'] };
      const NEW = { team: ['sample3', 'sample4'], team_mailers: ['mail3', 'mail4'] };

      await asset.teamHistoryCheck(NEW, OLD);
      done();
    });
  });
});
// ============================================================================================= //
