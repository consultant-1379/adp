// ============================================================================================= //
/**
* [ adp.endpoints.rbac.preview ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.rbac.preview';
  const answer = new adp.Answers();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  /**
   * Sets the response object and answer class
   * @param {object} RESULTREQ request object
   * @param {object} RESULTRES resolve object
   * @author Armando
   */
  const myNextCallBack = (RESULTREQ, RESULTRES) => {
    const res = adp.setHeaders(RESULTRES);
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setData(RESULTREQ.rbac);
    answer.setLimit(999999);
    answer.setTotal(1);
    answer.setPage(1);
    answer.setSize(adp.getSizeInMemory(RESULTREQ.rbac));
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  /**
   * Builds the permission preview for a user
   * @param {object} USER containing the signum and role of the user performing the request
   * for the preview
   * @returns {promise<object>} obj.allowed {object} containing permission types and
   * their allowed ids
   * obj.preview {object} all permission objects in preview form
   * obj.track {object} all tracking steps
   * @author Armando
   */
  const action = async (USER) => {
    const {
      sourceUser, sourceGroup, target, preview, track, errorReason,
    } = await adp.rbac.previewRequest(REQ);
    const rbac = new adp.middleware.RBACClass(preview, track);
    if (sourceUser !== null && sourceGroup === null) {
      const previewREQ = {
        userRequest: REQ.user,
        users: {
          docs: sourceUser,
        },
        rbacGroup: null,
        rbacTarget: target,
      };
      rbac.processRBAC(previewREQ, RES, myNextCallBack)
        .then(() => {
          // Success processed inside of [ processRBAC @ adp.middleware.RBACClass ]
        })
        .catch(() => {
          // Error processed inside of [ processRBAC @ adp.middleware.RBACClass ]
        });
    } else if (sourceUser === null && sourceGroup !== null) {
      const previewREQ = {
        userRequest: REQ.user,
        users: null,
        rbacGroup: sourceGroup,
        rbacTarget: target,
      };
      rbac.processRBAC(previewREQ, RES, myNextCallBack)
        .then(() => {
          // Success processed inside of [ processRBAC @ adp.middleware.RBACClass ]
        })
        .catch(() => {
          // Error processed inside of [ processRBAC @ adp.middleware.RBACClass ]
        });
    } else {
      const res = adp.setHeaders(RES);
      answer.setCode(404);
      res.statusCode = 404;
      answer.setMessage('404 Not found');
      answer.setData(`Not found: ${errorReason}`);
      answer.setLimit(999999);
      answer.setTotal(1);
      answer.setPage(1);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const errorText = 'User(s)/Group ID(s) not found';
      const errorObject = {
        sourceUser,
        sourceGroup,
        target,
        preview,
        track,
        errorReason,
        requestedBody: REQ.body,
        requestedByUser: USER,
      };
      adp.echoLog(errorText, errorObject, 404, packName);
    }
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  await adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      action(USER);
    })
    .catch((ERROR) => {
      const res = adp.setHeaders(RES);
      answer.setCode(500);
      res.statusCode = 500;
      answer.setMessage('500 Internal Server Error');
      answer.setData('');
      answer.setLimit(999999);
      answer.setTotal(1);
      answer.setPage(1);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const errorText = 'Internal Server Error';
      const errorObject = {
        requestedBody: REQ.body,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
