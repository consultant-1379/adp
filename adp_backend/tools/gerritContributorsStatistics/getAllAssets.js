// ============================================================================================= //
/**
* [ cs.getAllAssets ]
* @author Armando Dias [zdiaarm]
*
* Retrieve all assets from database and prepare the ones
* which the giturl is not empty or null.
*/
// ============================================================================================= //
module.exports = (SELECTEDASSET = null) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const dbModelAdplog = new adp.models.AdpLog();
  const dbModelAdp = new adp.models.Adp();
  const packName = 'cs.getAllAssets';
  const allAssets = {};
  const allAssetsIDs = [];
  let index = -1;
  let quantResultsFromDatabase = 0;
  let quantResultsWithGit = 0;
  let quantResultsWithoutGit = 0;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const assetHistory = () => {
    index += 1;
    if (index > (allAssetsIDs.length - 1)) {
      const gitObject = {
        totalAssetsFromDatabase: quantResultsFromDatabase,
        totalAssetsWithGitURL: quantResultsWithGit,
        totalAssetsWithoutGitURL: quantResultsWithoutGit,
        totalTime: cs.executionTimer(),
      };
      cs.gitLog('[ allAssets Script ] done!', gitObject, 200, packName);
      adp.echoDivider();
      RESOLVE(allAssets);
      return;
    }
    const key = allAssetsIDs[index];
    dbModelAdplog.getAssetHistory(key)
      .then((RESULT) => {
        if (Array.isArray(RESULT.docs) && (RESULT.docs.length > 0)) {
          const changes = RESULT.docs;
          changes.forEach((ITEM) => {
            const preNew = ITEM.new !== undefined
              && ITEM.new.giturl !== undefined
              && ITEM.new.giturl !== null
              && ITEM.new.giturl !== '';
            const newURLStatus = (`${(preNew ? ITEM.new.giturl : '')}`).trim().length > 0;
            const preOld = ITEM.old !== undefined
              && ITEM.old.giturl !== undefined
              && ITEM.old.giturl !== null
              && ITEM.old.giturl !== '';
            const oldURLStatus = (`${(preOld ? ITEM.old.giturl : '')}`).trim().length > 0;
            const alreadyFound = allAssets[key].urlSince !== undefined;
            if (newURLStatus && !oldURLStatus && !alreadyFound) {
              allAssets[key].urlSince = (`${adp.dateLogSystemFormat(new Date(ITEM.datetime)).simple}`);
            }
          });
        }
        assetHistory();
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ dbModelAdplog.getAssetHistory ] at [ assetHistory ]';
        const errorOBJ = {
          database: 'dataBase',
          query: key,
          error: ERROR,
        };
        cs.gitLog(errorText, errorOBJ, 500, packName);
        REJECT(ERROR);
      });
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  dbModelAdp.getAssetByIDorSLUG(SELECTEDASSET)
    .then((RESULT) => {
      const assets = RESULT.docs;
      if (Array.isArray(assets) && assets.length === 0) {
        const errorText = 'No Assets were found';
        let errorObj = {
          parameter: SELECTEDASSET,
          ERROR: 'Return from database is empty. Or the database is empty or the parameter is incorrect.',
        };
        errorObj = JSON.parse(JSON.stringify(errorObj).replace(/\$/gim, ''));
        cs.gitLog(errorText, errorObj, 400, packName);
        REJECT(errorObj);
      } else {
        quantResultsFromDatabase = assets.length;
        assets.forEach((ASSET) => {
          if (ASSET.giturl !== undefined && ASSET.giturl !== null) {
            allAssets[ASSET._id] = { _id: ASSET._id, slug: ASSET.slug, giturl: ASSET.giturl };
            quantResultsWithGit += 1;
            allAssetsIDs.push(ASSET._id);
          } else {
            quantResultsWithoutGit += 1;
            const logError = {
              asset_id: ASSET._id,
              asset_slug: ASSET.slug,
              asset_giturl: `${ASSET.giturl}`,
              extracted_name: null,
              mode_detected: null,
              api_url: null,
              log_date: (new Date()),
              desc: 'The field giturl is empty.',
            };
            adp.fullLog.push(logError);
            cs.logDetails('The field giturl is empty');
            cs.gitLog('Asset doesn\'t have valid giturl (It\'s empty)', logError, 400, packName);
          }
          cs.logDetails('Assets retrieved from database');
        });
        const gitLogObject = {
          processTime: `${((new Date()).getTime()) - timer}ms`,
          totalTime: cs.executionTimer(),
        };
        cs.gitLog('All Assets from database', gitLogObject, 200, packName);
        assetHistory();
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModelAdp.getAssetByIDorSLUG ]';
      const errorOBJ = {
        error: ERROR,
      };
      cs.gitLog(errorText, errorOBJ, 500, packName);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
