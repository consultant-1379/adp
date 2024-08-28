const request = require('request');
const config = require('../test.config.js');
const data = require('../test.data.js');
const login = require('../endpoints/login.js');

let token = 'Bearer ';

describe('to update data for the microservice', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  it('should update data for the existing microservice Key Management', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/21bde406-f7ab-4869-b2a0-d27503340d5d`,
      json: data.demoService_datatest,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
