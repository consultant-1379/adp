// ============================================================================================= //
/**
* [ global.adp.migration.lowerCaseSignum ]
* Force all signums to be LowerCase
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle                                                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.migration.lowerCaseSignum';
  const allPromises = [];
  let counter = 0;
  const adpModel = new adp.models.Adp();
  await adpModel.indexUsers(false)
    .then((RESULT) => {
      const resultOfQuery = RESULT.docs;
      resultOfQuery.forEach((USER) => {
        const user = USER;
        const originalSignum = USER.signum;
        const checkedSignum = USER.signum.trim().toLowerCase();
        if (user.signum !== checkedSignum) {
          user.signum = checkedSignum;
          user._rev = undefined;
          allPromises.push(
            adpModel.update(user)
              .then((UPDATERETURN) => {
                if (UPDATERETURN.ok === true) {
                  counter += 1;
                  adp.echoLog(`Changed from [${originalSignum}] to [${user.signum}]`, null, 200, packName);
                } else {
                  const obj = {
                    database: 'dataBase',
                    toUpdate: user,
                    databaseAnswer: UPDATERETURN,
                  };
                  adp.echoLog(`Something is not clear in [ adpModel.update ]. Please, check [ ${originalSignum} ] manually.`, obj, 500, packName, true);
                }
              })
              .catch((ERROR) => {
                const obj = {
                  database: 'dataBase',
                  toUpdate: user,
                  error: ERROR,
                };
                adp.echoLog('Error in [ adpModel.update ]', obj, 500, packName, true);
                REJECT();
              }),
          );
        }
      });
      Promise.all(allPromises)
        .then(() => {
          if (counter === 0) {
            adp.echoLog('"signum.toLowerCase()" finished. Nothing was changed.', null, 200, packName);
          } else if (counter === 1) {
            adp.echoLog('"signum.toLowerCase()" finished. One user was changed.', null, 200, packName);
          } else {
            adp.echoLog(`"signum.toLowerCase()" finished. ${counter} users were changed.`, null, 200, packName);
          }
          RESOLVE();
        })
        .catch((ERROR) => {
          adp.echoLog('Error in [ Promise.all ]', { error: ERROR }, 500, packName, true);
          REJECT();
        });
    })
    .catch((ERROR) => {
      const obj = {
        database: 'dataBase',
        view: 'userView',
        error: ERROR,
      };
      adp.echoLog('Error in [ adpModel.indexUsers ]', obj, 500, packName, true);
      REJECT();
    });
});
// ============================================================================================= //
