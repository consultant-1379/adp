// ============================================================================================= //
/**
* [ global.adp.login.checkdb ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async USER => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.login.checkdb';
  const dbModel = new adp.models.Adp();
  const prop1 = (USER.uid === null) || (USER.uid === undefined);
  if (prop1) {
    const errorMSG = { code: 400, message: 'User Object from LDAP is invalid!' };
    REJECT(errorMSG);
    return;
  }
  const userName = USER.uid.toLowerCase();
  const userFullName = USER.name;
  const userSigOBJ = { id: userName };
  const token = global.jsonwebtoken.sign(userSigOBJ, global.adp.config.jwt.secret);
  let newUser = null;
  let theUserFromDatabase = null;
  adp.echoLog(`Looking if user [ ${userName} ] exists on database...`, null, 200, packName);
  await global.adp.user.get(userName)
    .then((USERFROMDATABASE) => {
      if (USERFROMDATABASE === null || USERFROMDATABASE === undefined) {
        return null;
      }
      if (USERFROMDATABASE.docs === null || USERFROMDATABASE.docs === undefined) {
        return null;
      }
      if (!(Array.isArray(USERFROMDATABASE.docs))) {
        return null;
      }
      if (USERFROMDATABASE.docs.length !== 1) {
        return null;
      }
      adp.echoLog(`User [ ${userName} ] founded on database!`, null, 200, packName);
      theUserFromDatabase = USERFROMDATABASE;
      return theUserFromDatabase;
    })
    .catch((ERROR) => {
      adp.echoLog('Error on [ adp.user.get ]:', { user: USER, error: ERROR }, 500, packName, true);
    });
  let userMail = '';
  if (USER.email !== undefined && USER.email !== null) {
    userMail = USER.email.toLowerCase();
  }
  // Insert New User on Database
  if (theUserFromDatabase === null) {
    newUser = {
      _id: userName,
      type: 'user',
      signum: userName,
      name: userFullName,
      email: userMail,
      role: 'author',
      modified: new Date(),
    };
    adp.echoLog(`User [ ${userName} ] was not found on database! Creating new user...`, { newUser }, 200, packName);
    await dbModel.createOne(newUser);
  }

  const onlyTheNecessaryAction = (USEROBJ) => {
    if (!Array.isArray(USEROBJ)) {
      const useThisSignum = (`${USEROBJ.signum}`).trim().toLowerCase();
      const fromNew = {
        signum: useThisSignum,
        name: USEROBJ.name,
        email: USEROBJ.email,
        role: USEROBJ.role,
        token,
      };
      return fromNew;
    }
    const useThisSignum = (`${USEROBJ[0].signum}`).trim().toLowerCase();
    const fromDatabase = {
      signum: useThisSignum,
      name: USEROBJ[0].name,
      email: USEROBJ[0].email,
      role: USEROBJ[0].role,
      token,
    };
    return fromDatabase;
  };

  let onlyTheNecessary = null;
  if (theUserFromDatabase !== null) {
    onlyTheNecessary = onlyTheNecessaryAction(theUserFromDatabase.docs);
  } else {
    onlyTheNecessary = onlyTheNecessaryAction(newUser);
  }
  const resolveOBJ = { code: 200, message: `User login [ ${userName} ] successful!`, data: onlyTheNecessary };
  RESOLVE(resolveOBJ);
});
// ============================================================================================= //
