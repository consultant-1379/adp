// ============================================================================================= //
/**
* [ global.adp.notification.sendCommentsMail ]
* Send inline comments mail
* @author Varshini
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USR, ACTION, COMMENT) => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.notification.sendCommentsMail';
  const mailer = 'adp.portal.mailer@ericsson.com';
  const errors = {
    promiseGotError: 'ERROR ::',
    missingKnownAction: 'The ACTION is a mandatory parameter',
    missingUser: 'The USR is a mandatory parameter',
    missingComment: 'The COMMENT is a mandatory parameter',
    userFromDatabaseError: 'Error on retrieve User from Database:',
  };
  if (USR === null || USR === undefined) {
    const err = `${errors.missingUser}`;
    REJECT(err);
    return;
  }
  if (COMMENT === null || COMMENT === undefined) {
    const err = `${errors.missingComment}`;
    REJECT(err);
    return;
  }

  const startToSendCommentMail = (USER) => {
    const thisAction = `${ACTION}`.trim().toLowerCase();
    const mailObject = {
      usr: USER,
      action: thisAction,
      mailTimer: timer,
      comment: COMMENT,
      notifyFields: [],
      enableHighlight: true,
      senderMail: mailer,
      recipientsMail: COMMENT.location_email,
      ccMail: COMMENT.nm_email,
      mailSchema: '',
      assetData: {},
      assetHTML: '',
      subject: '',
      messageText: '',
      messageHTML: '',
    };

    switch (thisAction) {
      case 'add':
      case 'update':
      case 'delete':
      case 'resolve':
        global.adp.notification.buildCommentsHTML(mailObject)
          .then(mailObjectReturn => global.adp.notification.sendMail(mailObjectReturn))
          .then(RESOLVE)
          .catch((ERR) => {
            adp.echoLog(`Error in [ ${thisAction} Promise Chain ]`, { error: ERR }, 500, packName, true);
            const err = `${errors.promiseGotError} ${ERR}`;
            REJECT(err);
          });
        break;
      default:
        REJECT(errors.missingKnownAction);
        break;
    }
  };
  global.adp.user.read(USR.signum)
    .then((USER) => {
      const user = USER.docs;
      let findUser = false;
      if (Array.isArray(user)) {
        if (user.length === 1) {
          const theUser = {};
          theUser.signum = user[0].signum;
          theUser.name = user[0].name;
          theUser.email = user[0].email;
          theUser.role = user[0].role;
          findUser = true;
          startToSendCommentMail(user);
        }
      }
      if (!findUser) {
        const err = `${errors.userFromDatabaseError} ${USR.signum}`;
        adp.echoLog('Error in "findUser" value', err, 500, packName, true);
        REJECT(err);
      }
    })
    .catch((ERR) => {
      const obj = {
        signum: USR.signum,
        message: errors.userFromDatabaseError,
        error: ERR,
      };
      adp.echoLog('Error in [ adp.user.read ] from [ startToSendCommentMail ]', obj, 500, packName, true);
      const err = `${errors.userFromDatabaseError} ${ERR}`;
      REJECT(err);
    });
});
