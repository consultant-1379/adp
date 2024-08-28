/**
* Unit test for [ adp.models.PeopleFinder ]
* @author Cein [edaccei]
*/

describe('Testing [ adp.models.PeopleFinder ], ', () => {
  let pplFindData = {};
  beforeAll(() => {
    pplFindData = require('./peopleFinder.spec.json');
  });

  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    global.request = (options, callback) => callback(null, {}, {});

    adp.echoLog = () => {};

    adp.config = {};
    adp.config.peopleFinderApiUrl = '';

    adp.models = {};
    adp.models.azure = {};
    adp.models.azure.token = () => new Promise(resolve => resolve('token'));
    adp.models.PeopleFinder = require('./PeopleFinder');
  });

  afterEach(() => {
    adp = null;
  });

  it('peopleSearchBySignum: Should return a person not of type functional user.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum, true).then((resp) => {
      expect(resp.length).toBe(1);
      expect(resp[0].id).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('peopleSearchBySignum: Should return a functional user.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum).then((resp) => {
      expect(resp.length).toBe(2);
      expect(resp[1].id).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('peopleSearchBySignum: Should reject if the token fetch rejects.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    adp.models.azure.token = () => new Promise((resolve, reject) => reject());

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('peopleSearchBySignum: Should reject if the request returns an error.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      'Error', { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('peopleSearchBySignum: Should reject if the request returns a statusCode not of 200.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 501 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(501);
      done();
    });
  });

  it('peopleSearchBySignum: Should reject if the request returns a body of not type json.', (done) => {
    const testdata = pplFindData.peopleSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, testdata,
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.peopleSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBeDefined();
      done();
    });
  });

  it('functionalUserSearchBySignum: Should return a functional user not of type person.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum, true).then((resp) => {
      expect(resp.length).toBe(1);
      expect(resp[0].id).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('functionalUserSearchBySignum: Should return a person.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'personSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum).then((resp) => {
      expect(resp.length).toBe(2);
      expect(resp[1].id).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('functionalUserSearchBySignum: Should reject if the token fetch rejects.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, JSON.stringify(testdata),
    );

    adp.models.azure.token = () => new Promise((resolve, reject) => reject());

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('functionalUserSearchBySignum: Should reject if the request returns an error.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      'Error', { statusCode: 200 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('functionalUserSearchBySignum: Should reject if the request returns a statusCode not of 200.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 501 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(501);
      done();
    });
  });

  it('functionalUserSearchBySignum: Should reject if the request returns a body of not type json.', (done) => {
    const testdata = pplFindData.functionalUserSearch;
    const testSignum = 'funcUserSignum';
    global.request = (options, callback) => callback(
      null, { statusCode: 200 }, testdata,
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.functionalUserSearchBySignum(testSignum, true).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBeDefined();
      done();
    });
  });

  it('pdlSearchByMailNickname: Should return pdl data.', (done) => {
    const testdata = pplFindData.pdlSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback(null, { statusCode: 200 }, testdata);

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlSearchByMailNickname(testNickname).then((resp) => {
      expect(resp.totalNoOfResults).toBe(1);
      expect(resp.elements[0].mailNickname).toBe(testNickname);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('pdlSearchByMailNickname: Should reject if the token fetch rejects.', (done) => {
    const testdata = pplFindData.pdlSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback(null, { statusCode: 200 }, testdata);

    adp.models.azure.token = () => new Promise((resolve, reject) => reject());

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlSearchByMailNickname: Should reject if the request returns an error.', (done) => {
    const testdata = pplFindData.pdlSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback('Error', { statusCode: 200 }, testdata);

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlSearchByMailNickname: Should reject if the request returns a statusCode not of 200.', (done) => {
    const testdata = pplFindData.pdlSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback(
      null, { statusCode: 501 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(501);
      done();
    });
  });

  it('pdlMembersSearchByMailNickname: Should return pdl member data.', (done) => {
    const testdata = pplFindData.pdlMemberSearch;
    const testNickname = 'TESTPDL';
    const testSignum = 'TESTSIGNUM';
    global.request = (options, callback) => callback(null, { statusCode: 200 }, testdata);

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlMembersSearchByMailNickname(testNickname).then((resp) => {
      expect(resp.totalNoOfResults).toBe(2);
      expect(resp.elements[0].mailNickname).toBe(testNickname);
      expect(resp.elements[1].mailNickname).toBe(testSignum);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('pdlMembersSearchByMailNickname: Should reject if the token fetch rejects.', (done) => {
    const testdata = pplFindData.pdlMemberSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback(null, { statusCode: 200 }, testdata);

    adp.models.azure.token = () => new Promise((resolve, reject) => reject());

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlMembersSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlMembersSearchByMailNickname: Should reject if the request returns an error.', (done) => {
    const testdata = pplFindData.pdlMemberSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback('Error', { statusCode: 200 }, testdata);

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlMembersSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('pdlMembersSearchByMailNickname: Should reject if the request returns a statusCode not of 200.', (done) => {
    const testdata = pplFindData.pdlMemberSearch;
    const testNickname = 'TESTPDL';
    global.request = (options, callback) => callback(
      null, { statusCode: 501 }, JSON.stringify(testdata),
    );

    const pplFinder = new adp.models.PeopleFinder();

    pplFinder.pdlMembersSearchByMailNickname(testNickname).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(501);
      done();
    });
  });
});
