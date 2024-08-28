// ============================================================================================= //
/**
* [ global.adp.microservices.userTeamFullData ]
* Promise, returns the given Asset, but with complete data for each team member.
* @param {Object} ASSET The microservice object.
* @param {Object} LOCALPROCESSUSERS Object with users of this process.
* @param {Boolean} CHECKDATA If should check name/email possible updates using LDAP.
* @return {Object} The Asset with team data retrieved from Database/LDAP.
* @author John Dolan [ejohdol], Armando Schiavon Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (ASSET, LOCALPROCESSUSERS, CHECKDATA = false) => new Promise((RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const { team } = ASSET;
  const localProcessUsers = LOCALPROCESSUSERS;
  if (team !== undefined && team !== null) {
    let index = 0;
    const teamLength = team.length;
    const action = () => {
      const { signum } = team[index];
      if (localProcessUsers[signum] !== undefined) {
        const theUser = localProcessUsers[signum];
        team[index].name = theUser.name;
        team[index].email = theUser.email;
        team[index].type = theUser.type;
        team[index].role = theUser.role;
        index += 1;
        if (index < teamLength) {
          action();
        } else {
          RESOLVE();
        }
      } else {
        global.adp.user.thisUserShouldBeInDatabase(signum)
          .then((THEUSEROBJECT) => {
            if (Array.isArray(THEUSEROBJECT.docs) && THEUSEROBJECT.docs.length > 0) {
              const theUser = THEUSEROBJECT.docs[0];
              team[index].name = theUser.name;
              team[index].email = theUser.email;
              team[index].type = theUser.type;
              team[index].role = theUser.role;
              localProcessUsers[signum] = {
                name: theUser.name,
                email: theUser.email,
                type: theUser.type,
                role: theUser.role,
              };
            }
            index += 1;
            if (index < teamLength) {
              action();
            } else {
              RESOLVE();
            }
          })
          .catch((errorRetrievingUser) => {
            const packName = 'adp.microservices.userTeamFullData';
            adp.echoLog('Error in [ adp.user.thisUserShouldBeInDatabase ]', { signum, error: errorRetrievingUser }, 500, packName, true);
            RESOLVE();
          });
      }
    };
    // =============================================================================== //
    if (CHECKDATA) {
      const teamSignums = [];
      team.forEach((USER) => {
        teamSignums.push((`${USER.signum}`).toLowerCase().trim());
      });
      const updateUsersData = new adp.users.UpdateUsersDataClass();
      updateUsersData.updateUsers(teamSignums)
        .then(() => {
          action();
        })
        .catch((ERROR) => {
          const errorText = 'Error caught on [ updateUsersData.updateUsers @ adp.users.UpdateUsersDataClass ]';
          const errorObject = {
            error: ERROR,
            team,
            origin: 'Main Function',
          };
          adp.echoLog(errorText, errorObject, 500, 'adp.microservices.userTeamFullData');
          RESOLVE();
        });
    } else {
      action();
    }
    // =============================================================================== //
  } else {
    RESOLVE();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
