// ============================================================================================= //
/**
* [ adp.migration.xidGroupConversion ]
* EID Group is added to XID Group users, if EID already exists in XID users group
* then it will skip and Remove XID Object from groups and permissions.
* @author Ravikiran G [ zgarsri ]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
/**
 * Migration Script caller to update users' permissions
 * and the RBAC permission group (XID to EID).
 * @returns {Boolean} as True if successful
 * @author Ravikiran G [ zgarsri ]
 */
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const eid = new adp.MongoObjectID('602e415e01f5f70007a0a950');
  const xid = new adp.MongoObjectID('602e440d01f5f70007a0a952');
  const rbacGroupsModel = new adp.models.RBACGroups();
  const adpModel = new adp.models.Adp();

  rbacGroupsModel.getGroupById(eid)
    .then(EIDGROUP => adpModel.addEidGroupToXidUsers(EIDGROUP.docs[0], xid))
    .then(() => adpModel.removeXidPermissionsFromUsers(xid))
    .then(() => rbacGroupsModel.deleteGroupIfPossible('602e440d01f5f70007a0a952', true))
    .then(() => RESOLVE(true))
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
