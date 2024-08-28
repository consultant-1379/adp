// ============================================================================================= //
/**
* Unit test for [ global.adp.microservices.userTeamFullData ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservices.userTeamFullData ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;

    global.adp.microservices = {};
    global.adp.microservices.userTeamFullData = require('./userTeamFullData');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.user = {};
    global.adp.user.thisUserShouldBeInDatabase = SIGNUM => new Promise((RESOLVE, REJECT) => {
      let obj = null;
      switch (SIGNUM) {
        case 'mockUser1':
          obj = {
            docs: [
              {
                name: 'Mock User 1',
                email: 'user1@mock.com',
                type: 'user',
                role: 'author',
              },
            ],
          };
          RESOLVE(obj);
          break;
        case 'mockUser2':
          obj = {
            docs: [
              {
                name: 'Mock User 2',
                email: 'user2@mock.com',
                type: 'user',
                role: 'author',
              },
            ],
          };
          RESOLVE(obj);
          break;
        case 'mockUser3':
          obj = {
            docs: [],
          };
          RESOLVE(obj);
          break;
        case 'mockUserCrash':
          REJECT();
          break;
        default:
          obj = {};
          RESOLVE(obj);
          break;
      }
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Retrieve user data for Asset`s Team (Including repeated users)', (done) => {
    const mockAsset = {
      team: [
        { signum: 'mockUser1' },
        { signum: 'mockUser2' },
        { signum: 'mockUser3' },
        { signum: 'mockUser1' },
        { signum: 'mockUser2' },
      ],
    };
    const allUsersOfThisProcess = {};
    global.adp.microservices.userTeamFullData(mockAsset, allUsersOfThisProcess)
      .then(() => {
        expect(mockAsset.team[0].name).toBe('Mock User 1');
        expect(mockAsset.team[1].name).toBe('Mock User 2');
        expect(mockAsset.team[2].name).toBeUndefined();
        expect(mockAsset.team[3].name).toBe('Mock User 1');
        expect(mockAsset.team[4].name).toBe('Mock User 2');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Asset`s Team is null', (done) => {
    const mockAsset = {
      team: null,
    };
    const allUsersOfThisProcess = {};
    global.adp.microservices.userTeamFullData(mockAsset, allUsersOfThisProcess)
      .then(() => {
        expect(mockAsset.team).toBeNull();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [global.adp.user.thisUserShouldBeInDatabase] returns an invalid answer for one user', (done) => {
    const mockAsset = {
      team: [
        { signum: 'mockUser1' },
        { signum: 'mockUser2' },
        { signum: 'mockUser3' },
        { signum: 'mockUserError' },
      ],
    };
    const allUsersOfThisProcess = {};
    global.adp.microservices.userTeamFullData(mockAsset, allUsersOfThisProcess)
      .then(() => {
        expect(mockAsset.team[0].name).toBe('Mock User 1');
        expect(mockAsset.team[1].name).toBe('Mock User 2');
        expect(mockAsset.team[2].name).toBeUndefined();
        expect(mockAsset.team[3].name).toBeUndefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If [global.adp.user.thisUserShouldBeInDatabase] crash for one user', (done) => {
    const mockAsset = {
      team: [
        { signum: 'mockUser1' },
        { signum: 'mockUser2' },
        { signum: 'mockUser3' },
        { signum: 'mockUserCrash' },
      ],
    };
    const allUsersOfThisProcess = {};
    global.adp.microservices.userTeamFullData(mockAsset, allUsersOfThisProcess)
      .then(() => {
        expect(mockAsset.team[0].name).toBe('Mock User 1');
        expect(mockAsset.team[1].name).toBe('Mock User 2');
        expect(mockAsset.team[2].name).toBeUndefined();
        expect(mockAsset.team[3].name).toBeUndefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
