// ============================================================================================= //
/**
* [ global.adp.permission.canDoIt ]
* Function responsible to analyse if <b>USER</b> is <b>admin</b> ( giving complete access ) or
* if the <b>USER</b> is <b>onwer</b> of a <b>Microservice</b>
* ( giving access to manage this Microservice ).
* @param {Object} USERREQUEST Request Object, sent by the <b>JWT Middleware</b>.
* Basic contains the <b>USER</b> data.
* @param {String} MS String with the <b>Microservice ID</b>.
* Should be <b>NULL</b> when there is no <b>Microservice</b> to be checked.
* @return This functions is a <b>Promise</b>.
* Returns in the <b>Then</b> block in case of success or in the <b>Catch</b> block in case of fail.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USERREQUEST, MS) => new Promise(async (RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.permission.canDoIt';
  const dbModelAdp = new adp.models.Adp();
  let userName = null;
  let userRole = null;
  // ------------------------------------------------------------------------------------------- //
  // Extracting User from the Request
  // ------------------------------------------------------------------------------------------- //
  await global.adp.permission.getUserFromRequestObject(USERREQUEST)
    .then((USER) => {
      userName = USER.signum;
      userRole = USER.role;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.permission.getUserFromRequestObject ]';
      adp.echoLog(errorText, ERROR, 500, packName, true);
      const err = 'User Object Invalid';
      REJECT(err);
      return err;
    });
  // ------------------------------------------------------------------------------------------- //
  // Check if the role is admin
  // ------------------------------------------------------------------------------------------- //
  if (userRole === 'admin') {
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`" ${userName} " is admin! ( In ${endTime}ms )`, null, 200, packName);
    RESOLVE('admin');
    return 'admin';
  }
  // ------------------------------------------------------------------------------------------- //
  // Check if we have an Asset ID
  // ------------------------------------------------------------------------------------------- //
  const errorNoMSID = 'No MicroService ID';
  if (MS === null || MS === undefined) {
    REJECT(errorNoMSID);
    return errorNoMSID;
  }
  if (MS === '') {
    REJECT(errorNoMSID);
    return errorNoMSID;
  }
  // ------------------------------------------------------------------------------------------- //
  // Reading Asset from Database
  // ------------------------------------------------------------------------------------------- //
  let asset = null;
  await dbModelAdp.getById(MS)
    .then((body) => {
      if (Array.isArray(body.docs)) {
        if (body.docs.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          asset = body.docs[0];
        }
      }
    })
    .catch((ERROR) => {
      REJECT(ERROR);
      return ERROR;
    });
  // ------------------------------------------------------------------------------------------- //
  // Asset doesn't exist in Database - id is wrong
  // ------------------------------------------------------------------------------------------- //
  if (asset === null) {
    const assetNotFound = 'Asset Not Found!';
    REJECT(assetNotFound);
    return assetNotFound;
  }
  // ------------------------------------------------------------------------------------------- //
  // Getting the list of Special Permissions Fields
  // ------------------------------------------------------------------------------------------- //
  let fieldPermissions = null;
  await global.adp.permission.fieldListWithPermissions()
    .then((LIST) => {
      fieldPermissions = LIST;
    })
    .catch((ERROR) => {
      REJECT(ERROR);
      return ERROR;
    });
  // ------------------------------------------------------------------------------------------- //
  // If we have Field Permissions,
  // we have to see if the logged user
  // have permissions over this Asset.
  // If not, we have to check if he is
  // Asset/Service Owner
  // ------------------------------------------------------------------------------------------- //
  let isFieldAdmin = false;
  if (fieldPermissions !== null && fieldPermissions !== undefined) {
    await global.adp.permission.checkFieldPermissionCacheIt();
    const allPromises = [];
    await fieldPermissions.forEach(async (FIELD) => {
      if (asset[FIELD.slug] !== undefined && asset[FIELD.slug] !== null) {
        const fieldID = FIELD.id;
        const fieldValue = asset[FIELD.slug];
        allPromises.push(global.adp.permission.checkFieldPermission(fieldID, fieldValue));
      }
    });
    await Promise.all(allPromises)
      .then((ALLPERMISSIONS) => {
        if (Array.isArray(ALLPERMISSIONS)) {
          if (ALLPERMISSIONS.length > 0) {
            ALLPERMISSIONS.forEach((PERMISSION) => {
              if (PERMISSION !== null && PERMISSION !== undefined) {
                if (PERMISSION[userName] !== null && PERMISSION[userName] !== undefined) {
                  isFieldAdmin = true;
                }
              }
            });
          }
        }
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ Promise.all ]';
        adp.echoLog(errorText, ERROR, 500, packName, false);
      });
  }
  // ------------------------------------------------------------------------------------------- //
  // If the user is Field Admin, we can finish this function here!
  // Field Admin is Admin for the Assets with the Field indicates a specific option.
  // ------------------------------------------------------------------------------------------- //
  if (isFieldAdmin) {
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`" ${userName} " is FieldAdmin! ( In ${endTime}ms )`, null, 200, packName);
    RESOLVE('admin');
    return 'admin';
  }
  // ------------------------------------------------------------------------------------------- //
  // The user is not Field Admin, so let's see if he is Service Owner
  // ------------------------------------------------------------------------------------------- //
  let isOwner = false;
  if (asset.team !== null && asset.team !== undefined) {
    asset.team.forEach((member) => {
      if (userName.trim().toLowerCase() === member.signum.trim().toLowerCase()) {
        if (member.serviceOwner === true) {
          isOwner = true;
        }
      }
    });
    if (isOwner) {
      const endTime = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`" ${userName} " is Service Owner! ( In ${endTime}ms )`, null, 200, packName);
      const onwerMSG = 'Owner of the MicroService';
      RESOLVE(onwerMSG);
      return onwerMSG;
    }
  }
  // ------------------------------------------------------------------------------------------- //
  // Not Admin, not Field Admin, not Service Owner...
  // ------------------------------------------------------------------------------------------- //
  const endTime = (new Date()).getTime() - timer.getTime();
  adp.echoLog(`" ${userName} " is a normal user! ( In ${endTime}ms )`, null, 200, packName);
  const notTheOwnerMSG = 'Not the Owner of this MicroService';
  REJECT(notTheOwnerMSG);
  return notTheOwnerMSG;
});
// ============================================================================================= //
