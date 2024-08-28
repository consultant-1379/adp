const answerWith = require('../../answers/answerWith');

// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
* [ adp.middleware.validations.adpSchemaValidator ]
* validates the payload with the Schema.
* @param {JSON} SCHEMA against which payload to be validated
* @return {Variable} Returns true if everything is correct or an Array with the list of problems.
* @author Veerender Voskula[zvosvee]
*/
// ============================================================================================= //
module.exports = SCHEMA => ({ body: OBJ }, RES, NEXT) => {
  const packName = 'adp.middleware.validations.adpSchemaValidator';
  const startTimer = new Date();
  const { echoLog } = adp;
  if (typeof SCHEMA !== 'object' || typeof OBJ !== 'object') {
    const txt = 'Error: Parameter SCHEMA and OBJ must be a valid json Object';
    answerWith(400, RES, startTimer, txt, { OBJ });
    return false;
  }
  const errorList = [];
  const validatorAction = new global.Jsonschema();

  let validationResult = null;
  validationResult = validatorAction.validate(OBJ, SCHEMA);
  if (validationResult.errors.length) {
    validationResult.errors.forEach((error) => {
      if (error.stack) {
        const message = error.stack.replace('instance.', '');
        errorList.push(message);
      }
    });
  }

  const objIterable = (obj = OBJ, schema = SCHEMA) => {
    Object.keys(obj).forEach((item) => {
      if (schema.properties && (schema.properties[item] === null
            || schema.properties[item] === undefined)) {
        errorList.push(`The field "${JSON.stringify(item)}" is not part of the schema`);
      }
    });
  };

  // validates schema containing obj and arrays
  if (Array.isArray(OBJ)) {
    OBJ.forEach((item) => {
      objIterable(item, SCHEMA.items);
    });
  } else {
    objIterable();
  }


  if (errorList.length) {
    echoLog(`Error : Validating ${SCHEMA}`, { ...errorList }, 400, packName, true);
    answerWith(400, RES, startTimer, 'Incorrect user data', { ...errorList });
    return false;
  }
  return NEXT();
};
// ============================================================================================= //
