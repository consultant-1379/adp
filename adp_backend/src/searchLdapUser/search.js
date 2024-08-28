// ============================================================================================= //
/**
* [ global.adp.searchLdapUser.search ]
* @author Omkar Sadegaonkar [esdgmkr], Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = NAME => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.searchLdapUser.search';
  const saveLog = (DESC, OBJ) => {
    const msg = 'saveLog called';
    const obj = {
      description: DESC,
      object: OBJ,
    };
    adp.echoLog(msg, obj, 500, packName, false);
    const logJSON = {
      type: 'ldaperror',
      datetime: new Date(),
      log: `${DESC}`,
      obj: OBJ,
    };
    global.adp.auditlog.create(logJSON)
      .catch((ERROR) => {
        const errorText = 'Cannot save error on Database Log';
        const errorOBJ = {
          error: ERROR,
          description: DESC,
          object: OBJ,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
      });
  };
  const limit = 10;
  adp.echoLog(`Search request for user [ ${NAME} ]`, null, 200, packName);
  const { url } = global.adp.config.ldap;
  const { bindDN } = global.adp.config.ldap;
  const { bindCredentials } = global.adp.config.ldap;
  const { searchBase } = global.adp.config.ldap;
  const userToFind = NAME;
  const isUserToFindString = (typeof userToFind === 'string') && (userToFind.length > 0);
  if (!isUserToFindString) {
    const endResult = {
      code: 400,
      message: '400 - Bad Request',
    };
    REJECT(endResult);
    return;
  }
  adp.echoLog(`Starting LDAP Connection [ ${url} ] to check if user [ ${userToFind} ] can exists...`, null, 200, packName);

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
        const endMessage = `ERROR :: LDAP [ ${url} ] failed on BIND using the bindCredentials from config.json :: ${ERR}`;
        const endMessageToSend = 'ERROR :: LDAP failed on BIND';
        const errorOBJ = {
          error: ERR,
          bindDN,
          bindCredentials,
        };
        adp.echoLog(endMessage, errorOBJ, 500, packName, true);
        const rejectOBJ = { code: 500, message: endMessageToSend };

        await global.adp.login.unbindClient(client, 'user').then(() => {
          REJECT(rejectOBJ);
        }).catch((errorClosingLdap) => {
          REJECT(errorClosingLdap);
        });
        return;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      }
      // ======================================================================================= //
      const filterBuilder = (USR) => {
        let index = 0;
        const arrayBySpace = USR.split(' ');
        const arrayBySpaceLen = arrayBySpace.length;
        const finalArray = [];
        for (index = 0; index < arrayBySpaceLen; index += 1) {
          const arrayOne = arrayBySpace.slice(0, (index + 1));
          const arrayTwo = arrayBySpace.slice((index + 1));
          finalArray.push(arrayTwo.concat(arrayOne));
        }
        finalArray.reverse();
        let searchLDAP = '(|';
        index = 0;
        finalArray.forEach((SEARCH) => {
          if (index === 0) {
            const valueAsString = SEARCH.join(' ');
            const line = `(|(cn=${valueAsString}*)(sn=${valueAsString}*))`;
            searchLDAP = `${searchLDAP}${line}`;
          } else {
            const firstPiece = SEARCH.slice(0, index).join(' ');
            const secondPiece = SEARCH.slice(index).join(' ');
            const lineOne = `(&(cn=${firstPiece}*)(sn=${secondPiece}*))`;
            const lineTwo = `(&(cn=${secondPiece}*)(sn=${firstPiece}*))`;
            const lines = `(|${lineOne}${lineTwo})`;
            searchLDAP = `${searchLDAP}${lines}`;
          }
          index += 1;
        });
        searchLDAP = `${searchLDAP})`;
        return searchLDAP;
      };
      // ======================================================================================= //
      const filter = filterBuilder(userToFind);
      // ======================================================================================= //
      adp.echoLog(`Bind successful! Starting search for "${filter}"`, null, 200, packName);
      const ldapOptions = {
        filter,
        scope: 'sub',
        paged: true,
        sizeLimit: 20,
      };
      try {
        await client.search(searchBase, ldapOptions, async (ERR1, RES1) => {
          const searchList = [];
          RES1.on('searchEntry', (entry) => {
            if (searchList.length < ldapOptions.sizeLimit) {
              searchList.push(entry);
            }
          });
          RES1.on('end', () => {
            adp.echoLog(`Number of user(s) found : ${searchList.length}`, null, 200, packName);
            const usersFound = [];
            let counter = 0;
            searchList.forEach((ele) => {
              counter += 1;
              if (usersFound.length <= limit) {
                const USER = {};
                const elem = ele.attributes;
                Object.keys(elem).forEach((item) => {
                  const itemName = elem[item].type;
                  const itemValue = elem[item]._vals.toString('utf8'); // eslint-disable-line no-underscore-dangle
                  USER[itemName] = itemValue;
                });
                usersFound.push(global.adp.ldapNormalizer.analyse(USER));
              }
            });
            const message = (usersFound.length > 0 ? 'User(s) Found' : 'No Users Found');
            const endResult = {
              code: 200,
              message: `200 - ${message}`,
              total: counter,
              data: { usersFound },
              size: global.adp.getSizeInMemory(usersFound),
              limit,
            };
            global.adp.login.unbindClient(client, 'user').then(() => {
              RESOLVE(endResult);
            }).catch((errorClosingLdap) => {
              REJECT(errorClosingLdap);
            });
          });
        });
      } catch (ERROR) {
        saveLog('LDAP Search Error', {
          from: packName,
          base: searchBase,
          options: ldapOptions,
          fullerror: ERROR,
        });
        global.adp.login.unbindClient(client, 'user').then(() => {
          REJECT(ERROR);
        }).catch((errorClosingLdap) => {
          REJECT(errorClosingLdap);
        });
      }
    });
  } catch (ERROR) {
    saveLog('LDAP Main Bind Error', {
      from: packName,
      dn: bindDN,
      fullerror: ERROR,
    });
    await global.adp.login.unbindClient(client, 'user').then(() => {
      REJECT(ERROR);
    }).catch((errorClosingLdap) => {
      REJECT(errorClosingLdap);
    });
  }
});
// ============================================================================================= //
