const urljoin = require('url-join');
const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

let tokenAdmin = 'Bearer ';
let tokenFieldAdmin = 'Bearer ';
let tokenUser = 'Bearer ';

describe('Testing Asset`s Permissions (CRUD)', () => {
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

  // CRUD - Create Tests

  it('Creates a new Permission, as Admin.', (done) => {
    const postObject = {
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
          eterase: {
            notification: [
              'create',
              'update',
            ],
          },
        },
      },
    };
    request.post(postObject,
      (error, response) => {
        const debug = portal.answer({
          message: response.body.message,
          response: response.body,
          error,
          param: {
            url: urljoin(portal.baseUrl, 'permission'),
            postObject,
          },
        });

        expect(response.statusCode)
          .withContext(`The server code should be 200: ${debug}`)
          .toBe(200);
        done();
      });
  });

  it('Creates another new Permission, as Admin.', (done) => {
    const postObject = {
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
        admin: {
          etesase: {
            notification: [
              'create',
              'update',
            ],
          },
        },
      },
    };
    request.post(postObject,
      (error, response) => {
        const debug = portal.answer({
          message: response.body.message,
          response: response.body,
          error,
          param: {
            url: urljoin(portal.baseUrl, 'permission'),
            postObject,
          },
        });

        expect(response.statusCode)
          .withContext(`The server code should be 200: ${debug}`)
          .toBe(200);
        done();
      });
  });

  it('Creates the same Permission, an error is expected ( Because already exists ).', (done) => {
    const postObject = {
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
          eterase: {
            notification: [
              'create',
              'update',
            ],
          },
        },
      },
    };
    request.post(postObject,
      (error, response) => {
        const debug = portal.answer({
          message: response.body.message,
          response: response.body,
          error,
          param: {
            url: urljoin(portal.baseUrl, 'permission'),
            postObject,
          },
        });

        expect(response.statusCode)
          .withContext(`The server code should be 400: ${debug}`)
          .toBe(400);
        done();
      });
  });

  it('Creates a Permission without "group-id" field, an error is expected.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'item-id': 4,
        admin: {
          etesuse: {
            notification: [
              'update',
              'delete',
            ],
          },
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Creates a Permission without "item-id" field, an error is expected.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 1,
        admin: {
          etesuse: {
            notification: [
              'update',
              'delete',
            ],
          },
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Creates a Permission without "admin" field, an error is expected.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 1,
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Creates a new Permission, but the user is only Field Admin. "Forbidden" as error is expected.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: {
        'group-id': 4,
        'item-id': 6,
        admin: {
          etesuse: {
            notification: [
              'update',
              'delete',
            ],
          },
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('Creates a new Permission, but the user is only user. "Forbidden" as error is expected.', (done) => {
    request.post({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'group-id': 4,
        'item-id': 6,
        admin: {
          etesuse: {
            notification: [
              'update',
              'delete',
            ],
          },
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  // CRUD - Read Tests

  it('Read all Permissions, should find the Permission created before.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 5) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeTruthy();
      done();
    });
  });

  it('Read Permissions as Field Admin, should be able to see his own Permission.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 5) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeTruthy();
      done();
    });
  });

  it('Read Permissions as Field Admin, should not be able to see other Permissions.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 4) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeFalsy();
      done();
    });
  });

  it('Read Permissions as User, should get an empty list.', (done) => {
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

  // CRUD - Update Tests

  it('Update a Permission as Admin, adding an User as Field Admin.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
        admin: {
          etesase: {
            notification: [
              'create',
              'update',
            ],
          },
          emesuse: {
            notification: [
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

  it('Read Permissions as User (Temporary Field Admin), should be able to get his own Permission.', (done) => {
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
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 4) {
          foundSpecificPermission = true;
        }
      });

      expect(response.body.data.length).toEqual(1);
      expect(foundSpecificPermission).toBeTruthy();
      done();
    });
  });

  it('Update a Permission as (Temporary) Field Admin, removing your own rights over this Field.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
        admin: {
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

  it('Read Permissions as User, should get an empty list because this user lost his Permission.', (done) => {
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

  it('Update a Permission as Admin, but is missing the "group-id" field. Should get a "Bad Request" as error.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'item-id': 4,
        admin: {
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
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, but is missing the "item-id" field. Should get a "Bad Request" as error.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        admin: {
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
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, but is missing the "admin" field. Should get a "Bad Request" as error.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Admin, but the permission doesn`t exist. Should get a "Bad Request" as error.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: {
        'group-id': 99999,
        'item-id': 99999,
        admin: {
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
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Update a Permission as Field Admin, adding "create" to his own Notification Preferences.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 5,
        admin: {
          etesuse: {
            notification: [
              'create',
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

  it('Update a Permission as Field Admin, removing the Permission of another Field Admin.', (done) => {
    request.put({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 5,
        admin: {
          etesuse: {
            notification: [
              'create',
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

  it('Delete a Permission as Field Admin, should fail because this Field not belong to this Field Admin.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('Delete a Permission as User, should fail because is just a user with no Field Permissions.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'group-id': 3,
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('Delete a Permission as Admin, should fail because the Permission doesn`t exists.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'group-id': 999999,
        'item-id': 999999,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Delete a Permission as Admin, should fail because is missing the "group-id" field.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('Delete a Permission as Admin, should fail because is missing the "item-id" field.', (done) => {
    request.delete({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
      json: {
        'group-id': 3,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
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
        'item-id': 4,
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('Read Permissions as Admin, should not be able to see the deleted Permission.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 4) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeFalsy();
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

  it('Read Permissions as Admin, should not be able to see the previous deleted Permission.', (done) => {
    request.get({
      url: `${config.baseUrl}permission`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
      json: true,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      let foundSpecificPermission = false;
      response.body.data.forEach((PERMISSION) => {
        if (PERMISSION['group-id'] === 3 && PERMISSION['item-id'] === 5) {
          foundSpecificPermission = true;
        }
      });

      expect(foundSpecificPermission).toBeFalsy();
      done();
    });
  });
});
