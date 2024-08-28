// ============================================================================================= //
/**
* [ global.adp.user.validateSchema ]
* Just validates the Object with the Schema.
* @param {JSON} MS JSON Object with the User to be validated.
* @return {Variable} Returns true if everything is correct or an Array with the list of problems.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS) => {
  const errorList = [];
  const microserviceSchema = global.adp.config.schema.user;
  const validatorAction = new global.Jsonschema();
  const checkIfDontHave = (field) => {
    const result = microserviceSchema.properties[field] === null
      || microserviceSchema.properties[field] === undefined;
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
    return errorList;
  }
  return true;
};
// ============================================================================================= //
