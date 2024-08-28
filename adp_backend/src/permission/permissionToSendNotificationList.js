// ============================================================================================= //
/**
* [ global.adp.permission.permissionToSendNotificationList ]
* Return a list with all Field Permissions to send Notification
* @param {Object} FIELDID The id of the field ( From the endpoint "/listoption" ).
* @param {Object} OPTIONID The id of the option ( From the endpoint "/listoption" ).
* @param {Object} ACTION String with the CRUD action ( "create", "read", "update", "delete" ).
* @return This functions is a <b>Promise</b>.
* Returns in the <b>Then</b> block if found something,
* or in the <b>Catch</b> block if found nothing.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FIELDID, OPTIONID, ACTION) => new Promise(async (RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.permission.permissionToSendNotificationList';
  let found = false;
  await global.adp.permission.checkFieldPermissionCacheIt();
  await global.adp.permission.checkFieldPermission(FIELDID, OPTIONID)
    .then((RULES) => {
      const notificationPreferences = RULES;
      const notificationPreferencesByAction = {};
      if (notificationPreferences !== undefined
        && notificationPreferences !== null) {
        found = true;
        const allPromises = [];
        Object.keys(notificationPreferences).forEach((FIELDADMIN) => {
          const actionsArray = notificationPreferences[FIELDADMIN].notification;
          if (actionsArray.includes(ACTION.toLowerCase())) {
            allPromises.push(new Promise((SOLVETHIS, REJECTTHIS) => {
              global.adp.user.getUserNameMail(FIELDADMIN)
                .then((USER) => {
                  notificationPreferencesByAction[FIELDADMIN] = {};
                  notificationPreferencesByAction[FIELDADMIN].name = USER.name;
                  notificationPreferencesByAction[FIELDADMIN].email = USER.email;
                  SOLVETHIS();
                })
                .catch((ERROR) => {
                  const errorText = 'Error in [ adp.user.getUserNameMail ]';
                  const errorOBJ = {
                    fieldadmin: FIELDADMIN,
                    error: ERROR,
                  };
                  adp.echoLog(errorText, errorOBJ, 500, packName, true);
                  REJECTTHIS();
                });
            }));
          }
        });
        Promise.all(allPromises)
          .then(() => {
            if (Object.keys(notificationPreferencesByAction).length === 0) {
              const endTime = (new Date()).getTime() - timer.getTime();
              const msg = `Returning "null" as result because nothing was found in ${endTime}ms!`;
              adp.echoLog(msg, null, 200, packName);
              RESOLVE(null);
            } else {
              const endTime = (new Date()).getTime() - timer.getTime();
              const msg = `For [ ${FIELDID} / ${OPTIONID} ] was found: ${JSON.stringify(notificationPreferencesByAction)} in ${endTime}ms!`;
              adp.echoLog(msg, null, 200, packName);
              RESOLVE(notificationPreferencesByAction);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ Promise.all ]';
            const errorOBJ = {
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(ERROR);
          });
      }
      if (!found) {
        RESOLVE();
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.permission.checkFieldPermission ]';
      const errorOBJ = {
        fieldid: FIELDID,
        optionid: OPTIONID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT();
    });
});
// ============================================================================================= //
