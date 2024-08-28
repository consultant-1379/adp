// ============================================================================================= //
/**
* Unit test for [ adp.assets.BuildAssetSchemaClass ]
* @author Tirth [zpaptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

describe('Creating a class from [ adp.assets.BuildAssetSchemaClass ] and testing... ', () => {
  beforeEach(() => {
    global.adp = {};

    adp.behavior = {};
    adp.behavior.updateService = 0;
    adp.behavior.adpLogCreateOne = 0;

    adp.echoLog = () => {};
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.assets = {};
    adp.assets.BuildAssetSchemaClass = proxyquire('./BuildAssetSchemaClass', {
      schemaBase: '../setup/schema_base.json',
      schemaBaseAssembly: '../setup/schema_base_assembly.json',
      schemaBaseMicroservice: '../setup/schema_base_microservice.json',
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case when assembly schema is returned', (done) => {
    const buildSchema = new adp.assets.BuildAssetSchemaClass(false);
    const RESULT = buildSchema.buildSchema();

    expect(RESULT.assetSchema.properties.assembly_category).toBeDefined();
    expect(RESULT.assetSchema.properties.assembly_maturity).toBeDefined();
    expect(RESULT.assetSchema.properties.component_service).toBeDefined();
    expect(RESULT.assetSchema.properties.service_maturity).toBeUndefined();
    expect(RESULT.assetSchema.properties.service_category).toBeUndefined();
    expect(RESULT.assetSchema.required.includes('assembly_maturity')).toBeTruthy();
    expect(RESULT.assetSchema.required.includes('assembly_category')).toBeTruthy();
    done();
  });

  it('Successful case when microservice schema is returned', (done) => {
    const buildSchema = new adp.assets.BuildAssetSchemaClass();
    const RESULT = buildSchema.buildSchema();

    expect(RESULT.assetSchema.properties.service_category).toBeDefined();
    expect(RESULT.assetSchema.properties.service_maturity).toBeDefined();
    expect(RESULT.assetSchema.properties.component_service).toBeUndefined();
    expect(RESULT.assetSchema.properties.assembly_maturity).toBeUndefined();
    expect(RESULT.assetSchema.properties.assembly_category).toBeUndefined();
    expect(RESULT.assetSchema.required.includes('assembly')).toBeFalsy();
    done();
  });
});
// ============================================================================================= //
