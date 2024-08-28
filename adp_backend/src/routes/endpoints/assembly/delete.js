// ============================================================================================= //
/**
* [ global.adp.endpoints.assembly.delete ]
* (Soft) Delete the Assembly if the user is admin or
* owner of the assembly.
* @param {String} inline ID of the Assembly. After the URL, add a slash and the ID.
* Example: 03a6c2af-36da-430f-842c-84176fd54c0f
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
/**
 * @swagger
 * /assembly/{ID}:
 *    delete:
 *      description: Delete the Assembly if the user is admin or owner
 *      summary: Delete an assembly by ID
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Assembly
 *    parameters:
 *      - name: ID
 *        in: path
 *        description: Enter Assembly ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packname = 'global.adp.endpoints.assembly.delete';
  if (REQ.params === null || REQ.params === undefined) {
    return global.adp.Answers.answerWith(400, RES, timer, 'Assembly ID is NULL or UNDEFINED');
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return global.adp.Answers.answerWith(400, RES, timer, 'Assembly ID is NULL or UNDEFINED');
  }
  const myAssemblyID = REQ.params.id;
  return global.adp.permission.canDoIt(REQ, myAssemblyID)
    .then(async () => {
      const user = REQ.user.docs[0];
      const USR = {
        signum: (`${user.signum}`).trim().toLowerCase(),
        role: user.role,
      };
      global.adp.assembly.delete(myAssemblyID, USR)
        .then(() => {
          global.adp.Answers.answerWith(200, RES, timer, 'Assembly deleted');
          adp.echoLog(`Assembly deleted in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packname);
        })
        .catch((finalResult) => {
          let errorText;
          let errorCode;
          const finalTimer = `in ${(new Date()).getTime() - timer.getTime()}ms`;
          if (finalResult === 404) {
            errorCode = 404;
            errorText = `Error in [ adp.assembly.delete ]: Assembly not found ${finalTimer}`;
            global.adp.Answers.answerWith(404, RES, timer, 'Assembly Not Found');
          } else {
            errorCode = 500;
            errorText = `Error in [ adp.assembly.delete ] ${finalTimer}`;
            global.adp.Answers.answerWith(500, RES, timer);
          }
          const errorOBJ = {
            user: USR,
            assemblyId: myAssemblyID,
            error: finalResult,
          };
          adp.echoLog(errorText, errorOBJ, errorCode, packname, true);
        });
    })
    .catch((ERROR) => {
      global.adp.Answers.answerWith(403, RES, timer, 'You do not have permission to delete this Assembly');
      const errorText = 'Error in [ adp.permission.canDoIt ]';
      const errorOBJ = {
        error: ERROR,
        assemblyId: myAssemblyID,
        header: REQ.headers,
      };
      adp.echoLog(errorText, errorOBJ, 403, packname, true);
    });
};
// ============================================================================================= //
