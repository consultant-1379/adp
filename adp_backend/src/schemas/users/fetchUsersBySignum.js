const { Joi, Segments } = require('celebrate');

/**
  * Joi schema for endpoint fetchUsersBySignum
  * array of one or more signum string
  * @author Cein
  */
const fetchUsersBySignumSchema = {
  [Segments.BODY]: Joi.array().label('Type').min(1).items(
    Joi.string().label('User Signum').allow(''),
  )
    .required(),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Auth Bearer token'),
  }).unknown(),
};

module.exports = fetchUsersBySignumSchema;
