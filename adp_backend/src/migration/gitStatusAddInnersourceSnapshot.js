const errorLog = require('../library/errorLog');
const echoLog = require('../library/echoLog');

const InnersourceUserHistoryContr = require('../innerSource/InnersourceUserHistory.controller');
const GitstatusModel = require('../models/Gitstatus');


/**
 * [adp.migration.gitStatusAddInnersourceSnapshot]
 * @param {object} gitStatusDoc the gitstatus document to update
 * @returns {Promise<object>} the update gitstatus document
 * @author Cein
 */
const packName = 'adp.migration.gitStatusAddInnersourceSnapshot';

/**
 * Adds an single innersourceSnapshot to a given gitStatus document for the related user at
 * that period of time
 * @param {object} gitStatusDoc the gitStatus document to update
 * @returns {Promise<object>} obj.updated {boolean} if the object requires to be updated
 * obj.updatedGitStatusDoc {object} the updated gitstatus document
 * @author Cein
 */
const joinSnapshot = async (gitStatusDoc) => {
  const respObj = { updated: false, updatedGitStatusDoc: { ...gitStatusDoc } };
  if (gitStatusDoc.innersourceSnapshot) {
    return respObj;
  }

  if (gitStatusDoc.user_id && gitStatusDoc.date) {
    const innerHistContr = new InnersourceUserHistoryContr();
    const { user_id: userId, date } = gitStatusDoc;

    return innerHistContr.getClosestSnapshot(userId, date).then((snapshot) => {
      respObj.updatedGitStatusDoc.innersourceUserHistorySnapshot = snapshot;
      respObj.updated = true;
      return respObj;
    }).catch(error => Promise.reject(errorLog(
      error.code || 500,
      error.desc || `Failure to fetch snapshot for user ${userId} near date ${date}.`,
      {
        error, userId, date, gitStatusDoc,
      },
      'joinSnapshot',
      packName,
    )));
  }

  const msg = 'Gitstatus commit structure Incorrect, missing key user_id';
  return Promise.reject(errorLog(
    500,
    'Gitstatus commit structure Incorrect, missing required key/s user_id and/or date.',
    { error: msg, gitStatusDoc },
    'joinSnapshot',
    packName,
  ));
};

/**
 * Update the gitstatus given collection document with the required
 * innersourceUserHistory Snapshot object
 * @param {object} gitStatusDoc the gitstatus document object to update
 * @returns {Promise<boolean>} true if successful
 * @author cein
 */
const updateGitStatusDoc = gitStatusDoc => joinSnapshot(gitStatusDoc)
  .then((joinSnapObj) => {
    if (joinSnapObj.updated) {
      const gitStatusModel = new GitstatusModel();
      return gitStatusModel.update(joinSnapObj.updatedGitStatusDoc).then((updateResp) => {
        if (updateResp.ok) {
          return updateResp;
        }
        const msg = 'Failure to update snapshot';
        return Promise.reject(errorLog(
          500,
          'Failure to update snapshot',
          {
            error: msg, joinSnapObj, gitStatusDoc, updateResp,
          },
          'updateGitStatusDoc',
          packName,
        ));
      }).catch(error => Promise.reject(errorLog(
        error.code || 500,
        error.desc || 'Failure to update snapshot',
        { error, joinSnapObj, gitStatusDoc },
        'updateGitStatusDoc',
        packName,
      )));
    }
    return true;
  }).catch(error => Promise.reject(errorLog(
    error.code || 500,
    error.desc || 'Failure to join the innersourceUserHistory object to the gitStatus document',
    { error, gitStatusDoc },
    'updateGitStatusDoc',
    packName,
  )));

/**
 * Fetch all gitStatus collection documents
 * @returns {Promise<array>} list of all gitStatus documents
 * @author Cein
 */
const indexGitstatus = () => {
  const gitStatusModel = new GitstatusModel();
  return gitStatusModel.index().then((indexResp) => {
    if (indexResp.docs && Array.isArray(indexResp.docs) && indexResp.docs.length) {
      return indexResp.docs;
    }
    const msg = 'GitStatus model failed to return any documentation';
    return Promise.reject(errorLog(
      500,
      msg,
      { error: msg },
      'main',
      packName,
    ));
  }).catch(error => Promise.reject(errorLog(
    500,
    'Failure to fetch all GitStatus documents',
    { error },
    'main',
    packName,
  )));
};

module.exports = () => {
  const timer = (new Date()).getTime();

  return indexGitstatus().then((gitStatDocs) => {
    const promiseArr = [];
    for (let gitIndex = 0; gitIndex < gitStatDocs.length; gitIndex += 1) {
      promiseArr.push(updateGitStatusDoc(gitStatDocs[gitIndex]));
    }

    if (promiseArr.length) {
      return Promise.all(promiseArr).then(() => {
        echoLog(`Successfully migrated ${gitStatDocs.length} Gitstatus documents with InnersourceSnapshots in ${(new Date()).getTime() - timer}ms`, null, 200, packName);
        return true;
      }).catch(error => Promise.reject(errorLog(
        500,
        'Failure update a gitStatus document',
        { error, promiseArr },
        'main',
        packName,
      )));
    }
    echoLog('Nothing to update during gitstatusAddInnersouceSnapshot migration', null, 200, packName);
    return true;
  }).catch(error => Promise.reject(errorLog(
    error.code || 500,
    error.desc || 'Failure to fetch all gitstatus documents',
    { error },
    'main',
    packName,
  )));
};
