// ============================================================================================= //
/**
* [ adp.comments.CommentsClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./../library/utils/constants');
// ============================================================================================= //
class CommentsClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.comments.CommentsClass';
  }


  /**
   * [ Public ] getComment
   * Retrieve all comments (not soft-deleted) from
   * a specific location.
   * @param {Object} REQUEST The Request Object.
   * @returns a Promise. Resolves if is successful
   *          or rejects if fails.
   * @author Armando Dias [zdiaarm]
   */
  getComment(REQUEST) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const user = await this._extractUser(REQUEST);
        const { signum } = user;
        const parameters = await this._extractGetParameters(REQUEST);
        const idProperties = parameters.location_id.split('_');
        await this._checkType(idProperties[0]);
        await this._checkId(idProperties[0], idProperties[1], signum, REQUEST.rbac);
        const modelComment = new adp.models.Comments();
        modelComment.getCommentsByLocationID(parameters.location_id)
          .then((DBResult) => {
            if (DBResult && DBResult.docs) {
              const result = {
                code: 200,
                message: `Comments from ${parameters.location_id}`,
                resultsReturned: DBResult.resultsReturned,
                limitOfThisResult: DBResult.limitOfThisResult,
                offsetOfThisResult: DBResult.offsetOfThisResult,
                time: DBResult.time,
                docs: DBResult.docs,
              };
              RESOLVE(result);
            } else {
              const errorCode = 500;
              const errorMessage = HTTP_STATUS['500'];
              const errorObject = {
                error: 'Database Error',
                location_id: parameters.location_id,
                returnFromDatabase: DBResult,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'get', this.packName));
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = { error: ERROR };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'get', this.packName));
          });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
        const errorObject = { error: ERROR };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'get', this.packName));
      }
    });
  }

  /**
   * [ Public ] postComment
   * Creates a new comment.
   * @param {Object} BODYREQUEST The body Request Object.
   * @param {Object} USERREQUEST The user Request Object.
   * @param {Object} RBAC The rbac Object.
   * @returns a Promise. Resolves if is successful
   *          or rejects if fails.
   * @author Armando Dias [zdiaarm]
   */
  postComment(BODYREQUEST, USERREQUEST, RBAC) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const { signum } = USERREQUEST;
        const idProperties = BODYREQUEST
          && BODYREQUEST.location_id
          ? BODYREQUEST.location_id.split('_')
          : [];
        await this._checkType(idProperties[0]);
        await this._checkId(idProperties[0], idProperties[1], signum, RBAC);
        const now = new Date();
        const postObject = {
          location_id: BODYREQUEST.location_id,
          location_title: BODYREQUEST.location_title,
          location_page: BODYREQUEST.location_page,
          location_author: BODYREQUEST.location_author,
          location_email: BODYREQUEST.location_email,
          location_signum: BODYREQUEST.location_signum,
          location_type: idProperties[0],
          location_ms: {
            ms_id: idProperties[1],
            ms_page: idProperties[2],
          },
          dt_create: now,
          dt_last_update: now,
          signum: USERREQUEST.signum,
          nm_author: USERREQUEST.name,
          nm_email: USERREQUEST.email,
          desc_comment: this._sanitizeHTML(BODYREQUEST.comment_text),
        };
        const modelComment = new adp.models.Comments();
        modelComment.createComment(postObject)
          .then((DBResult) => {
            if (DBResult && DBResult.ok === true) {
              const result = {
                code: 200,
                message: 'Comment created successful',
                BODYREQUEST,
              };
              RESOLVE(result);
              //  Email notification for add comment
              this._sendCommentsNotification(DBResult.id, USERREQUEST, 'add');
            } else {
              const errorCode = 500;
              const errorMessage = HTTP_STATUS['500'];
              const errorObject = {
                error: 'Database Error',
                objectToCreate: postObject,
                returnFromDatabase: DBResult,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'post', this.packName));
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = ERROR && ERROR.data ? ERROR.data : { error: ERROR };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'post', this.packName));
          });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
        const errorObject = ERROR && ERROR.data ? ERROR.data : { error: ERROR };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'post', this.packName));
      }
    });
  }


  /**
   * [ Public ] putComment
   * Updates a specific comment.
   * The User Request should be owner
   * of the comment or it will fail.
   * @param {Object} BODYREQUEST The body Request Object.
   * @param {Object} USERREQUEST The user Request Object.
   * @returns a Promise. Resolves if is successful
   *          or rejects if fails.
   * @author Armando Dias [zdiaarm]
   */
  putComment(BODYREQUEST, USERREQUEST) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const modelComment = new adp.models.Comments();
        modelComment.updateComment(
          BODYREQUEST.comment_id,
          this._sanitizeHTML(BODYREQUEST.comment_text),
          USERREQUEST.signum,
        )
          .then((DBResult) => {
            if (DBResult && DBResult.ok === true) {
              const result = {
                code: 200,
                message: 'Comment updated successful',
                BODYREQUEST,
              };
              RESOLVE(result);
              // Email notification for update comment
              this._sendCommentsNotification(BODYREQUEST.comment_id, USERREQUEST, 'update');
            } else {
              const errorCode = DBResult && DBResult.code ? DBResult.code : 500;
              const errorMessage = DBResult && DBResult.desc ? DBResult.desc : HTTP_STATUS['500'];
              const errorObject = DBResult && DBResult.data ? DBResult.data : { DBResult };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'put', this.packName));
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = { error: ERROR };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'put', this.packName));
          });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
        const errorObject = { error: ERROR };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'put', this.packName));
      }
    });
  }


  /**
   * [ Public ] deleteComment
   * Soft-deletes a specific comment.
   * The User Request should be owner
   * of the comment or it will fail.
   * @param {Object} BODYREQUEST The body Request Object.
   * @param {Object} USERREQUEST The user Request Object.
   * @returns a Promise. Resolves if is successful
   *          or rejects if fails.
   * @author Armando Dias [zdiaarm]
   */
  deleteComment(BODYREQUEST, USERREQUEST) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const modelComment = new adp.models.Comments();
        modelComment.deleteComment(BODYREQUEST.comment_id, USERREQUEST.signum)
          .then((DBResult) => {
            if (DBResult && DBResult.ok === true) {
              const result = {
                code: 200,
                message: 'Comment successful deleted',
                BODYREQUEST,
              };
              RESOLVE(result);
              // Email notification for delete comment
              this._sendCommentsNotification(BODYREQUEST.comment_id, USERREQUEST, 'delete');
            } else {
              const errorCode = DBResult && DBResult.code ? DBResult.code : 500;
              const errorMessage = DBResult && DBResult.desc ? DBResult.desc : HTTP_STATUS['500'];
              const errorObject = DBResult && DBResult.data ? DBResult.data : { DBResult };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'delete', this.packName));
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = ERROR && ERROR.data ? ERROR.data : { ERROR };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'delete', this.packName));
          });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
        const errorObject = ERROR && ERROR.data ? ERROR.data : { ERROR };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'delete', this.packName));
      }
    });
  }


  /**
   * [ Public ] resolveComment
   * Resolves a specific comment.
   * The User Request should be owner
   * of the content or it will fail.
   * @param {Object} BODYREQUEST The body Request Object.
   * @param {Object} USERREQUEST The user Request Object.
   * @returns a Promise. Resolves if is successful
   *          or rejects if fails.
   * @author Rinosh Cherian [zcherin]
   */
  resolveComment(BODYREQUEST, USERREQUEST) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const modelComment = new adp.models.Comments();
        modelComment.resolveComment(
          BODYREQUEST.comment_id,
          this._sanitizeHTML(BODYREQUEST.resolve_text),
          USERREQUEST,
        )
          .then(async (DBResult) => {
            if (DBResult && DBResult.ok === true) {
              const result = {
                code: 200,
                message: 'Comment resolved successful',
                BODYREQUEST,
              };
              RESOLVE(result);
              // Email notification for resolve comment
              this._sendCommentsNotification(BODYREQUEST.comment_id, USERREQUEST, 'resolve');
            } else {
              const errorCode = DBResult && DBResult.code ? DBResult.code : 500;
              const errorMessage = DBResult && DBResult.desc ? DBResult.desc : HTTP_STATUS['500'];
              const errorObject = DBResult && DBResult.data ? DBResult.data : { DBResult };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'resolve', this.packName));
            }
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = { error: ERROR };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'resolve', this.packName));
          });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
        const errorObject = { error: ERROR };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'resolve', this.packName));
      }
    });
  }

  /**
   * [ Private ] _extractUser
   * Extract the user from REQUEST object.
   * @param {Object} REQUEST The Request Object.
   * @returns a Promise. Resolves if is valid
   *          ( with the parameters inside )
   *          or rejects if is invalid.
   * @author Armando Dias [zdiaarm]
   */
  _extractUser(REQUEST) {
    return new Promise((RESOLVE) => {
      const signum = REQUEST
        && REQUEST.userRequest
        && REQUEST.userRequest.signum
        ? REQUEST.userRequest.signum
        : '';
      const name = REQUEST
        && REQUEST.userRequest
        && REQUEST.userRequest.name
        ? REQUEST.userRequest.name
        : '';
      const email = REQUEST
        && REQUEST.userRequest
        && REQUEST.userRequest.email
        ? REQUEST.userRequest.email
        : '';
      const userResult = {
        signum,
        name,
        email,
      };
      return RESOLVE(userResult);
    });
  }


  /**
   * [ Private ] _extractGetParameters
   * Extract the parameters for reading.
   * @param {Object} REQUEST The Request Object.
   * @returns a Promise. Resolves if is valid
   *          ( with the parameters inside )
   *          or rejects if is invalid.
   * @author Armando Dias [zdiaarm]
   */
  _extractGetParameters(REQUEST) {
    return new Promise((RESOLVE, REJECT) => {
      if (!REQUEST || (REQUEST && (!REQUEST.body && !REQUEST.params && !REQUEST.query))) {
        const errorCode = 400;
        const errorMessage = 'Bad Request';
        const errorObject = {
          errorRequest: !REQUEST ? 'The request is null/undefined' : undefined,
          errorRequestBody: REQUEST && !REQUEST.body ? 'The body of request is null/undefined' : undefined,
          errorRequestParams: REQUEST && !REQUEST.params ? 'The params of request is null/undefined' : undefined,
          errorRequestQuery: REQUEST && !REQUEST.query ? 'The query of request is null/undefined' : undefined,
        };
        return REJECT(errorLog(errorCode, errorMessage, errorObject, '_extractGetParameters', this.packName));
      }

      const bodyCheck = REQUEST && REQUEST.body && REQUEST.body.location_id;
      const paramsCheck = REQUEST && REQUEST.params && REQUEST.params.location_id;
      const queryCheck = REQUEST && REQUEST.query && REQUEST.query.location_id;

      if (!bodyCheck && !paramsCheck && !queryCheck) {
        const errorCode = 400;
        const errorMessage = 'Bad Request';
        const errorObject = {
          errorLocationIdOnBody: ERROR_MESSAGES.ERROR_LOCATION_ID,
          errorLocationIdOnParams: ERROR_MESSAGES.ERROR_LOCATION_ID,
          errorLocationIdOnQuery: ERROR_MESSAGES.ERROR_LOCATION_ID,
        };
        return REJECT(errorLog(errorCode, errorMessage, errorObject, '_extractGetParameters', this.packName));
      }

      const parameters = {};
      if (bodyCheck) parameters.location_id = REQUEST.body.location_id;
      if (paramsCheck) parameters.location_id = REQUEST.params.location_id;
      if (queryCheck) parameters.location_id = REQUEST.query.location_id;
      return RESOLVE(parameters);
    });
  }


  /**
   * [ Private ] _checkType
   * Checks if the type is correct.
   * For the first story, only "ms" is valid.
   * @param {String} TYPE The Location ID Type.
   * @returns a Promise. Resolves if is valid or
   *          rejects if is invalid.
   * @author Armando Dias [zdiaarm]
   */
  _checkType(TYPE) {
    return new Promise((RESOLVE, REJECT) => {
      const type = (`${TYPE}`).toLowerCase().trim();
      if (type === 'ms'
        || type === 'msdocumentation'
        || type === 'article'
        || type === 'tutorial') {
        return RESOLVE({ type, is_valid: true });
      }
      const errorCode = 400;
      const errorMessage = 'Bad Request';
      const errorObject = { type: TYPE, is_valid: false };
      return REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkType', this.packName));
    });
  }


  /**
   * [ Private ] _checkId
   * Redirects the ID check to _checkMsId in
   * case of TYPE to be 'ms' or 'msdocumentation';
   * Although, in case TYPE is 'article' or
   * 'tutorial' redirects to _checkWpId;
   * @param {String} ID The ID.
   * @param {String} SIGNUM The User ID from who
   *                        made this request.
   * @param {Object} RBAC The RBAC Object for the
   *                      user who made this request.
   * @returns Promise. The value of _checkMsId or
   *          _checkWpId. Case TYPE is invalid,
   *          returns an error.
   * @author Armando Dias [zdiaarm]
   */
  _checkId(TYPE, ID, SIGNUM, RBAC) {
    const type = TYPE.toLowerCase().trim();
    if (type === 'ms' || type === 'msdocumentation') {
      return this._checkMsId(ID, SIGNUM, RBAC);
    }
    if (type === 'article' || type === 'tutorial') {
      return this._checkWpId(type, ID, SIGNUM, RBAC);
    }
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    const errorObject = { id: ID, is_valid: false };
    return new Promise((RES, REJ) => REJ(errorLog(errorCode, errorMessage, errorObject, '_checkId', this.packName)));
  }


  /**
   * [ Private ] _checkMsId
   * Checks if the Microservice ID is valid.
   * - If the user is Super Admin, we have to check if
   *   the id is valid into the database.
   * - If the user is not a Super Admin, we check if
   *   this user has permission into RBAC Object.
   * @param {String} MSID The Microservice ID.
   * @param {String} SIGNUM The User ID from who
   *                        made this request.
   * @param {Object} RBAC The RBAC Object for the
   *                      user who made this request.
   * @returns a Promise. Resolves if MSID is valid or
   *          rejects if MSID is invalid.
   * @author Armando Dias [zdiaarm]
   */
  _checkMsId(MSID, SIGNUM, RBAC) {
    if (!RBAC || !RBAC[SIGNUM]) {
      const errorCode = 400;
      const errorMessage = 'Bad Request';
      const errorObject = { ms_id: MSID, is_valid: false };
      return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkMsId', this.packName)));
    }
    if (RBAC[SIGNUM].admin === true) {
      return new Promise((RESOLVE, REJECT) => {
        const adpModel = new adp.models.Adp();
        adpModel.getById(MSID)
          .then((RESULT) => {
            if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
              return RESOLVE({ ms_id: MSID, is_valid: true });
            }
            const errorCode = 400;
            const errorMessage = 'Bad Request';
            const errorObject = { ms_id: MSID, is_valid: false };
            return REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkMsId', this.packName));
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = { error: ERROR };
            return REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkMsId', this.packName));
          });
      });
    }
    if (RBAC[SIGNUM].admin === false && RBAC[SIGNUM].allowed && RBAC[SIGNUM].allowed.assets) {
      if (RBAC[SIGNUM].allowed.assets.includes(MSID)) {
        return new Promise(RESOLVE => RESOLVE({ ms_id: MSID, is_valid: true }));
      }
    }
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    const errorObject = { ms_id: MSID, is_valid: false };
    return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkMsId', this.packName)));
  }


  /**
   * [ Private ] _checkWpId
   * Checks if the WPID is valid.
   * - If the user is Super Admin, we have to check if
   *   the wpid is valid into the []...].
   * - If the user is not a Super Admin, we check if
   *   this user has permission into RBAC Object.
   * @param {String} TYPE The object type of the WPID.
   * @param {String} WPID The Wordpress ID.
   * @param {String} SIGNUM The User ID from who
   *                        made this request.
   * @param {Object} RBAC The RBAC Object for the
   *                      user who made this request.
   * @returns a Promise. Resolves if WPID is valid or
   *          rejects if WPID is invalid.
   * @author Armando Dias [zdiaarm]
   */
  _checkWpId(TYPE, WPID, SIGNUM, RBAC) {
    if (!RBAC || !RBAC[SIGNUM]) {
      const errorCode = 400;
      const errorMessage = 'Bad Request';
      const errorObject = { wp_id: WPID, is_valid: false };
      return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkWpId', this.packName)));
    }
    let objectType = 'page'; // page (in WP) === article (in BackEnd)
    if (TYPE === 'tutorial') {
      objectType = 'tutorials'; // tutorials (in WP) === tutorial (in Backend)
    }
    const wpid = (`${WPID}`).toLowerCase().trim();
    if (RBAC[SIGNUM].admin === true) {
      return new Promise((RESOLVE, REJECT) => {
        adp.wordpress.getMenus()
          .then((WPMENU) => {
            let found = false;
            if (WPMENU && WPMENU.menus) {
              Object.keys(WPMENU.menus).forEach((MENUGROUP) => {
                if (!found) {
                  const menuGroup = WPMENU.menus[MENUGROUP];
                  menuGroup.items.forEach((MENUITEM) => {
                    const menuItem = MENUITEM;
                    if (`${menuItem.object_id}` === wpid
                      && `${menuItem.object}` === objectType) {
                      found = true;
                    }
                  });
                }
              });
            }
            if (found) {
              return RESOLVE({ wp_id: WPID, type: objectType, is_valid: true });
            }
            const errorCode = 400;
            const errorMessage = 'Bad Request';
            const errorObject = { wp_id: WPID, type: objectType, is_valid: false };
            return REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkWpId', this.packName));
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
            const errorObject = { error: ERROR };
            return REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkWpId', this.packName));
          });
      });
    }
    if (RBAC[SIGNUM].admin === false && RBAC[SIGNUM].allowed && RBAC[SIGNUM].allowed.contents) {
      if (RBAC[SIGNUM].allowed.contents.includes(`${WPID}`)) {
        return new Promise(RESOLVE => RESOLVE({ wp_id: WPID, is_valid: true }));
      }
    }
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    const errorObject = { wp_id: WPID, is_valid: false };
    return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, '_checkWpId', this.packName)));
  }


  /**
   * [ Private ] _sendCommentsNotification
   * Email notification for add / update / resolve / delete comment.
   * @param {string} COMMENTID The comment id.
   * @param {Object} USERREQUEST The user Request Object.
   * @param {string} ACTION The user action.
   * @author Rinosh Cherian [zcherin]
   */
  _sendCommentsNotification(COMMENTID, USERREQUEST, ACTION) {
    const now = new Date();
    const modelComment = new adp.models.Comments();
    modelComment.getCommentsByCommentID(COMMENTID)
      .then((Result) => {
        if (Result && Result.docs && Result.docs.length) {
          global.adp.notification.sendCommentsMail(USERREQUEST, ACTION, Result.docs[0])
            .then(() => {
              const endTimer = new Date();
              adp.echoLog(`comment "${COMMENTID}" ${ACTION}ed by "${USERREQUEST.signum}" in ${endTimer.getTime() - now.getTime()}ms`, null, 200, this.packName);
            })
            .catch((ERR) => {
              adp.echoLog('Error in [ adp.notification.sendCommentsMail ]', ERR, 500, this.packName, true);
            });
        }
      });
  }


  /**
   * [ Private ] _sanitizeHTML
   * Uses a 3PP ( "sanitize-html" loaded
   * in global.sanitizeHtml ) to remove
   * undesired HTML tags.
   * @param {String} ORIGINAL The Original Comment.
   * @returns Sring with the sanitized HTML of the Comment.
   * @author Armando Dias [zdiaarm]
   */
  _sanitizeHTML(ORIGINAL) {
    const cleanText = global.sanitizeHtml(ORIGINAL, {
      allowedTags: ['b', 'i', 'em', 'strong'],
    });
    return cleanText;
  }
}
// ============================================================================================= //
module.exports = CommentsClass;
// ============================================================================================= //
