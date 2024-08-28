/**
 * Unit test for [ adp.teamHistory.IsExternalContribution ]
 * @author Armando Dias [zdiaarm]
 */
/* eslint-disable class-methods-use-this */

describe('Testing [ adp.teamHistory.IsExternalContribution ] Class.', () => {
  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.dynamicSort = require('./../library/dynamicSort');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.mockResponse = {};
    adp.mockResponse.resolve = true;
    adp.mockResponse.response = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    class MockModelIsExternalContribution {
      getByAssetIDSignumDate() {
        return new Promise((RESOLVE, REJECT) => {
          if (adp.mockResponse.resolve === true) {
            RESOLVE(adp.mockResponse.result);
          } else {
            REJECT(adp.mockResponse.result);
          }
        });
      }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.mockLocalCache = {
      mockID1: {
        mockUser1: {
          '2020-12-01': {
            snapShot: {
              date_created: '2020-12-01',
            },
            limit: '2020-12-05',
          },
        },
        mockUser2: {
          '2020-12-03': {
            snapShot: {
              date_created: '2020-12-03',
            },
            limit: '2020-12-06',
          },
        },
        mockUser3: {
          '2020-01-01': {
            snapShot: null,
            limit: '2020-12-03',
          },
        },
      },
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.models = {};
    adp.models.TeamHistory = MockModelIsExternalContribution;
    adp.teamHistory = {};
    adp.teamHistory.IsExternalContribution = require('./IsExternalContribution');
  });


  afterEach(() => {
    adp = null;
  });


  it('Testing [ checkIt ] when user is internal contributor (returns false).', (done) => {
    adp.mockResponse.resolve = true;
    adp.mockResponse.result = {
      resultsReturned: 1,
      docs: [{
        date_created: '2020-12-05',
        team: [
          {
            portal: { signum: 'mockUser1' },
            peopleFinder: { mailNickname: 'mockUser1' },
          },
        ],
      }],
    };
    const isExternal = new adp.teamHistory.IsExternalContribution();
    isExternal.checkIt('mockID', 'mockUser1', '2020-12-05')
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch();
  });


  it('Testing [ checkIt ] when user is external contributor (returns true).', (done) => {
    adp.mockResponse.resolve = true;
    adp.mockResponse.result = {
      resultsReturned: 0,
      docs: [],
    };
    const isExternal = new adp.teamHistory.IsExternalContribution();
    isExternal.checkIt('mockID', 'mockUser1', '2020-12-04')
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch();
  });


  it('Testing [ checkIt ] when team have more than one SnapShot and the user is internal contributor (returns false).', (done) => {
    adp.mockResponse.resolve = true;
    adp.mockResponse.result = {
      resultsReturned: 2,
      docs: [{
        date_created: '2020-12-05',
        team: [
          {
            portal: { signum: 'mockUser1' },
            peopleFinder: { mailNickname: 'mockUser1' },
          },
          {
            portal: { signum: 'mockUser2' },
            peopleFinder: { mailNickname: 'mockUser2' },
          },
        ],
      },
      {
        date_created: '2020-12-01',
        team: [
          {
            portal: { signum: 'mockUser1' },
            peopleFinder: { mailNickname: 'mockUser1' },
          },
          {
            portal: { signum: 'mockUser2' },
            peopleFinder: { mailNickname: 'mockUser2' },
          },
        ],
      }],
    };
    const isExternal = new adp.teamHistory.IsExternalContribution();
    isExternal.checkIt('mockID', 'mockUser1', '2020-12-05')
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch();
  });


  it('Testing [ checkIt ] when team have more than one SnapShot and the user is external contributor (returns true).', (done) => {
    adp.mockResponse.resolve = true;
    adp.mockResponse.result = {
      resultsReturned: 2,
      docs: [{
        date_created: '2020-12-05',
        team: [
          {
            portal: { signum: 'mockUser1' },
            peopleFinder: { mailNickname: 'mockUser1' },
          },
        ],
      }],
    };
    const isExternal = new adp.teamHistory.IsExternalContribution();
    isExternal.checkIt('mockID', 'mockUser2', '2020-12-06')
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch();
  });


  it('Testing [ checkIt ] when [ super.getSnapshotFromDatabase ] crashes.', (done) => {
    adp.mockResponse.resolve = false;
    adp.mockResponse.result = 'Mock Error Test';
    const isExternal = new adp.teamHistory.IsExternalContribution();
    isExternal.checkIt('mockID', 'mockUser2', '2020-12-05')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
