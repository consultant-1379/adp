/* eslint-disable max-len */
/**
* [ global.adp.endpoints.report.assets ]
* @author Tirth [zpiptir]
*/

global.adp.docs.rest.push(__filename);
const packName = 'global.adp.endpoints.report.assembly';

/**
* @swagger
* /report/assembly/{format}:
*    post:
*      description: Generate report for Assembly
*      responses:
*        '200':
*          $ref: '#/components/responses/Ok'
*        '400':
*          $ref: '#/components/responses/BadRequest'
*        '401':
*          $ref: '#/components/responses/Unauthorized'
*        '403':
*          $ref: '#/components/responses/Forbidden'
*        '500':
*          $ref: '#/components/responses/InternalServerError'
*      tags:
*        - Asset report
*      requestBody:
*          description: "Add a JSON on the Raw Body of the Post request.
*                       The <b>Content</b> of this JSON should be a valid <b>MicroService</b>."
*          required: true
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  assets:
*                    type: array
*                    example: [{ "_id": "45e7f4f992afe7bbb62a3391e500egpd"}, {"_id": "45e7f4f992afe7bbb62a3391e500ekod"}]
*    parameters:
*      - name: format
*        in: path
*        description: Format of report json or xlsx.
*        required: true
*        schema:
*          type: string
*          format: string
*          enum: ["json", "xlsx"]
*/

/**
 * This function is used to validate if user has access to download report
 * of requested assets
 * @param {array} reqAssets Requested access from API request
 * @param {object} REQ Endpoint request object
 * @param {object} res Endpoint response object
 * @returns list of allowed assets if successful
 * @author Tirth [zpiptir]
 */
function validateAgainstRbac(reqAssets, REQ, res) {
  const answer = new global.adp.Answers();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // Applying RBAC
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let assets = reqAssets;
  if (!Array.isArray(assets)) {
    assets = [reqAssets];
  }

  let allowedAssets = [];
  let isAdmin = false;
  const signum = REQ && REQ.userRequest && REQ.userRequest._id
    ? REQ.userRequest._id.trim().toLowerCase() : null;
  if (signum !== null && REQ.rbac && REQ.rbac[signum]) {
    if (REQ.rbac[signum].admin === true) {
      allowedAssets = assets;
      isAdmin = true;
    } else {
      const allowedArray = REQ.rbac
          && REQ.rbac[signum]
          && REQ.rbac[signum].allowed
          && REQ.rbac[signum].allowed.assets
        ? REQ.rbac[signum].allowed.assets
        : [];
      assets.forEach((ITEM) => {
        if (allowedArray.includes(ITEM._id)) {
          allowedAssets.push(ITEM);
        }
      });
    }
  }

  if (!isAdmin && allowedAssets.length === 0) {
    answer.setCode(403);
    res.statusCode = 403;
    answer.setMessage('403 Forbidden');
    answer.setLimit(999999);
    answer.setTotal(1);
    answer.setPage(1);
    answer.setCache(undefined);
    answer.setData(undefined);
    answer.setTime((new Date()) - this.start);
    res.end(answer.getAnswer());
    const errorText = 'User got a 403 from reports';
    const errorObject = {
      signum,
      isAdmin,
      parameters: REQ.params,
      body: REQ.body,
      requestedAssets: reqAssets,
      assets,
      error: '403 Forbidden',
      rbacObject: REQ.rbac,
    };
    adp.echoLog(errorText, errorObject, 403, packName, true);
    return 403;
  }
  return allowedAssets;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
}

module.exports = (REQ, RES) => {
  global.adp.quickReports.clearDiskCache();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const timer = new Date();
  const format = (REQ.params && REQ.params.format ? REQ.params.format : '');
  const assets = (REQ.body ? REQ.body.assets : []);

  const allowedAssets = validateAgainstRbac(assets, REQ, res);
  if (allowedAssets === 403) {
    return;
  }

  const assemblyReports = new global.adp.quickReports.AssemblyReports(
    allowedAssets,
    format,
  );

  assemblyReports.generate().then((result) => {
    answer.setCode(200);
    const { data: reportObj } = result;
    if (result.format === 'xlsx' && reportObj.filePath) {
      RES.setHeader('Content-Disposition', `attachment; filename=${reportObj.fileName}`);
      RES.setHeader('Content-Transfer-Encoding', 'binary');
      RES.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      RES.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      RES.download(reportObj.filePath);
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`Asset report generated in ${endTimer}ms`, null, 200, packName);
    } else if (result.format === 'json' && reportObj) {
      answer.setData(reportObj);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`Report generated in ${endTimer}ms`, null, 200, packName);
    } else {
      adp.echoLog('Error generating report', { format: result.format }, 500, packName, true);
      res.setCode = 500;
      res.statusCode = 500;
      answer.setCode(500);
      res.end(answer.getAnswer());
    }
  }).catch((errorFetchingReport) => {
    const code = (errorFetchingReport.code ? errorFetchingReport.code : 500);
    const msg = (errorFetchingReport.error ? errorFetchingReport.error : errorFetchingReport);
    answer.setCode(code);
    answer.setMessage(msg);
    res.setCode = code;
    res.statusCode = code;
    const finalTimer = (new Date()).getTime() - timer.getTime();
    const errorText = `Error in [ assemblyReports.generate ] in ${finalTimer}ms`;
    adp.echoLog(errorText, { error: errorFetchingReport }, code, packName, true);
    RES.end(answer.getAnswer());
  });
};
