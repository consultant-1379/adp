
const proxyquire = require('proxyquire');
/**
* Unit test for [ adp.peoplefinder.BaseOperations ]
* @author Cein [edaccei]
*/

describe('Testing [ adp.peoplefinder.BaseOperations ], ', () => {
  let pplFinderResp;
  class PeopleFinder {
    constructor() {
      this.data = pplFinderResp.data;
      this.resolve = pplFinderResp.resolve;
    }

    peopleSearchBySignum() {
      return new Promise((res, rej) => (this.resolve ? res(this.data) : rej(this.data)));
    }

    functionalUserSearchBySignum() {
      return new Promise((res, rej) => (this.resolve ? res(this.data) : rej(this.data)));
    }

    pdlSearchByMailNickname() {
      return new Promise((res, rej) => (this.resolve ? res(this.data) : rej(this.data)));
    }

    pdlMembersSearchByMailNickname() {
      return new Promise((res, rej) => (this.resolve ? res(this.data) : rej(this.data)));
    }
  }

  class MockModelRetry {
    constructor(method) {
      this.method = method;
    }

    init() {
      return this.method();
    }
  }

  beforeEach(() => {
    pplFinderResp = {
      data: [],
      resolve: true,
    };
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.models = {};
    adp.models.PeopleFinder = PeopleFinder;

    adp.peoplefinder = {};
    adp.peoplefinder.BaseOperations = proxyquire('./BaseOperations', {
      '../library/ModelRetry': MockModelRetry,
    });
  });

  afterEach(() => {
    adp = null;
  });

  it('searchPeopleBySignum: Should return person data successfully.', (done) => {
    const testSignum = 'test';
    pplFinderResp.data = { signum: testSignum };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPeopleBySignum(testSignum).then((resp) => {
      expect(resp.signum).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchPeopleBySignum: Should return person data successfully multiple times, to use the local cache.', (done) => {
    const testSignum = 'test';
    const testAnotherSignum = 'test1';
    const testAnotherOneSignum = 'test2';
    pplFinderResp.data = { signum: testSignum };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    const finishThisTest = () => {
      done();
    };

    const functionalUserNotFromCache = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchPeopleBySignum(testAnotherOneSignum).then((resp) => {
        expect(resp).toEqual([]);
        finishThisTest();
      }).catch(() => {
        done.fail();
      });
    };

    const functionalUserSimpleCaseFromCache = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchPeopleBySignum(testAnotherSignum).then((resp) => {
        expect(resp).toEqual([]);
        functionalUserNotFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    const functionalUserSimpleCase = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchPeopleBySignum(testAnotherSignum).then((resp) => {
        expect(resp).toEqual([]);
        functionalUserSimpleCaseFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    const successfullSimpleCaseUserFromCache = () => {
      pplBaseOps.searchPeopleBySignum(testSignum).then((resp) => {
        expect(resp.signum).toBe(testSignum);
        functionalUserSimpleCase();
      }).catch(() => {
        done.fail();
      });
    };

    const successfullSimpleCase = () => {
      pplBaseOps.searchPeopleBySignum(testSignum).then((resp) => {
        expect(resp.signum).toBe(testSignum);
        successfullSimpleCaseUserFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    successfullSimpleCase();
  });

  it('searchPeopleBySignum: Should reject if the signum is not of type string or is empty.', (done) => {
    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPeopleBySignum(null).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((typeError) => {
      expect(typeError.code).toBe(400);
      pplBaseOps.searchPeopleBySignum('').then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((emptyError) => {
        expect(emptyError.code).toBe(400);
        done();
      });
    });
  });

  it('searchPeopleBySignum: Should reject if the peopleSearchBySignum rejects.', (done) => {
    const testSignum = 'test';
    pplFinderResp.resolve = false;
    pplFinderResp.data = { code: 500 };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPeopleBySignum(testSignum).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('searchFunctionalUserBySignum: Should return functional user data successfully.', (done) => {
    const testSignum = 'test';
    pplFinderResp.data = { signum: testSignum };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchFunctionalUserBySignum(testSignum).then((resp) => {
      expect(resp.signum).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchFunctionalUserBySignum: Should return functional user data successfully multiple times, to use the local cache.', (done) => {
    const testSignum = 'test';
    const testAnotherSignum = 'test1';
    const testAnotherOneSignum = 'test2';
    pplFinderResp.data = { signum: testSignum };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    const finishThisTest = () => {
      done();
    };

    const personalUserNotFromCache = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchFunctionalUserBySignum(testAnotherOneSignum).then((resp) => {
        expect(resp).toEqual([]);
        finishThisTest();
      }).catch(() => {
        done.fail();
      });
    };

    const personalUserSimpleCaseFromCache = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchFunctionalUserBySignum(testAnotherSignum).then((resp) => {
        expect(resp).toEqual([]);
        personalUserNotFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    const personalUserSimpleCase = () => {
      pplFinderResp.data = [];
      pplBaseOps.searchFunctionalUserBySignum(testAnotherSignum).then((resp) => {
        expect(resp).toEqual([]);
        personalUserSimpleCaseFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    const successfullSimpleCaseUserFromCache = () => {
      pplBaseOps.searchFunctionalUserBySignum(testSignum).then((resp) => {
        expect(resp.signum).toBe(testSignum);
        personalUserSimpleCase();
      }).catch(() => {
        done.fail();
      });
    };

    const successfullSimpleCase = () => {
      pplBaseOps.searchFunctionalUserBySignum(testSignum).then((resp) => {
        expect(resp.signum).toBe(testSignum);
        successfullSimpleCaseUserFromCache();
      }).catch(() => {
        done.fail();
      });
    };

    successfullSimpleCase();
  });

  it('searchFunctionalUserBySignum: Should reject if the signum is not of type string or is empty.', (done) => {
    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchFunctionalUserBySignum(null).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((typeError) => {
      expect(typeError.code).toBe(400);
      pplBaseOps.searchFunctionalUserBySignum('').then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((emptyError) => {
        expect(emptyError.code).toBe(400);
        done();
      });
    });
  });

  it('searchFunctionalUserBySignum: Should reject if the functionalUserSearchBySignum rejects.', (done) => {
    const testSignum = 'test';
    pplFinderResp.resolve = false;
    pplFinderResp.data = { code: 500 };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchFunctionalUserBySignum(testSignum).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('searchPDLByMailNickname: Should return pdl data successfully.', (done) => {
    const testMailNickname = 'test';
    pplFinderResp.data = { mailNickname: testMailNickname };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPDLByMailNickname(testMailNickname).then((resp) => {
      expect(resp.mailNickname).toBe(testMailNickname);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchPDLByMailNickname: Should reject if the mailNickname is not of type string or is empty.', (done) => {
    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPDLByMailNickname(null).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((typeError) => {
      expect(typeError.code).toBe(400);
      pplBaseOps.searchPDLByMailNickname('').then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((emptyError) => {
        expect(emptyError.code).toBe(400);
        done();
      });
    });
  });

  it('searchPDLByMailNickname: Should reject if the pdlSearchByMailNickname rejects.', (done) => {
    const testMailNickname = 'test';
    pplFinderResp.resolve = false;
    pplFinderResp.data = { code: 500 };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.searchPDLByMailNickname(testMailNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlMemberSearchByNickname: Should return pdl member data successfully.', (done) => {
    const testMailNickname = 'test';
    pplFinderResp.data = { mailNickname: testMailNickname };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.pdlMemberSearchByNickname(testMailNickname).then((resp) => {
      expect(resp.mailNickname).toBe(testMailNickname);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('pdlMemberSearchByNickname: Should reject if the mailNickname is not of type string or is empty.', (done) => {
    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.pdlMemberSearchByNickname(null).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((typeError) => {
      expect(typeError.code).toBe(400);
      pplBaseOps.pdlMemberSearchByNickname('').then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((emptyError) => {
        expect(emptyError.code).toBe(400);
        done();
      });
    });
  });

  it('pdlMemberSearchByNickname: Should reject if the pdlMembersSearchByMailNickname rejects.', (done) => {
    const testMailNickname = 'test';
    pplFinderResp.resolve = false;
    pplFinderResp.data = { code: 500 };

    const pplBaseOps = new adp.peoplefinder.BaseOperations();

    pplBaseOps.pdlMemberSearchByNickname(testMailNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });
});
