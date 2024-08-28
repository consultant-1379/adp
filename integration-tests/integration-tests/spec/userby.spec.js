const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let token = 'Bearer ';

describe('Basic tests for the userby endpoint', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  it('should get users from LDAP starting with "asase"(match for name field)', (done) => {
    request.get({
      url: `${config.baseUrl}searchldapuser/asase`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);

      const users = body.data.usersFound;
      const result = users.every(obj => obj.name.includes('Asase'));

      expect(result).toBe(true);
      done();
    });
  });

  it('should get user from LDAP with "eterace"(match for signum field)', (done) => {
    request.get({
      url: `${config.baseUrl}searchldapuser/eterase`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);

      const users = body.data.usersFound;
      const result = users.every(obj => obj.name === 'Rase User');

      expect(result).toBe(true);
      done();
    });
  });

  it('should get all users from LDAP field with "user"(match for surname, sn field)', (done) => {
    request.get({
      url: `${config.baseUrl}searchldapuser/user`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode)
        .withContext(`Expecting 200, got ${response.statusCode}: ${JSON.stringify(response, null, 2)}`)
        .toBe(200);

      const users = body.data.usersFound;
      const result = users.every(obj => obj.name.includes('User'));

      expect(result)
        .withContext(`Cannot find 'User' at the names of the response: ${JSON.stringify(response, null, 2)}`)
        .toBe(true);
      done();
    });
  });

  it('should get no error in case when no users from LDAP cn field was found', (done) => {
    request.get({
      url: `${config.baseUrl}searchldapuser/fake name`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode)
        .withContext(`Expecting 200, got ${response.statusCode}: ${JSON.stringify(response, null, 2)}`)
        .toBe(200);
      done();
    });
  });
});
