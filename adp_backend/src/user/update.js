// ============================================================================================= //
/**
* [ global.adp.user.update ]
* Update a User.
* @param {String} ID A simple String, with the ID of the User/Signum.
* @param {JSON} USER A JSON Object with the fields has to been changed or added.
* @returns {Number} Returns a 200 if everything is ok.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async (ID, USER, USERINACTION) => {
  const packName = 'global.adp.user.update';
  const dbModel = new adp.models.Adp();
  return global.adp.user.thisUserShouldBeInDatabase(ID)
    .then(async (body) => {
      let userFromDB = null;
      if (Array.isArray(body.docs)) {
        // eslint-disable-next-line prefer-destructuring
        userFromDB = body.docs[0];
        const isValid = global.adp.user.validateSchema(USER);
        if (Array.isArray(isValid)) {
          const errorText = `Impossible update: "${ID}" doesn't match the user schema.`;
          const errorOBJ = {
            isValid,
            userObject: USER,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          return isValid;
        }
        const newUSER = USER;
        /* eslint-disable no-underscore-dangle */
        /* _id is generated by CouchDB. */
        newUSER._id = ID;
        newUSER.modified = `${new Date()}`;
        /* eslint-enable no-underscore-dangle */
        if (USERINACTION.role !== 'admin') {
          if (newUSER.role !== userFromDB.role) {
            const errorText = `User "${USERINACTION.signum.trim().toLowerCase()}" cannot change the role "${userFromDB.role}" from "${ID}"`;
            adp.echoLog(errorText, null, 403, packName);
            newUSER.role = userFromDB.role;
          }
        }
        return dbModel.update(newUSER)
          .then((afterUpdate) => {
            if (afterUpdate.ok === true) {
              adp.echoLog(`"${ID}" updated`, null, 200, packName);
              global.adp.masterCache.clear('ALLUSERS', null, newUSER.signum);
              return 200;
            }
            const errorText = 'Error in [ dbModel.update ]`s answer';
            const errorOBJ = {
              database: 'dataBase',
              newUSER,
              databaseAnswer: afterUpdate,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return 500;
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ dbModel.update ]';
            const errorOBJ = {
              database: 'dataBase',
              newUSER,
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return 500;
          });
      }
      return 404;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.user.thisUserShouldBeInDatabase ]';
      const errorOBJ = {
        userId: ID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      return 404;
    });
};
// ============================================================================================= //
