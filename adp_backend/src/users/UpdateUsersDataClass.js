
// ============================================================================================= //
/**
* [ adp.users.UpdateUsersDataClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
class UpdateUsersDataClass {
  // ------------------------------------------------------------------------------------------ //
  constructor() {
    this.packName = 'adp.users.updateUsersDataClass';
    this.url = adp.config.ldap.url;
    this.bindDN = adp.config.ldap.bindDN;
    this.bindCredentials = adp.config.ldap.bindCredentials;
    this.searchBase = adp.config.ldap.searchBase;
    this.client = null;
    this.timerLDAPConnection = null;
    this.timerLDAPQueries = 0;
    this.startTimer = new Date();
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ retrieveFromLDAP ] uses the opened connection on this.client to search
   * for users using signum as parameter.
   * @param {String} SIGNUM string with the signum you need to search.
   * @returns a resolved promise case the check was successful
   * containing a user object normalised from LDAP.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  retrieveFromLDAP(SIGNUM) {
    if (this.client === null) {
      const errorMessage = 'Caught an Error on [ retrieveFromLDAP ]';
      const errorObject = {
        code: 500,
        error: 'this.client is null',
        signum: SIGNUM,
        origin: 'retrieveFromLDAP',
      };
      adp.echoLog(errorMessage, errorObject, 500, this.packName);
      return new Promise((RES, REJ) => REJ(errorObject));
    }
    return new Promise((RES) => {
      const filter = `(uid=${SIGNUM})`;
      this.timerLDAPQueries += 1;
      this.client.search(this.searchBase, { filter, scope: 'sub' }, (ERR1, RES1) => {
        const searchList = [];
        RES1.on('searchEntry', (entry) => {
          searchList.push(entry);
        });
        RES1.on('end', () => {
          let user = {};
          if (Array.isArray(searchList) && searchList.length > 0) {
            searchList.forEach((ITEM) => {
              const items = ITEM.attributes;
              Object.keys(items).forEach((item) => {
                const itemName = items[item].type;
                const itemValue = items[item]._vals.toString('utf8');
                user[itemName] = itemValue;
              });
              user = adp.ldapNormalizer.analyse(user);
              user.uid = `${user.uid}`.toLowerCase().trim();
              user.signum = `${user.signum}`.toLowerCase().trim();
              user.name = `${user.name}`.trim();
              user.email = `${user.email}`.trim();
              RES(user);
            });
          } else {
            RES(null);
          }
        });
      });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ connectOnLDAP ] open a connection with the LDAP
   * and stores it on this.client to be used on other
   * methods of this class.
   * @returns a resolved promise case was successful
   * and this.client is a open LDAP connection.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  connectOnLDAP() {
    this.timerLDAPConnection = new Date();
    return new Promise((RES, REJ) => {
      try {
        this.client = global.ldapjs.createClient({ url: this.url });
        this.client.bind(this.bindDN, this.bindCredentials, (ERR) => {
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
          if (ERR) {
            const endMessage = 'ERROR :: LDAP failed on BIND using the bindCredentials from config.json';
            const endObject = {
              url: this.url,
              bindDN: this.bindDN,
              error: ERR,
            };
            adp.echoLog(endMessage, endObject, 500, this.packName);
            adp.login.unbindClient(this.client, 'User')
              .then(() => endObject)
              .catch(errorClosingLdap => errorClosingLdap);
            REJ();
            return;
          }
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
          RES();
        });
      } catch (ERROR) {
        const errorObject = {
          origin: 'connectOnLDAP',
          error: ERROR,
        };
        adp.echoLog('Caught an error on try/catch block on [ connectOnLDAP ]', errorObject, 500, this.packName);
        REJ();
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ disconnectFromLDAP ] calls adp.login.unbindClient to disconnect from LDAP.
   * @returns a resolved promise case was successful.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  disconnectFromLDAP() {
    return new Promise((RES, REJ) => {
      adp.login.unbindClient(this.client, 'User')
        .then(() => {
          let msg;
          const timer = new Date().getTime() - this.timerLDAPConnection.getTime();
          if (this.timerLDAPQueries === 1) {
            msg = `LDAP connection open/ran 1 query/closed in ${timer}ms`;
          } else {
            msg = `LDAP connection open/ran ${this.timerLDAPQueries} queries/closed in ${timer}ms`;
          }
          adp.echoLog(msg, null, 200, this.packName, false);
          RES(true);
        }).catch((errorClosingLDAP) => {
          const errorText = 'Caugth an error on [ adp.login.unbindClient ] at [ disconnectFromLDAP ]';
          const errorObject = {
            origin: 'disconnectFromLDAP',
            error: errorClosingLDAP,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJ(errorClosingLDAP);
        });
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ updateAllTeamMails ] receives the previous email and the new email.
   * If both are valid and differents, calls updateTeamMails from adp.models.Adp
   * to update all instances of the previous email on teamMails Asset's field.
   * @param {String} PREVIOUSEMAIL string with the previous email.
   * @param {String} NEWEMAIL string with the nem email.
   * @returns a resolved promise case the check was successful.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  updateAllTeamMails(PREVIOUSEMAIL, NEWEMAIL) {
    return new Promise((RES, REJ) => {
      if (PREVIOUSEMAIL && NEWEMAIL
        && PREVIOUSEMAIL !== 'undefined'
        && PREVIOUSEMAIL !== 'null'
        && NEWEMAIL !== 'undefined'
        && NEWEMAIL !== 'null'
        && PREVIOUSEMAIL !== NEWEMAIL) {
        const adpModel = new adp.models.Adp();
        adpModel.updateTeamMails(PREVIOUSEMAIL, NEWEMAIL)
          .then(() => {
            RES();
          })
          .catch((ERROR) => {
            const errorText = 'Caugth an error on [ adpModel.updateTeamMails @ adp.models.Adp ] at [ updateAllTeamMails ]';
            const errorObject = {
              origin: 'updateAllTeamMails',
              error: ERROR,
            };
            adp.echoLog(errorText, errorObject, 500, this.packName);
            REJ(errorText);
          });
      } else {
        const msg = 'Nothing to update';
        RES(msg);
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ checkIfOk ] Just check if the parameter is a valid string
   * @param {string} STR The value to be checked.
   * @returns true if successful, otherwise false.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  checkIfOk(STR) {
    if (typeof STR !== 'string') {
      return false;
    }
    if (STR.trim().length === 0) {
      return false;
    }
    if (STR.trim().toLowerCase() === 'undefined') {
      return false;
    }
    if (STR.trim().toLowerCase() === 'null') {
      return false;
    }
    return true;
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ updateAllThoseUsers ] get one or more LDAP User objects, if it finds
   * a change on name/email, updates the user accordially.
   * Calls this.updateAllTeamMails() if necessary to update Asset's teamMails.
   * @param {Array} USERSFROMLDAP Array of Users from LDAP.
   * @returns a resolved promise case the check was successful.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  updateAllThoseUsers(USERSFROMLDAP) {
    const allPromises = [];
    const usersFromLDAP = USERSFROMLDAP;
    const adpModel = new adp.models.Adp();
    usersFromLDAP.forEach((userFromLDAP) => {
      if (userFromLDAP) {
        const signumFromLDAP = (`${userFromLDAP.uid}`).trim().toLowerCase();
        allPromises.push(new Promise((RES, REJ) => {
          adpModel.getNameEmailAndSignumBySignum(signumFromLDAP)
            .then((USERFROMDATABASE) => {
              const userFromDatabase = USERFROMDATABASE
              && USERFROMDATABASE.docs
              && USERFROMDATABASE.docs[0]
                ? USERFROMDATABASE.docs[0] : {};
              const userFromDatabaseOriginal = adp.clone(userFromDatabase);
              if (userFromDatabase._id === signumFromLDAP) {
                let foundChanges = false;
                let previousSignum;
                let previousName;
                let previousEmail;
                if (userFromDatabase.signum !== userFromLDAP.signum.trim().toLowerCase()) {
                  previousSignum = `${userFromDatabase.signum}`;
                  userFromDatabase.signum = userFromDatabase.signum.trim().toLowerCase();
                  foundChanges = true;
                }
                if (userFromDatabase.name !== userFromLDAP.name
                && this.checkIfOk(userFromLDAP.name)) {
                  previousName = `${userFromDatabase.name}`;
                  userFromDatabase.name = userFromLDAP.name;
                  foundChanges = true;
                }
                if (userFromDatabase.email !== userFromLDAP.email
                && this.checkIfOk(userFromLDAP.email)) {
                  previousEmail = `${userFromDatabase.email}`;
                  userFromDatabase.email = userFromLDAP.email;
                  foundChanges = true;
                }
                if (foundChanges) {
                  const fieldsToUpdate = {
                    _id: signumFromLDAP,
                    signum: userFromDatabase.signum,
                    name: userFromDatabase.name,
                    email: userFromDatabase.email,
                    modified: new Date(),
                  };
                  adpModel.update(fieldsToUpdate, false, true)
                    .then((afterUpdate) => {
                      if (afterUpdate.ok === true) {
                        const successObject = {
                          _id: signumFromLDAP,
                          previousSignum: previousSignum && fieldsToUpdate.signum
                            ? previousSignum : undefined,
                          updatedSignum: fieldsToUpdate.signum && previousSignum
                            ? fieldsToUpdate.signum : undefined,
                          previousName: previousName && fieldsToUpdate.name
                            ? previousName : undefined,
                          updatedName: fieldsToUpdate.name && previousName
                            ? fieldsToUpdate.name : undefined,
                          previousEmail: previousEmail && fieldsToUpdate.email
                            ? previousEmail : undefined,
                          updatedEmail: fieldsToUpdate.email && previousEmail
                            ? fieldsToUpdate.email : undefined,
                          processTimer: `${((new Date()).getTime() - this.startTimer.getTime())}ms`,
                        };
                        adp.echoLog('User updated', successObject, 200, this.packName, true);
                        adp.masterCache.clear('ALLUSERS', null, signumFromLDAP);
                        this.updateAllTeamMails(previousEmail, fieldsToUpdate.email)
                          .then(() => {
                            RES(`${signumFromLDAP} updated!`);
                          })
                          .catch((ERROR) => {
                            const errorText = 'Error in [ this.updateAllTeamMails ] at [ updateAllThoseUsers ]';
                            const errorOBJ = {
                              origin: 'updateAllThoseUsers',
                              error: ERROR,
                              database: 'dataBase',
                              signumFromLDAP,
                              fieldsToUpdate,
                              databaseAnswer: afterUpdate,
                              usersFromLDAP: USERSFROMLDAP,
                              userFromDatabase: userFromDatabaseOriginal,
                            };
                            adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
                            REJ(errorText);
                          });
                        return;
                      }
                      const errorText = 'Error in [ adpModel.update @ adp.models.Adp ] at [ updateAllThoseUsers ]';
                      const errorOBJ = {
                        origin: 'updateAllThoseUsers',
                        database: 'dataBase',
                        signumFromLDAP,
                        fieldsToUpdate,
                        databaseAnswer: afterUpdate,
                        usersFromLDAP: USERSFROMLDAP,
                        userFromDatabase: userFromDatabaseOriginal,
                      };
                      adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
                      REJ(errorText);
                    })
                    .catch((ERROR) => {
                      const errorText = 'Error caught in [ adpModel.update @ adp.models.Adp ] at [ updateAllThoseUsers ]';
                      const errorOBJ = {
                        origin: 'updateAllThoseUsers',
                        error: ERROR,
                        database: 'dataBase',
                        signumFromLDAP,
                        newUser: userFromDatabase,
                        usersFromLDAP: USERSFROMLDAP,
                        userFromDatabase: userFromDatabaseOriginal,
                      };
                      adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
                      REJ(ERROR);
                    });
                } else {
                  const message = `${signumFromLDAP} doesn't need to be updated!`;
                  adp.echoLog(message, null, 200, this.packName, false);
                  RES(message);
                }
              } else {
                const errorText = `[ ${signumFromLDAP} ] and [ ${userFromDatabase._id} ] should be the same! Nothing to update!`;
                const errorObject = {
                  origin: 'updateAllThoseUsers',
                  usersFromLDAP: USERSFROMLDAP,
                  signumFromLDAP,
                  userFromDatabase,
                };
                adp.echoLog(errorText, errorObject, 500, this.packName, false);
                RES(errorText);
              }
            })
            .catch((ERROR) => {
              const errorText = 'Caugth an error on [ adp.user.read ] at [ updateAllThoseUsers ]';
              const errorObject = {
                origin: 'updateAllThoseUsers',
                signumFromLDAP,
                error: ERROR,
                usersFromLDAP: USERSFROMLDAP,
              };
              adp.echoLog(errorText, errorObject, 500, this.packName);
              REJ(errorText);
            });
        }));
      } else {
        allPromises.push(new Promise(RES => RES()));
      }
    });
    return Promise.all(allPromises)
      .then(() => true)
      .catch((ERROR) => {
        const errorText = 'Caugth an error on [ Promise.all() ] at [ updateAllThoseUsers ]';
        const errorObject = {
          origin: 'updateAllThoseUsers',
          error: ERROR,
          usersFromLDAP: USERSFROMLDAP,
        };
        adp.echoLog(errorText, errorObject, 500, this.packName);
        return false;
      });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Main Function [ updateUsers ] receives an array of signums to check.
   * @param {Array} USERS Array of Signums. If get a string, will convert to Array.
   * @returns a resolved promise case the check was successful.
   * @author Armando Dias [zdiaarm]
   */
  // ------------------------------------------------------------------------------------------ //
  updateUsers(USERS) {
    return new Promise((RES, REJ) => {
      let users = USERS;
      if (!Array.isArray(users)) {
        users = [users];
      }
      this.connectOnLDAP()
        .then(() => {
          const allPromises = [];
          users.forEach((USER) => {
            allPromises.push(this.retrieveFromLDAP(USER));
          });
          Promise.all(allPromises)
            .then((USERSFROMLDAP) => {
              this.disconnectFromLDAP();
              this.updateAllThoseUsers(USERSFROMLDAP)
                .then((RESULT) => {
                  RES(RESULT);
                })
                .catch((ERROR) => {
                  const errorText = 'Error caught on [ this.updateAllThoseUsers() ] at [ updateUsers ]';
                  const errorObject = {
                    origin: 'updateUsers',
                    error: ERROR,
                    users: USERS,
                    usersFromLDAP: USERSFROMLDAP,
                  };
                  adp.echoLog(errorText, errorObject, 500, this.packName);
                  REJ();
                });
            })
            .catch((ERROR) => {
              const errorText = 'Error caught on [ Promise.all() ] at [ updateUsers ]';
              const errorObject = {
                origin: 'updateUsers',
                error: ERROR,
                users: USERS,
              };
              adp.echoLog(errorText, errorObject, 500, this.packName);
              this.disconnectFromLDAP();
              REJ(ERROR);
            });
        })
        .catch((ERROR) => {
          const errorText = 'Error caught on [ this.connectOnLDAP() ] at [ updateUsers ]';
          const errorObject = {
            origin: 'updateUsers',
            error: ERROR,
            users: USERS,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJ(ERROR);
        });
    });
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = UpdateUsersDataClass;
// ============================================================================================= //
