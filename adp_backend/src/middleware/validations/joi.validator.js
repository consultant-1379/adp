const answerWith = require('../../answers/answerWith');
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const isEmptySchema = (schema) => {
  if (!schema || Object.keys(schema).length === 0) {
    return true;
  }
  return false;
};
const statusCode = 400;

/**
* [ adp.middleware.validations.joi.validator.validateRequestSchema ]
* Joi Validator:Will validate the request object with the specified schemas.
* @param {Object} schema - JOI schema to validate
* @param {Object} property  request object to validate against schema;
* @return {Object} Returns validation object with error code and message.
* @author Veerender Voskula[zvosvee]
*/
const validateRequestSchema = (schema, property) => {
  if (isEmptySchema(schema)) {
    return { message: 'Schema not found', code: statusCode };
  }

  if (!property) {
    return { message: 'Input data not found for validating against schema', code: statusCode };
  }
  const { error } = schema.validate(property);
  let valErrorObj = {};
  if (error) {
    const { details } = error;
    const message = details.map(i => i.message).join(',');
    valErrorObj = { message, code: statusCode };
  }

  return valErrorObj;
};


/**
* [ adp.middleware.validations.joi.validator.joiValidator ]
* Middleware:Will validate the request object with the specified schemas.
* @param {Object} schema - map of req inputs => JOI schema to validate;default empty joi object
* @param {string} property  default is body;
* valid keys are body, headers, params, query, cookies etc;
* @return {boolean} Returns true and call next middleware if no validation failures;
* otherwise list the validation failures.
* @author Veerender Voskula[zvosvee]
*/
// ============================================================================================= //
const joiValidator = (schema, property = 'body') => (req, res, next) => {
  if (isEmptySchema(schema)) {
    answerWith(statusCode, res, new Date(), 'Schema not found');
    return;
  }
  const { message, code } = validateRequestSchema(schema[property], req[property]);
  if (code) {
    adp.echoLog(`Error : Validating schema of req.${property}`, { message, origin: 'joi.validator' }, code, 'adp.middleware.validations.joi.validator');
    answerWith(code, res, new Date(), message);
  } else {
    next();
  }
};

module.exports = { joiValidator, validateRequestSchema };
