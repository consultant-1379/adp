/**
 * Unit test for [ global.adp.quickReports.AssemblyReportMapHeaders ]
 * @author Cein-Sven Da Costa [edaccei]
 */
describe('Testing [ global.adp.quickReports.AssemblyReportMapHeaders ] class', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.document = {};

    global.adp.tags = {
      getLabel: tag => tag,
    };

    global.adp.assembly = {};
    // eslint-disable-next-line max-len
    global.adp.assembly.getComponentServicesFromAssembly = OBJ => new Promise(RESOLVE => RESOLVE(OBJ));
    global.adp.quickReports = {};
    global.adp.quickReports.AssemblyReportMapHeaders = require('./AssemblyReportMapHeaders');
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('denormalizeTags', () => {
    it('should build a string of tags.', () => {
      const tag1 = 'tag1';
      const tag2 = { label: 'tag2' };
      const testTagArr = [tag1, tag2];

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.denormalizeTags(testTagArr);

      expect(result).toBe(`${tag1}, ${tag2.label}`);
    });

    it('should return empty string if no tags are passed.', () => {
      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.denormalizeTags([]);

      expect(result).toBe('');
    });
  });

  describe('getDocUrlPath', () => {
    it('should absolute path for a document object with filepath.', () => {
      const docObj = { filepath: 'filepath' };
      const repoUrl = 'repo';

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.getDocUrlPath(docObj, repoUrl);

      expect(result).toBe(`${repoUrl}/${docObj.filepath}`);
    });

    it('should external link.', () => {
      const docObj = { external_link: 'link' };
      const repoUrl = 'repo';

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.getDocUrlPath(docObj, repoUrl);

      expect(result).toBe(docObj.external_link);
    });

    it('should return an empty string if no filepath or external link.', () => {
      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.getDocUrlPath({}, '');

      expect(result).toBe('');
    });
  });

  describe('mapAsset', () => {
    it('should map the asset obj to the headers.', () => {
      const tags = ['tag1', 'tag2'];
      const asset = {
        tags,
        testBool1: false,
        testBool2: true,
        testDenorm: 'incorrectValue',
        testNull: null,
        notInHeader: 'notInHeader',
      };
      const denorm = {
        testDenorm: 'correctValue',
      };
      const header = {
        tags: 'header',
        testBool1: 'header',
        testBool2: 'header',
        testDenorm: 'header',
        testNull: 'header',
      };

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.mapAsset(asset, header, denorm);

      expect(result.tags).toBe(`${tags[0]}, ${tags[1]}`);
      expect(result.testBool1).toBe('No');
      expect(result.testBool2).toBe('Yes');
      expect(result.testDenorm).toBe(denorm.testDenorm);
      expect(result.testNull).toBe('');
      expect(result.notInHeader).toBeUndefined();
    });
  });

  describe('mapDoc ', () => {
    it('should map the doc obj to the headers.', () => {
      const name = 'name';
      const ver = 'ver';
      const menuAuto = 'l';
      const repoObj = {
        development: 'dev',
        release: 'rel',
      };

      const asset = {
        category_name: 'cat',
        filepath: 'filepath',
        testBool1: false,
        testBool2: true,
        restricted: true,
        notInHeader: 'notInHeader',
      };
      const header = {
        service_name: 'header',
        version: 'header',
        category: 'header',
        url: 'header',
        menu_auto: 'header',
        repo_urls_development: 'header',
        repo_urls_release: 'header',
        restricted: 'header',
        default: 'header',
        notInObj: 'header',
        testBool1: 'header',
        testBool2: 'header',
        isCpiUpdated: 'header',
      };

      const isCpiUpdated = true;

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.mapDoc(asset, header, name, ver, menuAuto, repoObj, isCpiUpdated);

      expect(result.service_name).toBe(name);
      expect(result.version).toBe(ver);
      expect(result.category).toBe(asset.category_name);
      expect(result.url).toBe(`${repoObj.release}/${asset.filepath}`);
      expect(result.menu_auto).toBe('L');
      expect(result.repo_urls_development).toBe(repoObj.development);
      expect(result.repo_urls_release).toBe(repoObj.release);
      expect(result.restricted).toBe('Yes');
      expect(result.default).toBe('No');
      expect(result.testBool1).toBe('No');
      expect(result.testBool2).toBe('Yes');
      expect(result.isCpiUpdated).toBe('Yes');
      expect(result.notInObj).toBe('');
      expect(result.notInHeader).toBeUndefined();
    });
  });

  describe('mapDocs', () => {
    it('should return array of mapped documents to the given header.', () => {
      const name = 'name';
      const ver = 'ver';
      const menuAuto = 'l';
      const repoObj = {
        development: 'dev',
        release: 'rel',
      };

      const asset = {
        category_name: 'cat',
        filepath: 'filepath',
        testBool1: false,
        testBool2: true,
        restricted: true,
        notInHeader: 'notInHeader',
      };
      const asset2 = {
        category_name: 'cat2',
        external_link: 'link',
        restricted: false,
        notInHeader: 'notInHeader',
      };
      const header = {
        service_name: 'header',
        version: 'header',
        category: 'header',
        url: 'header',
        menu_auto: 'header',
        repo_urls_development: 'header',
        repo_urls_release: 'header',
        restricted: 'header',
        default: 'header',
        notInObj: 'header',
        testBool1: 'header',
        testBool2: 'header',
        isCpiUpdated: 'header',
      };

      const testDocObj = {};
      testDocObj[ver] = { versionLabel: 'ver', isCpiUpdated: false };
      testDocObj[ver][asset.category_name] = [asset];
      testDocObj[ver][asset2.category_name] = [asset2];

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.mapDocs(testDocObj, header, name, menuAuto, repoObj);

      expect(result[0].service_name).toBe(name);
      expect(result[0].version).toBe(ver);
      expect(result[0].category).toBe(asset.category_name);
      expect(result[0].url).toBe(`${repoObj.release}/${asset.filepath}`);
      expect(result[0].menu_auto).toBe('L');
      expect(result[0].repo_urls_development).toBe(repoObj.development);
      expect(result[0].repo_urls_release).toBe(repoObj.release);
      expect(result[0].restricted).toBe('Yes');
      expect(result[0].default).toBe('No');
      expect(result[0].testBool1).toBe('No');
      expect(result[0].testBool2).toBe('Yes');
      expect(result[0].notInObj).toBe('');
      expect(result[0].isCpiUpdated).toBe('No');
      expect(result[0].notInHeader).toBeUndefined();

      expect(result[1].service_name).toBe(name);
      expect(result[1].version).toBe(ver);
      expect(result[1].category).toBe(asset2.category_name);
      expect(result[1].url).toBe(asset2.external_link);
      expect(result[1].menu_auto).toBe('L');
      expect(result[1].repo_urls_development).toBe(repoObj.development);
      expect(result[1].repo_urls_release).toBe(repoObj.release);
      expect(result[1].restricted).toBe('No');
      expect(result[1].default).toBe('No');
      expect(result[1].testBool1).toBe('');
      expect(result[1].testBool2).toBe('');
      expect(result[1].notInObj).toBe('');
      expect(result[1].notInHeader).toBeUndefined();
    });
  });

  describe('mapTeamData', () => {
    it('should return the mapped team to the headers with denorm data.', () => {
      const name = 'test';
      const team = [
        { serviceOwner: true, team_role: 1 },
        { team_role: 2 },
      ];
      const denorm = [{ team_role: 'role1' }, { team_role: 'role2' }];
      const teamHeader = {
        service_name: 'header',
        team_role: 'header',
        serviceOwner: 'header',
        notInObj: 'header',
      };

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.mapTeamData(team, teamHeader, name, denorm);

      expect(result[0].service_name).toBe(name);
      expect(result[0].team_role).toBe(denorm[0].team_role);
      expect(result[0].serviceOwner).toBe('Yes');
      expect(result[0].notInObj).toBe('');

      expect(result[1].service_name).toBe(name);
      expect(result[1].team_role).toBe(denorm[1].team_role);
      expect(result[1].serviceOwner).toBe('No');
      expect(result[1].notInObj).toBe('');
    });
  });

  describe('mapAdditionalInfoData', () => {
    it('should return the mapped additional information details to the headers with data.', () => {
      const name = 'test';
      const addInfo = [
        { category: 'title', title: 'some data', link: 'www.link1.com' },
        { category: 'demo', title: 'some data 1', link: 'www.link2.com' },
      ];
      const addInfoHeader = {
        service_name: 'header',
        category: 'header',
        title: 'header',
        link: 'header',
      };

      const reportMap = global.adp.quickReports.AssemblyReportMapHeaders;
      const result = reportMap.mapAdditionalInfoData(addInfo, addInfoHeader, name);

      expect(result[0].service_name).toBe(name);
      expect(result[0].category).toBe('title');
      expect(result[0].title).toBe('some data');
      expect(result[0].link).toBe('www.link1.com');

      expect(result[1].service_name).toBe(name);
      expect(result[1].category).toBe('demo');
      expect(result[1].title).toBe('some data 1');
      expect(result[1].link).toBe('www.link2.com');
    });
  });
});
