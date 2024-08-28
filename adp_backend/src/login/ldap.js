// ============================================================================================= //
/**
* [ global.adp.login.ldap ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USERNAME, PASSWORD) => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.login.ldap';
  const { customMetrics } = require('../metrics/register');
  /**
   * Sends the log to the console and the auditlog (adplog db)
   * @param {string} DESC the description of the log
   * @param {object} OBJ the object to insert into the auditlog (adplog db)
   * @author Armando Schiavon Dias [escharm]
   */
  const saveLog = (DESC, OBJ) => {
    adp.echoLog('saveLog', { description: DESC, object: OBJ }, 200, packName, false);
    const logJSON = {
      type: 'ldaperror',
      datetime: new Date(),
      log: `${DESC}`,
      obj: OBJ,
    };
    global.adp.auditlog.create(logJSON)
      .catch((ERROR) => {
        adp.echoLog('Cannot save error on Database Log', { error: ERROR }, 500, packName, true);
      });
  };

  try {
    const isUserNameString = (typeof USERNAME === 'string') && (USERNAME.length > 0);
    const isPassWordString = (typeof PASSWORD === 'string') && (PASSWORD.length > 0);
    if (!isUserNameString || !isPassWordString) {
      let endMessageToSend = '';
      if (USERNAME.length > 0) {
        endMessageToSend = `Login [ ${USERNAME} ] or Password are invalid. Cannot try to login.`;
      } else {
        endMessageToSend = 'Login or Password are invalid. Cannot try to login.';
      }
      adp.echoLog(endMessageToSend, null, 100, packName);
      const rejectOBJ = { code: 400, message: endMessageToSend };
      REJECT(rejectOBJ);
      return;
    }
  } catch (ERROR) {
    const endMessageToSend = `Login [ ${USERNAME} ] or Password are invalid:`;
    adp.echoLog(endMessageToSend, ERROR, 400, packName);
    const rejectOBJ = { code: 400, message: endMessageToSend };
    REJECT(rejectOBJ);
    return;
  }
  const { url } = global.adp.config.ldap;
  const { bindDN } = global.adp.config.ldap;
  const { bindCredentials } = global.adp.config.ldap;
  const { searchBase } = global.adp.config.ldap;
  adp.echoLog(`Starting LDAP Connection [ ${url} ] to check if user [ ${USERNAME} ] can login...`, null, 200, packName);

  let clientADMIN;
  try {
    clientADMIN = global.ldapjs.createClient({ url });
  } catch (ERROR) {
    saveLog('Create LDAP Client Error', { from: packName, fullerror: ERROR });
    customMetrics.externalErrorCounter.inc();
    REJECT(ERROR);
    return;
  }

  try {
    await clientADMIN.bind(bindDN, bindCredentials, async (ERR) => {
      if (ERR) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        const endMessage = `ERROR :: LDAP [ ${url} ] failed on BIND using the bindCredentials from config.json`;
        const endMessageToSend = 'ERROR :: LDAP failed on BIND';
        adp.echoLog(endMessage, { error: ERR }, 500, packName, true);
        const rejectOBJ = { code: 500, message: endMessageToSend };
        customMetrics.externalErrorCounter.inc();
        REJECT(rejectOBJ);
        return;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      }

      const filterLine = global.adp.config.ldap.searchFilter.replace(/{{username}}/gim, USERNAME);
      adp.echoLog(`Bind successful! Starting search for "${filterLine}"`, null, 200, packName);
      const optionsForSearch = { filter: filterLine, scope: 'sub' };
      try {
        await clientADMIN.search(searchBase, optionsForSearch, async (ERR1, RES1) => {
          const searchList = [];
          RES1.on('searchEntry', (entry) => {
            searchList.push(entry);
          });
          RES1.on('end', async () => {
            const USERFROMLDAP = {};
            if (searchList.length === 1) {
              let userOBJ = null;
              if (searchList[0].attributes === null || searchList[0].attributes === undefined) {
                userOBJ = { ...searchList[0] };
              } else {
                userOBJ = searchList[0].attributes;
              }
              Object.keys(userOBJ).forEach((item) => {
                const itemName = userOBJ[item].type;
                const itemValue = userOBJ[item]._vals.toString('utf8');
                USERFROMLDAP[itemName] = itemValue;
              });
              const USER = adp.ldapNormalizer.analyse(USERFROMLDAP);

              const updateUsersData = new adp.users.UpdateUsersDataClass();
              await updateUsersData.updateAllThoseUsers([USER])
                .catch((ERROR) => {
                  const errorText = 'Error caught on [ updateUsersData.updateAllThoseUsers @ adp.users.UpdateUsersDataClass ]';
                  const errorObject = {
                    error: ERROR,
                    origin: 'Main Function',
                  };
                  adp.echoLog(errorText, errorObject, 500, 'adp.microservices.userTeamFullData');
                });

              const bindNewDN = (searchList[0].dn !== undefined)
                ? searchList[0].dn : USERFROMLDAP.dn;
              adp.echoLog(`User [ ${USER.uid} ] has found in LDAP.`, null, 200, packName);
              const bindNewCredentials = global.base64.decode(decodeURIComponent(PASSWORD)).toString('ascii');
              adp.echoLog(`Binding [ ${bindNewDN} ] with the LDAP Server...`, null, 200, packName);

              global.adp.login.unbindClient(clientADMIN, 'Admin').then(() => {
                let clientUSER;
                try {
                  clientUSER = global.ldapjs.createClient({ url });
                } catch (ERROR) {
                  saveLog('Create Second LDAP Client Error', { from: packName, fullerror: ERROR });
                  customMetrics.externalErrorCounter.inc();
                  REJECT(ERROR);
                  return;
                }
                try {
                  clientUSER.bind(bindNewDN, bindNewCredentials, async (ERRLASTBIND) => {
                    if (ERRLASTBIND) {
                      const errorMessage = `Login and/or Password are incorrect. Login for [ ${USERNAME} ] fail. Is not possible to BIND the user with the LDAP.`;
                      adp.echoLog(errorMessage, ERRLASTBIND, 401, packName);
                      const rejectOBJ = { code: 401, message: errorMessage };
                      await global.adp.login.unbindClient(clientUSER, 'User').then(() => {
                        REJECT(rejectOBJ);
                      }).catch((errorClosingLdap) => {
                        adp.echoLog('Error on [ adp.login.unbindClient ]', { error: errorClosingLdap }, 500, packName, true);
                        REJECT(errorClosingLdap);
                      });
                      return;
                    }
                    const successfulMessage = `User can Bind with LDAP. Login and Password are correct. Login for [ ${USERNAME} ] successful!`;
                    adp.echoLog(successfulMessage, null, 200, packName);
                    delete USER.userPassword;
                    const resolveOBJ = { code: 200, message: successfulMessage, user: USER };
                    global.adp.login.unbindClient(clientUSER, 'User').then(() => {
                      RESOLVE(resolveOBJ);
                    }).catch((errorClosingLDAP) => {
                      REJECT(errorClosingLDAP);
                    });
                  });
                } catch (ERROR) {
                  customMetrics.externalErrorCounter.inc();
                  saveLog('LDAP Second Bind Error', {
                    from: packName,
                    dn: bindNewDN,
                    fullerror: ERROR,
                  });
                  REJECT(ERROR);
                }
              }).catch((errorClosingAdminLdap) => {
                REJECT(errorClosingAdminLdap);
              });
            } else {
              const errorMessage = `Login and/or Password are incorrect. Login for [ ${USERNAME} ] fail!`;
              let realErrorMessage = '';
              if (searchList.length === 0) {
                realErrorMessage = 'Nothing returned from LDAP!';
              } else {
                realErrorMessage = 'More than one user is returning from LDAP!';
              }
              const rejectOBJ = { code: 401, message: errorMessage };
              adp.echoLog(realErrorMessage, { username: USERNAME }, 500, packName, true);
              global.adp.login.unbindClient(clientADMIN, 'User').then(() => {
                REJECT(rejectOBJ);
              }).catch((errorClosingLDAP) => {
                REJECT(errorClosingLDAP);
              });
            }
          });
        });
      } catch (ERROR) {
        saveLog('LDAP Search Error', {
          from: packName,
          base: searchBase,
          options: optionsForSearch,
          fullerror: ERROR,
        });
        global.adp.login.unbindClient(clientADMIN, 'Admin').then(() => {
          REJECT(ERROR);
        }).catch((errorClosingLDAP) => {
          REJECT(errorClosingLDAP);
        });
      }
    });
  } catch (ERROR) {
    customMetrics.externalErrorCounter.inc();
    saveLog('LDAP Main Bind Error', {
      from: packName,
      dn: bindDN,
      fullerror: ERROR,
    });
    REJECT(ERROR);
  }
});
// ============================================================================================= //
