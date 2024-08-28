const request = require('request');
const config = require('../test.config.js');
const data = require('../test.data.js');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Basic tests for the users', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('should get all users', (done) => {
    request.get({
      url: `${config.baseUrl}users`,
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVzdXB1c2UiLCJpYXQiOjE1NTE4Nzc2MTF9.qQpZP3t5wcqZyNfWA8_Nf_jvfkfevtZKFMOhzf-FNNo' },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should get user by signum and return appropriate data for it.', async (done) => {
    const { code, body } = await portal.getUser('etesuse');

    expect(code).toBe(200);
    expect(body.data._id).toEqual('etesuse');
    done();
  });

  it('should get 404 in case when user with such signum is not found', async (done) => {
    const { code } = await portal.getUser('eomelit');

    expect(code).toBe(404);
    done();
  });

  it('should create user with name newuser_test', async () => {
    const { code } = await portal.createUser(data.newuser_create, 'newuser_test');

    expect(code).toBe(200);
  });

  it('should update user with new role using admin token', async () => {
    const { code } = await portal.updateUser(data.newuser_update_role, 'newuser_test');

    expect(code).toBe(200);
  });

  it('should update user with new name using admin token', async () => {
    const { code } = await portal.updateUser(data.newuser_update_name, 'newuser_test');

    expect(code).toBe(200);
  });
});
