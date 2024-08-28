// ============================================================================================= //
/**
* [ cs.preparations ]
* @author Armando Dias [zdiaarm]
*
* Load the basics from Backend to load the enviromment setup, databases, etc.
* Test if database exists, if is empty ( First run returns true ) or if
* contains data ( Incremental returns false ). If rejects, should
* make [ gerritContributorsStatistics/start.js ] finish the
* proccess with errors.
*/
// ============================================================================================= //
global.packageJson = require('../../package.json');
// ============================================================================================= //
module.exports = (SELECTEDASSET = null) => new Promise(async (RESOLVE, REJECT) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const packName = 'cs.preparations';
  await adp.timeStepStart();
  if (adp.db === null) {
    adp.db = {};
  }
  if (adp.db.start === undefined || adp.db.start === null) {
    adp.db.start = require('./../../src/db/start');
    await adp.setup.loadFromFile();
    await adp.db.start();
  }

  adp.echoDivider();
  adp.echoLog('[ contributorsStatistics URL Templates ]', null, 200);
  adp.echoLog(`gerritApi: [ ${adp.config.contributorsStatistics.gerritApi} ]`, null, 200);
  adp.echoLog(`gerritPotentialTag: [ ${adp.config.contributorsStatistics.gerritPotentialTag} ]`, null, 200);
  adp.echoLog(`gerritApiRevisionDetail: [ ${adp.config.contributorsStatistics.gerritApiRevisionDetail} ]`, null, 200);
  adp.echoDivider();

  if (SELECTEDASSET === null) {
    cs.gitLog(`[ ${global.version} Script ] started: All valid Assets...`, null, 200, packName);
  } else {
    cs.gitLog(`[ ${global.version} Script ] started: One Asset...`, { asset: SELECTEDASSET }, 200, packName);
  }

  adp.echoDivider();
  cs.gitLog('Team history process started', null, 200, packName);
  const dbModelGitstatus = new adp.models.Gitstatus();
  const teamHistoryContr = new adp.teamHistory.TeamHistoryController();
  const timer = (new Date()).getTime();
  await teamHistoryContr.fetchLatestSnapshotsAllMs().then((latestSnapshots) => {
    const { errors } = latestSnapshots;
    const errorCount = (errors ? errors.length : 0);
    const timeStampCode = (new Date()).getTime();
    const errorObj = { message: `Please, check 'Gitstatuslog' collection, where timeStampCode is: ${timeStampCode}` };
    const gitLogText = 'Team history process completed';
    const gitLogObject = {
      timeStampCode,
      time: (new Date()).getTime() - timer,
      quantErrors: errorCount,
      listErrors: errorObj,
    };
    cs.gitLog(gitLogText, gitLogObject, 200, packName);
  }).catch((errorLastestSnapshots) => {
    const errorText = 'Failure to update all teams snapshots';
    cs.gitLog(errorText, { error: errorLastestSnapshots }, 500, packName);
  });

  await dbModelGitstatus.getJustOneToCheckIfIsEmpty()
    .then((RESULT) => {
      if (RESULT.resultsReturned === 0) {
        adp.firstRun = true;
        cs.gitLog('Preparations Script done!', { status: 'Database was empty. First run!', totalTime: cs.executionTimer() }, 200, packName);
        adp.echoDivider();
        RESOLVE(true);
      } else {
        adp.firstRun = false;
        cs.gitLog('Preparations Script done!', { status: 'Database was not empty. Incremental action!', totalTime: cs.executionTimer() }, 200, packName);
        adp.echoDivider();
        RESOLVE(false);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error on [ dbModelGitstatus.getJustOneToCheckIfIsEmpty ]';
      const errorOBJ = {
        error: ERROR,

      };
      cs.gitLog(errorText, errorOBJ, 500, packName);
      REJECT();
    });
});
// ============================================================================================= //
