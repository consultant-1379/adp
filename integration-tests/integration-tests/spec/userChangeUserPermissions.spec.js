const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let tokenAdmin = 'Bearer ';
let tokenUser2 = 'Bearer ';
let tokenUser = 'Bearer ';

describe('Testing Asset`s Permissions (CRUD)', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (errorAdmin, responseAdmin, bodyAdmin) => {
      tokenAdmin += login.callback(errorAdmin, responseAdmin, bodyAdmin);
      request.post(login.optionsTest, (errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin) => {
        tokenUser2 += login.callback(errorFieldAdmin, responseFieldAdmin, bodyFieldAdmin);
        request.post(login.optionsTestOne, (errorUser, responseUser, bodyUser) => {
          tokenUser += login.callback(errorUser, responseUser, bodyUser);
          done();
        });
      });
    });
  });


  // CRUD - Update Tests

  it('Update a Permission as Admin, adding an User as Field Admin.', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
              items: ['DNEW'],
            },
          ],
          target: 'emesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Read Permissions as Field Admin, should be able to see his own Permission added before.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['item-id'] === 5) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeTruthy();
      done();
    });
  });

  it('Update a Permission as Domain Admin, trying to add permissions for himself, should fail as he is not a admin of this domain', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
              items: ['DNEW', 'OSS'],
            },
          ],
          target: 'emesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('Update a Permission as Domain Admin, should add athother user to his domain', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
              items: ['DNEW'],
            },
          ],
          target: 'etesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Read Permissions as User, should be able to see his own Permission added by domain admin.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser2 },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['item-id'] === 5) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeTruthy();
      done();
    });
  });

  it('Update a Permission as Domain Admin, should delete athother user from his domain', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
              items: [],
            },
          ],
          target: 'etesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Read Permissions as User, should be empty as another user deleted permissions for him', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser2 },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);

      expect(response.body.data.length).toBe(0);
      done();
    });
  });

  it('Update a Permission as Admin, should be failing as "field" is missing', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              items: ['DNEW'],
            },
          ],
          target: 'emesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, should be failing as "items" field is missing', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
            },
          ],
          target: 'emesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, should be failing as "target" field is missing', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json:
      {
        newPermissions: [
          {
            field: 'domain',
            items: ['DNEW'],
          },
        ],
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, deleted permisson for Field Admin, not field admin any more', (done) => {
    request.put({
      url: `${config.baseUrl}permission/changeUserPermissions`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json:
        {
          newPermissions: [
            {
              field: 'domain',
              items: [],
            },
          ],
          target: 'emesuse',
        },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Read own permissions, should be empty as user deleted from field admin', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(0);
      done();
    });
  });

  it('Delete a Permission as Field Admin, should be successful.', (done) => {
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
