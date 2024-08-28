const request = require('request');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

let token = 'Bearer ';
let tokenTest = 'Bearer ';
let idofMicroservice = '';
let idofMicroserviceEsupuse = '';


describe('Basic tests for logs to check under logged in user', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  it('should get log for all microservices', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('should get log for all items with type Microservices ', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      /* eslint-disable no-underscore-dangle */
      idofMicroservice = body.data[1].new._id;
      /* eslint-enable no-underscore-dangle */
      expect(response.statusCode).toBe(200);
      expect(body.data.length).toBeGreaterThan(0);
      const result = body.data.every(obj => obj.type === 'microservice');

      expect(result).toBe(true);
      done();
    });
  });


  it('should get logs for a particular microservice ID', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice/${idofMicroservice}`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const result = body.data.every(obj => JSON.stringify(obj).includes(idofMicroservice));

      expect(result).toBe(true);
      done();
    });
  });


  it('should get log for paricular user', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/byusersignum/esupuse`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const dataArray = body.data;
      const typeMicroservice = dataArray.filter(obj => obj.type === 'microservice');
      // eslint-disable-next-line no-underscore-dangle
      idofMicroserviceEsupuse = typeMicroservice[1].new._id;

      expect(dataArray.length).toBeGreaterThan(0);
      const result = dataArray.every(obj => obj.signum === 'esupuse');

      expect(result).toBe(true);
      done();
    });
  });

  it('should return log for particular microservice for particular user', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/byusersignum/esupuse/microservice/${idofMicroserviceEsupuse}`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const resultsignum = body.data.every(obj => obj.signum === 'esupuse');
      const resultmicroserviceid = body.data.every(obj => JSON.stringify(obj)
        .includes(idofMicroserviceEsupuse));

      expect(resultsignum).toBe(true);
      expect(resultmicroserviceid).toBe(true);
      done();
    });
  });

  it('should get 200 in case when microservice with such id is not found', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice/d18cc06932329fd5f1b23855f903test`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

describe('Basic tests for the microservice log for not logged in user', () => {
  it('should get a 401 error when trying to acess logs for user as token is missing', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/byusersignum/esupuse`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });


  it('should get a 401 error when trying to acess logs for particular microservice as token is missing', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice/${idofMicroservice}`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });
});


describe('Basic tests for the log for test user', () => {
  beforeAll((done) => {
    request.post(login.optionsTest, (error, response, body) => {
      tokenTest += login.callback(error, response, body);
      done();
    });
  });

  it('test user should get logs related to him', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs`,
      json: true,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const result = body.data.every(obj => obj.role === 'admin' || obj.role === 'author');

      expect(result).toBe(true);
      done();
    });
  });


  it('test user should get logs for microservices', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice`,
      json: true,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const result = body.data.every(obj => obj.role === 'admin' || obj.role === 'author');

      expect(result).toBe(true);
      done();
    });
  });

  it('test user should get log for user test user', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/microservice/etesuse`,
      json: true,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const result = body.data.every(obj => obj.role === 'admin' || obj.role === 'author');

      expect(result).toBe(true);
      done();
    });
  });


  it('test user should get 401 when trying to get log for esupuse', (done) => {
    request.get({
      url: `${config.baseUrl}auditlogs/byusersignum/esupuse`,
      json: true,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });
});
