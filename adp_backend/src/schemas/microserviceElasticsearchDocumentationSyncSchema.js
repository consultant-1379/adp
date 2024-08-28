const { Joi, Segments } = require('celebrate');

/**
  * Joi schema for endpoint microserviceElasticsearchDocumentationForceSync
  * array of one or more signum string
  * @author Githu
  */
const microserviceElasticsearchDocumentationSyncSchema = {
  [Segments.BODY]: Joi.object({
    ids: Joi.array().label('Microservice ID Array').min(1).items(
      Joi.string().label('Microservice ID').trim().min(1),
    )
      .unique()
      .required(),
    versionName: Joi.string().label('versionName'),
    docSlug: Joi.string().label('docSlug'),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Auth Bearer token'),
  }).unknown(),
};

module.exports = microserviceElasticsearchDocumentationSyncSchema;
