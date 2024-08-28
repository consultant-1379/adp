/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
/**
* [ global.adp.users.getUsersWithPermissions ]
* Returns a list of users with permission
* @param {Object} REQ The Request Object of this action.
* @return Returns an Object with a list of Users.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = REQ => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.users.getUsersWithPermissions';
  const dbModel = new adp.models.Adp();
  const errorResponseObject = {
    unauthorized: {
      code: 401,
      message: 'Unauthorized',
    },
    userNotFound: {
      code: 404,
      message: 'User Not Found',
    },
  };
  const responseArray = [];
  let responseArrayFinal = [];
  let responseElement = {
    id: '',
    signum: '',
    name: '',
    field: '',
    items: [],
    super_admin: false,
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let userObject = {};
  if (REQ && REQ.headers && REQ.headers.authorization) {
    const token = REQ.headers.authorization.substring(6, REQ.headers.authorization.length).trim();
    try {
      const decoded = await global.jsonwebtoken.verify(token, global.adp.config.jwt.secret);
      const signum = decoded.id;
      await global.adp.user.get(signum)
        .then((USER) => {
          if (USER) {
            if (USER.docs) {
              if (Array.isArray(USER.docs)) {
                userObject = {
                  // eslint-disable-next-line no-underscore-dangle
                  signum: USER.docs[0]._id,
                  role: USER.docs[0].role,
                };
              }
            }
          }
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adp.user.get ]';
          const errorOBJ = {
            signum,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(errorResponseObject.userNotFound);
          return false;
        });
    } catch (ERROR) {
      const errorText = 'Error in try/catch block';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(errorResponseObject.unauthorized);
      return false;
    }
  } else {
    const errorText = 'Authorization not found';
    const errorOBJ = {
      headers: REQ.headers,
    };
    adp.echoLog(errorText, errorOBJ, 401, packName);
    REJECT(errorResponseObject.unauthorized);
    return false;
  }
  // For admins
  if (userObject && userObject.role === 'admin') {
    adp.echoLog(`User [ ${userObject.signum} ] is admin, so reading all admins and field admins`, null, 200, packName);
    // Reading all admin users
    await dbModel.getAllAdmin()
      .then((admins) => {
        if (admins.docs && admins.docs.length && admins.docs.length > 0) {
          admins.docs.forEach((admin) => {
            responseElement = {
              id: admin._id,
              signum: admin.signum,
              name: admin.name,
              field: '',
              items: [],
              super_admin: true,
            };
            responseArray.push(responseElement);
          });
        } else {
          const errorText = 'No admin record found in the database using [ dbModel.getAllAdmin ]';
          const errorOBJ = {
            databaseAnswer: admins,
          };
          adp.echoLog(errorText, errorOBJ, 404, packName);
        }
      })
      .catch((err) => {
        const errorText = 'Error in [ dbModel.getAllAdmin ]';
        const errorOBJ = {
          error: err,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(err);
      });
  } else {
    const userProfile = await global.adp.profile.get(userObject.signum, REQ);
    if (userProfile && userProfile.role === 'Field Admin') {
      adp.echoLog(`User [ ${userObject.signum} ] is field admin, so reading all field admins for that field`, null, 200, packName);
    } else {
      RESOLVE([]);
      return false;
    }
  }
  const permissions = await global.adp.permission.crudRead(userObject.signum, userObject.role);
  if (permissions.length === 0) {
    adp.echoLog(`No permissions found for User [ ${userObject.signum} ] `, null, 200, packName);
    RESOLVE(responseArray);
    return false;
  }
  const promises = [];
  let subPromises = [];
  permissions.forEach((permission) => {
    promises.push(new Promise((RES, REJ) => {
      subPromises = [];
      Object.keys(permission.admin).forEach(async (admin) => {
        const ifAlreadyAdmin = responseArray.filter(
          adminUser => (adminUser.signum === admin && adminUser.super_admin),
        );
        if (!(ifAlreadyAdmin && ifAlreadyAdmin.length === 1)) {
          subPromises.push(new Promise((RES1, REJ1) => {
            global.adp.user.get(admin).then((userDetails) => {
              if (userDetails.docs && userDetails.docs.length && userDetails.docs.length === 1) {
                responseElement = {
                  id: userDetails.docs[0]._id,
                  signum: userDetails.docs[0].signum,
                  name: userDetails.docs[0].name,
                  field: permission['group-id'],
                  items: permission['item-id'],
                  super_admin: false,
                };
                responseArray.push(responseElement);
                RES1();
                return true;
              }
              REJ1(errorResponseObject.userNotFound);
              const errorText = `No unique user in database for [ ${admin} ] using [ adp.user.get ]`;
              const errorOBJ = {
                parameter: admin,
                answer: userDetails,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              return false;
            }).catch((err) => {
              const errorText = 'Error in [ adp.user.get ]';
              const errorOBJ = {
                parameter: admin,
                error: err,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              REJ1(err);
            });
          }));
        }
      });
      Promise.all(subPromises).then(() => {
        RES();
        return true;
      }).catch((err) => {
        const errorText = 'Error in [ Promise.all ] ( subPromises )';
        adp.echoLog(errorText, { error: err }, 500, packName, true);
        REJ(err);
      });
    }));
  });
  Promise.all(promises)
    .then(async () => {
      await global.adp.listOptions.get().then((ans) => {
        const listOptions = JSON.parse(ans);
        let foundOne;
        let foundOneItem;
        let tempField = {};
        responseArray.forEach((field) => {
          tempField = {};
          tempField = field;
          foundOne = listOptions.filter(option => option.id === field.field);
          if (foundOne.length === 1) {
            tempField.field = foundOne[0].slug;
            foundOneItem = foundOne[0].items.filter(option => option.id === field.items);
            if (foundOneItem.length === 1) {
              tempField.items = foundOneItem[0].name;
            }
          }
        });
        responseArrayFinal = [];
        let tempListUsers = [];
        let tempList1 = [];
        let uniqueUsers = [];
        let uniqueFields;
        let tempUser = {};
        uniqueUsers = responseArray.map((fieldAdmin => fieldAdmin.signum));
        uniqueUsers = uniqueUsers.filter((value, index, self) => self.indexOf(value) === index);
        uniqueUsers.forEach((user) => {
          tempUser = {};
          tempListUsers = [];
          tempListUsers = responseArray.filter(fieldAdmin => fieldAdmin.signum === user);
          tempUser.id = tempListUsers[0].id;
          tempUser.name = tempListUsers[0].name;
          tempUser.signum = tempListUsers[0].signum;
          tempUser.fields = [];
          uniqueFields = tempListUsers.map((fieldAdmin => fieldAdmin.field));
          uniqueFields = uniqueFields.filter((value, index, self) => self.indexOf(value) === index);
          uniqueFields.forEach((field) => {
            if (field === '') {
              tempUser.super_admin = true;
            } else {
              tempUser.super_admin = false;
              tempList1 = [];
              tempList1 = tempListUsers.filter(fieldAdmin => fieldAdmin.field === field);
              tempList1 = tempList1.sort(global.adp.dynamicSort('items')).map((x => x.items));
              tempUser.fields.push({ field, item: tempList1 });
            }
          });
          responseArrayFinal.push(tempUser);
        });
        RESOLVE(responseArrayFinal);
        return true;
      });
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ Promise.all ]';
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      REJECT(ERROR);
      return false;
    });
  return true;
});
// ============================================================================================= //
