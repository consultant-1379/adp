const { Segments } = require('celebrate');
const Joi = require('joi').extend(require('@joi/date'));
/**
  * Joi schema for validating date ranges, domain and service category
  * that are specified for searching the innersource top contributors/organisations
  * @author Abhishek Singh, Veerender
  */

const innerSourceContributorsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    fromDate: Joi.date().format('YYYY-MM-DD').optional()
      .when('toDate', {
        is: Joi.exist(),
        then: Joi.date().format('YYYY-MM-DD').max(Joi.ref('toDate')),
      })
      .label('From Date'),
    toDate: Joi.date().format('YYYY-MM-DD').optional()
      .label('To Date'),
    domain: Joi.string().optional()
      .label('Domain'),
    service_category: Joi.string()
      .optional()
      .label('Service Category'),
    limit: Joi.string()
      .optional()
      .label('limit')
      .pattern(/^[1-9][0-9]*$/)
      .message('The limit must be an integer that is greater than zero.'),
  }),
};

module.exports = innerSourceContributorsSchema;
