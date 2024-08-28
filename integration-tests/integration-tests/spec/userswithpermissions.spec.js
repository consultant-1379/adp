const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let tokenAdmin = 'Bearer ';
let tokenFieldAdmin = 'Bearer ';
let tokenUser = 'Bearer ';

describe('Testing Userwithpermission endpoint', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (errorAdmin, responseAdmin, bodyAdmin) => {
      tokenAdmin += login.callback(errorAdmin, responseAdmin, bodyAdmin);
      request.post(login.optionsTest, (errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin) => {
        tokenUser += login.callback(errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin);
        request.post(login.optionsTestOne, (errorUser, responseUser, bodyUser) => {
          tokenFieldAdmin += login.callback(errorUser, responseUser, bodyUser);
          done();
        });
      });
    });
  });

  // CRUD - Create Tests

  it('Creates a new Permission, as Admin.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 5,
        admin: {
          eterase: {
            notification: [
              'create',
              'update',
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

  it('Creates another new Permission, as Admin.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
        admin: {
          emesuse: {
            notification: [
              'create',
              'update',
            ],
          },
          etesase: {
            notification: [
              'create',
              'update',
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

  it('Admin user should be able to read information about domain admin permissions', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;
      const result = bodyData.filter(obj => obj.signum === 'etesuse');

      expect(result).toBeTruthy();
      done();
    });
  });

  it('Admin user should be able to read information about domain admin which was not in DB before', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;
      const result = bodyData.filter(obj => obj.signum === 'etesase');

      expect(result).not.toEqual([]);
      done();
    });
  });

  it('Super Admin user should be able to read information about Super admins', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;
      let includeUser = false;
      bodyData.filter((obj) => {
        if (obj.signum === 'esupuse') {
          includeUser = true;
        }
        return includeUser;
      });

      expect(includeUser).toBeTruthy();
      done();
    });
  });

  it('Super Admin user should have super_admin set to true', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;
      const result = bodyData.filter(obj => (obj.signum === 'esupuse') && (obj.super_admin === true));

      expect(result).not.toEqual([]);
      done();
    });
  });

  it('Domain Admin should be able to read information only about domain he owns', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;
      const result = bodyData.every(obj => JSON.stringify(obj).includes('COS'));

      expect(result).toBeTruthy();
      done();
    });
  });

  it('User without domain/admin permissions should  not be able to read information about any domains', (done) => {
    request.get({
      url: `${config.baseUrl}usersWithPermissions`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allBody = JSON.parse(body);
      const bodyData = allBody.data;

      expect(bodyData).toEqual([]);
      done();
    });
  });

  it('Delete a Permission 4 as Admin, should be successful.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('Delete a Permission  2 as Admin, should be successful.', (done) => {
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
