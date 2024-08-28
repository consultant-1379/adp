/**
 * Unbinds the connection to ldap
 * If a connection stays open an error will eventually occur which cause the BE
 * to restart
 * [ global.adp.login.unbindClient ]
 * @param {object} CLIENT the ldap instance object
 * @param {string} MSG any details relating to this client
 * @author Armando Schiavon Dias [escharm]
 * @author Cein-Sven Da Costa [edaccei]
*/
global.adp.docs.list.push(__filename);

const packName = 'global.adp.login.unbindClient';

/**
 * Sends the log to the console and the auditlog (adplog db)
 * @param {string} DESC the description of the log
 * @param {object} OBJ the object to insert into the auditlog (adplog db)
 * @author Armando Schiavon Dias [escharm]
 */
const saveLog = (DESC, OBJ) => {
  adp.echoLog('saveLog', { description: DESC, object: OBJ }, 200, packName);
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

module.exports = (CLIENT, MSG) => new Promise((RESOLVE, REJECT) => {
  if (CLIENT && CLIENT.connected) {
    try {
      CLIENT.unbind((ERRORONUNBIND) => {
        if (ERRORONUNBIND) {
          const errorClosing = { message: `ERROR on closing the LDAP [ [ ${MSG} ] ] connection:`, code: 500 };
          adp.echoLog(errorClosing.message, ERRORONUNBIND, errorClosing.code, packName);
          REJECT(ERRORONUNBIND);
        } else if (CLIENT.connected === false) {
          adp.echoLog(`LDAP [ ${MSG} ] connection closed`, null, 200, packName);
          RESOLVE(true);
        } else {
          const unbindError = { message: 'LDAP Client unbind failed, client is still connected.', code: 500 };
          saveLog(unbindError.message, {
            from: packName, level: MSG, fullerror: { ...unbindError, CLIENT },
          });
          REJECT(unbindError);
        }
      });
    } catch (ERROR) {
      saveLog('LDAP Unbind Error', { from: packName, level: MSG, fullerror: ERROR });
      REJECT(ERROR);
    }
  } else if (CLIENT && CLIENT.connected === false) {
    adp.echoLog(`LDAP [ ${MSG} ] connection closed`, null, 200, packName);
    RESOLVE(true);
  } else {
    const error = { message: 'ldapjs client not defined', code: 400 };
    adp.echoLog(error.message, null, error.code, packName);
    REJECT(error);
  }
});
