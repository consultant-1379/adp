const { Segments } = require('celebrate');
const Joi = require('joi').extend(require('@joi/date'));

/**
 * JOI schema validation for the Assembly report
 *
 * @author Tirth [zpiptir]
 */
const reportAssemblySchema = {
  [Segments.BODY]: Joi.object().keys({
    assets: Joi.array()
      .items(Joi.object({ _id: Joi.string() }).label('Assets'))
      .min(1),
  }),
};

module.exports = reportAssemblySchema;
