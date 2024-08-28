const { RBAC } = require('./utils/constants');

adp.docs.list.push(__filename);
// ============================================================================================= //
/**
* [ adp.getDefaultRBACGroupID ]
* Returns rbac group id based on user signum
* @return {str} default group id(Internal Users Group ID).
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
module.exports = () => {
  const { DEFAULT_GROUPID } = RBAC;
  // Any new User by default is assigned to Internal Users Group
  return DEFAULT_GROUPID;
};
