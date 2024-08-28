// ============================================================================================= //
/**
* [ global.adp.permission.canDoItUser ]
* Function responsible to analyse if <b>USER</b> is <b>admin</b> ( giving complete access ) or
* if the <b>USER</b> is <b>onwer</b> of the User Object.
* @param {Object} USERREQUEST Request Object, sent by the <b>JWT Middleware</b>.
* Basic contains the <b>USER</b> data.
* @param {String} MS String with the <b>User ID</b>.
* Should be <b>NULL</b> when there is no <b>Microservice</b> to be checked.
* @return This functions is a <b>Promise</b>.
* Returns in the <b>Then</b> block in case of success or in the <b>Catch</b> block in case of fail.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USERREQUEST, USEROBJECT) => new Promise((RESOLVE, REJECT) => {
  const errorDenied = 'denied';
  const USERSIGNUM = USEROBJECT.signum;
  if (USERREQUEST === null || USERREQUEST === undefined) {
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user === null || USERREQUEST.user === undefined) {
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user.docs === null || USERREQUEST.user.docs === undefined) {
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user.docs[0] === null || USERREQUEST.user.docs[0] === undefined) {
    REJECT(errorDenied);
    return errorDenied;
  }

  const user = USERREQUEST.user.docs[0];
  const userName = user._id.toLowerCase(); // eslint-disable-line no-underscore-dangle
  const userRole = user.role;
  if (userRole === 'admin') {
    RESOLVE('admin');
    return 'admin';
  }
  const errorNoUSERID = 'No User ID/Signum';
  if (USERSIGNUM === null || USERSIGNUM === undefined) {
    REJECT(errorNoUSERID);
    return errorNoUSERID;
  }
  if (USERSIGNUM === '') {
    REJECT(errorNoUSERID);
    return errorNoUSERID;
  }
  if (USERSIGNUM.trim().toLowerCase() === userName) {
    const onwerMSG = 'Owner';
    RESOLVE(onwerMSG);
    return onwerMSG;
  }
  if (userRole === USEROBJECT.role) {
    const onwerMSG = 'Author';
    RESOLVE(onwerMSG);
    return onwerMSG;
  }
  const notTheOwnerMSG = 'Not the Owner';
  REJECT(notTheOwnerMSG);
  return notTheOwnerMSG;
});
// ============================================================================================= //
