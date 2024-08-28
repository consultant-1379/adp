// ============================================================================================= //
/**
* [ global.adp.endpoints.profile.update ]
* Update a <b>user</b> register, if the JSON object is conform the <b>Schema</b> and
* the <b>Token</b> belongs to an <b>Administrator</b> or one of the <b>Onwers of the
* userData</b>.<br/>
* You have to provide the <b>user ID</b> of the target of your update. Invalid
* <b>ID</b> will result in <b>404 Errors</b>.<br/>
* You can use the <b>ID</b> inline <u>or</u> inside the <b>JSON Object</b>, as <b>_id</b>
* parameter.<br/>
* In case you provide the <b>ID</b> in two different ways, they should be the same. Or will
* result in a <b>400 Bad Request</b> error.<br/><br/>
* Be careful with <b>JSON format</b>. Sending a <b>JSON</b> with sintaxe problems will
* generate errors on <b>3PP Middleware</b>.
* @param {String} Inline Just put the address of this endPoint.
* @param {String} Authorization as string on the header of the request.
* Add a header variable with the name <b>Authorization</b> with the string "Bearer
* <b>TOKEN</b>".<br/>
* Don't forget the space between the word <b>Bearer</b> and the <b>token</b>.
* @param {String} Header Add "Content-Type" on Header with the value " application/json ".
* @param {raw} Body Add a JSON on the Raw Body of the Post request. The <b>Content</b>
* of this JSON should be a valid <b>userData</b>.
* Example of <b>JSON Object</b> to update. Realize the field <b>_id</b> is mandatory
* only if the <b>ID</b> is not in the <b>URL</b>.<br/>
* This <b>endPoint</b> do not request all the fields of the <b>Schema</b>, if they do
* not will change.<br/>
* <PRE>
* {
* &nbsp;"_id": "829b7796bb980b8f664f69f9b9081ee7",
* &nbsp;"name": "BACKEND TEST 2"
* }
* </PRE>
* This example will update only the <b>name</b> of the <b>userData</b>.
* @return 201 - user profile updated successfully
* @return 202 - Request has been accepted and is under process currently
* @return 400 - Bad syntax
* @return 500 - Internal Server Error
* @group profile CRUD
* @route PUT /profile
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('../../../library/errorLog');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const packName = 'global.adp.endpoints.profile.update';
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const newuserData = REQ.body;
  const myUserfromURL = REQ.params.id;
  const myUserfromBody = newuserData._id;
  const fromURL = !((myUserfromURL === null) || (myUserfromURL === undefined) || (myUserfromURL === ''));
  const fromBody = !((myUserfromBody === null) || (myUserfromBody === undefined) || (myUserfromBody === ''));
  let myUser = null;
  if (fromURL && fromBody) {
    if (myUserfromURL !== myUserfromBody) {
      return global.adp.Answers.answerWith(400, RES, timer, 'Two different _id variables. Send just one.');
    }
    myUser = myUserfromBody;
  }
  if (fromURL && !fromBody) {
    myUser = myUserfromURL;
  }
  if (!fromURL && fromBody) {
    myUser = myUserfromBody;
  }
  if (myUser === null) {
    return global.adp.Answers.answerWith(400, RES, timer, 'Id not received.');
  }
  global.adp.profile.update(myUser, newuserData, REQ)
    .then(() => {
      global.adp.Answers.answerWith(200, RES, timer);
      adp.echoLog(`User successful updated in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packName);
    })
    .catch((error) => {
      const errorText = `Error in [ adp.profile.update ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = {
        error,
        myUser,
        newuserData,
      };
      if (error && error.code && error.message) {
        let errorMessage = '';

        if (Array.isArray(error.message)) {
          errorMessage = error.message.join(', ');
        } else {
          errorMessage = error.message;
        }

        errorLog(error.code, errorMessage, errorOBJ, 'main', packName);
        answer.setCode(error.code);
        res.statusCode = error.code;
        answer.setMessage(error.message);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
        return false;
      }
      errorLog(error.code, errorText, errorOBJ, 'main', packName);
      answer.setCode(500);
      res.statusCode = 500;
      answer.setMessage(`Error: ${error}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return true;
};
// ============================================================================================= //
