const schemaBase = require('../setup/schema_base.json');
const schemaBaseAssembly = require('../setup/schema_base_assembly.json');
const schemaBaseMicroservice = require('../setup/schema_base_microservice.json');

/**
* [ adp.assets.BuildAssetSchemaClass ]
* @author Ravikiran G [zgarsri]
*/
// ============================================================================================= //

class BuildAssetSchemaClass {
  // ------------------------------------------------------------------------------------------ //
  constructor(LOADMS = true) {
    this.packName = 'adp.assets.BuildAssetSchemaClass';
    this.loadExtra = LOADMS ? schemaBaseMicroservice : schemaBaseAssembly;
  }
  // ------------------------------------------------------------------------------------------ //

  /**
   * The build schema method is to construct the required schema
   * for assets (MS / Assembly) CRUD operation.
   * @return {object} Object with the result of the complete MS / Assembly schema.
   * @author Ravikiran G [zgarsri]
   */
  buildSchema() {
    const mergedSchema = JSON.parse(JSON.stringify(schemaBase));
    Object.keys(this.loadExtra.assetSchema.properties).forEach((FIELD) => {
      mergedSchema.assetSchema.properties[FIELD] = this.loadExtra.assetSchema.properties[FIELD];
    });
    this.loadExtra.assetSchema.required.forEach((REQUIRED) => {
      mergedSchema.assetSchema.required.push(REQUIRED);
    });
    return mergedSchema;
  }
}
// ============================================================================================= //

module.exports = BuildAssetSchemaClass;
