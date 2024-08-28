const data = require('../test.data.js');

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
let microserviceID;

describe('Testing Microservice Endpoint to check complience rules', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('[Compliance] Should succesfully create MS with compliance', async (done) => {
    const msData = data.demoService_with_compliance;
    microserviceID = await portal.createMS(msData);

    expect(microserviceID).toBeDefined();
    done();
  });

  it('[Compliance] Should succesfully update MS with new compliance', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
            comment: 'Test Comment 1',
          },
          {
            field: 2,
            answer: 2,
            comment: 'Test Comment 2',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(200);
    const complienceMS = response.body.data.compliance;
    const result1 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 1'));
    const result2 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 2'));

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    done();
  });

  it('[Compliance] Should succesfully update MS with compliance answer set to yes without comment', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(200);
    done();
  });

  it('[Compliance] Should fail to update compliance with values No without comment', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 3,
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update compliance with values Partially Compliant without comment', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 4,
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update compliance with values Not Aplicable without comment', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 4,
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update compliance with not existing value for Group', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 100,
        fields: [
          {
            field: 1,
            answer: 4,
            comment: 'Test Comment 1',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update compliance with not existing value for Field', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 100,
            answer: 4,
            comment: 'Test Comment 2',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update compliance with empty array for the fields', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update MS with compliance with comment and without answer( 0 value)', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 0,
            comment: 'Test Comment 1',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });

  it('[Compliance] Should fail to update MS with compliance with empty string comment and without answer( 0 value)', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 0,
            comment: '',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(400);
    done();
  });


  it('[Compliance] Should succesfully update complience with 2 groups and several fields in each group', async (done) => {
    const msDataComplience = data.demoService_with_compliance;
    msDataComplience.compliance = [
      {
        group: 1,
        fields: [
          {
            field: 1,
            answer: 1,
          },
          {
            field: 2,
            answer: 2,
            comment: 'Test Comment 2',
          },
          {
            field: 3,
            answer: 2,
            comment: 'Test Comment 3',
          },
          {
            field: 4,
            answer: 3,
            comment: 'Test Comment 4',
          },
          {
            field: 5,
            answer: 4,
            comment: 'Test Comment 5',
          },
        ],
      },
      {
        group: 2,
        fields: [
          {
            field: 1,
            answer: 1,
          },
          {
            field: 2,
            answer: 2,
            comment: 'Test Comment 8',
          },
          {
            field: 3,
            answer: 2,
            comment: 'Test Comment 9',
          },
          {
            field: 4,
            answer: 3,
            comment: 'Test Comment 10',
          },
          {
            field: 5,
            answer: 4,
            comment: 'Test Comment 11',
          },
          {
            field: 6,
            answer: 1,
          },
          {
            field: 7,
            answer: 1,
            comment: 'Test Comment 13',
          },
          {
            field: 8,
            answer: 1,
            comment: 'Test Comment 14',
          },
          {
            field: 12,
            answer: 1,
            comment: 'Test Comment 17',
          },
        ],
      },
    ];
    const response = await portal.updateMS(msDataComplience, microserviceID);

    expect(response.code).toBe(200);

    const complienceMS = response.body.data.compliance;
    const result1 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 2'));
    const result2 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 5'));
    const result3 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 8'));
    const result4 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 17'));


    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
    expect(result4).toBe(true);
    done();
  });

  it('[Compliance] Should succesfully get MS with compliances ', async (done) => {
    const msObjectResponse = await portal.getMS(microserviceID);

    expect(msObjectResponse.code).toBe(200);

    const complienceMS = msObjectResponse.body.data.compliance;
    const result1 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 2'));
    const result2 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 5'));
    const result3 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 8'));
    const result4 = complienceMS.some(obj => JSON.stringify(obj).includes('Test Comment 17'));

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
    expect(result4).toBe(true);

    done();
  });
});
