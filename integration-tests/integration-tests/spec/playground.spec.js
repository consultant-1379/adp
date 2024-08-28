
/**
* Testing playground endpoint
* @author Ludmila Omelchenko
*/
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
const login = require('../endpoints/login.js');

xdescribe('Testing playground endpoint for admin user', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Testing playground endpoint with only mandatory query parameters', async (done) => {
    const responsePlayground = await portal.playground('esupuse', 'myfirstservice');


    const responseData = responsePlayground
    && responsePlayground.body
    && responsePlayground.body.data
      ? responsePlayground.body.data
      : null;

    expect(responseData)
      .withContext(`Playground link should equal 'https://adpdevexp.hoff061.rnd.gic.ericsson.se/' got ${responseData}`)
      .toContain('https://adpdevexp.hoff061.rnd.gic.ericsson.se/');

    expect(responsePlayground.code).toBe(200);
    done();
  });

  it('Testing playground endpoint without status', async (done) => {
    const responsePlayground = await portal.playground('esupuse', 'myfirstservice', 'hahn108.rnd.gic.ericsson.se');


    const responseData = responsePlayground
    && responsePlayground.body
    && responsePlayground.body.data
      ? responsePlayground.body.data
      : null;

    expect(responseData)
      .withContext(`Playground link should equal 'https://hahn108.rnd.gic.ericsson.se/' got ${responseData}`)
      .toContain('https://adpdevexp.hahn108.rnd.gic.ericsson.se/');

    expect(responsePlayground.code).toBe(200);
    done();
  });

  it('Testing playground endpoint with all parameters', async (done) => {
    const responsePlayground = await portal.playground('esupuse', 'myfirstservice', 'hahn108.rnd.gic.ericsson.se', 'refresh');


    const responseData = responsePlayground
    && responsePlayground.body
    && responsePlayground.body.data
      ? responsePlayground.body.data
      : null;

    expect(responseData)
      .withContext(`Playground link should equal 'https://hahn108.rnd.gic.ericsson.se/' got ${responseData}`)
      .toContain('https://adpdevexp.hahn108.rnd.gic.ericsson.se/');

    expect(responsePlayground.code).toBe(200);
    done();
  });
});

xdescribe('Testing playground endpoint for test user', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTest);
  });

  it('Testing playground endpoint for test user with only mandatory parameters', async (done) => {
    const responsePlayground = await portal.playground('etesuse', 'myfirstservice');


    const responseData = responsePlayground
    && responsePlayground.body
    && responsePlayground.body.data
      ? responsePlayground.body.data
      : null;

    expect(responseData)
      .withContext(`Playground link should equal 'https://adpdevexp.hoff061.rnd.gic.ericsson.se/' got ${responseData}`)
      .toContain('https://adpdevexp.hoff061.rnd.gic.ericsson.se/');

    expect(responsePlayground.code).toBe(200);
    done();
  });

  it('Testing playground endpoint for test user with all paramenter', async (done) => {
    const responsePlayground = await portal.playground('etesuse', 'myfirstservice', 'hahn108.rnd.gic.ericsson.se', 'refresh');


    const responseData = responsePlayground
    && responsePlayground.body
    && responsePlayground.body.data
      ? responsePlayground.body.data
      : null;

    expect(responseData)
      .withContext(`Playground link should equal 'https://hahn108.rnd.gic.ericsson.se/' got ${responseData}`)
      .toContain('https://adpdevexp.hahn108.rnd.gic.ericsson.se/');

    expect(responsePlayground.code).toBe(200);
    done();
  });
});
