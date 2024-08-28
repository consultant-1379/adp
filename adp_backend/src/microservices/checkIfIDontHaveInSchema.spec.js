// ============================================================================================= //
/**
* Unit test for [ global.adp.microservices.checkIfIDontHaveInSchema ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //

class MockBuildAssetSchemaClass {
  buildSchema() {
    if (global.mockBehaviour.buildSchema) {
      const result = {
        assetSchema: {
          name: 'MockName',
          properties: {
            name: {
              description: 'The Name of the Asset',
            },
          },
        },
      };
      return result;
    }
    const error = 'MockError';
    return error;
  }
}

describe('Testing [ global.adp.microservices.checkIfIDontHaveInSchema ]', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {
      id: '/microservice',
      type: 'object',
      properties: {
        name: {
          description: 'The Name of the MicroService',
          type: 'string',
          minLength: '3',
          maxLength: '30',
        },
        alignment: {
          description: 'The ID of the Alignment of the MicroService',
          type: 'integer',
        },
      },
    };
    global.mockExpect = {};
    global.mockBehaviour = {};
    global.mockBehaviour.buildSchema = true;
    global.adp.assets = {};
    global.adp.assets.BuildAssetSchemaClass = MockBuildAssetSchemaClass;
    /* eslint-disable global-require */
    global.adp.microservices = {};
    global.adp.microservices.checkIfDontHaveInSchema = require('./checkIfIDontHaveInSchema');
    /* eslint-enable global-require */
  });
  // =========================================================================================== //


  // =========================================================================================== //
  afterEach(() => {
    global.adp = null;
    global.mockExpect = null;
    global.mockBehaviour = null;
  });
  // =========================================================================================== //


  // =========================================================================================== //
  it('Asking if we do not have "name" in the Mock Schema. Should returns "false" because we have.', async (done) => {
    const result = global.adp.microservices.checkIfDontHaveInSchema('name');

    expect(result).toBeFalsy();
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Asking if we do not have "name" in the Mock Schema. Should returns "false" because we have for assembly.', async (done) => {
    const result = global.adp.microservices.checkIfDontHaveInSchema('name', 'assembly');

    expect(result).toBeFalsy();
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Asking if we do not have "-name" in the Mock Schema. Should returns "false" because we have "name".', async (done) => {
    const result = global.adp.microservices.checkIfDontHaveInSchema('-name');

    expect(result).toBeFalsy();
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Asking if we do not have "testeField" in the Mock Schema. Should returns "true" because we do not have.', async (done) => {
    const result = global.adp.microservices.checkIfDontHaveInSchema('testeField');

    expect(result).toBeTruthy();
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('When buildSchema() sends error', async (done) => {
    global.mockBehaviour.buildSchema = false;
    const result = global.adp.microservices.checkIfDontHaveInSchema('name');

    expect(result).toBeTruthy();
    done();
  });
  // =========================================================================================== //


  // =========================================================================================== //
});
// ============================================================================================= //
