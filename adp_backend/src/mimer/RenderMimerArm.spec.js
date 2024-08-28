// ============================================================================================= //
/**
* Unit test for [ adp.mimer.RenderMimerArm ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //


class mockAdpModel {
  getMimerDevelopmentVersionFromYAML() {
    return new Promise(RESOLVE => RESOLVE(''));
  }

  getOneById(MOCKID) {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.getOneById === true || adp.mockBehavior.getOneById === 0) {
        const obj = { docs: [{ _id: MOCKID, mockMicroservice: true, mimer_menu: ['version1', 'version2'] }] };
        RES(obj);
      } else if (adp.mockBehavior.getOneById === 3) {
        const obj = {};
        RES(obj);
      } else {
        const ERROR = {
          code: 500,
          message: 'MockError',
        };
        REJ(ERROR);
      }
    });
  }

  update() {
    if (!adp.mockBehavior.updateMS) {
      const ERROR = {
        code: 500,
        message: 'MockError',
      };
      return new Promise((RES, REJ) => REJ(ERROR));
    }
    return new Promise(RES => RES());
  }

  getJustTheMimerVersionStarterFromAsset() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.getJustTheMimerVersionStarterFromAsset === true) {
        const obj = '0.0.0';
        RES(obj);
      } else {
        const ERROR = {
          code: 500,
          message: 'MockError',
        };
        REJ(ERROR);
      }
    });
  }

  getLatestVersionByMSId() {
    return new Promise((RES) => {
      RES('0.0.0');
    });
  }

  getAssetSlugUsingID() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.getAssetSlugUsingID === true) {
        RES('mock-asset-slug');
      } else {
        const ERROR = {
          code: 500,
          message: 'MockError',
        };
        REJ(ERROR);
      }
    });
  }

  getARMMenu(ID) {
    return new Promise((RES, REJ) => {
      if (ID === 'mockedMSId') {
        const obj = {
          menu_auto: true,
          repo_urls: {
            development: '',
            release: '',
          },
          menu: {
            auto: {
              development: [],
              release: [],
              date_modified: '',
              errors: {
                development: [],
                release: [],
              },
            },
            manual: {
              development: [
                {
                  name: 'Service Overview',
                  slug: 'service-overview',
                  external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                  default: true,
                },
                {
                  name: 'Service Deployment Guide',
                  slug: 'service-deployment-guide',
                  external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                },
                {
                  name: 'Application Developers Guide',
                  slug: 'application-developers-guide',
                  external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                },
                {
                  name: 'Troubleshooting Guide',
                  slug: 'troubleshooting-guide',
                  external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                },
              ],
              release: [],
              date_modified: '',
            },
          },
        };
        RES(obj);
      } else {
        const ERROR = {
          code: 500,
          message: 'MockError',
        };
        REJ(ERROR);
      }
    });
  }

  updateLastSyncDate() {
    if (adp.mockBehavior.updateLastSyncDate === true) {
      return new Promise(RES => RES());
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}

const mockEchoLogClass = class {
  createOne() {
    return new Promise((RES) => {
      RES();
    });
  }
};

class MockListOption {
  getItemsForGroup() {
    const result = {
      docs: [
        {
          _id: '3e40f822bab762133a9c3b968800c09e',
          'select-id': 1,
          type: 'item',
          name: 'Developer Product Information',
          'group-id': 10,
          'test-id': 'filter-dpi',
          order: 0,
          slug: 'dpi',
        },
        {
          _id: '3e40f822bab762133a9c3b9688013c00',
          'select-id': 2,
          type: 'item',
          name: 'Inner Source',
          'group-id': 10,
          'test-id': 'filter-inner-source',
          order: 1,
          slug: 'inner-source',
        },
        {
          _id: '3e40f822bab762133a9c3b968801d8ed',
          'select-id': 3,
          type: 'item',
          name: 'Release Documents',
          'group-id': 10,
          'test-id': 'filter-release-documents',
          order: 3,
          slug: 'release-documents',
        },
        {
          _id: '3e40f822bab762133a9c3b968801f98c',
          'select-id': 4,
          type: 'item',
          name: 'Additional Documents',
          'group-id': 10,
          'test-id': 'filter-additional-documents',
          order: 4,
          default: true,
          slug: 'additional-documents',
        },
      ],
    };
    return new Promise((RESOLVE) => {
      RESOLVE(result);
    });
  }
}

class MockAssetDocuments {
  createOrUpdate() {
    if (adp.mockBehavior.createOrUpdate === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }

  getMenuVersions(ASSETID, TYPE) {
    if (adp.mockBehavior.getMenuVersions === false && ASSETID) {
      const mockError = {
        code: 500,
        message: 'MockError',
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    let obj;
    switch (TYPE) {
      case 'raw':
        obj = ['1.0.2', '1.0.3'];
        return new Promise(RES => RES(obj));
      case 'mimer':
        obj = ['1.0.2', '1.0.3'];
        return new Promise(RES => RES(obj));
      case 'merged':
        obj = ['1.0.2', '1.0.3'];
        return new Promise(RES => RES(obj));
      default:
        obj = {
          error: 'MockError',
        };
        return new Promise((RES, REJ) => REJ(obj));
    }
  }

  getSpecificVersion() {
    if (adp.mockBehavior.getSpecificVersion === true) {
      const obj = { docs: [] };
      return new Promise(RES => RES(obj));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }

  hardDeleteThoseVersionsFromDatabase(ASSETID, TYPE, TOCLEAR) {
    if (adp.mockBehavior.hardDeleteThoseVersionsFromDatabase === true
      && ASSETID && TYPE && TOCLEAR) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}
// ============================================================================================= //


describe('Testing [ adp.mimer.RenderMimerArm ] Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};
    adp.docs = {};
    adp.docs.list = [];
    adp.models = {};
    adp.models.Adp = mockAdpModel;
    adp.models.Listoption = MockListOption;
    adp.models.AssetDocuments = MockAssetDocuments;
    adp.clone = data => data;
    adp.models.EchoLog = mockEchoLogClass;
    adp.queue = {};
    adp.microservice = {};
    adp.feRendering = {};
    adp.microservice.updateAssetDocSettings = (MS) => {
      if (adp.mockBehavior.updateSettings === 1) {
        return new Promise((RES, REJ) => REJ());
      }
      return new Promise(RES => RES(MS));
    };

    adp.feRendering.prepareDocStructureForRendering = () => {
      const response = {
        documentsForRendering: ['version1', 'version2'],
      };
      return new Promise(RES => RES(response));
    };

    adp.queue.addJobs = () => {
      if (adp.mockBehavior.addJobs === 1) {
        return new Promise((RES, REJ) => REJ());
      }
      return new Promise(RES => RES());
    };

    adp.queue.getNextIndex = () => new Promise(RES => RES(0));

    adp.mockBehavior = {
      addJobs: 0,
      getOneById: true,
      updateMS: true,
      updateSettings: 0,
    };
    adp.dynamicSort = require('./../library/dynamicSort');
    adp.versionSort = require('./../library/versionSort');
    adp.mimer = {};
    adp.mimer.RenderMimerArm = require('./RenderMimerArm');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ _prepareArmAutoMenuVersions ] Simple Successful Case.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = {
      development: [
        { version: 'development', something: true },
      ],
      release: [
        { version: '1.0', mock: true },
        { version: '2.0', mock: true },
        { version: '3.0', mock: true },
      ],
    };
    const expectedResult = [
      { version: 'development', source: ['auto'] },
      { version: '1.0', source: ['auto'] },
      { version: '2.0', source: ['auto'] },
      { version: '3.0', source: ['auto'] },
    ];
    await render._prepareArmAutoMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmAutoMenuVersions ] Simple Alternative Case 1.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [{ version: 'development', source: ['mimer'] }, { version: '1.0', source: ['mimer'] }];
    const mockArmMenu = {
      development: [
        { version: 'development', something: true },
      ],
      release: [
        { version: '1.0', mock: true },
        { version: '2.0', mock: true },
        { version: '3.0', mock: true },
      ],
    };
    const expectedResult = [
      { version: 'development', source: ['mimer', 'auto'] },
      { version: '1.0', source: ['mimer', 'auto'] },
      { version: '2.0', source: ['auto'] },
      { version: '3.0', source: ['auto'] },
    ];
    await render._prepareArmAutoMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmAutoMenuVersions ] Simple Alternative Case 2.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = {};
    const expectedResult = [];
    await render._prepareArmAutoMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmAutoMenuVersions ] Simple Alternative Case 3.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = null;
    const expectedResult = [];
    await render._prepareArmAutoMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmManualMenuVersions ] Simple Successful Case.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = {
      development: [
        { version: 'development', something: true },
      ],
      release: [
        { version: '1.0', mock: true },
        { version: '2.0', mock: true },
        { version: '3.0', mock: true },
      ],
    };
    const expectedResult = [
      { version: 'development', source: ['manual'] },
      { version: '1.0', source: ['manual'] },
      { version: '2.0', source: ['manual'] },
      { version: '3.0', source: ['manual'] },
    ];
    await render._prepareArmManualMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmManualMenuVersions ] Simple Alternative Case 1.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [{ version: 'development', source: ['mimer'] }, { version: '1.0', source: ['mimer'] }];
    const mockArmMenu = {
      development: [
        { version: 'development', something: true },
      ],
      release: [
        { version: '1.0', mock: true },
        { version: '2.0', mock: true },
        { version: '3.0', mock: true },
      ],
    };
    const expectedResult = [
      { version: 'development', source: ['mimer', 'manual'] },
      { version: '1.0', source: ['mimer', 'manual'] },
      { version: '2.0', source: ['manual'] },
      { version: '3.0', source: ['manual'] },
    ];
    await render._prepareArmManualMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmManualMenuVersions ] Simple Alternative Case 2.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = {};
    const expectedResult = [];
    await render._prepareArmManualMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _prepareArmManualMenuVersions ] Simple Alternative Case 3.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const mockVersions = [];
    const mockArmMenu = null;
    const expectedResult = [];
    await render._prepareArmManualMenuVersions(mockVersions, mockArmMenu);

    expect(mockVersions).toEqual(expectedResult);
    done();
  });


  it('[ _getMS ] Simple Successful Case.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    render._getMS('MockMSID')
      .then((RESULT) => {
        expect(RESULT).toEqual({ _id: 'MockMSID', mockMicroservice: true, mimer_menu: ['version1', 'version2'] });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ _getMS ] Simple Alternative Case 1.', async (done) => {
    adp.mockBehavior.getOneById = 2;
    const render = new adp.mimer.RenderMimerArm();
    render._getMS('MockMSID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });


  it('[ _getMS ] Simple Alternative Case 2.', async (done) => {
    adp.mockBehavior.getOneById = 3;
    const render = new adp.mimer.RenderMimerArm();
    render._getMS('MockMSID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });


  it('[ _updateMicroservice ] Simple Successful Case.', async (done) => {
    const mockMS = {
      _id: 'mockMSID',
      mockMS: true,
    };
    const render = new adp.mimer.RenderMimerArm();
    render._updateMicroservice(mockMS)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ _updateMicroservice ] Simple Alternative Case.', async (done) => {
    adp.mockBehavior.updateMS = false;
    const mockMS = {
      _id: 'mockMSID',
      mockMS: true,
    };
    const render = new adp.mimer.RenderMimerArm();
    render._updateMicroservice(mockMS)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });

  it('[mainQueuePreparation] Simple Successfull case', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'mockedMSId';
    const QUEUEOBJECTIVE = {};
    adp.mockBehavior.getJustTheMimerVersionStarterFromAsset = true;
    render.mainQueuePreparation(MSID, QUEUEOBJECTIVE)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[mainQueuePreparation] throws an error', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'mockedMSId';
    const QUEUEOBJECTIVE = {};
    adp.mockBehavior.getOneById = false;
    render.mainQueuePreparation(MSID, QUEUEOBJECTIVE)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });

  it('[versionDocumentPreparation] Simple Successful case', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'mockedMSId';
    const MIMERVERSIONSTARTER = 'mockedStringWithStarterVersion';
    const VERSIONS = [['development', ['auto']], ['8.3.1', ['mimer']], ['8.3.0', ['mimer']]];
    adp.mockBehavior.getAssetSlugUsingID = true;
    adp.mockBehavior.getSpecificVersion = true;

    render.versionDocumentPreparation(MSID, MIMERVERSIONSTARTER, VERSIONS)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[ _generateQueueForMenuRenderPerVersion ] Error Case.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    adp.mockBehavior.addJobs = 1;
    const MSID = 'mockedMSId';
    const QUEUEOBJECTIVE = {};
    render._generateQueueForMenuRenderPerVersion(MSID, QUEUEOBJECTIVE, '', [{ version: '1.2.1' }, { version: '5.2.8' }, { version: '1.2.3' }])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });

  it('[versionDocumentPreparation] Error Case.', async (done) => {
    adp.mockBehavior.updateMS = false;
    adp.mockBehavior.getOneById = 2;
    const MSID = 'mockedMSId';
    const render = new adp.mimer.RenderMimerArm();
    render.versionDocumentPreparation(MSID)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });

  it('[ _addArmMenu ] successful Case.', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    adp.mockBehavior.createOrUpdate = true;
    const ASSETID = 'MockMSID';
    const ASSETSLUG = 'mock-ms-slug';
    const CURRENTVERSION = '1.0.2+';
    const MENUOBJECT = {
      '1.0.2': {
        'additional-documents': [],
        versionLabel: '1.0.2',
        isCpiUpdated: false,
      },
    };

    render._addArmMenu(ASSETID, ASSETSLUG, CURRENTVERSION, MENUOBJECT)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[ _addMimerMenu ] successful Case.', async (done) => {
    const ASSETID = 'MockMSID';
    const ASSETSLUG = 'mock-ms-slug';
    const CURRENTVERSION = '8.3.0';
    const MENUOBJECT = [
      {
        asset_id: '45e7f4f992afe7bbb62a3391e500ffry',
        asset_slug: 'auto-ms-mimer',
        type: 'mimer',
        version: '8.3.0',
        docs: { versionLabel: '8.3.0', 'release-documents': [] },
      },
    ];
    const render = new adp.mimer.RenderMimerArm();
    adp.mockBehavior.createOrUpdate = true;

    render._addMimerMenu(ASSETID, ASSETSLUG, CURRENTVERSION, MENUOBJECT)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[finshRenderProcess] simple successful case', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'mockedMSId';
    adp.mockBehavior.getAssetSlugUsingID = true;
    adp.mockBehavior.hardDeleteThoseVersionsFromDatabase = true;
    adp.mockBehavior.updateLastSyncDate = true;
    adp.mockBehavior.getJustTheMimerVersionStarterFromAsset = true;

    render.finshRenderProcess(MSID)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[finshRenderProcess] throws an error', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'mockedMSId';
    adp.mockBehavior.getOneById = false;

    render.finshRenderProcess(MSID)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.packName).toEqual('adp.mimer.RenderMimerArmClass');
        done();
      });
  });

  it('[_getMimerMenuByVersion] simple successful case', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MS = {
      mimer_menu: ['version1', 'version2'],
    };

    render._getMimerMenuByVersion(MS, 0)
      .then((RESULT) => {
        expect(RESULT).toBe('version1');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[_getMimerMenuByVersion] Version not found case', async (done) => {
    const render = new adp.mimer.RenderMimerArm();
    const MS = {
    };

    render._getMimerMenuByVersion(MS, '0')
      .then((RESULT) => {
        expect(RESULT).toBe(null);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[_addMergedMenu] Success case', async (done) => {
    adp.mockBehavior.createOrUpdate = true;
    const render = new adp.mimer.RenderMimerArm();
    const MSID = 'MockMSID';
    const MSSLUG = 'mock-slug';
    const CURRENTVERSION = '8.3.0';
    const ARMMENU = {
      '8.3.0': {
        'additional-documents': [
          {
            name: 'Sample 3',
            filepath: '8.3.0/CAS_Deployment_Guide.zip',
            slug: 'sample-3',
            default: true,
            url: 'https://localhost/notify/mockartifactory/local/dynamic/8.3.0/CAS_Deployment_Guide.zip',
            doc_route: [
              '/marketplace',
              'auto-ms-mimer-2',
              'documentation',
              '8.3.0',
              'additional-documents',
              'sample-3',
            ],
            doc_link: 'https://localhost:9999/document/auto-ms-mimer-2/8.3.0/additional-documents/sample-3',
            doc_mode: 'api',
          },
        ],
        versionLabel: '8.3.0',
        isCpiUpdated: true,
      },
    };
    const MIMERMENU = [
      {
        asset_id: 'MockMSID',
        asset_slug: 'mock-slug',
        type: 'mimer',
        version: '8.3.0',
        docs: {
          versionLabel: '8.3.0',
          'release-documents': [{
            name: 'User Guide',
            mimer_source: true,
            category_name: 'Release Documents',
            category_slug: 'release-documents',
            doc_route: [
              '/marketplace',
              'mockMs',
              'documentation',
              '1.0.0',
              'release-documents',
              'user-guide',
            ],
            doc_link: 'https://mockurl/document/mockMs/8.3.0/release-documents/user-guide',
          }],
        },
      },
    ];

    render._addMergedMenu(MSID, MSSLUG, CURRENTVERSION, ARMMENU, MIMERMENU)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[_reOrderCategories] Success case', async (done) => {
    const mockList = {
      docs: {
        versionLabel: '1.0.0',
        'release-documents': [
          {
            name: 'User Guide',
            mimer_source: true,
            category_name: 'Release Documents',
            category_slug: 'release-documents',
            doc_route: [
              '/marketplace',
              'mockMs',
              'documentation',
              '1.0.0',
              'release-documents',
              'user-guide',
            ],
            doc_link: 'https://mockurl/document/mockMs/8.3.0/release-documents/user-guide',
          },
          {
            name: 'Service User Guide',
            mimer_source: true,
            category_name: 'Release Documents',
            category_slug: 'release-documents',
          },
          {
            name: 'API Specification',
            category_name: 'Release Documents',
            category_slug: 'release-documents',
          },
          {
            name: 'Application Developers Guide',
            category_name: 'Release Documents',
            category_slug: 'release-documents',
          },
          {
            name: 'Contributing Guideline',
            category_name: 'Release Documents',
            category_slug: 'release-documents',
          },
          {
            name: 'Inner Source README',
            category_name: 'Release Documents',
            category_slug: 'release-documents',
            doc_route: [
              '/marketplace',
              'mockMs',
              'documentation',
              'development',
              'inner-source',
              'inner-source-readme',
            ],
            doc_link: 'https://mockurl/document/mockMs/development/inner-source/inner-source-readme',
          },
        ],
      },
    };
    const render = new adp.mimer.RenderMimerArm();
    render._reOrderAllCategories(mockList);

    expect(mockList).toBeTruthy();
    expect(mockList.docs['release-documents'][0].name).toEqual('User Guide');
    done();
  });

  it('[_reOrderVersions] Success case', async (done) => {
    const mockList = {
      menu_merged: {
        '1.0.0': {
          versionLabel: '1.0.0',
          'release-documents': [
            {
              name: 'Service User Guide',
              mimer_source: true,
              category_name: 'Release Documents',
              category_slug: 'release-documents',
            },
          ],
          dpi: [
            {
              name: 'User Guide',
              mimer_source: true,
              category_name: 'Developer Product Information',
              category_slug: 'dpi',
            },
          ],
          'inner-source': [
            {
              name: 'Inner Source README',
              mimer_source: true,
              category_name: 'Inner Source',
              category_slug: 'inner-source',
            },
          ],
        },
        '2.0.0': {
          versionLabel: '2.0.0',
          'release-documents': [
            {
              name: 'ADP Guidelines',
              category_name: 'Release Documents',
              category_slug: 'release-documents',
            },
          ],
          dpi: [
            {
              name: 'User Guide',
              mimer_source: true,
              category_name: 'Developer Product Information',
              category_slug: 'dpi',
            },
          ],
        },
      },
    };
    const render = new adp.mimer.RenderMimerArm();
    render._reOrderVersions(mockList);
    const keys = Object.keys(mockList.menu_merged);

    expect(mockList).toBeTruthy();
    expect(keys[0]).toEqual('2.0.0');
    done();
  });

  it('[_recategorizeDocuments] Success case for Software Vendor List from mimer', async (done) => {
    const menu = {
      versionLabel: '1.0.7',
      isCpiUpdated: false,
      isMimerCertificated: true,
      'release-documents': [
        {
          name: 'Software Vendor List (SVL)',
          slug: 'software-vendor-list-svl',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
          document_server_source: 'mimer',
        },
        {
          name: 'Software Vendor List (SVL)',
          slug: 'software-vendor-list-svl',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
          document_server_source: 'arm',
        },
      ],
      'additional-documents': [],
      dpi: [
        {
          name: 'Service User Guide',
          slug: 'service-user-guide',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
          document_server_source: 'arm',
        },
      ],
    };
    const menuType = 'merged';
    const mimerVersionStarter = '1.0.3';

    const render = new adp.mimer.RenderMimerArm();
    const result = await render._recategorizeDocuments(
      menu, menuType, mimerVersionStarter, undefined,
    );
    const svl = result
      && Array.isArray(result['release-documents'])
      ? result['release-documents'].find(item => item.name.includes('Software Vendor List'))
      : {};

    expect(svl.document_server_source).toEqual('mimer');
    done();
  });

  it('[_recategorizeDocuments] Success case for Software Vendor List from arm', async (done) => {
    const menu = {
      versionLabel: '1.0.7',
      isCpiUpdated: false,
      isMimerCertificated: true,
      'release-documents': [
        {
          name: 'Test Report',
          slug: 'test-report',
          document_server_source: 'mimer',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
        },
        {
          name: 'Software Vendor List (SVL)',
          slug: 'software-vendor-list-svl',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
          document_server_source: 'arm',
        },
      ],
      'additional-documents': [],
      dpi: [
        {
          name: 'Service User Guide',
          slug: 'service-user-guide',
          category_name: 'Release Documents',
          category_slug: 'release-documents',
          document_server_source: 'arm',
        },
      ],
    };
    const menuType = 'merged';
    const mimerVersionStarter = '1.0.3';

    const render = new adp.mimer.RenderMimerArm();
    const result = await render._recategorizeDocuments(
      menu, menuType, mimerVersionStarter, undefined,
    );
    const svl = result
      && Array.isArray(result['release-documents'])
      ? result['release-documents'].find(item => item.name.includes('Software Vendor List'))
      : {};

    expect(svl.document_server_source).toEqual('arm');
    done();
  });
});

// ============================================================================================= //
