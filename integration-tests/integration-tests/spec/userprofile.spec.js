const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let tokenAdmin = 'Bearer ';
let tokenFieldAdmin = 'Bearer ';
let tokenUser = 'Bearer ';

describe('Testing users profile', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (errorAdmin, responseAdmin, bodyAdmin) => {
      tokenAdmin += login.callback(errorAdmin, responseAdmin, bodyAdmin);
      request.post(login.optionsTest, (errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin) => {
        tokenFieldAdmin += login.callback(errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin);
        request.post(login.optionsTestOne, (errorUser, responseUser, bodyUser) => {
          tokenUser += login.callback(errorUser, responseUser, bodyUser);
          done();
        });
      });
    });
  });

  it('Creates a new Permission, as Admin.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 5,
        admin: {
          etesuse: {
            notification: [
              'update',
              'delete',
            ],
          },
          etesase: {
            notification: [
              'create',
              'update',
              'delete',
            ],
          },
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should not get profile as an unauthorized user', (done) => {
    request.get({
      url: `${config.baseUrl}profile/etesuse`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });

  it('Test user should get a user profile for himself', (done) => {
    request.get({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: true,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toEqual('emesuse');
      done();
    });
  });


  it('User with domain admin permissions should get a user profile for himself', (done) => {
    request.get({
      url: `${config.baseUrl}profile/etesuse`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toEqual('etesuse');
      done();
    });
  });

  it('User with admin permissions should get a user profile for domain admin', (done) => {
    request.get({
      url: `${config.baseUrl}profile/etesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (_error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toEqual('etesuse');
      done();
    });
  });

  it('User with admin permissions should get a user profile for himself', (done) => {
    request.get({
      url: `${config.baseUrl}profile/esupuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (_error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.signum).toEqual('esupuse');
      expect(body.data.role).toEqual('Admin');
      done();
    });
  });

  it('User with admin permissions should get a user profile', (done) => {
    request.get({
      url: `${config.baseUrl}profile/etesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (_error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('User should do initial update of marketInformationActive property to true for himself', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        _id: 'emesuse',
        signum: 'emesuse',
        name: 'Messy User',
        marketInformationActive: true,
        email: 'messy-user@adp-test.com',
        role: 'author',
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should return bad request when trying to update user but ID for the user is different in a body', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        _id: 'etesuse',
        signum: 'etesuse',
        name: 'Test User',
        marketInformationActive: false,
        email: 'test-user@adp-test.com',
        role: 'author',
      },
    },

    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should update marketInformationActive property for the user', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        _id: 'emesuse',
        signum: 'emesuse',
        name: 'Messy User',
        marketInformationActive: false,
        email: 'messy-user@adp-test.com',
        role: 'author',
      },
    },

    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should not allow to update name field due to it is in the list of fields which cannot be updated', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        _id: 'emesuse',
        signum: 'emesuse',
        name: 'Messy test',
        marketInformationActive: false,
        email: 'messy-user@adp-test.com',
        role: 'author',
      },
    },

    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should not allow  to update marketInformationActive field due to incorrect data format', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        _id: 'emesuse',
        signum: 'emesuse',
        name: 'Messy test',
        marketInformationActive: 'false',
        email: 'messy-user@adp-test.com',
        role: 'author',
      },
    },

    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('User should get a user profile and check if marketInformationActive property set to false after update', (done) => {
    request.get({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (_error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.marketInformationActive).toBeFalsy();
      done();
    });
  });

  it('should update marketInformationActive property for the user back to true', (done) => {
    request.put({
      url: `${config.baseUrl}profile/emesuse`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        _id: 'emesuse',
        signum: 'emesuse',
        name: 'Messy User',
        marketInformationActive: true,
        email: 'messy-user@adp-test.com',
        role: 'author',
      },
    },

    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Delete a Permission as Admin, should be successful.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 5,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
