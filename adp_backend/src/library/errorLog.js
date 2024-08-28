/**
 * [ errorLog ] Function to log errors without
 * overwrite in case of a cascade of errors.
 * Use it on REJECT of Promises, return of not
 * successful functions/methods and on catch of
 * try/catch blocks.
 * @param {Number} CODE The Status Server Code:
 * (100-199) Informational Responses,
 * (200-299) Successful Responses,
 * (300-399) Redirects,
 * (400-499) Client Errors,
 * (500-599) Server Errors.
 * Most common: 200 Ok, 400 Bad Request, 401 Unauthorized,
 * 403 Forbidden, 404 Not Found, 500 Internal Server Error.
 * @param {String} DESCRIPTION A short description of the
 * expected error.
 * @param {Object} DATAOBJECT Object, required, containing
 * the "native error" as "error" attribute as first attribute
 * of this object and followed by all possible parameters
 * to help at future investigations.
 * @param {String} ORIGIN String, required, with the method
 * or function name. If is about an anonymous module.exports,
 * call it as "main".
 * @param {String} PACKNAME String, required, with Folder/File
 * name following the notation: adp.folder.name.
 * @param {Boolean} FORCESAVE Boolean, optional, default value is null.
 * If is not a 500 error, you can force to save setting this as true.
 * Setting as a false, even a 500 error will not save at the database.
 * @returns Error Object { code, desc, data, origin, packName }.
 * @author Armando Dias [zdiaarm]
 */

module.exports = (CODE, DESCRIPTION, DATAOBJECT, ORIGIN, PACKNAME, FORCESAVE = null) => {
  // Checking if this is a cascade error.
  // If yes, means the [ DATAOBJECT.error ] already contains
  // a "errorLog Object". So this should not be rewrite by
  // any side-effect caused by the first error.
  // If not, the "errorLog Object" should be created.
  if (DATAOBJECT
    && DATAOBJECT.error
    && DATAOBJECT.error.origin
    && DATAOBJECT.error.packName) {
    return DATAOBJECT.error;
  }

  // Building the "errorLogObject".
  const errorLogObject = {
    code: CODE,
    desc: DESCRIPTION,
    data: DATAOBJECT,
    origin: ORIGIN,
    packName: PACKNAME,
  };

  // It is easy to lost the Error Object because Mongo doesn't
  // accept this using the 3PP we are using. The solution is
  // serialize the error before proceed.
  if (errorLogObject && errorLogObject.data && errorLogObject.data.error) {
    errorLogObject.data.error = JSON.stringify(
      errorLogObject.data.error,
      Object.getOwnPropertyNames(errorLogObject.data.error),
    );
  }

  // Echoing the message on terminal using the echoLog.
  // Forcing to not allow echoLog save this on database.
  adp.echoLog(DESCRIPTION, DATAOBJECT, CODE, PACKNAME, false);

  // If FORCESAVE is true or if FORCESAVE is null and CODE is
  // bigger or equal of 500, we should save this error on database.
  // If FORCESAVE is false, this error will not be save even if
  // the CODE is greater or equal 500.
  if ((FORCESAVE === true) || (FORCESAVE === null && CODE >= 500)) {
    const echoLogModel = new adp.models.EchoLog();
    errorLogObject.date = new Date();
    echoLogModel.createOne(errorLogObject)
      .then(() => {
        // Returning the errorObject after saved it on database.
        delete errorLogObject.date;
        return errorLogObject;
      })
      .catch((ERROR) => {
        adp.echoLog('Error on MongoDB', { error: ERROR }, 500, 'adp.errorLog', false);
        delete errorLogObject.date;
        return errorLogObject;
      });
  }

  // Returning the errorObject without saving on database.
  return errorLogObject;
};
