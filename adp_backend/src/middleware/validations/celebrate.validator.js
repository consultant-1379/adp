adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
* [ adp.common.validators.celebrate.validator ]
   * Will validate the request object with the specified schemas
   * @param {Object} schema - map of req inputs => JOI schema to validate
   * valid keys for schemaMap:  headers, body, query, params
   * @param {Object} options - Joi options to be directly passed into validation
   * @returns {Function} a middleware function to execute
   * @author Veerender Voskula[zvosvee]
*/
const {
  celebrate,
} = require('celebrate');

const DEFAULT_OPTIONS = {
  abortEarly: false,
  messages: {
    'string.empty': '{#label} cant be empty!',
    'any.required': '{#label} is a required field for this operation',
  },
};

const celebrateValidator = (schema, options = DEFAULT_OPTIONS) => {
  const opts = Object.assign({}, options);
  return celebrate(schema, opts);
};

module.exports = celebrateValidator;
