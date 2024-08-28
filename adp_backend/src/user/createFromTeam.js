// ============================================================================================= //
/**
* [ global.adp.user.createFromTeam ]
* Create a User in Database.
* @param {JSON} USEROBJ a JSON Object with the User. Must follow the schema.
* @return Return ID for OK, Code 500 if something went wrong.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.user.createFromTeam';
  const allPromises = [];
  if (MS.team !== null && MS.team !== undefined) {
    MS.team.forEach((teamMember) => {
      allPromises.push(global.adp.user.read(teamMember.signum.trim().toLowerCase())
        .then((RESULT) => {
          if (RESULT.docs.length === 0) {
            allPromises.push(global.adp.userbysignum.search(teamMember.signum.trim().toLowerCase())
              .then((LDAPUSER) => {
                adp.echoLog(`Team member "${teamMember.signum.trim().toLowerCase()}" not in Database...`, 404, packName);
                if (Array.isArray(LDAPUSER.data.usersFound)) {
                  if (LDAPUSER.data.usersFound.length === 1) {
                    const msg = `LDAP data about "${teamMember.signum.trim().toLowerCase()}" retrieved. Inserting into our Database...`;
                    const obj = { userFromLDAP: LDAPUSER.data.usersFound[0] };
                    adp.echoLog(msg, obj, 200, packName);
                    const myUID = LDAPUSER.data.usersFound[0].uid;
                    const myName = LDAPUSER.data.usersFound[0].name;
                    const myEmail = LDAPUSER.data.usersFound[0].email;
                    const userOBJ = {
                      signum: myUID,
                      name: myName,
                      email: myEmail,
                    };
                    allPromises.push(global.adp.user.create(userOBJ)
                      .then(() => {
                        const successMessage = `User "${teamMember.signum.trim().toLowerCase()}" successful saved in our Database.`;
                        adp.echoLog(successMessage, { userObject: userOBJ }, 200, packName);
                      })
                      .catch((ERROR) => {
                        const errorText = 'adp.user.create';
                        const errorOBJ = {
                          userObject: userOBJ,
                          error: ERROR,
                        };
                        adp.echoLog(errorText, errorOBJ, 500, packName, true);
                      }));
                  } else {
                    const errorText = `LDAP data about "${teamMember.signum.trim().toLowerCase()}" is not clear. Impossible insert into our Database.`;
                    const errorOBJ = {
                      ldapAnswer: LDAPUSER,
                    };
                    adp.echoLog(errorText, errorOBJ, 500, packName, true);
                  }
                }
              })
              .catch((ERROR) => {
                const errorText = 'Error on [ adp.userbysignum.search ]';
                const errorOBJ = {
                  parameter: teamMember.signum.trim().toLowerCase(),
                  error: ERROR,
                };
                adp.echoLog(errorText, errorOBJ, 500, packName, true);
              }));
          }
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adp.user.read ]';
          const errorOBJ = {
            error: ERROR,
            signum: teamMember.signum.trim().toLowerCase(),
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
        }));
    });
    Promise.all(allPromises)
      .then(() => { RESOLVE(); })
      .catch(() => { REJECT(); });
  }
});
// ============================================================================================= //
