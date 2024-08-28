// ============================================================================================= //
/**
* [ global.adp.notification.sendAssetMail ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (USR, ACTION, ASSET, OLDASSET) => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.notification.sendAssetMail';
  const errors = {
    promiseGotError: 'ERROR ::',
    missingKnownAction: 'The ACTION is a mandatory parameter',
    missingUser: 'The USR is a mandatory parameter',
    missingAsset: 'The ASSET is a mandatory parameter',
    userFromDatabaseError: 'Error on retrieve User from Database:',
  };
  if (USR === null || USR === undefined) {
    const err = `${errors.missingUser}`;
    REJECT(err);
    return;
  }
  if (ASSET === null || ASSET === undefined) {
    const err = `${errors.missingAsset}`;
    REJECT(err);
    return;
  }

  const anyDirtyNotifyFields = NOTIFYFIELDS => NOTIFYFIELDS.filter(
    FIELDINFO => FIELDINFO.dirty,
  ).length > 0;

  /**
   * Admin specific change detection for notification
   * @param {object} OLDMS ms object data before save
   * @param {object} NEWMS ms data after save
   * @returns {Array} list of admin notification specific properties with
   * flags indicating if they are dirty or not
   */
  const getNotifyFields = (OLDMS, NEWMS) => {
    const schema = global.adp.config.schema.microservice;
    const notifyFields = [];
    Object.keys(schema.properties).forEach((FIELDNAME) => {
      const field = schema.properties[FIELDNAME];
      if (field.notify_admin_on_change) {
        if (!OLDMS) {
          notifyFields.push({
            slug: FIELDNAME,
            field,
            dirty: true,
          });
        } else {
          notifyFields.push({
            slug: FIELDNAME,
            field,
            dirty: OLDMS[FIELDNAME] !== NEWMS[FIELDNAME],
          });
        }
      }
    });
    return notifyFields;
  };
  const notifyFieldList = getNotifyFields(OLDASSET, ASSET);


  // ------------------------------------------------------------------------------------------- //
  const startToSendAssetMail = (USER) => {
  // ------------------------------------------------------------------------------------------- //
    const thisAction = `${ACTION}`.trim().toLowerCase();
    const mailObject = {
      usr: USER,
      action: thisAction,
      mailTimer: timer,
      asset: ASSET,
      oldAsset: OLDASSET,
      notifyFields: notifyFieldList,
      enableHighlight: true,
      senderMail: 'adp.portal.mailer@ericsson.com',
      recipientsMail: '',
      ccMail: [],
      mailSchema: '',
      assetData: {},
      assetHTML: '',
      subject: '',
      messageText: '',
      messageHTML: '',
    };

    /**
     * This function is used to check if the domain of service is changed
     * @returns {boolean} true if domain is changed else false;
     * @author Omkar
     */
    const isDomainChanged = () => {
      const domainFieldNotify = notifyFieldList.filter(field => field.slug === 'domain');
      if (domainFieldNotify.length === 1 && domainFieldNotify[0].dirty) {
        mailObject.notifyFields = [domainFieldNotify[0]];
        return true;
      }
      return false;
    };

    switch (thisAction) {
      case 'create':
      case 'delete':
        mailObject.enableHighlight = thisAction === 'create';
        global.adp.notification.getRecipients(mailObject)
          .then(mailObjectReturn => global.adp.notification.buildMailSchema(mailObjectReturn))
          .then(mailObjectReturn => global.adp.notification.buildAssetData(mailObjectReturn))
          .then(mailObjectReturn => global.adp.notification.buildAssetHTML(mailObjectReturn))
          .then(mailObjectReturn => global.adp.notification.sendMail(mailObjectReturn))
          .then(RESOLVE)
          .catch((ERR) => {
            adp.echoLog('Error in [ Delete Promise Chain ]', { error: ERR }, 500, packName, true);
            const err = `${errors.promiseGotError} ${ERR}`;
            REJECT(err);
          });
        break;
      case 'update':
        if (!anyDirtyNotifyFields(notifyFieldList)) {
          mailObject.enableHighlight = false;
        }
        global.adp.notification.getRecipients(mailObject)
          .then(mailObjectReturn => global.adp.notification.buildMailSchema(mailObjectReturn))
          .then(mailObjReturn => global.adp.notification.buildAssetUpdateData(mailObjReturn))
          .then(mailObjectReturn => global.adp.notification.buildAssetHTML(mailObjectReturn))
          .then(mailObjectReturn => global.adp.notification.sendMail(mailObjectReturn))
          .then(RESOLVE)
          .catch((ERR) => {
            adp.echoLog('Error in [ Update Promise Chain ]', { error: ERR }, 500, packName, true);
            const err = `${errors.promiseGotError} ${ERR}`;
            REJECT(err);
          });
        break;
      case 'changedomainnotify':
        if (isDomainChanged()) {
          global.adp.notification.getRecipients(mailObject)
            .then(mailObjectReturn => global.adp.notification.buildMailSchema(mailObjectReturn))
            .then(mailObjReturn => global.adp.notification.buildAssetAdminUpdateData(mailObjReturn))
            .then(mailObjReturn => global.adp.notification.buildAssetHTML(mailObjReturn))
            .then(mailObjectReturn => global.adp.notification.sendMail(mailObjectReturn))
            .then(RESOLVE)
            .catch((ERR) => {
              adp.echoLog('Error in [ Change Domain Notify Promise Chain ]', { error: ERR }, 500, packName, true);
              const err = `${errors.promiseGotError} ${ERR}`;
              REJECT(err);
            });
        } else {
          RESOLVE();
        }
        break;
      default:
        REJECT(errors.missingKnownAction);
        break;
    }
  // ------------------------------------------------------------------------------------------- //
  };
  // ------------------------------------------------------------------------------------------- //
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
          startToSendAssetMail(user);
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
      adp.echoLog('Error in [ adp.user.read ] from [ startToSendAssetMail ]', obj, 500, packName, true);
      const err = `${errors.userFromDatabaseError} ${ERR}`;
      REJECT(err);
    });
});
// ============================================================================================= //
