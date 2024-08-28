// ============================================================================================= //
/**
* [ global.adp.notification.getRecipients ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const getAdminsByField = require('../permission/getAdminsByField');

module.exports = MAILOBJECT => new Promise(async (RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const RespMailobject = MAILOBJECT;
  const packName = 'global.adp.notification.getRecipients';
  const emails = {
    currentUser: [],
    domainAdmins: [],
    admins: [],
    devTeam: [],
    teamMembers: [],
  };

  // Add email of user who is performing the action
  const { asset, action, enableHighlight } = MAILOBJECT;
  if (MAILOBJECT.usr !== undefined && MAILOBJECT.usr !== null) {
    emails.currentUser.push(MAILOBJECT.usr[0].email);
  }

  /**
 * This function is used to read the fields with admin permissions
 */
  async function fetchFieldsWithAdminPermissions() {
    return global.adp.permission.fieldListWithPermissions()
      .then(LIST => LIST)
      .catch((ERROR) => {
        const errorText = 'Error in [ adp.permission.fieldListWithPermissions ] from [ fetchFieldsWithAdminPermissions ]';
        adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
        return null;
      });
  }
  /**
 * This function is used to check if there are any domain admins for the domain
 * from which microservice is removed.
 * @author Omkar
 */
  function checkForOldDomainAdminsAndResolve() {
    const oldDomainId = MAILOBJECT.oldAsset.domain;
    getAdminsByField.fetchAdmins(3, oldDomainId).then((listOfFieldAdmins) => {
      const fieldAdmins = listOfFieldAdmins || [];
      const superAdmins = emails.admins || [];
      const allAdmins = [...new Set(fieldAdmins.concat(superAdmins))];
      if (Array.isArray(allAdmins) && allAdmins.length > 0) {
        RespMailobject.recipientsMail = allAdmins;
        RESOLVE(RespMailobject);
        return true;
      }
      const errResp = {
        code: 404,
        message: 'No admin found for old domain',
      };
      REJECT(errResp);
      return false;
    })
      .catch((ERROR) => {
        REJECT(ERROR);
        const errorText = 'Error in [ getAdminsByField.fetchAdmins(3, oldDomainId) ] from [ checkForOldDomainAdminsAndResolve ]';
        adp.echoLog(errorText, { error: ERROR, oldDomainId }, 500, packName, true);
        return false;
      });
  }

  /**
 * This function is used to check for development team members from database
 * and emails will be sent to only them along with the user who triggers the action
 * @author Omkar
 */
  function checkEmailsForDevTeamAndResolve() {
    dbModel.getAllAdminDevTeam()
      .then((RESULT) => {
        const resultOfQuery = RESULT.docs;
        resultOfQuery.forEach((ITEM) => {
          const anAdminEmail = ITEM.email;
          if (!emails.devTeam.includes(anAdminEmail)) {
            emails.devTeam.push(anAdminEmail);
          }
        });
        RespMailobject.recipientsMail = [...new Set(emails.currentUser.concat(emails.devTeam))];
        RESOLVE(RespMailobject);
        return true;
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ dbModel.getAllAdminDevTeam ] from [ checkEmailsForDevTeamAndResolve ]';
        const objError = {
          error: ERROR,
        };
        adp.echoLog(errorText, objError, 500, packName, true);
      });
  }

  /**
   * This method collects emails of team members of a service to be added into
   * recipients list
   * @author omkar
   */
  function addTeamMembers() {
    const teamEmails = MAILOBJECT.asset.teamMails;
    teamEmails.forEach((teamEmail) => {
      if (!emails.teamMembers.includes(teamEmail)) {
        emails.teamMembers.push(teamEmail);
      }
    });
    if (asset.team_mailers) {
      asset.team_mailers.forEach((mailer) => {
        if (!emails.teamMembers.includes(mailer)) {
          emails.teamMembers.push(mailer);
        }
      });
    }
  }

  /**
   * This method is used to check if there is any admin for any field (e.g. domain admin)
   * If domain admins found, they are grouped together into array.
   * @author omkar
   */
  async function addFieldPermission() {
    const fieldPermissions = await fetchFieldsWithAdminPermissions();
    const allPromises = [];
    if (fieldPermissions) {
      fieldPermissions.forEach(async (FIELD) => {
        if (asset[FIELD.slug]) {
          const fieldID = FIELD.id;
          const fieldValue = asset[FIELD.slug];
          const permissionAction = action;
          allPromises
            .push(
              global.adp.permission.permissionToSendNotificationList(
                fieldID, fieldValue, permissionAction,
              ),
            );
        }
      });
      return Promise.all(allPromises)
        .then((ALLPERMISSIONS) => {
          if (Array.isArray(ALLPERMISSIONS)) {
            if (ALLPERMISSIONS.length > 0) {
              ALLPERMISSIONS.forEach((PERMISSION) => {
                if (PERMISSION !== null && PERMISSION !== undefined) {
                  Object.keys(PERMISSION).forEach((USER) => {
                    if (PERMISSION[USER].email !== null && PERMISSION[USER].email !== undefined) {
                      if (!emails.domainAdmins.includes(PERMISSION[USER].email)) {
                        emails.domainAdmins.push(PERMISSION[USER].email);
                      }
                    } else {
                      const ERRORMSG = 'User does not have email in permission object';
                      adp.echoLog('Access denied', ERRORMSG, 403, packName);
                    }
                  });
                  adp.echoLog('Field admins (if exists) added in recipents list', null, 200, packName);
                }
              });
            }
          }
        })
        .catch((ERROR) => {
          adp.echoLog('Error in [ Promise.all ] from [ addFieldPermission ]', ERROR, 500, packName, true);
        });
    }
    return true;
  }

  /**
   * This function is used to check if there are any super admins,
   * if found, they are collected in an array
   * @author Omkar
   */
  function CheckAdmins() {
    // To read emails list of admin users from the database.
    return dbModel.getAllAdminNotDevTeam()
      .then((RESULT) => {
        const resultOfQuery = RESULT.docs;
        if (Array.isArray(resultOfQuery)) {
          resultOfQuery.forEach((ITEM) => {
            const anAdminEmail = ITEM.email;
            if (!emails.admins.includes(anAdminEmail)) {
              emails.admins.push(anAdminEmail);
            }
          });
        }
        adp.echoLog('List of admins added in recipents list', null, 200, packName);
      })
      .catch((err) => {
        const errorText = 'Error in [ dbModel.getAllAdminNotDevTeam ] from [ CheckAdmins ]';
        const errorOBJ = {
          error: err,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
      });
  }

  if (global.adp.config.devModeMail === true) {
    checkEmailsForDevTeamAndResolve();
  } else if (action === 'changedomainnotify') {
    await CheckAdmins();
    checkForOldDomainAdminsAndResolve();
  } else {
    addTeamMembers();
    await addFieldPermission();
    if (action === 'update') {
      if (enableHighlight) {
        await CheckAdmins();
        RespMailobject.recipientsMail = [...new Set(emails.currentUser.concat(emails.teamMembers,
          emails.domainAdmins, emails.admins))];
      } else {
        RespMailobject.recipientsMail = [...new Set(emails.currentUser.concat(emails.teamMembers))];
      }
      RESOLVE(RespMailobject);
      return true;
    }
    await CheckAdmins();
    RespMailobject.recipientsMail = [...new Set(emails.currentUser.concat(emails.teamMembers,
      emails.admins,
      emails.domainAdmins))];
    RESOLVE(RespMailobject);
    return true;
  }
  return true;
});
// ============================================================================================= //
