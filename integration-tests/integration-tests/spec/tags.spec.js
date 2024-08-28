const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let token = 'Bearer ';


describe('Basic tests for the microservises for logged in admin user', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });
  it('should get all list of tags and check for Basic tags(TagTwo, TagOne, TagThree) ', (done) => {
    request.get({
      url: `${config.baseUrl}tags`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const resultTags = body.data.map(obj => obj.label);

      expect(response.statusCode).toBe(200);
      expect(resultTags).toContain('TagTwo');
      expect(resultTags).toContain('TagOne');
      expect(resultTags).toContain('TagThree');

      done();
    });
  });

  it('should get a list of tags for microservices containing Label1 word ', (done) => {
    request.get({
      url: `${config.baseUrl}tags/Label1`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const result = body.data.every(obj => JSON.stringify(obj).includes('Label1'));

      expect(result).toBe(true);
      expect(response.statusCode).toBe(200);

      done();
    });
  });


  it('should return 200 when no appropriate results was found', (done) => {
    request.get({
      url: `${config.baseUrl}tags/commerctest`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
