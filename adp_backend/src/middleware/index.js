const frontEndVersionSync = require('./frontEndVersionSync');
const rbac = require('./rbac/index');

module.exports = {
  frontEndVersionSync,
  rbac,
  hasRole: require('./hasRole'),
  isUserInDB: require('./isUserInDB'),
  validations: require('./validations'),
  isMicroserviceValidBySlug: require('./isMicroserviceValidBySlug'),
};
