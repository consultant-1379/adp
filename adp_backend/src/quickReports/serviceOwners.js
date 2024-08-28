// ============================================================================================= //
/**
* [ global.adp.quickReports.serviceOwners ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.quickReports.serviceOwners';
  const dbModel = new adp.models.Adp();
  const users = {};
  // =========================================================================================== //
  const getMS = () => new Promise((RESOLVEMS, REJECTMS) => {
    // ----------------------------------------------------------------------------------------- //
    dbModel.indexMicroservices()
      .then((MS) => {
        MS.docs.forEach((MSItem) => {
          if (MSItem.team !== undefined && MSItem.team !== null) {
            MSItem.team.forEach((USER) => {
              if (USER.serviceOwner) {
                const found = USER.signum.trim().toLowerCase();
                if (users[found] === undefined || users[found] === null) {
                  users[found] = {
                    signum: found,
                    ownerFrom: MSItem.name,
                  };
                } else {
                  users[found].ownerFrom = `${users[found].ownerFrom}, ${MSItem.name}`;
                }
              }
            });
          }
        });
        RESOLVEMS(users);
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ dbModel.indexMicroservices ] at [ getMS ]';
        const errorOBJ = {
          database: 'dataBase',
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECTMS(ERROR);
      });
    // ----------------------------------------------------------------------------------------- //
  });
  // =========================================================================================== //
  const getUSER = () => new Promise((RESOLVEUSER, REJECTUSER) => {
    // ----------------------------------------------------------------------------------------- //
    dbModel.indexUsers()
      .then((USER) => {
        const fromDB = USER.docs;
        Object.keys(users).forEach((K) => {
          const obj = fromDB.find(E => E.signum === K);
          if (obj !== null && obj !== undefined) {
            users[K].email = obj.email;
            users[K].name = obj.name;
          }
        });
        RESOLVEUSER(users);
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ dbModel.indexUsers ] at [ getUSER ]';
        const errorOBJ = {
          database: 'dataBase',
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECTUSER(ERROR);
      });
    // ----------------------------------------------------------------------------------------- //
  });
  // =========================================================================================== //
  const generateHTML = () => new Promise((RESOLVEHTML) => {
    // ----------------------------------------------------------------------------------------- //
    let usersArray = [];
    Object.keys(users).forEach((K) => {
      usersArray.push(users[K]);
    });
    usersArray = usersArray.sort(global.adp.dynamicSort('name'));
    let HTML = '<table cellpadding="3">';
    let color = 'CCCCCC';
    usersArray.forEach((ITEM) => {
      if (ITEM.email !== undefined) {
        HTML = `${HTML}<tr bgcolor="#${color}">`;
        HTML = `${HTML}<td>${ITEM.signum}</td>`;
        HTML = `${HTML}<td>${ITEM.name}</td>`;
        HTML = `${HTML}<td>${ITEM.email}</td>`;
        HTML = `${HTML}<td>${ITEM.ownerFrom}</td>`;
        HTML = `${HTML}</tr>`;
        if (color === 'CCCCCC') {
          color = 'FFFFFF';
        } else {
          color = 'CCCCCC';
        }
      }
    });
    HTML = `${HTML}</table>`;
    HTML = `${HTML}<br/><br/>`;
    HTML = `${HTML}<div><b>List of Service Owners Mails:</b></div>`;
    HTML = `${HTML}<div>`;
    let first = true;
    usersArray.forEach((ITEM) => {
      if (ITEM.email !== undefined) {
        if (first) {
          HTML = `${HTML}${ITEM.email}`;
          first = false;
        } else {
          HTML = `${HTML}, ${ITEM.email}`;
        }
      }
    });
    HTML = `${HTML}</div>`;
    RESOLVEHTML(HTML);
    // ----------------------------------------------------------------------------------------- //
  });
  // =========================================================================================== //
  getMS()
    .then(getUSER)
    .then((HTML) => {
      generateHTML(HTML)
        .then((TOSEND) => {
          RESOLVE(TOSEND);
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
  // =========================================================================================== //
});
// ============================================================================================= //
