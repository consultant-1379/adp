// ============================================================================================= //
/**
* [ adp.middleware.rbac ]
* Function to be added on Express 3PP Endpoint declarations
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.middleware.rbac';
/**
 * This function is used to prepare error object in case of
 * validation  errors to be sent as response
 * @param {objct} RES Response object for endpoint
 * @param {number} CODE HTTP Error code
 * @param {string} MSG Error message
 * @param {datetime} timer start time for the operation
 * @author Armando
 */
const sendError = (RES, CODE, MSG, timer) => {
  adp.setHeaders(RES);
  const res = RES;
  res.statusCode = CODE;
  if (res.closed !== true) {
    const answer = new adp.Answers();
    answer.setCode(CODE);
    answer.setMessage(MSG);
    answer.setLimit(999999);
    answer.setTotal(1);
    answer.setPage(1);
    answer.setCache(undefined);
    answer.setData(undefined);
    answer.setTime((new Date()) - timer);
    res.end(answer.getAnswer());
  }
};

/**
 * This function is used to check if user is allowed to access
 * requested data, reject in case of restricted access
 * @param {object} NEXT Response NEXT object
 * @param {object} RBACRequest RBAC details of request
 * @param {object} RES Endpoint Response object
 * @param {string} signum of the user trying to access something
 * @param {string} role of user trying to access something
 * @param {datetime} timer stare time for the operation
 * @author Armando
 */
const validationAction = (NEXT, RBACRequest, RES, signum, role, timer) => {
  const rbac = new adp.middleware.RBACClass();
  const callBack = () => {
    NEXT();
  };
  rbac.processRBAC(RBACRequest, RES, callBack)
    .then((RESULT) => {
      if (RESULT === 403) {
        const errorText = 'User is not authorized to proceed';
        const errorOBJ = {
          message: 'Unauthorized', signum, role, timer: `${(new Date()) - timer}ms`,
        };
        adp.echoLog(errorText, errorOBJ, 403, packName, true);
        sendError(RES, 403, '403 Unauthorized', timer);
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error in [ rbac.processRBAC @ adp.rbac.MiddlewareClass ]';
      const errorOBJ = {
        error: ERROR,
        signum,
        role,
        timer: `${(new Date()) - timer}ms`,
      };
      errorLog(errorCode, errorMessage, errorOBJ, 'main', packName);
      sendError(RES, 500, 'Problem occurred while validating user permissions', timer);
    });
};

/**
 * Public Function which starts the process
 * @param {object} REQ Request object.
 * @param {object} RES Response object.
 * @param {object} NEXT NEXT object.
 * @param {object} FORCECONTENTONLY Ignores target if true.
 * Default value is false.
 * @author Armando
 */
module.exports = (REQ, RES, NEXT, FORCECONTENTONLY = false) => {
  const timer = new Date();
  const requestUserObject = REQ && REQ.user && REQ.user.docs
    ? REQ.user.docs[0] : null;

  const { role, signum } = requestUserObject != null
    ? requestUserObject : { role: null, signum: null };

  const RBACRequest = REQ;
  RBACRequest.userRequest = requestUserObject;
  RBACRequest.users = REQ.user;
  RBACRequest.rbacGroup = null;

  let extractedID = null;
  if (REQ && REQ.params && (REQ.params.id || REQ.params.msSlug)) {
    extractedID = REQ.params.id ? REQ.params.id : REQ.params.msSlug;
  } else if (REQ && REQ.query) {
    extractedID = REQ.query.asset ? REQ.query.asset : null;
  }
  if (extractedID === null) {
    const bodyAssetIDsArray = REQ && REQ.body && REQ.body.assets ? REQ.body.assets : null;
    if (Array.isArray(bodyAssetIDsArray) && bodyAssetIDsArray.length > 0) {
      extractedID = [];
      bodyAssetIDsArray.forEach((ITEM) => {
        if (ITEM && ITEM._id) {
          extractedID.push(ITEM._id);
        } else if (ITEM && ITEM.id) {
          extractedID.push(ITEM.id);
        } else {
          extractedID.push(ITEM);
        }
      });
    }
  }

  if (typeof extractedID === 'string' && !FORCECONTENTONLY) {
    RBACRequest.rbacTarget = [extractedID];
  } else if (Array.isArray(extractedID)) {
    RBACRequest.rbacTarget = extractedID;
  } else {
    RBACRequest.rbacTarget = [];
  }

  if (role === null || signum === null) {
    sendError(RES, 400, 'User not identified', timer);
    return;
  }

  if (Array.isArray(RBACRequest.rbacTarget) && RBACRequest.rbacTarget.length === 0) {
    validationAction(NEXT, RBACRequest, RES, signum, role, timer);
  } else {
    const dbModel = new adp.models.Adp();
    dbModel.getAssetByIDorSLUG(extractedID)
      .then((ANSWER) => {
        if (ANSWER && ANSWER.docs && ANSWER.docs[0]) {
          const theID = ANSWER.docs[0]._id;
          RBACRequest.rbacTarget = [theID];
        }
        validationAction(NEXT, RBACRequest, RES, signum, role, timer);
      })
      .catch((ERROR) => {
        const errorText = 'Caught an error in [ dbModel.getAssetByIDorSLUG @ adp.models.Adp ]';
        const errorObj = {
          parameters: REQ.params,
          error: ERROR,
        };
        adp.echoLog(errorText, errorObj, 500, packName);
        sendError(RES, 500, 'Problem occurred while reading assets by given parameters', timer);
      });
  }
};
// ============================================================================================= //
