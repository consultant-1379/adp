// ============================================================================================= //
/**
* [ global.adp.Answers.answerWith ]
* Shortcut to answer with <b>Server Codes</b> ( 200, 400, 401, etc. )
* @param {Integer} CODE Inform the <b>Server Code</b>.
* @param {Object} res The response Request of this action.
* @param {Date} INITIALTIME The <b>Date/Time JavaScript Object</b>.
* <b>INITIALTIME</b> is generated on begin of this action, before call this function.
* Can be <b>null</b>.
* @param {String} MSG String with a message to be added after the <b>Server Code</b>.
* MSG can be <b>null</b>.
* @param {JSON} DATA The <b>JSON</b> to send as answer of the <b>Request</b> in case of success.
* <b>DATA</b> can be <b>null</b>.
* @param {INTEGER} PAGE Only in case of multiple items inside <b>DATA</b>.
* Use <b>PAGE</b> to inform the page you are displaying.
* Can be <b>null</b>.
* @param {INTEGER} LIMIT Only in case of multiple items inside <b>DATA</b>.
* Use <b>LIMIT</b> to inform the maximum quantity per request.
* Can be <b>null</b>.
* @param {INTEGER} TOTAL Display how many registers in this category have in Database.
* <b>TOTAL</b> can be <b>null</b>.
* @return {JSON} Returns a <b>JSON</b> to the client indicate in <b>res</b> (response) Object.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (CODE, RES, INITIALTIME, MSG, DATA, PAGE, LIMIT, TOTAL) => {
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const setMSG = (INITIALTEXT) => {
    if (MSG === null || MSG === undefined || MSG === '') {
      return INITIALTEXT;
    }
    return `${INITIALTEXT} - ${MSG}`;
  };

  switch (CODE) {
    case 200:
      res.statusCode = 200;
      answer.setCode(200);
      answer.setMessage(setMSG('200 Ok'));
      break;
    case 400:
      res.statusCode = 400;
      answer.setCode(400);
      answer.setMessage(setMSG('400 Bad Request'));
      break;
    case 401:
      res.statusCode = 401;
      answer.setCode(401);
      answer.setMessage(setMSG('401 Unauthorized'));
      break;
    case 403:
      res.statusCode = 403;
      answer.setCode(403);
      answer.setMessage(setMSG('403 Forbidden'));
      break;
    case 404:
      res.statusCode = 404;
      answer.setCode(404);
      answer.setMessage(setMSG('404 Not Found'));
      break;
    default:
      res.statusCode = 500;
      answer.setCode(500);
      answer.setMessage(setMSG('500 Internal Server Error'));
      break;
  }

  if (DATA !== null && DATA !== undefined) {
    answer.setData(DATA);
    answer.setSize(global.adp.getSizeInMemory(DATA));
  }

  if (PAGE !== null && PAGE !== undefined) {
    answer.setPage(PAGE);
  }

  if (LIMIT !== null && LIMIT !== undefined) {
    answer.setLimit(LIMIT);
  }

  if (TOTAL !== null && TOTAL !== undefined) {
    answer.setTotal(TOTAL);
  }

  answer.setTime(new Date() - INITIALTIME);
  res.end(answer.getAnswer());

  return true;
};
// ============================================================================================= //
