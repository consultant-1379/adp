// ============================================================================================= //
/**
* [ cs.clearOldData ]
* @author Armando Dias [zdiaarm]
*
* Clear from database registers with more than one year.
*/
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const packName = 'cs.clearOldData';
  const now = new Date();
  const dbModelGitstatus = new adp.models.Gitstatus(cs.mode);
  const lastYearObject = (new Date((now).setFullYear((now).getFullYear() - 1)));
  const lastYear = adp.dateLogSystemFormat(lastYearObject).simple;
  const alreadyDeleted = [];
  dbModelGitstatus.getAssetOlderThanSpecificDate(lastYear)
    .then((RESULTS) => {
      const toDestroy = RESULTS.docs;
      let index = -1;
      const limit = toDestroy.length;
      const destroyItNow = () => {
        index += 1;
        if (index >= limit) {
          RESOLVE();
          return;
        }
        const thisID = toDestroy[index]._id;
        const thisRev = toDestroy[index]._rev;
        const thisDate = toDestroy[index].date;
        const thisSlug = toDestroy[index].asset_slug;
        dbModelGitstatus.deleteOne(thisID, thisRev)
          .then(() => {
            adp.fullClearLog.push(`${thisID} - [ ${thisSlug} ] deleted.`);
            if (!alreadyDeleted.includes(thisDate)) {
              alreadyDeleted.push(thisDate);
              adp.echoLog(`Register at [ ${thisDate} ] deleted.`);
            }
            destroyItNow();
          })
          .catch((ERROR) => {
            const errorText = 'Error on [ dbModelGitstatus.deleteOne ]';
            const errorOBJ = {
              database: 'dataBaseGitStatus',
              id: thisID,
              rev: thisRev,
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            destroyItNow();
          });
      };
      destroyItNow();
    })
    .catch((ERROR) => {
      const errorText = 'Error on [ dbModelGitstatus.getByQuery ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
