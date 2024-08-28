const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let token = 'Bearer ';

describe('Basic tests for Get PRA verison endpoint', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  it('Should return 200 when trying to get information for Alarm handler from index.yaml', (done) => {
    request.get({
      url: `${config.baseUrl}getpraversion/auto-ms-with-docs`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Should return 404 when the microservice does not exist', (done) => {
    request.get({
      url: `${config.baseUrl}getpraversion/service-that-does-not-exist`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
});
