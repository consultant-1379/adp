// ============================================================================================= //
/**
* [ global.adp.quickReports.teamMembers ]
* Generate a CSV Report of all team members of each Microservice
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-use-before-define */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //


// ============================================================================================= //
// Private Constants
const packName = 'global.adp.quickReports.teamMembers';
const regExpCommaDetector = new RegExp(/,+/gim);
// ============================================================================================= //


// ============================================================================================= //
// Private Variables
let listOptions = null;
let onlyRoles = null;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ replaceCommas ]
* @param STR Original String.
* @return String without commas.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const replaceCommas = (STR) => {
  if (STR !== undefined && STR !== null) {
    return STR.replace(regExpCommaDetector, '-');
  }
  return undefined;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ CSV ]
* @param OBJ Denormalized Object to transform into CSV.
* @return String with the CSV content.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const CSV = (OBJ) => {
  let csv = '';
  OBJ.forEach((MS) => {
    const msName = MS.name;
    const ms = MS;
    ms.team = ms.team.sort(global.adp.dynamicSort('-serviceOwner', 'name'));
    ms.team.forEach((LINE) => {
      if (msName !== undefined) {
        csv = `${csv}${replaceCommas(msName)},`;
      }
      if (LINE.signum !== undefined) {
        csv = `${csv}${replaceCommas(LINE.signum)},`;
      }
      if (LINE.name !== undefined) {
        csv = `${csv}${replaceCommas(LINE.name)},`;
      }
      if (LINE.email !== undefined) {
        csv = `${csv}${replaceCommas(LINE.email)},`;
      }
      if (LINE.team_role !== undefined) {
        csv = `${csv}${replaceCommas(LINE.team_role)},`;
      }
      if (LINE.serviceOwner) {
        csv = `${csv}Service Owner,`;
      } else {
        csv = `${csv},`;
      }
      csv = `${csv}\r\n`;
    });
  });
  return csv;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ denormalizeThisRole ]
