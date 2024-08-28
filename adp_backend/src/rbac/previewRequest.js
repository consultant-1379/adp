// ============================================================================================= //
/**
* [ adp.rbac.previewRequest ]
* Check the JSON Body for Preview
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
const packName = 'adp.rbac.previewRequest';
// ============================================================================================= //
/**
 * Fetches user objects from a given list of user ids/signums
 * @param {array} ID list of user ids/signums
 * @returns {promise<array|null>} list of found user objects
 * if none are match null will be returned
 * @author Armando
 */
const checkSignum = (ID) => {
  let ids = ID;
  if (!Array.isArray(ids)) {
    ids = [ID];
  }
  const adpModel = new adp.models.Adp();
  return adpModel.getUsersById(ids, true)
    .then((RESULT) => {
      if (RESULT && RESULT.docs && RESULT.docs.length > 0) {
        const usersProfile = RESULT.docs;
        return usersProfile;
      }
      return null;
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error in [ adpModel.getUsersById @ adp.models.Adp ] at [ checkSignum ]';
      const errorObject = {
        ID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
      return Promise.reject(ERROR);
    });
};

// ============================================================================================= //
/**
 * Fetches all permission groups relating to a given list of user ids
 * @param {array} IDS list of group ids
 * @returns {promise<array>} list of groups objects
 * @author Armando
 */
const checkGroup = (IDS) => {
  let idsArray = IDS;
  if (!Array.isArray(idsArray)) {
    idsArray = [IDS];
  }
  const ids = [];
  idsArray.forEach((ID) => {
    ids.push(new adp.MongoObjectID(ID));
  });
  const rbacGroupsModel = new adp.models.RBACGroups();
  return rbacGroupsModel.getGroupByIds(ids)
    .then((RESULT) => {
      if (RESULT && RESULT.docs && RESULT.docs.length > 0) {
        const groups = RESULT.docs;
        return groups;
      }
      return null;
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error in [ rbacGroupsModel.getGroupById @ adp.models.RBACGroups ] at [ checkGroup ]';
      const errorObject = {
        IDS,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
      return Promise.reject(ERROR);
    });
};
// ============================================================================================= //
/**
 * Fetches list of allowed permission items
 * @param {object} REQ the request object, uses:
 * REQ.body.source {array<string>} list of user ids/signums to retrieve accessable items of
 * REQ.body.target {array<object>} list of target ids
 * REQ.body.preview {boolean} true to show a preview
 * REQ.body.track {boolean} true to track the process
 * @returns {object} obj.sourceUser {array} list of found user objects
 * obj.sourceUser {array} list of found user objects
 * obj.sourceGroup {array} list of all related permission group objects
 * obj.target {array} list of targets items, used to target specific items ids only
 * obj.preview {boolean} if the preview is set
 * obj.track {boolean} if true tracks each set of the permission evaluation process
 * obj.errorReason {string} any error message during processing
 * @author Armando
 */
module.exports = async (REQ) => {
  const checkSource = REQ && REQ.body && REQ.body.source ? REQ.body.source : undefined;
  const checkTarget = REQ && REQ.body && REQ.body.target ? REQ.body.target : undefined;
  let sourceUser = null;
  let sourceGroup = null;
  let target = (checkTarget === undefined || checkTarget === null) ? [] : checkTarget;
  if (!Array.isArray(target)) {
    target = [target];
  }
  try {
    sourceUser = await checkSignum(checkSource);
    if (sourceUser === null) {
      sourceGroup = await checkGroup(checkSource);
    }
  } catch (ERROR) {
    let errorReasonOnCatch = '';
    if (Array.isArray(REQ.body.source) && REQ.body.source.length > 1) {
      errorReasonOnCatch += `source ( ${REQ.body.source.toString()} ) not found as users or rbac group ids`;
    } else {
      errorReasonOnCatch += `source ( ${REQ.body.source.toString()} ) not found as user or rbac group id`;
    }
    return {
      sourceUser: [],
      sourceGroup: [],
      target: [],
      preview: null,
      track: null,
      errorReason: errorReasonOnCatch,
    };
  }
  const preview = REQ && REQ.body && REQ.body.preview ? REQ.body.preview : false;
  const track = REQ && REQ.body && REQ.body.track ? REQ.body.track : false;
  let errorReason = '';
  if (sourceUser === null) {
    if (Array.isArray(REQ.body.source) && REQ.body.source.length > 1) {
      errorReason += `source ( ${REQ.body.source.toString()} ) not found as users`;
    } else {
      errorReason += `source ( ${REQ.body.source.toString()} ) not found as user`;
    }
  }
  if (sourceGroup === null) {
    if (errorReason !== '') {
      errorReason += ' also ';
    }
    if (Array.isArray(REQ.body.source) && REQ.body.source.length > 1) {
      errorReason += `source ( ${REQ.body.source.toString()} ) not found as rbac group ids`;
    } else {
      errorReason += `source ( ${REQ.body.source.toString()} ) not found as rbac group id`;
    }
  }
  if (errorReason === '') {
    errorReason = undefined;
  } else {
    errorReason += '.';
  }
  return {
    sourceUser, sourceGroup, target, preview, track, errorReason,
  };
};
// ============================================================================================= //
