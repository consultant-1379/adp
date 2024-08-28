// ============================================================================================= //
/**
* [ global.adp.endpoints.releaseSettings.get ]
* @author Michael Coughlan [zmiccou]
*/

/**
 * @swagger
 * /releaseSettings:
 *    get:
 *      description: This endpoint shows all the releaseSettings Object on the browser
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Release Settings
 */

/**
 * @swagger
 * /releaseSettings/{key_name}:
 *    get:
 *      description: This endpoint shows all the releaseSettings Object on the browser
 *      responses:
 *        '200':
 *          description: OK.Success-Shows releaseSettings Object based on the key supplied
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Release Settings
 *      parameters:
 *        - name: key_name
 *          in: path
 *          description: Name of the key in releaseSettings Object
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const ReleaseSettingsController = require('../../../releaseSettings/ReleaseSettingsController');

module.exports = async (REQ, RES) => {
  const releaseSettingsController = new ReleaseSettingsController();
  const { key } = REQ.params;

  const timer = new Date();
  const packName = 'adp.endpoints.releaseSettings.get';
  const answer = new adp.Answers();

  const res = adp.setHeaders(RES);

  return releaseSettingsController.getReleaseSettings(key)
    .then((releaseSettingsResponse) => {
      const endTimer = (new Date()).getTime() - timer.getTime();

      answer.setCode(200);
      answer.setMessage('200 Ok');
      answer.setTotal(releaseSettingsResponse.length);
      answer.setData(releaseSettingsResponse);
      answer.setTime(endTimer);

      res.end(answer.getAnswer());
      return true;
    })
    .catch((ERROR) => {
      const { code, data, message } = ERROR;
      answer.setCode(code || 500);
      answer.setMessage(message);
      res.statusCode = code || 500;
      res.end(answer.getAnswer());

      const errorText = `Error in [ adp.releaseSettings.get ] on ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorObj = {
        code: code || 500,
        data,
        message: message || 'Internal server error',
      };

      adp.echoLog(errorText, errorObj, code, packName, true);
    });
};
// ============================================================================================= //
