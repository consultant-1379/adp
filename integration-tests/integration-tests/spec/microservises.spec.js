const request = require('request');
const config = require('../test.config.js');
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();


let token = 'Bearer ';

describe('Microservices endpoint', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  describe('Basic tests for the microservices(no login required)', () => {
    it('should get second page of Microservices, 10 items per page, all data for each microservice', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?page=1&limit=10&sort=reusability_level,name`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(body.data[0].microservices.length).toBe(10);
        expect(body.page).toEqual(1);
        done();
      });
    });

    it('should get Microservices only where reusability_level Reused', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?reusability_level=4&page=1&sort=reusability_level,-name`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.filter(obj => obj.reusability_level !== 4);

        expect(result).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should get Microservices only where service category  1 or 3 ', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?service_category=1,3`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.filter(obj => obj.service_category !== '1' && obj.service_category !== '3' && obj.service_category !== 1 && obj.service_category !== 3);

        expect(result).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should get Microservices only where service category = 1 and reusability_level is 4', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?reusability_level=4&service_category=1`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.filter(obj => obj.service_category !== 1 && obj.reusability_level !== 4);

        expect(result).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should get Microservices only where service category ADP Generic Services', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?service_category=1`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.filter(obj => obj.service_category !== 1);

        expect(result).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should get Microservices only where domain  2 or 3 (OSS or BSS)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?domain=2,3`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const resultAfterFilter = responseMicroservices.filter(obj => obj.domain !== 2 && obj.domain !== 3);

        expect(resultAfterFilter).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should get Microservices only where domain 2 or 3 (OSS or BSS) and service maturity 1(Idea)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?domain=2,3&service_maturity=1`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const resultAfterFilter = responseMicroservices.filter(obj => obj.domain !== 2 && obj.domain !== 3 && obj.service_maturity !== 1);

        expect(resultAfterFilter).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should get Microservices groupby service category and display ADP Generic Services', (done) => {
      request.get({
        url: `${config.baseUrl}microservices?groupby=service_category`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);


        let foundGroup = false;
        body.data.forEach((GROUP) => {
          if (GROUP.groupType === true && GROUP.groupHeader === 'ADP Generic Services') {
            foundGroup = true;
          }
        });

        expect(foundGroup).toBeTruthy();
        done();
      });
    });

    it('should get Microservices groupby Reusability level and display None services', (done) => {
      request.get({
        url: `${config.baseUrl}microservices?groupby=reusability_level`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);


        let foundGroup = false;
        body.data.forEach((GROUP) => {
          if (GROUP.groupType === true && GROUP.groupHeader === 'None') {
            foundGroup = true;
          }
        });

        expect(foundGroup).toBeTruthy();
        done();
      });
    });

    it('should get Microservices groupby Service Area and check if Messaging group is returned', (done) => {
      request.get({
        url: `${config.baseUrl}microservices?groupby=serviceArea`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);


        let foundGroup = false;
        body.data.forEach((GROUP) => {
          if (GROUP.groupType === true && GROUP.groupHeader === 'Messaging') {
            foundGroup = true;
          }
        });

        expect(foundGroup).toBeTruthy();
        done();
      });
    });

    it('should get Microservices group by Service Area and check if Messaging group is returned', (done) => {
      request.get({
        url: `${config.baseUrl}microservices?groupby=serviceArea&service_category=1`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);

        const responseMicroservices = body.data[0].microservices;
        const resultAfterFilter = responseMicroservices.filter(obj => obj.service_category !== 1);


        let foundGroup = false;
        body.data.forEach((GROUP) => {
          if (GROUP.groupType === true && GROUP.groupHeader === 'Security') {
            foundGroup = true;
          }
        });

        expect(resultAfterFilter).toEqual([]);
        expect(foundGroup).toBeTruthy();
        done();
      });
    });

    it('should return Microservices only which containing "innersource" word in any field', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=innersource`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => JSON.stringify(obj).includes('innersource'));

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should return array of MS with "ADP Generic Services" content when search for ADP Generic Services', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=ADP%20Generic%20Services`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => JSON.stringify(obj).includes('ADP Generic Services'));

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should return 404 when search for ADP Generic Services and filter ADP Reusable Services', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=ADP%20Generic%20Services&service_category=2`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return Microservices only which containing "tags" word in any field,return all information for microservice', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=tags`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => JSON.stringify(obj).includes('tags'));

        expect(result).toBe(true);
        expect(responseMicroservices).not.toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should return Microservices only which contain "mandatory" word in any field, return all information for microservice', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=mandatory`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => JSON.stringify(obj).includes('mandatory'));

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should search by name and return appropriate result', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=Auto MS max for Report`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.name === 'Auto MS max for Report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by name and return appropriate result [2]', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=Auto MS max for Report`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.name === 'Auto MS max for Report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by description and return appropriate result', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=maximum data for the report`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.description === 'This is a service containing maximum data for the report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by restricted field and return appropriate result', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=other`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.name === 'Auto MS max for Report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by restricted_description field and return appropriate result', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=Reason to be Restricted`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.name === 'Auto MS max for Report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by domain field and return appropriate result', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=COS`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.find(obj => obj.name === 'Auto MS max for Report');

        expect(result).toBeDefined();
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should search by service maturity and return appropriate result, check all services in response have specified maturity', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=Ready for Non-Commercial Use`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => obj.service_maturity === 6);

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should search by service category and return appropriate result, check all services in response have specified service category', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?search=Ready for Non-Commercial Use`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => obj.service_maturity === 6);

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });


    it('should return Microservices only which contain Based on field equal to Test 3PP', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?based_on=Test 3PP`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const responseMicroservices = body.data[0].microservices;
        const result = responseMicroservices.every(obj => obj.based_on === 'Test 3PP');

        expect(result).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should check if microservices are sorted by name correctly', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?sort=name`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        const result = body.data[0].microservices.map(obj => obj.name);
        const sort = result.sort();
        function arraysEqual() {
          for (let i = 0; i < result.length; i += 1) {
            if (sort[i] !== result[i]) return false;
          }
          return true;
        }

        expect(arraysEqual()).toBe(true);
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  // ============================================================================================= //
  /**
* [ Integration tests for Marketplace Search, Filter, Group By ]
* @author Akshay Mungekar
*/
  describe('Testing the response of invalid filterby endpoints', () => {
    it('should return an error response for invalid filter endpoints (eg.service category)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?service_category=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return an error response for invalid filter endpoints (eg.reusability level)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?reusability_level=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return an error response for invalid filter endpoints (eg.service maturity)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?service_maturity=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return an error response for invalid filter endpoints (eg.domain)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?domain=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return an error response for invalid filter endpoints (eg.service area)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?serviceArea=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('should return an error response for invalid filter endpoints (eg.service category and reusability level)', (done) => {
      request.get({
        url: `${config.baseUrl}microservices/?service_category=999&reusability_level=999`,
        headers: { Authorization: token },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    // Group By Tests
    describe('Testing the response of groupby options accessed from the dropdown', () => {
      it('should return an error response for invalid grouping endpoints', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?groupby=service_maturity`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });

      it('should return an error response for invalid filter endpoints and valid grouping endpoints (eg.service category,service maturity by reusability level)', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?groupby=reusability_level&service_category=999&service_maturity=999`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(404);
          done();
        });
      });

      it('should return an error response for valid filter endpoints and invalid grouping endpoints (eg.service category,service maturity by service maturity)', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?groupby=service_maturity&service_category=1&service_maturity=1`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });
    });

    // Sort By Tests
    describe('Testing the response of sort by options on marketplace', () => {
      beforeAll(async () => {
        await portal.login();
      });

      it('should check if microservices are sorted by date modified asc', async (done) => {
        const msObjectResponse = await portal.searchMS('?reusability_level=1&page=1&sort=-date_modified');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS1.date_modified) - new Date(MS2.date_modified)));

        const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside reusability level should be by date_modified got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();
        done();
      });

      it('should  check if microservices are sorted by date modified desc', async (done) => {
        const msObjectResponse = await portal.searchMS('?reusability_level=1&page=1&sort=date_modified');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS2.date_modified) - new Date(MS1.date_modified)));

        const MSResponse = msObjectResponse
          && msObjectResponse.body
          && msObjectResponse.body.data
          && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside reusability level should by date_modified got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();

        expect(msObjectResponse.code)
          .withContext(`The server code should be 200: ${msObjectResponse.code}`)
          .toEqual(200);
        done();
      });

      it('should check if microservices are sorted by date created asc', async (done) => {
        const msObjectResponse = await portal.searchMS('?reusability_level=1&page=1&sort=-date_created');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS1.date_created) - new Date(MS2.date_created)));

        const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside reusability level should by date_modified got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();
        done();
      });

      it('should try check if microservices are sorted by date created desc', async (done) => {
        const msObjectResponse = await portal.searchMS('?reusability_level=1&page=1&sort=date_created');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS2.date_created) - new Date(MS1.date_created)));

        const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside reusability level should by date_created got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();
        done();
      });


      it('should check if microservices are sorted by date modified asc while service_category = 1', async (done) => {
        const msObjectResponse = await portal.searchMS('?service_category=1&groupby=service_category&page=1&sort=-date_modified');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS1.date_modified) - new Date(MS2.date_modified)));

        const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside service_category should be by date_modified got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();
        done();
      });

      it('should check if microservices are sorted by date modified asc while grouping by reusability level', async (done) => {
        const msObjectResponse = await portal.searchMS('?reusability_level=1&groupby=reusability_level&page=1&sort=-date_modified');

        const responseMicroservices = msObjectResponse.body.data[0].microservices;
        const sortedModifiedDate = responseMicroservices.sort((MS1, MS2) => (
          new Date(MS1.date_modified) - new Date(MS2.date_modified)));

        const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
          ? msObjectResponse.body.data[0].microservices
          : null;


        expect(responseMicroservices)
          .withContext(`Sorting inside service_category should be by date_modified got  ${responseMicroservices}`)
          .toEqual(sortedModifiedDate);

        expect(MSResponse)
          .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
          .not.toBeNull();
        done();
      });
    });

    // Search tests for regex validations (@ - . ,)

    describe('Testing the response of search field to validate the searched string inclusive of accepted special symbols', () => {
      it('should search service by user email and return appropriate result', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=super-user%40adp-test.com`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const res = body.data[0].microservices;
          const result = res.find(obj => obj.name === 'Auto MS with Docs');

          expect(response.statusCode).toBe(200);
          expect(res).not.toEqual([]);
          expect(result).not.toEqual([]);
          done();
        });
      });

      it('should search service by user email after trim and return an appropriate result', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=super!-user%40*adp-test.com`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const res = body.data[0].microservices;
          const result = res.find(obj => obj.name === 'Auto MS with Docs');

          expect(response.statusCode).toBe(200);
          expect(res).not.toEqual([]);
          expect(result).not.toEqual([]);
          done();
        });
      });

      it('should return an error response for invalid special symbols in the searched email string', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=super_user%40adp~test.com`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(404);
          done();
        });
      });

      it('should return an error response for empty string after trim', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=!~*%25`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });

      it('should search service by description inclusive of accepted special symbols and return appropriate result', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=Min%20Microservice%2C%20to%20test%20just%20mandatory%20fields`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const res = body.data[0].microservices;
          const result = res.find(obj => obj.name === 'Auto MS Min');

          expect(response.statusCode).toBe(200);
          expect(res).not.toEqual([]);
          expect(result).not.toEqual([]);
          done();
        });
      });

      it('should search service by description after trim and return an appropriate result', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=Min%20%20Microservice%3B%2C%20to%20test%20just%20a%20mandatory%20fields!`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const res = body.data[0].microservices;
          const result = res.find(obj => obj.name === 'Auto MS Min');

          expect(response.statusCode).toBe(200);
          expect(res).not.toEqual([]);
          expect(result).not.toEqual([]);
          done();
        });
      });

      it('should return an empty response for invalid words/characters between the valid searched description string', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=Mimimum%20Microservice%2C%20to%20test%20just%20a%20mandatory%20fields`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const errorObject = {
            url: `${config.baseUrl}microservices/?search=Mim%20Microservice%2C%20to%20test%20just%20a%20mandatory%20fields`,
            body,
          };

          expect(response.statusCode)
            .withContext(`Expected statusCode as 404, got ${response.statusCode} instead :: ${JSON.stringify(errorObject, null, 2)}`)
            .toBe(404);
          done();
        });
      });

      it('should return an empty result for inval_secret in the backend and return an appropriate response', (done) => {
        request.get({
          url: `${config.baseUrl}microservices/?search=Auto%20MS%20Test%202`,
          headers: { Authorization: token },
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const res = body.data[0].microservices;
          const result = res.filter(obj => obj.inval_secret === 'abcdef');

          expect(response.statusCode).toBe(200);
          expect(res).not.toEqual([]);
          expect(result).toEqual([]);
          done();
        });
      });
    });
  });

  describe('Basic microservices logic for RBAC', () => {
    describe('for Etasase admin user in No Perm Group', () => {
      beforeAll(async () => {
        await portal.login(login.optionsTestUserEtasase);
      });

      it('should try to find MS for user, asset belongs to that group', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.slug === 'auto-ms-min');

        expect(res).not.toEqual([]);
        expect(result).not.toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });

      it('should try to find MS for user, asset was deleted', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.name === 'ms-deleted');

        expect(res).not.toEqual([]);
        expect(result).toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });
    });

    describe('for Etasase user in No Perm Group', () => {
      beforeAll(async () => {
        await portal.login(login.optionsTestUserEtarase);
      });

      it('should try to find MS for user, asset was deleted for Etarase', async (done) => {
        const msObjectResponse = await portal.searchMS();

        expect(msObjectResponse.code).toBe(404);
        done();
      });
    });

    describe('for Epesuse user in static group', () => {
      beforeAll(async () => {
        await portal.login(login.optionsTestUserEpesuse);
      });

      it('should try to find MS for user, asset belongs to that group for Epesuse', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.slug === 'document-refresh-warnings-test');

        expect(res).not.toEqual([]);
        expect(result).not.toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });

      it('should try to find MS for user, asset outside of the group', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.name === 'auto-ms-max');

        expect(res).not.toEqual([]);
        expect(result).toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });
    });

    describe('for Etapase user in static group', () => {
      beforeAll(async () => {
        await portal.login(login.optionsTestUserEtesuse2);
      });

      it('should try to find MS for user, asset belongs to that group for Etapase', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.slug === 'auto-ms-max');

        expect(res).not.toEqual([]);
        expect(result).not.toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });

      it('should try to find MS for user, where he is service owner', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.slug === 'auto-ms-min');

        expect(res).not.toEqual([]);
        expect(result).not.toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });

      it('should try to find MS for user, asset outside of the group', async (done) => {
        const msObjectResponse = await portal.searchMS();
        const res = msObjectResponse.body.data[0].microservices;
        const result = res.filter(obj => obj.name === 'document-refresh-warnings-test');

        expect(res).not.toEqual([]);
        expect(result).toEqual([]);
        expect(msObjectResponse.code).toBe(200);
        done();
      });
    });
  });

  describe('[ RBAC ] Testing Administration Asset List ( Endpoint: /microservices-by-owner/ )', () => {
    it('[ RBAC ] SuperUser access the Administration Asset List ( All assets allowed ).', (done) => {
      portal.login(login.optionsAdmin)
        .then((TOKEN) => {
          const options = {
            url: `${config.baseUrl}microservices-by-owner`,
            headers: { Authorization: TOKEN },
            strictSSL: false,
          };
          request.post(options,
            (error, response) => {
              if (error) {
                done.fail();
                return;
              }
              const jsonReturn = JSON.parse(response.body);

              expect(jsonReturn.code).toBe(200);
              expect(jsonReturn.total).not.toBe(0);
              expect(Array.isArray(jsonReturn.data)).toBeTruthy();
              done();
            });
        })
        .catch(() => {
          done.fail();
        });
    });

    it('[ RBAC ] TestUser access the Administration Asset List ( Not zero assets allowed ).', (done) => {
      portal.login(login.optionsTest)
        .then((TOKEN) => {
          const options = {
            url: `${config.baseUrl}microservices-by-owner`,
            headers: { Authorization: TOKEN },
            strictSSL: false,
          };
          request.post(options,
            (error, response) => {
              if (error) {
                done.fail();
                return;
              }
              const jsonReturn = JSON.parse(response.body);

              expect(jsonReturn.code).toBe(200);
              expect(jsonReturn.total).not.toBe(0);
              expect(Array.isArray(jsonReturn.data)).toBeTruthy();
              done();
            });
        })
        .catch(() => {
          done.fail();
        });
    });

    it('[ RBAC ] Etapase User access the Administration Asset List ( Zero assets allowed ).', (done) => {
      portal.login(login.optionsTestUserEtapase)
        .then((TOKEN) => {
          const options = {
            url: `${config.baseUrl}microservices-by-owner`,
            headers: { Authorization: TOKEN },
            strictSSL: false,
          };
          request.post(options,
            (error, response) => {
              if (error) {
                done.fail();
                return;
              }
              const jsonReturn = JSON.parse(response.body);

              expect(jsonReturn.code).toBe(200);
              expect(jsonReturn.total).toBe(0);
              expect(Array.isArray(jsonReturn.data)).toBeTruthy();
              done();
            });
        })
        .catch(() => {
          done.fail();
        });
    });
  });
});
