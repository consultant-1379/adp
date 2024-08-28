// // ============================================================================================= //
// /**
// * [ endpoints.validateField.validate ]
// * Validates the field as per rules.
// * @param {object} fieldObject The value of field which needs to be validated
// * @param {boolean} updateDb Decide whether should update value in database or not
// * @return Response object with list of errors or warning (if any)
// * @route GET /validate
// * @author Omkar [zsdgmkr]
// */
// // ============================================================================================= //
// global.adp.docs.rest.push(__filename);
// // ============================================================================================= //
// const validate = require('./../../../validateField/validate');

// module.exports = async (REQ, RES) => {
//   const timer = new Date();
//   const packname = 'endpoints.validateField.validate';
//   if (!REQ.params) {
//     return global.adp.Answers.answerWith(400, RES, timer, 'Field to be validated should be provided in parameters');
//   }
//   if (!REQ.params.field) {
//     return global.adp.Answers.answerWith(400, RES, timer, 'Field to be validated does not exist');
//   }
//   const fieldToBeValidated = REQ.params.field;

//   if (!REQ.body) {
//     return global.adp.Answers.answerWith(400, RES, timer, 'Actual Data for the field needs to be provided in body');
//   }
//   if (!REQ.body[fieldToBeValidated]) {
//     return global.adp.Answers.answerWith(400, RES, timer, `Data for ${fieldToBeValidated} not exist`);
//   }
//   const updateDb = REQ.params.updateDb === 'true';
//   const answer = new global.adp.Answers();
//   const res = global.adp.setHeaders(RES);

//   return validate.validateField(fieldToBeValidated, REQ.body, updateDb)
//     .then((afterDocumentRefresh) => {
//       answer.setCode(200);
//       res.statusCode = 200;
//       answer.setMessage('200 Ok');
//       answer.setTotal(0);
//       answer.setSize(0);
//       answer.setData(afterDocumentRefresh);
//       answer.setTime(new Date() - timer);
//       res.end(answer.getAnswer());
//       return true;
//     })
//     .catch((ERROR) => {
//       const errorText = 'Error in [ validate.validateField ]';
//       const errorOBJ = {
//         error: ERROR,
//         fieldToBeValidated,
//         body: REQ.body,
//         updateDb,
//       };
//       adp.echoLog(errorText, errorOBJ, 500, packname, true);
//       answer.setCode(500);
//       res.statusCode = 500;
//       answer.setMessage(ERROR);
//       answer.setTime(new Date() - timer);
//       res.end(answer.getAnswer());
//       return false;
//     });
// };
// // ============================================================================================= //
