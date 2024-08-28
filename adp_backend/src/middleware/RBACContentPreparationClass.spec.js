// ============================================================================================= //
/**
* Unit test for [ adp.middleware.RBACContentPreparationClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ adp.middleware.RBACContentPreparationClass ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.setHeaders = OBJ => OBJ;
    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLogErrors = [];
    adp.echoLog = ((T1, T2) => {
      adp.echoLogErrors.push({ message: T1, object: T2 });
    });
    adp.Answers = {};
    adp.Answers.answerWith = (CODE, RES, TIMER, TEXT) => {
      adp.Answers.gotCode = CODE;
      adp.Answers.gotRES = RES;
      adp.Answers.gotTEXT = TEXT;
    };
    adp.wordpress = {};
    adp.wordpress.mockMenus = require('./RBACContentPreparationClass.spec.json');
    adp.wordpress.behavior = 0;
    adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
      if (adp.wordpress.behavior === 0) {
        RES(adp.wordpress.mockMenus);
      } else {
        const mockError = 'Mock Error';
        REJ(mockError);
      }
    });
    adp.middleware = {};
    adp.middleware.RBACContentPreparationClass = require('./RBACContentPreparationClass');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ RBACContentPreparationClass ] Successful case for Articles.', (done) => {
    const REQ = {
      user: {
        docs: [
          {
            signum: 'unitTestMockUser',
            rbac: [
              {
                permission: [{
                  type: 'content',
                  static: ['3346'],
                }],
              },
            ],
          },
        ],
      },
      params: { wppath: 'fetchArticleValidatePath' },
      query: {
        articleSlug: 'what_is_adp',
        articleType: 'page',
        parentSlugArray: '["overview"]',
      },
    };
    const RES = {};
    const NEXT = () => {
      expect(REQ.params.id).toEqual('3346');
      expect(REQ.wpcontent.wppath).toEqual('fetchArticleValidatePath');
      expect(REQ.wpcontent.target.object_id).toEqual('3346');
      expect(REQ.wpcontent.target.articleMode).toEqual(true);
      expect(REQ.wpcontent.target.tutorialMode).toEqual(false);
      expect(REQ.wpcontent.target.previewMode).toEqual(false);
      expect(REQ.wpcontent.payload.articleSlug).toEqual('what_is_adp');
      expect(REQ.wpcontent.payload.articleType).toEqual('page');
      expect(REQ.wpcontent.payload.parentSlugArray).toEqual(['overview']);
      done();
    };

    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {})
      .catch(() => {
        done.fail();
      });
  });


  it('[ RBACContentPreparationClass ] Successful case for Articles ( if wppath is undefined ).', (done) => {
    const REQ = {
      user: {
        docs: [
          {
            signum: 'unitTestMockUser',
            rbac: [
              {
                permission: [{
                  type: 'content',
                  static: ['3346'],
                }],
              },
            ],
          },
        ],
      },
      params: { wppath: undefined },
      query: {
        articleSlug: 'what_is_adp',
        articleType: 'page',
        parentSlugArray: '["overview"]',
      },
    };
    const RES = {};
    const NEXT = () => {
      expect(REQ.params.id).toEqual('3346');
      expect(REQ.wpcontent.wppath).toEqual('fetchArticleValidatePath');
      expect(REQ.wpcontent.target.object_id).toEqual('3346');
      expect(REQ.wpcontent.target.articleMode).toEqual(true);
      expect(REQ.wpcontent.target.tutorialMode).toEqual(false);
      expect(REQ.wpcontent.target.previewMode).toEqual(false);
      expect(REQ.wpcontent.payload.articleSlug).toEqual('what_is_adp');
      expect(REQ.wpcontent.payload.articleType).toEqual('page');
      expect(REQ.wpcontent.payload.parentSlugArray).toEqual(['overview']);
      done();
    };

    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {})
      .catch(() => {
        done.fail();
      });
  });


  it('[ RBACContentPreparationClass ] Successful case for Tutorials.', (done) => {
    const REQ = {
      user: {
        docs: [
          {
            signum: 'unitTestMockUser',
            rbac: [
              {
                permission: [{
                  type: 'content',
                  static: ['3346', '9021'],
                }],
              },
            ],
          },
        ],
      },
      params: { wppath: 'fetchTutorialPageValidatePath' },
      query: {
        tutorialSlug: 'questionnaire-examples',
        parentSlugArray: '["tutorials"]',
      },
    };

    const testLinkedPaths = [
      '/getstarted/tutorials/questionnaire-examples',
      '/do-not-remove-footer-header/tutorials/questionnaire-examples',
      '/workinginadpframework/tutorials/questionnaire-examples',
    ];

    const RES = {};
    const NEXT = () => {
      expect(REQ.params.id).toEqual('9021');
      expect(REQ.wpcontent.wppath).toEqual('fetchTutorialPageValidatePath');
      expect(REQ.wpcontent.target.object_id).toEqual('9021');
      expect(REQ.wpcontent.target.articleMode).toEqual(false);
      expect(REQ.wpcontent.target.tutorialMode).toEqual(true);
      expect(REQ.wpcontent.target.previewMode).toEqual(false);
      expect(REQ.wpcontent.payload.tutorialSlug).toEqual('questionnaire-examples');
      expect(REQ.wpcontent.payload.parentSlugArray).toEqual(['tutorials']);

      const linkedUrlPaths = REQ.wpcontent.allContent['9021'].url;

      expect(linkedUrlPaths.length).toEqual(3);
      expect(linkedUrlPaths[0]).toEqual(testLinkedPaths[0]);
      expect(linkedUrlPaths[1]).toEqual(testLinkedPaths[1]);
      expect(linkedUrlPaths[2]).toEqual(testLinkedPaths[2]);
      done();
    };

    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {})
      .catch(() => {
        done.fail();
      });
  });


  it('[ RBACContentPreparationClass ] Successful case for Preview.', (done) => {
    const REQ = {
      params: { wppath: 'preview' },
      query: {
        id: '123456',
      },
    };
    const RES = {};
    const NEXT = () => {
      expect(REQ.params.id).toEqual('123456');
      expect(REQ.wpcontent.wppath).toEqual('preview');
      expect(REQ.wpcontent.target.object_id).toEqual('123456');
      expect(REQ.wpcontent.target.articleMode).toEqual(false);
      expect(REQ.wpcontent.target.tutorialMode).toEqual(false);
      expect(REQ.wpcontent.target.previewMode).toEqual(true);
      done();
    };
    const contentPreparation = (new adp.middleware.RBACContentPreparationClass())
      .process(REQ, RES, NEXT);

    expect(contentPreparation).toBeDefined();
  });


  it('[ RBACContentPreparationClass ] Successful case for Preview ( if wpath is "doc_preview" ).', (done) => {
    const REQ = {
      params: { wppath: 'doc_preview' },
      query: {
        id: '123456',
      },
    };
    const RES = {};
    const NEXT = () => {
      expect(REQ.params.id).toEqual('123456');
      expect(REQ.wpcontent.wppath).toEqual('preview');
      expect(REQ.wpcontent.target.object_id).toEqual('123456');
      expect(REQ.wpcontent.target.articleMode).toEqual(false);
      expect(REQ.wpcontent.target.tutorialMode).toEqual(false);
      expect(REQ.wpcontent.target.previewMode).toEqual(true);
      done();
    };
    const contentPreparation = (new adp.middleware.RBACContentPreparationClass())
      .process(REQ, RES, NEXT);

    expect(contentPreparation).toBeDefined();
  });


  it('[ RBACContentPreparationClass ] If [ adp.wordpress.getMenus ] breaks.', (done) => {
    const REQ = {
      params: { wppath: 'fetchArticleValidatePath' },
      query: {
        articleSlug: 'what_is_adp',
        articleType: 'page',
        parentSlugArray: '["overview"]',
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };

    adp.wordpress.behavior = 1;
    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error.origin).toEqual('loadAllContentIDs');
        expect(ERROR.error.error).toEqual('Mock Error');
        expect(adp.echoLogErrors.length).toBeGreaterThan(0);
        expect(adp.echoLogErrors[0].message).toBe('Caught an error in [ adp.wordpress.getMenus ] at [ loadAllContentIDs ]');
        expect(adp.echoLogErrors[1].message).toBe('Caught an error in the promise chain at [ process ]');
        done();
      });
  });


  it('[ RBACContentPreparationClass ] If wppath is an invalid option.', (done) => {
    const REQ = {
      params: { wppath: 'notValidOption' },
      query: {
        articleSlug: 'what_is_adp',
        articleType: 'page',
        parentSlugArray: '["overview"]',
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };

    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error.origin).toEqual('process');
        expect(adp.echoLogErrors.length).toBeGreaterThan(0);
        expect(adp.echoLogErrors[0].message).toBe('Unexpected situation on switch/case at [ extractParameters ]');
        expect(adp.echoLogErrors[0].object.details).toBe('wppath should be "fetchTutorialPageValidatePath", "preview", "doc_preview", "fetchArticleValidatePath" or undefined');
        done();
      });
  });

  it('[ RBACContentPreparationClass ] Negative case, sending invalid parameters to Article Mode.', (done) => {
    const REQ = {
      params: { wppath: 'fetchArticleValidatePath' },
      query: {
        articleSlug: 123,
        articleType: 123,
        parentSlugArray: 123,
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };
    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error).toEqual('At least one of the three parameters is invalid');
        expect(adp.Answers.gotCode).toEqual(400);
        expect(adp.Answers.gotTEXT).toEqual('400 - Bad Request');
        done();
      });
  });


  it('[ RBACContentPreparationClass ] Negative case, sending another invalid parameters to Article Mode.', (done) => {
    const REQ = {
      params: { wppath: 'fetchArticleValidatePath' },
      query: {
        articleSlug: '',
        articleType: '',
        parentSlugArray: '["overview"]]',
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };
    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error).toEqual('At least one of the three parameters is invalid');
        expect(adp.Answers.gotCode).toEqual(400);
        expect(adp.Answers.gotTEXT).toEqual('400 - Bad Request');
        done();
      });
  });


  it('[ RBACContentPreparationClass ] Negative case, sending invalid parameters to Tutorials Mode.', (done) => {
    const REQ = {
      params: { wppath: 'fetchTutorialPageValidatePath' },
      query: {
        tutorialSlug: 123,
        parentSlugArray: 123,
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };
    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error).toEqual('At least one of the two parameters is invalid');
        expect(adp.Answers.gotCode).toEqual(400);
        expect(adp.Answers.gotTEXT).toEqual('400 - Bad Request');
        done();
      });
  });


  it('[ RBACContentPreparationClass ] Negative case, sending another invalid parameters to Tutorials Mode.', (done) => {
    const REQ = {
      params: { wppath: 'fetchTutorialPageValidatePath' },
      query: {
        tutorialSlug: '',
        parentSlugArray: '["tutorials"]]',
      },
    };
    const RES = {};
    const NEXT = () => {
      done.fail();
    };
    (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.origin).toEqual('process');
        expect(ERROR.error).toEqual('At least one of the two parameters is invalid');
        expect(adp.Answers.gotCode).toEqual(400);
        expect(adp.Answers.gotTEXT).toEqual('400 - Bad Request');
        done();
      });
  });
});
