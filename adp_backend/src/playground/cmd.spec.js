// ============================================================================================= //
/**
* Unit test for [ global.adp.playground.cmd ]
* @author Armando Schiavon Dias [escharm]/Githu
*/
// ============================================================================================= //
describe('Testing [ global.adp.playground.cmd ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.playgroundAddress = 'http://unit.test.com/playground';

    global.request = {};
    global.adp.echoLog = () => {};
    global.mockBehaviour = 0;
    global.request.post = (URL, OBJ, CALLBACK) => {
      if (global.mockBehaviour === 1) {
        CALLBACK(null, { statusCode: 500 }, { message: 'Unexpected behavior from Playground Server' });
      }
      CALLBACK(null, { statusCode: 200 }, { message: 'http://ok.com' });
    };
    global.request.delete = (URL, OBJ, CALLBACK) => {
      CALLBACK(null, { statusCode: 200 }, { message: 'http://ok.com' });
    };

    /* eslint-disable global-require */
    global.adp.playground = {};
    global.adp.playground.cmd = require('./cmd');
    /* eslint-enable global-require */
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Retrieving answer without a step.', async (done) => {
    const user = 'esupuse';
    const step = '';
    const status = '';
    await global.adp.playground.cmd(user, step, status)
      .then((getTheLink) => {
        expect(getTheLink.data).toBe('http://ok.com');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Retrieving answer with a step.', async (done) => {
    const user = 'esupuse';
    const step = 'one';
    const status = '';
    await global.adp.playground.cmd(user, step, status)
      .then((getTheLink) => {
        expect(getTheLink.data).toBe('http://ok.com');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Error fetching the playground link', async (done) => {
    global.mockBehaviour = 1;
    const user = 'esupuse';
    const step = 'one';
    const status = '';
    await global.adp.playground.cmd(user, step, status)
      .then(() => {
        done.fail();
      }).catch((err) => {
        expect(err).toEqual(500);
        done();
      });
  });

  it('Error fetching the playground link on refresh', async (done) => {
    global.mockBehaviour = 1;
    const user = 'esupuse';
    const step = 'one';
    const status = 'refresh';
    await global.adp.playground.cmd(user, step, status)
      .then(() => {
        done.fail();
      }).catch((err) => {
        expect(err).toEqual(500);
        done();
      });
  });

  it('Retrieving answer for a refresh request.', async (done) => {
    const user = 'esupuse';
    const step = 'one';
    const status = 'refresh';
    await global.adp.playground.cmd(user, step, status)
      .then((getTheLink) => {
        expect(getTheLink.data).toBe('http://ok.com');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
