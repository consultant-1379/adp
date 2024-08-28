const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');


describe('Basic tests for the login', () => {
  it('should login for admin user', (done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      login.callback(error, response, body);

      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toBe('esupuse');
      expect(body.data.role).toBe('admin');
      expect(body.data.name).toBe('Super User');
      expect(body.data.token).not.toBe(null);
      done();
    });
  });

  it('should login for test user admin', (done) => {
    request.post(login.optionsTest, (error, response, body) => {
      login.callback(error, response, body);

      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toBe('etesuse');
      expect(body.data.role).toBe('author');
      expect(body.data.name).toBe('Test User');
      expect(body.data.token).not.toBe(null);
      done();
    });
  });


  it('should login for test user etapase when all uppercase letters in signum', (done) => {
    request.post(login.optionsTestUserEtapase, (error, response, body) => {
      login.callback(error, response, body);

      expect(response.statusCode)
        .withContext('Server code should be 200').toBe(200);

      expect(body.data.signum)
        .withContext('User signum should be etapase').toBe('etapase');

      expect(body.data.name)
        .withContext('user Name should be Apase User').toBe('Apase User');
      done();
    });
  });

  it('should login for test user', (done) => {
    request.post(login.optionsTestOne, (error, response, body) => {
      login.callback(error, response, body);

      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toBe('emesuse');
      expect(body.data.role).toBe('author');
      expect(body.data.name).toBe('Messy User');
      expect(body.data.token).not.toBe(null);
      done();
    });
  });

  it('should get 401 in case if login is incorrect', (done) => {
    request.post({
      url: `${config.baseUrl}login`,
      json: true,
      body: {
        username: 'etesus',
        password: 'c3VwZXItcGFzc3dvcmQx',
      },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);

      done();
    });
  });

  it('should get 401 in case if password is incorrect ', (done) => {
    request.post({
      url: `${config.baseUrl}login`,
      json: true,
      body: {
        username: 'etesuse',
        password: 'test-password',
      },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);

      done();
    });
  });
});
