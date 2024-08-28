// ============================================================================================= //
/**
* [ global.adp.endpoints.user.create ]
* Create a <b>User</b> register, if the JSON object is conform the <b>Schema</b>.<br/><br/>
* @author Armando Schiavon Dias [escharm]
*/

/**
 * @swagger
 * /user:
 *    post:
 *      description: This endpoint creates a  new user based on the supplied data
 *      requestBody:
 *          description: "Details of the new user. ID and Signum should be same"
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example: myuser
 *                  signum:
 *                    type: string
 *                    example: myuser
 *                  role:
 *                    type: string
 *                    example: User
 *                  name:
 *                    type: string
 *                    example: Normal User
 *                  marketInformationActive:
 *                    type: boolean
 *                    example: true
 *                  email:
 *                    type: string
 *                    example: user@gmail.com
 *      responses:
 *        '200':
 *          description: Ok. Successfully created a User
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *          - User CRUD Operations
 *
 */

// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const newUser = REQ.body;
  if (newUser === null || newUser === undefined) {
    return global.adp.Answers.answerWith(400, RES, timer, 'Missing User Data');
  }
  return global.adp.user.create(newUser)
    .then((expectedOBJ) => {
      if (Array.isArray(expectedOBJ)) {
        return global.adp.Answers.answerWith(
          (expectedOBJ.code ? expectedOBJ.code : 500),
          RES,
          timer,
          (expectedOBJ.message ? expectedOBJ.message : 'User Data Incorrect'),
          expectedOBJ,
        );
      }
      switch (expectedOBJ.code) {
        case 400:
          return global.adp.Answers.answerWith(400, RES, timer);
        case 500:
          return global.adp.Answers.answerWith(500, RES, timer);
        default:
          return global.adp.Answers.answerWith(200, RES, timer);
      }
    })
    .catch(errorOBJ => global.adp.Answers.answerWith(500, RES, timer, `${errorOBJ}`));
};
// ============================================================================================= //
