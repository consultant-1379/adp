const { Joi, Segments } = require('celebrate');

/**
  * Joi schema for endpoint getComponentServicesFromAssembly
  * array of one or more assembly ids/slug as string
  * @author Tirth [zpiptir]
  */
const getComponentServicesFromAssembly = {
  [Segments.BODY]: Joi.object({
    idsOrSlugs: Joi.array().label('Assembly IDOrSlug Array').min(1).items(
      Joi.string().label('Assembly IDOrSlug').trim().min(1),
    )
      .unique()
      .required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Auth Bearer token'),
  }).unknown(),
};

module.exports = getComponentServicesFromAssembly;
