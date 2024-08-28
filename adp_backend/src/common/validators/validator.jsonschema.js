// ============================================================================================= //
/**
* [ global.adp.common.utils.validator.jsonschema ]
* Just validates the Object with the Schema.
* NOTE - At this point, its only for one layer validation
* @param {JSON} OBJ to be validated
* @param {JSON} SCHEMA against which to be validated
* @return {Variable} Returns true if everything is correct or an Array with the list of problems.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
module.exports = (OBJ, SCHEMANAME) => {
  const errorList = [];
  const validatorAction = new global.Jsonschema();
  const SCHEMA = adp.config.schema[SCHEMANAME];
  const validationResult = validatorAction.validate(OBJ, SCHEMA);
  if (validationResult.errors.length) {
    validationResult.errors.forEach((error) => {
      if (error.stack) {
        const message = error.stack.replace('instance.', '');
        errorList.push(message);
      }
    });
  }
  if (Object.keys(OBJ).length) {
    Object.keys(OBJ).forEach((item) => {
      if (SCHEMA.properties[item] === null
          || SCHEMA.properties[item] === undefined) {
        errorList.push(`The field ${item} is not part of the schema`);
      }
    });
  }
  return errorList.length ? errorList : true;
};
// ============================================================================================= //