* @param ROLEID Number with the Role ID.
* @return String related with the ID.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const denormalizeThisRole = (ROLEID) => {
  const item = onlyRoles.filter(ROLE => ROLE.id === ROLEID);
  if (item === undefined || item.length === 0) {
    return 'Team Member';
  }
  return item[0].name;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ getAllMicroservicesFromDataBase ]
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const denormalizeAll = (ALLMSITEMS, ALLDATABASEUSERS) => new Promise((RESOLVE) => {
  const allMS = ALLMSITEMS;
  const allUsers = ALLDATABASEUSERS;
  let msStep = 0;
  const msTotal = allMS.length;
  if (msTotal === 0) {
    RESOLVE();
    return;
  }
  const memberStepAction = (THISMS, THISSTEP, STEPTOTAL) => {
    const thisMS = THISMS;
    const member = thisMS.team[THISSTEP];
    const finish = () => {
      if ((THISSTEP + 1) < STEPTOTAL) {
        memberStepAction(thisMS, (THISSTEP + 1), STEPTOTAL);
      } else if ((msStep + 1) < msTotal) {
        msStep += 1;
        msStepAction();
      } else {
        RESOLVE(allMS);
      }
    };
    const extra = allUsers.find(USER => USER.signum === member.signum);
    if (Array.isArray(extra) && extra.length > 0) {
      const user = extra[0];
      member.name = user.name;
      member.email = user.email;
      member.team_role = denormalizeThisRole(member.team_role);
      finish();
    } else {
      global.adp.user.thisUserShouldBeInDatabase(member.signum)
        .then((USER) => {
          const user = USER.docs[0];
          member.name = user.name;
          member.email = user.email;
          member.team_role = denormalizeThisRole(member.team_role);
          finish();
        })
        .catch((ERROR) => {
          member.name = '[ 404 - User not found in LDAP ]';
          member.email = '[ 404 - User not found in LDAP ]';
          member.team_role = denormalizeThisRole(member.team_role);
          const errorText = 'Error in [ adp.user.thisUserShouldBeInDatabase ] at [ memberStepAction ]';
          const errorOBJ = {
            signum: member.signum,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          finish();
        });
    }
  };
  const msStepAction = () => {
    const thisMS = allMS[msStep];
    const memberTotal = thisMS.team.length;
    if (memberTotal > 0) {
      memberStepAction(thisMS, 0, memberTotal);
    } else if ((msStep + 1) < msTotal) {
      msStep += 1;
      msStepAction();
    } else {
      RESOLVE(allMS);
    }
  };
  msStepAction();
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ getAllMicroservicesFromDataBase ]
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const getAllMicroservicesFromDataBase = () => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  dbModel.indexMicroservices()
    .then((MS) => {
      const fromDB = MS.docs;
      const teams = [];
      fromDB.forEach((ITEM) => {
        if (ITEM.team !== undefined) {
          const { name, team } = ITEM;
          const obj = {
            name,
            team,
          };
          teams.push(obj);
        }
      });
      RESOLVE(teams);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.indexMicroservices ] at [ getAllMicroservicesFromDataBase ]';
      const errorOBJ = {
        database: 'dataBase',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ loadUsersFromDatabase ]
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const loadUsersFromDatabase = () => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  dbModel.indexUsers()
    .then((MS) => {
      const fromDB = MS.docs;
      const users = [];
      fromDB.forEach((ITEM) => {
        const { signum, name, email } = ITEM;
        const obj = {
          signum,
          name,
          email,
        };
        users.push(obj);
      });
      RESOLVE(users);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.indexUsers ] at [ loadUsersFromDatabase ]';
      const errorOBJ = {
        database: 'dataBase',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ getOnlyRoles ]
* @param LISTOPTIONS The listOptions full object.
* @return Only the team_role listOptions object.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const getOnlyRoles = (LISTOPTIONS) => {
  let result = null;
  LISTOPTIONS.forEach((ITEM) => {
    if (ITEM.slug === 'team_role') {
      result = ITEM.items;
    }
  });
  return result;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* [ global.adp.quickReports.teamMembers ]
* Generate a CSV Report of all team members of each Microservice
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  global.adp.listOptions.get()
    .then((LISTOPTIONS) => {
      listOptions = JSON.parse(LISTOPTIONS);
      onlyRoles = getOnlyRoles(listOptions);
      getAllMicroservicesFromDataBase()
        .then((FROMDB) => {
          loadUsersFromDatabase()
            .then((DATABASEUSERS) => {
              const sorted = FROMDB.sort(global.adp.dynamicSort('name'));
              denormalizeAll(sorted, DATABASEUSERS)
                .then((DENORMALIZED) => {
                  const csv = CSV(DENORMALIZED);
                  const now = new Date();
                  const year = now.getFullYear();
                  let month = `${now.getMonth()}`;
                  if (month.length < 2) {
                    month = `0${month}`;
                  }
                  let day = `${now.getDate()}`;
                  if (day.length < 2) {
                    day = `0${day}`;
                  }
                  let hour = `${now.getHours()}`;
                  if (hour.length < 2) {
                    hour = `0${hour}`;
                  }
                  let minute = `${now.getMinutes()}`;
                  if (minute.length < 2) {
                    minute = `0${minute}`;
                  }
                  let second = `${now.getSeconds()}`;
                  if (second.length < 2) {
                    second = `0${second}`;
                  }
                  let msecond = `${now.getMilliseconds()}`;
                  if (msecond.length === 3) {
                    msecond = `0${msecond}`;
                  } else if (msecond.length === 2) {
                    msecond = `00${msecond}`;
                  } else if (msecond.length === 1) {
                    msecond = `000${msecond}`;
                  }
                  const filename = `teamMembers_${year}-${month}-${day}-${hour}-${minute}-${second}-${msecond}.csv`;
                  global.adp.document.checkThisPath('quickReports')
                    .then((FULLPATH) => {
                      const path = `${FULLPATH}/${filename}`;
                      global.fs.writeFileSync(path, csv, 'utf8');
                      RESOLVE(path);
                    })
                    .catch((ERROR) => {
                      const errorText = 'Error in [ adp.document.checkThisPath ]';
                      const errorOBJ = {
                        parameter: 'quickReports',
                        error: ERROR,
                      };
                      adp.echoLog(errorText, errorOBJ, 500, packName, true);
                      REJECT(ERROR);
                    });
                })
                .catch((ERROR) => {
                  const errorText = 'Error in [ denormalizeAll ]';
                  const errorOBJ = {
                    sorted,
                    databaseUsers: DATABASEUSERS,
                    error: ERROR,
                  };
                  adp.echoLog(errorText, errorOBJ, 500, packName, true);
                  REJECT(ERROR);
                });
            })
            .catch((ERROR) => {
              const errorText = 'Error in [ loadUsersFromDatabase ]';
              const errorOBJ = {
                error: ERROR,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              REJECT(ERROR);
            });
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ getAllMicroservicesFromDataBase ]';
          const errorOBJ = {
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.listOptions.get ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
