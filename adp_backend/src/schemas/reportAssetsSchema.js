const { Segments } = require('celebrate');
const Joi = require('joi').extend(require('@joi/date'));

/**
 * JOI schema validation for the assets report
 *
 * @author Michael Coughlan [zmiccou]
 */
const reportAssetsSchema = {
  [Segments.BODY]: Joi.object().keys({
    assets: Joi.array()
      .items(Joi.object({ _id: Joi.string() }).label('Assets'))
      .min(1),
    fromDate: Joi.date().format('YYYY-MM-DD')
      .optional()
      .when('toDate', {
        is: Joi.exist(),
        then: Joi.date().format('YYYY-MM-DD').max(Joi.ref('toDate')),
      })
      .label('From Date'),
    toDate: Joi.date().format('YYYY-MM-DD').optional().label('To Date'),
    assetType: Joi.string()
      .optional(),
  }),
};

module.exports = reportAssetsSchema;
