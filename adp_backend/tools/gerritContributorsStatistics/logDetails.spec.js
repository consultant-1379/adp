// ============================================================================================= //
/**
* Unit test for [ cs.logDetails ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.logDetails ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.docs = {};
    adp.docs.list = [];
    cs.logDetails = require('./logDetails');
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    adp.fullLogDetails = {};
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a simple successful case.', async (done) => {
    cs.logDetails('Test One');

    expect(adp.fullLogDetails['Test One']).toBe(1);
    done();
  });


  it('Testing a simple successful case, but running the command three times.', async (done) => {
    cs.logDetails('Test One');
    cs.logDetails('Test One');
    cs.logDetails('Test One');

    expect(adp.fullLogDetails['Test One']).toBe(3);
    done();
  });


  it('Testing a successful case with sublevel.', async (done) => {
    cs.logDetails('Test One', 'sublevel');

    expect(adp.fullLogDetails.sublevel['Test One']).toBe(1);
    done();
  });


  it('Testing a successful case with sublevel, but running the command three times.', async (done) => {
    cs.logDetails('Test One', 'sublevel');
    cs.logDetails('Test One', 'sublevel');
    cs.logDetails('Test One', 'sublevel');

    expect(adp.fullLogDetails.sublevel['Test One']).toBe(3);
    done();
  });


  it('Testing a successful case with ID control (Only count one).', async (done) => {
    cs.logDetails('Test One', null, '123');
    cs.logDetails('Test One', null, '123');
    cs.logDetails('Test One', null, '123');

    expect(adp.fullLogDetails['Test One']).toBe(1);
    done();
  });


  it('Testing a successful case with sublevel and ID control (Only count one).', async (done) => {
    cs.logDetails('Test One', 'sublevel', '123');
    cs.logDetails('Test One', 'sublevel', '123');
    cs.logDetails('Test One', 'sublevel', '123');

    expect(adp.fullLogDetails.sublevel['Test One']).toBe(1);
    done();
  });
});
// ============================================================================================= //
