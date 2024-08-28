// ============================================================================================= //
/**
* [ global.adp.microservices.checkIfDontHaveInSchema ]
* Returns boolean if the field exists or not in the MicroServices Schema.
* ( /src/setup/schema_microservice.json ).
* @param {Object} NAMEOFFIELD The name of the field to check.
* @param {Object} SCHEMATYPE
* @return {BOOLEAN} Returns true/false ( True for not exist ).
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (NAMEOFFIELD, SCHEMATYPE = 'microservice') => {
  try {
    let microserviceSchema;
    if (SCHEMATYPE && SCHEMATYPE === 'assembly' && NAMEOFFIELD !== 'domain') {
      const mergedAssemblyBaseSchema = new adp.assets.BuildAssetSchemaClass(false);
      microserviceSchema = mergedAssemblyBaseSchema.buildSchema().assetSchema;
    } else {
      const mergedMicroserviceBaseSchema = new adp.assets.BuildAssetSchemaClass();
      microserviceSchema = mergedMicroserviceBaseSchema.buildSchema().assetSchema;
      // microserviceSchema = global.adp.config.schema.microservice;
    }
    const checkIfDontHave = (FIELD) => {
      let checkThis = FIELD;
      if (checkThis.substr(0, 1) === '-') {
        checkThis = checkThis.substr(1, (checkThis.length - 1));
      }
      const result = microserviceSchema.properties[checkThis] === null
        || microserviceSchema.properties[checkThis] === undefined;
      return result;
    };
    return (checkIfDontHave(NAMEOFFIELD));
  } catch (ERROR) {
    const booleanErrorReturnShouldBeTrue = true;
    return (booleanErrorReturnShouldBeTrue);
  }
};
// ============================================================================================= //
