const answerWith = require('../answers/answerWith');

// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //

/**
* [ adp.middleware.isMicroserviceValidBySlug ]
* verify whether target microservice is in DB by slug
* @param {string} msSlug microservice slug that needs to be validated against DB
* @return Response object with list of errors or warning, otherwise call next middleware
* @author Omkar Sadegaonkar [zsdgmkr]
*/
module.exports = async (msSlug, RES, next) => {
  const packName = 'adp.middleware.isMicroserviceValidBySlug';
  const startTimer = new Date();
  const {
    setHeaders, echoLog, microservice,
  } = adp;
  const res = setHeaders(RES);
  if (msSlug === null || msSlug === undefined) {
    answerWith(400, res, startTimer, 'Microservice Slug is required', msSlug);
    return false;
  }
  try {
    const result = await microservice.checkSlug(msSlug);
    if (result === 'Valid SLUG') {
      return next();
    }
    const message = `BAD REQUEST: Microservice not found for slug ${msSlug}`;
    const code = 404;
    echoLog(message, { code, message, msSlug }, code, packName, true);
    answerWith(code, res, startTimer, message, msSlug);
    return false;
  } catch (err) {
    const message = err.message || 'Internal Server Error';
    const code = err.code || 500;
    echoLog(message, { code, message, msSlug }, code, packName, true);
    answerWith(code, res, startTimer, message, msSlug);
    return false;
  }
};
