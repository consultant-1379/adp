// ============================================================================================= //
/**
* [ global.adp.userbysignum.search ]
* @author Omkar Sadegaonkar [esdgmkr]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (UID, STRICTMODE) => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.userbysignum.search';
  const saveLog = (DESC, OBJ) => {
    const logJSON = {
      type: 'ldaperror',
      datetime: new Date(),
      log: `${DESC}`,
      obj: OBJ,
    };
    global.adp.auditlog.create(logJSON)
      .catch((ERROR) => {
        adp.echoLog('Error in [ saveLog ', ERROR, 500, packName, true);
      });
  };
  const limit = 10;
  const {
    url, bindDN, bindCredentials, searchBase,
  } = global.adp.config.ldap;

  let userToFind = UID;
  const isUserToFindString = (typeof userToFind === 'string') && (userToFind.length > 0);
  if (!isUserToFindString) {
    const endResult = {
      code: 400,
      message: '400 - Bad Request',
    };
    REJECT(endResult);
    return;
  }
  userToFind = userToFind.toUpperCase().trim();
  let client;
  try {
    client = global.ldapjs.createClient({ url });
  } catch (ERROR) {
    saveLog('Create LDAP Client Error', { from: packName, fullerror: ERROR });
    REJECT(ERROR);
    return;
  }
  try {
    await client.bind(bindDN, bindCredentials, async (ERR) => {
      if (ERR) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        const endMessage = `ERROR :: LDAP [ ${url} ] failed on BIND using the bindCredentials from config.json`;
        const endMessageToSend = 'ERROR :: LDAP failed on BIND';
        adp.echoLog('Error on [ client.bind ]', { msg: endMessage, error: ERR }, 500, packName, true);
        const rejectOBJ = { code: 500, message: endMessageToSend };
        await global.adp.login.unbindClient(client, 'User').then(() => {
          REJECT(rejectOBJ);
        }).catch((errorClosingLdap) => {
          REJECT(errorClosingLdap);
        });
        return;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      }
      let filter = `(uid=${userToFind}*)`;
      if (STRICTMODE !== undefined && STRICTMODE !== null) {
        filter = `(uid=${userToFind})`;
      }
      try {
        await client.search(searchBase, { filter, scope: 'sub' }, async (ERR1, RES1) => {
          const searchList = [];
          RES1.on('searchEntry', (entry) => {
            searchList.push(entry);
          });
          RES1.on('end', () => {
            const usersFound = [];
            let counter = 0;
            searchList.forEach((ele) => {
              counter += 1;
              if (usersFound.length <= limit) {
                const USER = {};
                const elem = ele.attributes;
                Object.keys(elem).forEach((item) => {
                  const itemName = elem[item].type;
                  const itemValue = elem[item]._vals.toString('utf8');
                  USER[itemName] = itemValue;
                });
                usersFound.push(global.adp.ldapNormalizer.analyse(USER));
              }
            });
            if (usersFound.length === 0) {
              const endResult = {
                code: 404,
                message: '404 - User Not Found',
              };
              global.adp.login.unbindClient(client, 'User').then(() => {
                REJECT(endResult);
              }).catch((errorClosingLDAP) => {
                REJECT(errorClosingLDAP);
              });
            } else {
              const endResult = {
                code: 200,
                message: '200 - User(s) Found',
                total: counter,
                data: { usersFound },
                size: global.adp.getSizeInMemory(usersFound),
                limit,
              };
              global.adp.login.unbindClient(client, 'User').then(() => {
                RESOLVE(endResult);
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
          filter,
          fullerror: ERROR,
        });
        global.adp.login.unbindClient(client, 'User').then(() => {
          REJECT(ERROR);
        }).catch((errorClosingLDAP) => {
          REJECT(errorClosingLDAP);
        });
      }
    });
  } catch (ERROR) {
    saveLog('LDAP Main Bind Error', {
      from: packName,
      dn: bindDN,
      fullerror: ERROR,
    });
    await global.adp.login.unbindClient(client, 'User').then(() => {
      REJECT(ERROR);
    }).catch((errorClosingLdap) => {
      REJECT(errorClosingLdap);
    });
  }
});
// ============================================================================================= //
