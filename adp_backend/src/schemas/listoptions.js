const { Joi, Segments } = require('celebrate');

/**
 * Validation for endpoint listoptionsClean get
 * @author Cein
 */
const listoptionsCleanGetSchema = {
  [Segments.BODY]: Joi.array().label('Permission group Id array').items(
    Joi.string().label('Permission Group Id'),
  ),
};

module.exports = listoptionsCleanGetSchema;
