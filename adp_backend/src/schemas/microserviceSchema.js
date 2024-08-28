/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-useless-return */

const { Joi, Segments } = require('celebrate');

/**
 * Check whether the Microservice itself has CPI enabled and provide an appropriate
 * default value
 *
 * @param {object} requestBody the release version part of the request body
 * @param {object} helper JOI object containing the parent parts of the request body
 * @returns {boolean}
 *
 * @author Michael Coughlan [zmiccou]
 */
const checkDefaultCpi = (requestBody, helper) => {
  const { is_cpi_updated } = requestBody;

  helper.state.ancestors.forEach((ancestor) => {
    if (ancestor.hasOwnProperty('check_cpi')) {
      if (ancestor.check_cpi) {
        return is_cpi_updated ? is_cpi_updated : false;
      }

      return;
    }
  });
};

/**
 * JOI validation schema for Document Version CPI value
 *
 * @author Michael Coughlan [zmiccou]
 */
const microserviceDocumentVersionCpiDefault = {
  [Segments.BODY]: Joi.object({
    menu: Joi.object({
      manual: Joi.object({
        release: Joi.array().items(
          Joi.object({
            is_cpi_updated: Joi.boolean().default(checkDefaultCpi),
          }).unknown(),
        ),
      }).unknown(),
    }).unknown(),
  }).unknown(),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Auth Bearer token'),
  }).unknown(),
};

module.exports = { microserviceDocumentVersionCpiDefault };
