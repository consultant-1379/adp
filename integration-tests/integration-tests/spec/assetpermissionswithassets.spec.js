const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');
const data = require('../test.data.js');

let tokenAdmin = 'Bearer ';
let tokenFieldAdmin = 'Bearer ';
let tokenUser = 'Bearer ';
let microserviceId = '';
let microserviceId2 = '';

describe('Testing Asset`s Permissions with Assets', () => {
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

  // Creating a permission rule for tests with Assets

  it('In CRUD of Field Permissions:\r\n   Admin [esupuse] creates a new Field Permission to [etesuse]\r\n   Domain Admin in "5".', (done) => {
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
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  // Creating Asset for tests

  it('In CRUD of Assets/Microservices:\r\n   User [emesuse] should be successful to create microservice in domain "5".', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoAssetWithFieldPermission,
      headers: { Authorization: tokenUser },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();
      microserviceId = id;
      done();
    });
  });

  it('In CRUD of Assets/Microservices:\r\n   User [emesuse] should be successful to create microservice in domain "4".', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoAssetWithFieldPermission2,
      headers: { Authorization: tokenUser },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();
      microserviceId2 = id;
      done();
    });
  });

  // Testing CRUD of Assets/Microservices and Admin Area List

  it('In Admin Area:\r\n   User [emesuse] should be able to find in the list the two Assets\r\n   where he is Service Owner.', (done) => {
    request.post({
      url: `${config.baseUrl}microservices-by-owner`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
    },
    (error, response) => {
      let foundSpecificAsset = false;
      let foundSpecificAsset2 = false;
      const jsonReturn = response && response.body ? JSON.parse(response.body) : undefined;
      jsonReturn.data.forEach((ASSET) => {
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId) {
          foundSpecificAsset = true;
        }
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId2) {
          foundSpecificAsset2 = true;
        }
      });

      expect(foundSpecificAsset).toBeTruthy();
      expect(foundSpecificAsset2).toBeTruthy();
      done();
    });
  });

  it('In Admin Area:\r\n   Field Admin [etesuse] should be able to find only one Asset created by [emesuse]\r\n   Because he is Field Admin of one of them.', (done) => {
    request.post({
      url: `${config.baseUrl}microservices-by-owner`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
    },
    (error, response) => {
      let foundSpecificAsset = false;
      let foundSpecificAsset2 = false;
      const jsonReturn = JSON.parse(response.body);
      jsonReturn.data.forEach((ASSET) => {
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId) {
          foundSpecificAsset = true;
        }
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId2) {
          foundSpecificAsset2 = true;
        }
      });

      expect(foundSpecificAsset).toBeTruthy();
      expect(foundSpecificAsset2).toBeFalsy();
      done();
    });
  });

  it('In Admin Area:\r\n   Admin [esupuse] should be able to find the two Assets created before by [emesuse]\r\n   in Admin Area List.', (done) => {
    request.post({
      url: `${config.baseUrl}microservices-by-owner`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response) => {
      let foundSpecificAsset = false;
      let foundSpecificAsset2 = false;
      const jsonReturn = JSON.parse(response.body);
      jsonReturn.data.forEach((ASSET) => {
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId) {
          foundSpecificAsset = true;
        }
        // eslint-disable-next-line no-underscore-dangle
        if (ASSET._id === microserviceId2) {
          foundSpecificAsset2 = true;
        }
      });

      expect(foundSpecificAsset).toBeTruthy();
      expect(foundSpecificAsset2).toBeTruthy();
      done();
    });
  });

  // ////////////////////////////////////////

  it('<<<   Begin of the temporary change of permission   >>>\r\n   In CRUD of Field Permissions:\r\n   Admin [esupuse] add [emesuse] as Field Admin "5"', (done) => {
    request.put({
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
          emesuse: {
            notification: [
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

  it('In CRUD of Assets/Microservices:\r\n   User [emesuse] is able to update the Asset', (done) => {
    const newAssetData = data.demoAssetWithFieldPermission;
    newAssetData.reusability_level = 3;
    newAssetData.description = 'This Update should work!';
    setTimeout(async () => {
      request.put({
        url: `${config.baseUrl}microservice/${microserviceId}`,
        json: newAssetData,
        headers: { Authorization: tokenUser },
        strictSSL: false,
      },
      (error, response) => {
        expect(response.statusCode).toBe(200);
        done();
      }, 5000);
    });
  });

  it('In CRUD of Field Permissions:\r\n   Admin [esupuse] removes [emesuse] from Field Admin\r\n   <<<   End of the temporary change of permission   >>>\r\n   ', (done) => {
    request.put({
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
        },
      },
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  // ///////////////////////////////////////

  it('In CRUD of Assets/Microservices:\r\n   Field Admin [etesuse] reads the details of the first Asset.\r\n   Because he is Field Admin, retrieved data should not contains any info about fields be "ReadOnly".', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const allInfo = JSON.parse(body);
      const info = allInfo.data.readonlyfields;

      expect(info).toEqual([]);
      done();
    });
  });

  it('In CRUD of Assets/Microservices:\r\n   Admin [esupuse] is able to change the value of "reusability_level"', (done) => {
    const currentAssetData = data.demoAssetWithFieldPermission;
    currentAssetData.reusability_level = 3;
    currentAssetData.description = 'This Update should be successful';
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: currentAssetData,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  // Deleting Specific Asset

  it('In CRUD of Assets/Microservices:\r\n   User [emesuse] should be successful to delete the First Asset created before.\r\n   Because he is Service Owner.', (done) => {
    request.delete({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      headers: { Authorization: tokenUser },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('In CRUD of Assets/Microservices:\r\n   Field Admin [etesuse] cannot delete the second Asset.\r\n   Because he is not Domain Admin of this Asset.', (done) => {
    request.delete({
      url: `${config.baseUrl}microservice/${microserviceId2}`,
      headers: { Authorization: tokenFieldAdmin },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('In CRUD of Assets/Microservices:\r\n   Admin [esupuse] is able to delete the Second Asset created before.\r\n   Because he is System Admin.', (done) => {
    request.delete({
      url: `${config.baseUrl}microservice/${microserviceId2}`,
      headers: { Authorization: tokenAdmin },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  // Cleaning Database

  it('In CRUD of Field Permissions:\r\n   Field Admin [etesuse] should be successful to delete a Permission from his domain.', (done) => {
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

  it('In CRUD of Field Permissions:\r\n   Admin reads the Permissions, should not be able to see the previous deleted Permission.', (done) => {
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
