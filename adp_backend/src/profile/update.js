// ============================================================================================= //
/**
* [ global.adp.profile.update ]
* Update user profile data from DataBase.
* @param {JSON} USEROBJECT of user for which information needs to be updated
* @param {String} REQ request object of singed user
* @returns {JSON} Returns the response object
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USERID, USEROBJECT, REQ) => new Promise(async (RESOLVE, REJECT) => {
// =========================================================================================== //
  const dbModelAdplog = new adp.models.AdpLog();
  const analyseIt = (ARRAY, KEY, NEW, OLD, EXCEPTION1, EXCEPTION2) => {
    if (Array.isArray(NEW)) {
      if (Array.isArray(OLD)) {
        if (NEW.length !== OLD.length) {
          const obj = {
            fieldname: `${KEY}`,
            from: OLD,
            to: NEW,
          };
          ARRAY.push(obj);
        } else {
          NEW.forEach((item, index) => {
            analyseIt(ARRAY, index, NEW[index], OLD[index], NEW, OLD);
          });
        }
      }
    } else if (typeof NEW === 'object') {
      Object.keys(NEW).forEach((skey) => {
        analyseIt(ARRAY, skey, NEW[skey], OLD[skey], NEW, OLD);
      });
    } else if (NEW !== OLD) {
      let obj = {};
      const boolean1 = (EXCEPTION1 !== null) && (EXCEPTION1 !== undefined);
      const boolean2 = (EXCEPTION2 !== null) && (EXCEPTION2 !== undefined);
      if (boolean1 && boolean2) {
        obj = {
          fieldname: KEY,
          from: EXCEPTION2,
          to: EXCEPTION1,
        };
      } else {
        obj = {
          fieldname: KEY,
          from: OLD,
          to: NEW,
        };
      }
      ARRAY.push(obj);
    }
  };
  // =========================================================================================== //
  const packName = 'global.adp.profile.update';
  const errorResponseObject = {
    unauthorized: {
      code: 401,
      message: 'Unauthorized',
    },
    userNotFound: {
      code: 404,
      message: 'User Not Found',
    },
    readOnlyField: {
      code: 400,
      message: 'field is/are read only: ',
    },
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let userObject;
  await global.adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      userObject = {
        signum: USER.signum,
        role: USER.role,
      };
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.permission.getUserFromRequestObject ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(errorResponseObject.unauthorized);
      return false;
    });

  if (userObject && userObject.role !== 'admin') {
    if (USERID !== userObject.signum) {
      const errorText = `User [${userObject.signum}] does not have permissions to update data of [${USERID}]`;
      adp.echoLog(errorText, null, 403, packName);
      REJECT(errorResponseObject.unauthorized);
      return false;
    }
  }
  await global.adp.user.get(USERID)
    .then(async (RESULT) => {
      const errorFields = {
        readOnly: [],
        wrongdataType: [],
      };
      if (RESULT.docs && RESULT.docs.length !== 1) {
        const errorText = `User [${USERID}] not found`;
        adp.echoLog(errorText, null, 404, packName);
        REJECT(errorResponseObject.userNotFound);
        return false;
      }
      const userDataFromDB = RESULT.docs[0];
      const isValid = global.adp.user.validateSchema(USEROBJECT);
      if (Array.isArray(isValid)) {
        const errorText = `Impossible update: "${USERID}" doesn't match the user schema.`;
        adp.echoLog(errorText, null, 400, packName);
        const errResp = {
          code: 400,
          message: isValid,
        };
        REJECT(errResp);
        return false;
      }
      const schemaOrigin = global.adp.clone(global.adp.config.schema.user);
      Object.keys(schemaOrigin.properties).forEach((KEY) => {
        const object = schemaOrigin.properties[KEY];
        if (object.readOnly && userDataFromDB[KEY] !== USEROBJECT[KEY]) {
          errorFields.readOnly.push(KEY);
          return false;
        }
        return true;
      });
      if (errorFields.readOnly.length === 0 && isValid) {
        global.adp.user.update(USERID, USEROBJECT, userObject).then((resp) => {
          adp.echoLog('User profile updated successfully', null, 200, packName);
          global.adp.masterCache.clear('ALLUSERS', null, USERID);
          RESOLVE(resp);
          //------------------------------------------------------------------------------
          const log = {
            type: 'user',
            datetime: new Date(),
            signum: userObject.signum,
            role: userObject.role,
            desc: 'update',
            changes: '',
            new: USEROBJECT,
            old: userDataFromDB,
          };
          const changesArray = [];
          Object.keys(USEROBJECT).forEach((key) => {
            analyseIt(changesArray, key, USEROBJECT[key], userDataFromDB[key]);
          });
          log.changes = changesArray;
          dbModelAdplog.createOne(log)
            .then((expect) => {
              if (expect.ok === true) {
                return true;
              }
              const errorText = 'Data not saved in auditlogs';
              const errorOBJ = {
                database: 'dataBaseLog',
                databaseAnswer: expect,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              return false;
            })
            .catch((err) => {
              const errorText = 'Error in [ dbModelAdplog.createOne ]';
              const errorOBJ = {
                database: 'dataBaseLog',
                toSave: log,
                error: err,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
            });
          //----------------------------------------------------------------------
          return true;
        })
          .catch((err) => {
            const errorText = 'Error in [ adp.user.update ]';
            const errorOBJ = {
              userid: USERID,
              userObject: USEROBJECT,
              author: userObject,
              error: err,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(err);
            return false;
          });
      } else {
        errorResponseObject.readOnlyField.message += errorFields.readOnly;
        REJECT(errorResponseObject.readOnlyField);
        return false;
      }
      return true;
    })
    .catch((ERR) => {
      const errorText = 'Error in [ adp.user.get ]';
      const errorOBJ = {
        userid: USERID,
        error: ERR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(errorResponseObject.userNotFound);
    });
  return true;
});
// ============================================================================================= //
