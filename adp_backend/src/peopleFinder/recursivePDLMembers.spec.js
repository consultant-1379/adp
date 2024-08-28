const recursiveJson = require('./recursivePDLMembers.spec.json');
/**
* Unit test for [ adp.peoplefinder.recursivePDLMember ]
* @author Cein [edaccei]
*/
describe('Testing [ adp.peoplefinder.recursivePDLMember ], ', () => {
  let adpUserRes;
  let missingDocsResponse;
  let pdlMemberSearchByNicknameRes;
  let searchPDLByMailNicknameResp;
  class BaseOperations {
    constructor() {
      this.recurObj = recursiveJson.recursiveTestData;
      this.searchPDLByMailNicknameResp = searchPDLByMailNicknameResp;
    }

    pdlMemberSearchByNickname(dataKey) {
      return new Promise((res, rej) => {
        if (pdlMemberSearchByNicknameRes) {
          res(this.recurObj[dataKey]);
        } else {
          const error = {};
          rej(error);
        }
      });
    }

    searchPDLByMailNickname(mailNickname) {
      return new Promise((res, rej) => {
        if (this.searchPDLByMailNicknameResp.resolve) {
          let resp;
          if (!this.searchPDLByMailNicknameResp.malformed) {
            resp = { elements: [] };
          } else {
            resp = { elements: null };
          }
          if (this.searchPDLByMailNicknameResp.setData) {
            resp.elements.push(mailNickname);
          }
          res(resp);
        } else {
          const error = {};
          rej(error);
        }
      });
    }
  }

  beforeEach(() => {
    adpUserRes = true;
    missingDocsResponse = false;
    pdlMemberSearchByNicknameRes = true;
    searchPDLByMailNicknameResp = {
      resolve: true,
      setData: true,
      malformed: false,
    };

    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.user = {};
    adp.user.thisUserShouldBeInDatabase = signum => new Promise((res, rej) => {
      if (adpUserRes) {
        if (missingDocsResponse) {
          res({});
        } else {
          res({ docs: [recursiveJson.userData[signum]] });
        }
      } else {
        const err = { message: '', code: 404 };
        rej(err);
      }
    });

    adp.peoplefinder = {};
    adp.peoplefinder.BaseOperations = BaseOperations;

    adp.peoplefinder.RecursivePDLMembers = require('./RecursivePDLMembers');
  });

  afterEach(() => {
    adp = null;
  });

  it('searchByMailers: Should return five members from the recursive data with portal users, with default recursive limit.', (done) => {
    const mailers = ['group1@ericsson.com', 'group2@pdl.internal.ericsson.com', 'group3'];

    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true, 'notCorrectValue');

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(5);
      expect(memberResp.members.length).toBe(5);
      expect(memberResp.errors.length).toBe(0);
      expect(memberResp.warnings.length).toBeGreaterThan(0);

      const testLastMember = memberResp.members[4];

      expect(testLastMember.portal.signum).toBe(testLastMember.peopleFinder.mailNickname);
      expect(testLastMember.portal.signum).toBe('signum5');

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return one member if the recursiveLimit is 1 and should not return portal users .', (done) => {
    const mailers = ['group2'];

    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, 'NotTheCorrectValue', 1);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(1);
      expect(memberResp.members.length).toBe(1);
      expect(memberResp.errors.length).toBe(0);
      expect(memberResp.warnings.length).toBe(0);

      const testLastMember = memberResp.members[0];

      expect(testLastMember.portal).not.toBeDefined();
      expect(testLastMember.peopleFinder.mailNickname).toBe('signum1');

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return one member if the recursiveLimit is 1 and the pagination response has multiple pages.', (done) => {
    const mailers = ['group7'];

    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, false, 1);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(1);
      expect(memberResp.members.length).toBe(1);
      expect(memberResp.errors.length).toBe(0);
      expect(memberResp.warnings.length).toBe(0);

      const testLastMember = memberResp.members[0];

      expect(testLastMember.portal).not.toBeDefined();
      expect(testLastMember.peopleFinder.mailNickname).toBe('signum1');

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return no members if the mailer is empty.', (done) => {
    const mailers = ['group6'];

    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(0);
      expect(memberResp.warnings.length).toBeGreaterThan(0);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return no members if only groups are found.', (done) => {
    const mailers = ['group1'];

    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true, 1);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(0);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should reject if the the mailers passed are not of type array or is empty.', (done) => {
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(1, true);

    recPdlMembers.searchByMailers().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((errorWrongType) => {
      expect(errorWrongType.code).toBe(400);

      const recPdlMembers2 = new adp.peoplefinder.RecursivePDLMembers([], true);
      recPdlMembers2.searchByMailers().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((errorEmptyArr) => {
        expect(errorEmptyArr.code).toBe(400);
        done();
      });
    });
  });

  it('searchByMailers: Should return errors if the mailers are email address that do not contain ericsson.', (done) => {
    const mailers = ['group1@someotherdomain.com'];
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(1);

      expect(memberResp.errors[0].code).toBe(400);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return errors if the mailers are not of type string or are empty.', (done) => {
    const mailers = [1, ''];
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(2);

      expect(memberResp.errors[0].code).toBe(400);
      expect(memberResp.errors[1].code).toBe(400);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return empty portal members if thisUserShouldBeInDatabase rejects.', (done) => {
    const mailers = ['group1'];
    adpUserRes = false;
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(5);
      expect(memberResp.members.length).toBe(5);
      expect(memberResp.errors.length).toBe(0);

      const testLastMember = memberResp.members[0];

      expect(testLastMember.portal.signum).not.toBeDefined();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return empty members if model pdlMemberSearchByNickname rejects.', (done) => {
    const mailers = ['group1'];
    pdlMemberSearchByNicknameRes = false;
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(1);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return an error type 400 if the model searchPDLByMailNickname cannot retrieve it.', (done) => {
    const mailers = ['group1'];
    searchPDLByMailNicknameResp.setData = false;
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(1);

      expect(memberResp.errors[0].code).toBe(400);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return an error if the model searchPDLByMailNickname rejects.', (done) => {
    const mailers = ['group1'];
    searchPDLByMailNicknameResp.resolve = false;
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(1);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('searchByMailers: Should return an error if the elements key is not present.', (done) => {
    const mailers = ['group1'];
    searchPDLByMailNicknameResp.resolve = true;
    searchPDLByMailNicknameResp.setData = false;
    searchPDLByMailNicknameResp.malformed = true;
    const recPdlMembers = new adp.peoplefinder.RecursivePDLMembers(mailers, true);

    recPdlMembers.searchByMailers().then((memberResp) => {
      expect(memberResp.membersTotal).toBe(0);
      expect(memberResp.members.length).toBe(0);
      expect(memberResp.errors.length).toBe(1);

      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });
});
