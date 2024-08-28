// ============================================================================================= //
/**
* [ global.adp.profile.get ]
* Get user profile data from DataBase.
* @param {String} SIGNM of user for which information is needed
* @param {String} REQ request object of singed user
* @returns {JSON} Returns the profile information of the user.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USERID, REQ) => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.profile.get';
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
    const errorText = 'Error in [ REQ.headers ]';
    const errorOBJ = {
      headers: REQ.headers,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
    REJECT(errorResponseObject.unauthorized);
    return false;
  }

  if (userObject && userObject.role !== 'admin') {
    if (USERID !== userObject.signum) {
      adp.echoLog(`User [${userObject.signum}] does not have permissions to read data of [${USERID}]`, null, 403, packName);
      REJECT(errorResponseObject.unauthorized);
      return false;
    }
  }
  await global.adp.user.get(USERID)
    .then(async (RESULT) => {
      const responseData = {
        name: '',
        role: '',
        fields: [],
        email: '',
        signum: '',
        marketInformationActive: false,
        lastUpdated: Date(),
      };
      if (RESULT.docs && RESULT.docs.length !== 1) {
        const errorText = `User [${USERID}] not found`;
        const errorOBJ = {
          userid: USERID,
          databaseAnswer: RESULT,
        };
        adp.echoLog(errorText, errorOBJ, 404, packName);
        REJECT(errorResponseObject.userNotFound);
        return false;
      }
      const userDataFromDB = RESULT.docs[0];
      responseData.name = userDataFromDB.name;
      responseData.email = userDataFromDB.email;
      responseData.signum = userDataFromDB.signum;
      responseData.marketInformationActive = userDataFromDB.marketInformationActive;
      responseData.lastUpdated = userDataFromDB.modified;

      if (userDataFromDB.role === 'admin') {
        responseData.role = 'Admin';
      } else {
        await global.adp.permission.isFieldAdminByUserID(USERID).then((ifFieldAdminList) => {
          if (ifFieldAdminList.length > 0) {
            const tempDomainAdminList = [];
            responseData.role = 'Field Admin';
            let tempList = [];
            let uniqueFields = [];
            uniqueFields = ifFieldAdminList.map((fieldAdmin => fieldAdmin.field));
            uniqueFields = uniqueFields.filter(
              (value, index, self) => self.indexOf(value) === index,
            );
            uniqueFields.forEach((field) => {
              tempList = [];
              tempList = ifFieldAdminList.filter(
                fieldAdmin => fieldAdmin.field === field,
              ).map((x => x.item));
              tempDomainAdminList.push({ field, item: tempList });
            });
            responseData.fields = tempDomainAdminList;
          }
        })
          .catch((error) => {
            const errorText = 'Error in [ adp.permission.isFieldAdminByUserID ]';
            const errorOBJ = {
              userid: USERID,
              error,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
          });
      }

      RESOLVE(responseData);
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
