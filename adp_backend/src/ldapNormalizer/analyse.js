// ============================================================================================= //
/**
* [ global.adp.ldapNormalizer.analyse ]
* Returns the LDAP register, after analysing the fields.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SOURCE) => {
  const checkThis = (V) => {
    if (V !== null && V !== undefined) {
      if (V.length > 0) {
        return true;
      }
    }
    return false;
  };
  const resultObject = {};

  let buildName = '';
  if (checkThis(SOURCE.eriBirthName) || checkThis(SOURCE.eriSn)) {
    if (checkThis(SOURCE.eriBirthName)) {
      buildName = `${SOURCE.eriBirthName}`;
    }
    if (checkThis(SOURCE.eriSn)) {
      if (buildName.length > 0) {
        buildName = `${buildName} ${SOURCE.eriSn}`;
      } else {
        buildName = `${SOURCE.eriSn}`;
      }
    }
  }
  if (buildName === '') {
    if (checkThis(SOURCE.sn)) {
      buildName = `${SOURCE.sn}`;
    }
  }
  let buildMail = '';
  if (checkThis(SOURCE.mail)) {
    buildMail = `${SOURCE.mail}`;
  }
  resultObject.uid = SOURCE.uid;
  resultObject.signum = SOURCE.uid;
  resultObject.name = buildName;
  resultObject.email = buildMail;
  return resultObject;
};
// ============================================================================================= //
