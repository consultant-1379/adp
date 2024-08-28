const { Segments } = require('celebrate');
const Joi = require('joi').extend(require('@joi/date'));
/**
  * Joi schema for validating a parameter to change the behavior
  * of InnerSource Commits Behavior
  * @author Armando Dias [ zdiaarm ]
  */

const innerSourceChangeBehavior = {
  [Segments.PARAMS]: Joi.object().keys({
    tag: Joi.string().trim().valid(...['gitstatus', 'gitstatusbytag']),
  }),
};

module.exports = innerSourceChangeBehavior;
