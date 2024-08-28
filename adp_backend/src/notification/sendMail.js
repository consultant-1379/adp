// ============================================================================================= //
/**
* [ global.adp.notification.sendMail ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MAILOBJECT => new Promise((RESOLVE, REJECT) => {
  const dbModelAdplog = new adp.models.AdpLog();
  const packName = 'global.adp.notification.sendMail';
  const options = {
    url: global.adp.config.nodeMailer,
    form: {
      fromEmailAddress: MAILOBJECT.senderMail,
      toCsvMailList: MAILOBJECT.recipientsMail,
      ccMailList: MAILOBJECT.ccMail,
      subject: MAILOBJECT.subject,
      messageText: MAILOBJECT.messageText,
      messageHtml: MAILOBJECT.messageHTML,
    },
  };
  const callback = (ERROR, RESPONSE, BODY) => {
    if (!ERROR) {
      // Success
      if (RESPONSE.statusCode === 200) {
        RESOLVE(MAILOBJECT);
        const endTimer = (new Date()).getTime() - MAILOBJECT.mailTimer.getTime();
        const text = `Message from [ callback ]: Email successful sent in ${endTimer}ms`;
        const obj = {
          statusCode: RESPONSE.statusCode,
          body: BODY,
        };
        adp.echoLog(text, obj, 200, packName);
        const logObject = {
          type: 'email',
          datetime: new Date(),
          time: `${endTimer}ms`,
          signum: MAILOBJECT.usr[0].signum,
          role: MAILOBJECT.usr[0].role,
          desc: MAILOBJECT.action,
          recipientsList: MAILOBJECT.recipientsMail,
          subject: MAILOBJECT.subject,
          messageHtml: MAILOBJECT.messageHTML,
        };
        dbModelAdplog.createOne(logObject)
          .then(() => {
            adp.echoLog('Email data has been stored in logs', null, 200, packName);
          })
          .catch((ERRORDB) => {
            const errorOBJ = {
              database: 'dataBaseLog',
              toSave: logObject,
              error: ERRORDB,
            };
            adp.echoLog('Error on [ dbModelAdplog.createOne ]', errorOBJ, 500, packName, true);
          });
      } else {
        const endTimer = (new Date()).getTime() - MAILOBJECT.mailTimer.getTime();
        const text = `Message from [ callback ]: Email failed in ${endTimer}ms`;
        const obj = {
          statusCode: RESPONSE.statusCode,
          body: BODY,
        };
        adp.echoLog(text, obj, 500, packName, true);
        REJECT(RESPONSE.statusCode);
      }
    } else {
      // Fail
      const text = 'Message from [ callback ]: Error';
      adp.echoLog(text, ERROR, 500, packName, true);
      REJECT(ERROR);
    }
  };
  adp.echoLog('Starting to send Email...', null, 200, packName);
  global.request.post({ url: options.url, form: options.form }, callback);
});
// ============================================================================================= //
