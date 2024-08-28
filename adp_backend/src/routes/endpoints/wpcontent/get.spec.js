// ============================================================================================= //
/**
* Unit test for [ adp.routes.endpoints.wpcontent.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.routes.endpoints.wpcontent.get ] ', () => {
  // =========================================================================================== //

  class mockProxyClass {
    constructor(URL) {
      global.mockExpect.serverURL = URL;
    }

    getData(WPPATH, PAYLOAD) {
      global.mockExpect.wppath = WPPATH;
      global.mockExpect.payload = PAYLOAD;
      return new Promise((RES, REJ) => {
        if (adp.proxy.mockBehavior === 0) {
          RES(`MOCK CONTENT FROM ${WPPATH}`);
        } else if (adp.proxy.mockBehavior === 1) {
          const mockCrash = 'mockCrashError';
          REJ(mockCrash);
        } else if (adp.proxy.mockBehavior === 2) {
          const obj = {
            parentSlugResults: [
              {
                linked_menu: [[
                  { object_id: '3346' },
                  { object_id: '0000' },
                  { object_id: '9999' },
                  { object_id: '1234' },
                  { object_id: '5678' },
                  { object_id: '9012' },
                ]],
              },
            ],
          };
          RES(obj);
        } else if (adp.proxy.mockBehavior === 3) {
          const obj = {
            parentSlugResults: [
              {
                linked_menu: [[
                  { object_id: '3345' },
                ]],
              },
            ],
            slugResults: [
              {
                ID: '3345',
                post_type: 'tutorials',
                post_content: 'mockContent',
                post_author: '0',
              }
            ]
          };
          RES(obj);
        } else if (adp.proxy.mockBehavior === 4) {
          const obj = {
            parentSlugResults: [
              {
                linked_menu: [[
                  { object_id: '3346' },
                ]],
              },
            ],
            slugResults: [
              {
                ID: '3346',
                post_type: 'articles',
                post_content: 'mockContent',
                post_author: '1',
              }
            ]
          };
          RES(obj);
        } else if (adp.proxy.mockBehavior === 5) {
          const obj = {
            parentSlugResults: [
              {
                linked_menu: [[
                  { object_id: '3347' },
                ]],
              },
            ],
            slugResults: [
              {
                ID: '3347',
                post_type: 'articles',
                post_content: 'mockContent',
                post_author: '2',
              }
            ]
          };
          RES(obj);
        } else {
          const mockCrash = { code: 404 };
          REJ(mockCrash);
        }
      });
    }

    getUser() {
      return new Promise((RES, REJ) => {
        const userDetails = '{"slug":"slug"}';
        RES(userDetails);
      });
    }
  }

  // =========================================================================================== //

  class MockRESClass {
    constructor(CALLBACK) {
      this.callback = CALLBACK;
    }

    end(CONTENT) {
      this.callback(CONTENT);
    }
  }

  // =========================================================================================== //
  class MockInstrumentClass {
    getLocationIDWP() {
      return 'mockLocationID';
    }

    apply() {
      return 'mockContent';
    }
  }

  // =========================================================================================== //
  class MockCommentsDL {
    getCommentsDL() {
      return {
        docs: [
          {
            dlName: ['PDLADPFRAM'],
            dlEmail: ['PDLADPFRAM@pdl.internal.ericsson.com'],
            type: 'page',
            active: true,
          },
          {
            dlName: ['PDLADPUNIC'],
            dlEmail: ['PDLADPUNIC@pdl.internal.ericsson.com'],
            type: 'tutorials',
            active: true,
          },
        ]
      };
    }
  }

  // =========================================================================================== //
  class MockRecursivePDLMembers {
    searchByMailers() {
      return {
        members: [
          {
            peopleFinder: {
              mailNickname: 'esupuse',
              displayName: 'Super User',
            },
          },
          {
            peopleFinder: {
              mailNickname: 'etesuse',
              displayName: 'Test User',
            },
          },
        ]
      };
    }
  }

  // =========================================================================================== //
  // Mock answer template for [ adp.middleware.RBACContentPreparationClass ]

  const middlewareMockTemplate = {
    userRequest: {
      _id: 'mockUser',
    },
    rbac: {
      mockUser: {
        admin: true,
      },
    },
    wpcontent: {
      wppath: null,
      target: {
        object_id: null,
        articleMode: false,
        tutorialMode: false,
        previewMode: false,
      },
      payload: {
        articleSlug: 'what_is_adp',
        articleType: 'page',
        parentSlugArray: [
          'overview',
        ],
      },
      isArticle: true,
      isTutorial: false,
      isPreview: false,
    },
    wpFullUserMenu: {
      mockUser: [
        '3346',
        '1234',
      ],
    },
  };

  // =========================================================================================== //

  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => { }; // (STR, OBJ) => { console.log(STR, OBJ); };
    global.mockExpect = {};
    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];
    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    adp.Answers = {};
    adp.Answers.answerWith = (errorCode, RES, TIMER, errorText) => {
      const messageObject = {
        code: errorCode,
        message: errorText,
      };
      RES.end(JSON.stringify(messageObject));
    };
    adp.setHeaders = RES => RES;
    adp.config = {};
    adp.config.wordpress = {};
    adp.config.wordpress.url = 'https://mockWordPressLink/';
    adp.routes = {};
    adp.routes.endpoints = {};
    adp.routes.endpoints.wpcontent = {};
    adp.routes.endpoints.wpcontent.get = require('./get');

    adp.proxy = {};
    adp.proxy.mockBehavior = 0;
    adp.proxy.ProxyClass = mockProxyClass;

    adp.models = {};
    adp.models.CommentsDL = MockCommentsDL;

    adp.peoplefinder = {};
    adp.peoplefinder.RecursivePDLMembers = MockRecursivePDLMembers;

    adp.comments = {};
    adp.comments.InstrumentClass = MockInstrumentClass;
  });

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case test', (done) => {
    const CALLBACK = (OBJ) => {
      expect(OBJ).toBe('"MOCK CONTENT FROM fetchArticleValidatePath"');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    const REQ = adp.clone(middlewareMockTemplate);
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });


  it('Successful case test if user is not admin', (done) => {
    const CALLBACK = (OBJ) => {
      const obj = JSON.parse(OBJ);

      expect(obj.parentSlugResults).toBeDefined();
      expect(obj.parentSlugResults[0].linked_menu[0].length).toBe(2);
      expect(obj.parentSlugResults[0].linked_menu[0][0]).toEqual({ object_id: '3346' });
      expect(obj.parentSlugResults[0].linked_menu[0][1]).toEqual({ object_id: '1234' });
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    adp.proxy.mockBehavior = 2;
    const REQ = adp.clone(middlewareMockTemplate);
    REQ.rbac.mockUser.admin = false;
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });

  it('Successful case test if author is 0', (done) => {
    const CALLBACK = (OBJ) => {
      const obj = JSON.parse(OBJ);

      expect(obj.parentSlugResults).toBeDefined();
      expect(obj.slugResults).toBeDefined();
      expect(obj.slugResults[0].ID).toEqual('3345');
      expect(obj.slugResults[0].post_type).toEqual('tutorials');
      expect(obj.slugResults[0].post_content).toEqual('mockContent');
      expect(obj.slugResults[0].post_author).toEqual('0');
      expect(obj.slugResults[0].location_id).toEqual('mockLocationID');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    adp.proxy.mockBehavior = 3;
    const REQ = adp.clone(middlewareMockTemplate);
    REQ.rbac.mockUser.admin = false;
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3345';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });

  it('Successful case test if author is 1', (done) => {
    const CALLBACK = (OBJ) => {
      const obj = JSON.parse(OBJ);

      expect(obj.parentSlugResults).toBeDefined();
      expect(obj.slugResults).toBeDefined();
      expect(obj.slugResults[0].ID).toEqual('3346');
      expect(obj.slugResults[0].post_type).toEqual('articles');
      expect(obj.slugResults[0].post_content).toEqual('mockContent');
      expect(obj.slugResults[0].post_author).toEqual('1');
      expect(obj.slugResults[0].location_id).toEqual('mockLocationID');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    adp.proxy.mockBehavior = 4;
    const REQ = adp.clone(middlewareMockTemplate);
    REQ.rbac.mockUser.admin = false;
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });

  it('Successful case test if author is 2', (done) => {
    const CALLBACK = (OBJ) => {
      const obj = JSON.parse(OBJ);

      expect(obj.parentSlugResults).toBeDefined();
      expect(obj.slugResults).toBeDefined();
      expect(obj.slugResults[0].ID).toEqual('3347');
      expect(obj.slugResults[0].post_type).toEqual('articles');
      expect(obj.slugResults[0].post_content).toEqual('mockContent');
      expect(obj.slugResults[0].post_author).toEqual('2');
      expect(obj.slugResults[0].location_id).toEqual('mockLocationID');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    adp.proxy.mockBehavior = 5;
    const REQ = adp.clone(middlewareMockTemplate);
    REQ.rbac.mockUser.admin = false;
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3347';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });


  it('Negative case test - If [ proxy.getData @ adp.proxy.ProxyClass ] breaks', (done) => {
    const CALLBACK = (OBJ) => {
      expect(OBJ).toBe('{"code":500,"message":"Error 500"}');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    const REQ = adp.clone(middlewareMockTemplate);
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };

    adp.proxy.mockBehavior = 1;
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });


  it('Negative case test - If [ proxy.getData @ adp.proxy.ProxyClass ] returns a 404 error', (done) => {
    const CALLBACK = (OBJ) => {
      expect(OBJ).toBe('{"code":404,"message":"Error 404"}');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    const REQ = adp.clone(middlewareMockTemplate);
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    REQ.wpcontent.payload = {
      articleSlug: 'what_is_adp',
      articleType: 'page',
      parentSlugArray: [
        'overview',
      ],
    };

    adp.proxy.mockBehavior = 6;
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });


  it('Negative case test - If [ adp.middleware.RBACContentPreparationClass ] not ran before this function', (done) => {
    const CALLBACK = (OBJ) => {
      expect(OBJ).toBe('{"code":500,"message":"Error 500"}');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    const REQ = {};
    adp.proxy.mockBehavior = 1;
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });


  it('Negative case test - If [ adp.middleware.RBACContentPreparationClass ] not delivery all parameters', (done) => {
    const CALLBACK = (OBJ) => {
      expect(OBJ).toBe('{"code":500,"message":"Error 500"}');
      done();
    };
    adp.mockRES = new MockRESClass(CALLBACK);

    const REQ = adp.clone(middlewareMockTemplate);
    REQ.wpcontent.wppath = 'fetchArticleValidatePath';
    REQ.wpcontent.target.object_id = '3346';
    REQ.wpcontent.target.articleMode = true;
    delete REQ.wpcontent.payload;

    adp.proxy.mockBehavior = 1;
    adp.routes.endpoints.wpcontent.get(REQ, adp.mockRES);
  });
  // =========================================================================================== //
});
