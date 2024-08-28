// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.getVersionsByMS ]
* getting the list of version based on ms
* @param {String} inline MicroService Id.
* @author Vinod [zvinrac]
*/
// ============================================================================================= //
/**
 * @swagger
 * /getallversions/{Microservice Name}:
 *    get:
 *      description: This endpoint returns the <b>list of versions based on microservice</b>.
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
 *        - Microservice
 *    parameters:
 *      - name: Microservice Name
 *        in: path
 *        description: Enter Microservice Name
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
    const timer = new Date();
    const packName = 'global.adp.endpoints.microservice.getVersionsByMS';
    const answer = new global.adp.Answers();
    const res = global.adp.setHeaders(RES);
    const badRequest = () => {
        answer.setCode(400);
        answer.setMessage('400 Bad Request - MicroService NAME is NULL or UNDEFINED...');
        res.statusCode = 400;
        res.end(answer.getAnswer());
        return false;
    };
    if (REQ.params === null || REQ.params === undefined) {
        return badRequest();
    }
    if (REQ.params.msId === null || REQ.params.msId === undefined) {
        return badRequest();
    }
    const microServiceId = REQ.params.msId;
    const versionForMS = new adp.microservices.getVersionsForMicroservice();
    await versionForMS.getListOfVersionForaMS(microServiceId)
    .then((versionResp) => {
        const combinedArray = [...versionResp.armVersions, ...versionResp.mimerVersions];
        versionResp['mergedArray'] = [...new Set(combinedArray)];
        adp.echoLog(`successfully fetched the List of version for the asset [${microServiceId}]`, null, 200, packName);
        answer.setCode(200);
        answer.setCache('Not from Cache');
        answer.setMessage('200 - fetching version for MS');
        answer.setData(versionResp);
        res.statusCode = answer.getCode();
        const resAnswer = answer.getAnswer();
        res.end(resAnswer);
    })
};
