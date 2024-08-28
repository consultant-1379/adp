// ============================================================================================= //
/**
* Unit test for innersource contributors controllers
* @author  Veerender Voskula, Michael Coughlan
*/
// ============================================================================================= //
const contributorsResponse = {
  docs: [
    {
      userId: 'esupuse',
      userName: 'Super User',
      userEmail: 'super-user@adp-test.com',
      dateFrom: '2021-02-03',
      dateTo: '2021-03-05',
      totalCommits: 1012,
      totalAddedLines: 25300,
      totalRemovedLines: 10120,
      organisation: 'BDGS SA PC PDG',
      ou: 'BDGS SA PC PDG IPW&POL CCRC Unit 1',
      contributionWeight: 30360,
      micro_services: [
        {
          assetId: '608bc0d0be591ad46deef0d5',
          assetName: 'auto-generated-166',
          commits: 2,
          insertions: 40,
          deletions: 20,
          weight: 50,
        }],
    },
  ],
};

const organisationsResponse = {
  docs: [
    {
      dateFrom: '2021-01-15',
      dateTo: '2021-01-15',
      totalCommits: 57,
      totalAddedLines: 1400,
      totalRemovedLines: 520,
      organisation: 'BDGS SA PC PDG',
      contributionWeight: 1660,
      contributors: 1,
      micro_services: [
        {
          assetId: '1a319091a57a0586ea2199761011f968',
          assetName: 'auto-ms-test-innersource-3',
          commits: 1,
          insertions: 20,
          deletions: 10,
        },
      ],
    },
  ],
};

class MockGitStatus {
  innerSourceContributors() {
    return new Promise((resolve, reject) => {
      if (adp.contributorsFetchError) {
        reject(new Error({ code: 500 }));
        return;
      }
      if (adp.invalidDataSet) {
        resolve();
      }
      if (adp.emptyDataSet) {
        resolve({ docs: [] });
      }
      if (adp.emptyMicroServicesDataSet) {
        resolve({ docs: [{ micro_services: [] }] });
      }
      resolve(contributorsResponse);
    });
  }

  innersourceOrganisations() {
    return new Promise((resolve, reject) => {
      if (adp.organisationsFetchError) {
        reject(new Error({ code: 500 }));
        return;
      }

      if (adp.invalidDataSet) {
        resolve();
      }

      if (adp.emptyDataSet) {
        resolve({ docs: [] });
      }

      if (adp.emptyMicroServicesDataSet) {
        resolve({ docs: [{ micro_services: [] }] });
      }

      resolve(organisationsResponse);
    });
  }
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
describe('Testing innersource.contributors controller behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    adp.models = {};
    adp.models.Gitstatus = MockGitStatus;
    adp.echoLog = text => text;
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {};

    global.adp.microservices = {};
    global.adp.microservices.checkIfDontHaveInSchema = key => !(key === 'filter_test1' || key === 'filter_test2');

    adp.query = { fromDate: '2020-01-01', toDate: '2021-04-04', domain: '1' };
    adp.controller = require('./contributions.controller');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('success with empty query filters:fetch top contributors', async (done) => {
    await adp.controller.contributions({})
      .then((result) => {
        expect(result.data[0].micro_services.length).toBe(1);
        expect(result.total).toBe(1);
        done();
      }).catch(() => done.fail());
  });

  it('success without any query filters:fetch top contributors', async (done) => {
    await adp.controller.contributions()
      .then((result) => {
        expect(result.data[0].micro_services.length).toBe(1);
        expect(result.total).toBe(1);
        done();
      }).catch(() => done.fail());
  });

  it('success with query filters:fetch top contributors', async (done) => {
    adp.emptyDataSet = true;
    await adp.controller.contributions(adp.query)
      .then((result) => {
        expect(result.data.length).toBe(0);
        expect(result.total).toBe(0);
        done();
      }).catch(() => done.fail());
  });

  it('success with no date range filters:fetch top contributors', async (done) => {
    adp.emptyMicroServicesDataSet = true;
    await adp.controller.contributions({ domain: '1', service_category: '1' })
      .then((result) => {
        expect(result.data.length).toBe(0);
        expect(result.total).toBe(0);
        done();
      }).catch(() => done.fail());
  });

  it('failed with db failure :fetch top contributors', async (done) => {
    adp.contributorsFetchError = true;
    await adp.controller.contributions(adp.query)
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('failed because of invalid data set:fetch top contributors', async (done) => {
    adp.invalidDataSet = true;
    await adp.controller.contributions(adp.query)
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('failed because of invalid query:fetch top contributors', async (done) => {
    adp.invalidDataSet = true;
    await adp.controller.contributions('mock')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('should successfully fetch the organisations with empty query parameters', (done) => {
    adp.controller.contributions({}, 'organisations')
      .then((result) => {
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        done();
      })
      .catch(() => done.fail());
  });

  it('should successfully fetch the organisations without any query parameters', (done) => {
    adp.controller.contributions(undefined, 'organisations')
      .then((result) => {
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        done();
      })
      .catch(() => done.fail());
  });

  it('should successfully fetch the organisations with query filters', (done) => {
    adp.emptyDataSet = true;
    adp.controller.contributions(adp.query, 'organisations')
      .then((result) => {
        expect(result.data.length).toBe(0);
        expect(result.total).toBe(0);
        done();
      })
      .catch(() => done.fail());
  });

  it('should successfully fetch the organisations with no dateFrom filter', (done) => {
    adp.emptyMicroServicesDataSet = true;
    adp.controller.contributions({ domain: '1', service_category: '1' }, 'organisations')
      .then((result) => {
        expect(result.data.length).toBe(0);
        expect(result.total).toBe(0);
        done();
      }).catch(() => done.fail());
  });

  it('should fail with a database failure', (done) => {
    adp.organisationsFetchError = true;
    adp.controller.contributions({}, 'organisations')
      .then(() => done.fail())
      .catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('should fail with an invalid data set', (done) => {
    adp.invalidDataSet = true;
    adp.controller.contributions({}, 'organistions')
      .then(() => done.fail())
      .catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('should fail because of an invalid query', (done) => {
    adp.invalidDataSet = true;
    adp.controller.contributions('mock', 'organisations')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });
});
// ============================================================================================= //
