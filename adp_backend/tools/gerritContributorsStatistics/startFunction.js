// ============================================================================================= //
/**
* [ npm run gerritContributorsStatistics ]
* gerritContributorsStatistics/start.js
* @author Armando Dias [zdiaarm]
*
* Script to be called by Cron Task a few times per day. It will collect the Gerrit Statistics
* of each microservice ( if the "giturl" follow some rules ) and save it on database.
*/
// ============================================================================================= //
require('./loader');
// ============================================================================================= //
module.exports = (MODE = 'CLASSICMODE', SELECTEDASSET = null) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const packName = 'cs.start';
  global.version = 'gerritContributorsStatistics';
  adp.fullLogStart = (new Date());
  adp.fullLog = [];
  adp.fullSuccessLog = [];
  adp.fullLogDetails = {};
  cs.mode = MODE;
  cs.externalContributorsLogList = [];
  cs.externalContributorsLogObjectByAsset = {};
  cs.functionalUsersLogList = [];
  cs.UpdateUserDataLocalCacheArray = [];
  cs.preparations(SELECTEDASSET)
    .then(() => {
      cs.getAllAssets(SELECTEDASSET)
        .then((ALLASSETS) => {
          cs.getAllStats(ALLASSETS)
            .then(() => {
              adp.fullLogDetails['External Contributors'] = cs.externalContributorsLogList.length;
              adp.fullLogDetails['Functional Users'] = cs.functionalUsersLogList.length;
              cs.gitLog('Contributors Statistics Final Log', adp.fullLogDetails, 200, packName);
              let endLogLine = cs.finalTimerLine(timer, (new Date()).getTime());
              let modeDescription = 'all';
              if (typeof SELECTEDASSET === 'string') {
                modeDescription = SELECTEDASSET;
              }
              const adpLog = {
                type: 'gerritContributorsStatistics',
                mode: modeDescription,
                start: adp.fullLogStart,
                end: (new Date()),
                duration: endLogLine,
                info: adp.fullLogDetails,
                success: adp.fullSuccessLog,
                errors: adp.fullLog,
                externalContributorsList: cs.externalContributorsLogList,
                externalContributorsByAsset: cs.externalContributorsLogObjectByAsset,
                functionalUsersList: cs.functionalUsersLogList,
              };
              adpLog.info['Total Errors'] = adp.fullLog.length;
              const adpLogModel = new adp.models.AdpLog();
              const gitObject = {
                totalTime: cs.executionTimer(),
                fullLog: adpLog,
              };
              cs.gitLog('Process Finished', gitObject, 200, packName);

              adpLogModel.createOne(adpLog)
                .then(() => {
                  endLogLine = cs.finalTimerLine(timer, (new Date()).getTime());
                  cs.gitLog('adpLog entry created', { totalTime: endLogLine }, 200, packName);
                  RESOLVE(adpLog);
                  if (SELECTEDASSET === null) {
                    cs.cleanWrongCommits()
                      .then(() => {
                        endLogLine = cs.finalTimerLine(timer, (new Date()).getTime());
                        cs.gitLog('Cleaning process done!', { totalTime: endLogLine }, 200, packName);
                        RESOLVE(adpLog);
                      })
                      .catch((ERROR) => {
                        cs.gitLog('Error on [ cs.cleanWrongCommits ]', { error: ERROR }, 500, packName);
                        RESOLVE(adpLog);
                      });
                  }
                })
                .catch((ERROR) => {
                  endLogLine = cs.finalTimerLine(timer, (new Date()).getTime());
                  cs.gitLog('Catch an error on [ adpLogModel.createOne @ adp.models.AdpLog ]', { totalTime: endLogLine, error: ERROR }, 500, packName);
                  RESOLVE(adpLog);
                });
            })
            .catch((ERROR) => {
              cs.gitLog('Error on [ cs.getAllStats ]', { error: ERROR }, 500, packName);
              REJECT(ERROR);
            });
        })
        .catch((ERROR) => {
          cs.gitLog('Error on [ cs.getAllAssets ]', { error: ERROR }, 500, packName);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      cs.gitLog('Error on [ cs.preparations ]', { error: ERROR }, 500, packName);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
