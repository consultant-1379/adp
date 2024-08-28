// ============================================================================================= //
/**
* Unit test for [ global.adp.tutorials.getBySlug ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ adp.tutorials.getBySlug ] behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    adp.config = {};
    adp.config.wordpress = {};
    adp.config.wordpress.url = 'mock-url';
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.requestBehavior = 'success';
    global.request = (SETUPOBJ, CALLBACK) => {
      if (global.requestBehavior === 'success') {
        const menuFromMockWordpressAsString = '[{"post_title":"Title"}]';
        CALLBACK(undefined, { body: menuFromMockWordpressAsString });
      } else if (global.requestBehavior === 'invalidAnswer') {
        CALLBACK(undefined, { body: '[]' });
      } else {
        CALLBACK('MockErrorOnRequest', undefined);
      }
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.tutorials = {};
    global.adp.tutorials.getBySlug = require('./getBySlug');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should respond with Tutorial Title in case of valid answer', (done) => {
    global.requestBehavior = 'success';
    global.adp.tutorials.getBySlug('mock-slug')
      .then((RESPONSE) => {
        expect(RESPONSE.code).toEqual('200');
        expect(RESPONSE.title).toEqual('Title');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Should respond with error in case of invalid answer', (done) => {
    global.requestBehavior = 'invalidAnswer';
    global.adp.tutorials.getBySlug('mock-slug')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual('400');
        expect(ERROR.message).toEqual('Tutorial not found for the slug - mock-slug');
        done();
      });
  });

  it('Should respond with error in case failure from WP', (done) => {
    global.requestBehavior = 'error';
    global.adp.tutorials.getBySlug('mock-slug')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual('500');
        expect(ERROR.message).toEqual('MockErrorOnRequest');
        done();
      });
  });
});
// ============================================================================================= //
