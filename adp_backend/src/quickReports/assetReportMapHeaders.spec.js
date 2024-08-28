/**
 * Unit test for [ global.adp.quickReports.AssetReportMapHeaders ]
 * @author Cein-Sven Da Costa [edaccei]
 */
describe('Testing [ global.adp.quickReports.AssetReportMapHeaders ] class', () => {
  let getComplianceOptionsResp;
  let errorDb;
  beforeEach(() => {
    getComplianceOptionsResp = {
      resolve: true,
      data: '',
    };
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.document = {};

    global.adp.tags = {
      getLabel: tag => tag,
    };

    global.adp.compliance = {};
    global.adp.compliance.readComplianceOptions = {
      getComplianceOptions: () => new Promise((resolve, reject) => {
        if (getComplianceOptionsResp.resolve) {
          resolve(getComplianceOptionsResp.data);
        } else {
          reject(getComplianceOptionsResp.data);
        }
      }),
    };

    global.adp.models = {};
    global.adp.models.Gitstatus = class Gitstatus {
      constructor() {
        this.dbName = 'gitStatus';
      }

      getDataForReport() {
        return new Promise((resolve, reject) => {
          if (errorDb) {
            reject();
          } else {
            const resp = {
              docs: [],
            };
            resolve(resp);
          }
          return this.dbName;
        });
      }
    };
    global.adp.quickReports = {};
    global.adp.quickReports.AssetReportMapHeaders = require('./AssetReportMapHeaders');
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('denormalizeTags', () => {
    it('should build a string of tags.', () => {
      const tag1 = 'tag1';
      const tag2 = { label: 'tag2' };
      const testTagArr = [tag1, tag2];

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.denormalizeTags(testTagArr);

      expect(result).toBe(`${tag1}, ${tag2.label}`);
    });

    it('should return empty string if no tags are passed.', () => {
      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.denormalizeTags([]);

      expect(result).toBe('');
    });
  });

  describe('getDocUrlPath', () => {
    it('should absolute path for a document object with filepath.', () => {
      const docObj = { filepath: 'filepath' };
      const repoUrl = 'repo';

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.getDocUrlPath(docObj, repoUrl);

      expect(result).toBe(`${repoUrl}/${docObj.filepath}`);
    });

    it('should external link.', () => {
      const docObj = { external_link: 'link' };
      const repoUrl = 'repo';

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.getDocUrlPath(docObj, repoUrl);

      expect(result).toBe(docObj.external_link);
    });

    it('should return an empty string if no filepath or external link.', () => {
      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

  describe('mapCompliance', () => {
    it('should update the status and comment with denorm data if found, if not leave blank.', () => {
      const name = 'test';
      const status = 'testStatus';
      const comment = 'testComment';
      const optionObj = {
        service_name: 'options',
        status: '',
        comment: '',
      };
      const compOptsArr = [
        { group: '1', name: '1', ...optionObj },
        { group: '2', name: '2', ...optionObj },
      ];
      const denormCompArr = [
        {
          group: '1', name: '1', status, comment,
        },
      ];

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.mapCompliance(compOptsArr, denormCompArr, name);

      expect(result[0].service_name).toBe(name);
      expect(result[0].status).toBe(status);
      expect(result[0].comment).toBe(comment);

      expect(result[1].service_name).toBe(name);
      expect(result[1].status).toBe('');
      expect(result[1].comment).toBe('');
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

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
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

  describe('flattenCompDenormList', () => {
    it('should return a single dimension object array from a multi-dimension array.', () => {
      const group = 'testgroup';
      const name = 'testName';
      const status = 'testStatus';
      const comment = 'testComment';
      const testGroupObj = {
        group,
        fields: [
          {
            field: name,
            answer: status,
            comment,
            randomField: 'shouldNotShow',
          },
        ],
      };

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.flattenCompDenormList([testGroupObj]);

      expect(result[0].group).toBe(group);
      expect(result[0].name).toBe(name);
      expect(result[0].status).toBe(status);
      expect(result[0].comment).toBe(comment);
      expect(result[0].randomField).toBeUndefined();
    });

    it('should return a empty array if no field items.', () => {
      const group = 'testgroup';
      const testGroupObj = {
        group,
        fields: [],
      };

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.flattenCompDenormList([testGroupObj]);

      expect(result.length).toBe(0);
    });

    it('should return array if no groups.', () => {
      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const result = reportMap.flattenCompDenormList([]);

      expect(result.length).toBe(0);
    });
  });

  describe('buildStandardCompQues', () => {
    it('should map the questions to the headers while adding the default status.', () => {
      const defaultStatus = 'defaultStatus';
      const headers = {
        group: 'header',
        name: 'header',
        description: 'header',
        status: 'header',
        notInGroup: 'header',
      };

      const testFieldObj = {
        slug: 'testSlug',
        name: 'testName',
        desc: 'testDesc',
        notInHeader: 'shouldNotShow',
      };
      const testGroupObj = {
        group: 'testGroup',
        fields: [testFieldObj],
      };

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      const resultArr = reportMap.buildStandardCompQues([testGroupObj], headers, defaultStatus);
      const result = resultArr[0];

      expect(result.group).toBe(testGroupObj.group);
      expect(result.name).toBe(testFieldObj.name);
      expect(result.description).toBe(testFieldObj.desc);
      expect(result.status).toBe(defaultStatus);
      expect(result.notInGroup).toBe('');
      expect(result.notInHeader).toBeUndefined();
    });

    it('should return empty array if no fields or no groups or no headers.', () => {
      const headers = {
        group: 'header',
        name: 'header',
        description: 'header',
        status: 'header',
        notInGroup: 'header',
      };
      const testGroupObj = {
        group: 'testGroup',
        fields: [],
      };

      const reportMap = global.adp.quickReports.AssetReportMapHeaders;
      let result = reportMap.buildStandardCompQues([testGroupObj], headers, '');

      expect(result.length).toBe(0);

      result = reportMap.buildStandardCompQues([], headers, '');

      expect(result.length).toBe(0);

      result = reportMap.buildStandardCompQues([testGroupObj], {}, '');

      expect(result.length).toBe(0);
    });
  });

  describe('getComplianceQues', () => {
    it('should return correctly formed Compliance questions from the given header.', (done) => {
      const headers = {
        group: 'header',
        name: 'header',
        description: 'header',
        status: 'header',
        notInGroup: 'header',
      };
      const testDefaultFieldObj = {
        slug: 'testSlug',
        name: 'testNameDefault',
        desc: 'testDesc',
        notInHeader: 'shouldNotShow',
        default: true,
      };
      const testFieldObj = {
        slug: 'testSlug2',
        name: 'testName2',
        desc: 'testDesc2',
      };
      const testGroupObj = {
        group: 'testGroup',
        fields: [testFieldObj, testDefaultFieldObj],
      };

      getComplianceOptionsResp.data = JSON.stringify(
        { groups: [testGroupObj], answers: [testDefaultFieldObj, testFieldObj] },
      );

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([], {});
      reportMap.getComplianceQues(headers).then((resultArr) => {
        expect(resultArr[0].group).toBe(testGroupObj.group);
        expect(resultArr[0].name).toBe(testFieldObj.name);
        expect(resultArr[0].description).toBe(testFieldObj.desc);
        expect(resultArr[0].status).toBe(testDefaultFieldObj.name);
        expect(resultArr[0].notInGroup).toBe('');

        expect(resultArr[1].group).toBe(testGroupObj.group);
        expect(resultArr[1].name).toBe(testDefaultFieldObj.name);
        expect(resultArr[1].description).toBe(testDefaultFieldObj.desc);
        expect(resultArr[1].status).toBe(testDefaultFieldObj.name);
        expect(resultArr[1].notInGroup).toBe('');
        expect(resultArr[1].notInHeader).toBeUndefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should reject of reading the compliance options fails.', (done) => {
      const headers = {
        group: 'header',
        name: 'header',
        description: 'header',
        status: 'header',
        notInGroup: 'header',
      };

      getComplianceOptionsResp.resolve = false;
      getComplianceOptionsResp.data = 'error';

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([], {});
      reportMap.getComplianceQues(headers).then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject of the built standard questions are empty.', (done) => {
      getComplianceOptionsResp.data = JSON.stringify(
        { groups: [], answers: [] },
      );
      getComplianceOptionsResp.data = 'error';

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([], {});
      reportMap.getComplianceQues({}).then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('mapAllHeaders', () => {
    it('should return all mapped data to headers.', (done) => {
      const testData = require('./assetReportMapHeaders.spec.json');
      const { asset1: testAsset1, headers } = testData;

      const team1 = testAsset1.team[0];
      const team2 = testAsset1.team[1];
      const team1Denorm = 'role1';
      const team2Denorm = 'role2';
      const demormComp = testAsset1.denorm.compliance;
      const doc1 = testAsset1.documentsForRendering.development.cat1test[0];
      const doc2 = testAsset1.documentsForRendering.ver1Test.cat1test[0];

      const docVer = 'ver1Test';

      // comp question data
      const testDefaultCompFieldObj = {
        id: 1,
        name: 'compFieldName1',
        desc: 'testDesc',
        group: 'testCompGroup',
        default: true,
      };
      const testCompFieldObj = {
        id: 2,
        name: 'compFieldName2',
        desc: 'testDesc2',
        group: 'testCompGroup',
      };
      const testGroupObj = {
        id: 1,
        group: 'testCompGroup',
        fields: [testDefaultCompFieldObj, testCompFieldObj],
      };
      getComplianceOptionsResp.data = JSON.stringify(
        { groups: [testGroupObj], answers: [testDefaultCompFieldObj, testCompFieldObj] },
      );

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([testAsset1], headers);
      reportMap.mapAllHeaders().then((result) => {
        expect(result.heading_overview).toBeDefined();
        expect(result.heading_documentation).toBeDefined();
        expect(result.heading_compliance).toBeDefined();
        expect(result.heading_team).toBeDefined(0);
        expect(result.data_overview.length).toBeGreaterThan(0);
        expect(result.data_documentation.length).toBeGreaterThan(0);
        expect(result.data_compliance.length).toBeGreaterThan(0);
        expect(result.data_team.length).toBeGreaterThan(0);

        const overview = result.data_overview[0];

        expect(overview.name).toBe(testAsset1.name);
        expect(overview.description).toBe(testAsset1.description);
        expect(overview.tags).toBe(`${testAsset1.tags[0].label}, ${testAsset1.tags[1].label}`);
        expect(overview.restricted).toBe(testAsset1.denorm.restricted);
        expect(overview.restricted_description).toBe(testAsset1.restricted_description);
        expect(overview.product_number).toBe(testAsset1.product_number);
        expect(overview.reusability_level).toBe(testAsset1.denorm.reusability_level);
        expect(overview.service_category).toBe(testAsset1.denorm.service_category);
        expect(overview.report_service_bugs).toBe(testAsset1.report_service_bugs);
        expect(overview.request_service_support).toBe(testAsset1.request_service_support);
        expect(overview.domain).toBe(testAsset1.denorm.domain);
        expect(overview.based_on).toBe(testAsset1.based_on);
        expect(overview.serviceArea).toBe(testAsset1.denorm.serviceArea);
        expect(overview.service_maturity).toBe(testAsset1.denorm.service_maturity);
        expect(overview.helm_chartname).toBe(testAsset1.helm_chartname);
        expect(overview.helmurl).toBe(testAsset1.helmurl);
        expect(overview.giturl).toBe(testAsset1.giturl);
        expect(overview.discussion_forum_link).toBe(testAsset1.discussion_forum_link);

        const doc1result = result.data_documentation[0];
        const doc2result = result.data_documentation[1];

        expect(doc1result.service_name).toBe(testAsset1.name);
        expect(doc1result.version).toBe('In Development');
        expect(doc1result.category).toBe(doc1.category_name);
        expect(doc1result.name).toBe(doc1.name);
        expect(doc1result.url).toBe(`${testAsset1.repo_urls.development}/${doc1.filepath}`);
        expect(doc1result.restricted).toBe('No');
        expect(doc1result.default).toBe('Yes');
        expect(doc1result.menu_auto).toBe(testAsset1.denorm.menu_auto);
        expect(doc1result.repo_urls_development).toBe(testAsset1.repo_urls.development);
        expect(doc1result.repo_urls_release).toBe(testAsset1.repo_urls.release);

        expect(doc2result.service_name).toBe(testAsset1.name);
        expect(doc2result.version).toBe(docVer);
        expect(doc2result.category).toBe(doc2.category_name);
        expect(doc2result.name).toBe(doc2.name);
        expect(doc2result.url).toBe(doc2.external_link);
        expect(doc2result.restricted).toBe('Yes');
        expect(doc2result.default).toBe('No');

        const comp1result = result.data_compliance[0];
        const comp2result = result.data_compliance[1];

        expect(comp1result.service_name).toBe(testAsset1.name);
        expect(comp1result.group).toBe(testDefaultCompFieldObj.group);
        expect(comp1result.name).toBe(testDefaultCompFieldObj.name);
        expect(comp1result.description).toBe(testDefaultCompFieldObj.desc);
        expect(comp1result.status).toBe(demormComp[0].fields[0].answer);
        expect(comp1result.comment).toBe(demormComp[0].fields[0].comment);

        expect(comp2result.service_name).toBe(testAsset1.name);
        expect(comp2result.group).toBe(testCompFieldObj.group);
        expect(comp2result.name).toBe(testCompFieldObj.name);
        expect(comp2result.description).toBe(testCompFieldObj.desc);
        expect(comp2result.status).toBe(demormComp[0].fields[1].answer);
        expect(comp2result.comment).toBe(demormComp[0].fields[1].comment);

        const team1result = result.data_team[0];
        const team2result = result.data_team[1];

        expect(team1result.service_name).toBe(testAsset1.name);
        expect(team1result.name).toBe(team1.name);
        expect(team1result.email).toBe(team1.email);
        expect(team1result.signum).toBe(team1.signum);
        expect(team1result.team_role).toBe(team1Denorm);
        expect(team1result.serviceOwner).toBe('No');

        expect(team2result.service_name).toBe(testAsset1.name);
        expect(team2result.name).toBe(team2.name);
        expect(team2result.email).toBe(team2.email);
        expect(team2result.signum).toBe(team2.signum);
        expect(team2result.team_role).toBe(team2Denorm);
        expect(team2result.serviceOwner).toBe('Yes');

        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should reject if fetching the compliance questions fails.', (done) => {
      getComplianceOptionsResp.resolve = false;
      getComplianceOptionsResp.data = 'error';

      const ovHead = {};
      const docHead = {};
      const compHead = {};
      const teamHead = {};
      const headers = {
        heading_overview: ovHead,
        heading_documentation: docHead,
        heading_compliance: compHead,
        heading_team: teamHead,
      };

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([], headers);
      reportMap.mapAllHeaders().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject if fetching the contributors data fails.', (done) => {
      errorDb = true;

      const ovHead = {};
      const docHead = {};
      const compHead = {};
      const teamHead = {};
      const headers = {
        heading_overview: ovHead,
        heading_documentation: docHead,
        heading_compliance: compHead,
        heading_team: teamHead,
      };

      const reportMap = new global.adp.quickReports.AssetReportMapHeaders([], headers);
      reportMap.mapAllHeaders().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('mapContributors', () => {
    it('should return mapped data for contributors', (done) => {
      const contriData = [{
        field1: 'Value 1',
        field2: 'Value 2',
      }];
      const contriHeader = {
        service_name: 'Name',
        field1: 'Field 1',
        field2: 'Field 2',
        field3: 'Field 3',
      };
      const assetName = 'Test';
      const resp = adp.quickReports.AssetReportMapHeaders.mapContributors(
        contriData, contriHeader, assetName,
      );

      expect(resp).toBeDefined();
      expect(resp.length).toEqual(1);
      done();
    });
  });
});
