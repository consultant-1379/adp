const { Joi, Segments } = require('celebrate');

/**
  * Joi schema for validating array of group id
  * that are assigned for users
  * @author Veerender Voskula
  */

const assignUserWithRbacSchema = {
  [Segments.BODY]: Joi.array().label('RBAC permission group array').min(1).items(
    Joi.string().required().min(24).label('Group Id'),
  ),
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().required().label('User signum'),
  }).unknown(),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Auth Bearer token'),
  }).unknown(),
};

module.exports = assignUserWithRbacSchema;
