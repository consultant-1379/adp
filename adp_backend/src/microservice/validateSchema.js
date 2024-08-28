// ============================================================================================= //
/**
* [ global.adp.microservice.validateSchema ]
* Just validates the Object with the Schema.
* @param {JSON} MS JSON Object with the MicroService to be validated.
* @return {Variable} Returns true if everything is correct or an Array with the list of problems.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS, TYPE) => {
  const ms = MS;
  const assetType = (TYPE === 'microservice');
  const tempID = ms._id;
  // We should delete internal fields ( Which cannot be change by external requests )
  delete ms._id; // Internal CouchDB ID
  delete ms._rev; // Internal CouchDB Revision ID
  delete ms.type; // Internal "Type" of the register ( "microservice"/"user" )
  delete ms.inval_secret; // We cannot accept this from outside

  const errorList = [];
  const assetsSchema = new adp.assets.BuildAssetSchemaClass(assetType);
  const microserviceSchema = assetsSchema.buildSchema().assetSchema;
  const validatorAction = new global.Jsonschema();
  const checkIfDontHave = (field) => {
    const result = microserviceSchema.properties[field] === null
      || microserviceSchema.properties[field] === undefined;
    if (tempID !== undefined && tempID !== null) {
      ms._id = tempID;
    }
    return result;
  };
  let validationResult = null;
  validationResult = validatorAction.validate(MS, microserviceSchema);
  if (validationResult.errors.length > 0) {
    const regExpRemoveInstanceFromName = new RegExp(/(instance\.)/gim);
    validationResult.errors.forEach((error) => {
      if ((error.stack !== null) && (error.stack !== undefined)) {
        const message = error.stack.replace(regExpRemoveInstanceFromName, '');
        errorList.push(message);
      }
    });
  }
  Object.keys(MS).forEach((item) => {
    if (checkIfDontHave(item, MS[item])) {
      errorList.push(`The field ${item} is not part of the schema`);
    }
  });
  if (errorList.length > 0) {
    if (tempID !== undefined && tempID !== null) {
      ms._id = tempID;
    }
    return errorList;
  }
  if (tempID !== undefined && tempID !== null) {
    ms._id = tempID;
  }
  return true;
};
// ============================================================================================= //
