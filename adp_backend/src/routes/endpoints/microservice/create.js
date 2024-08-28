// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.create ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservice:
 *    post:
 *      description: Create a <b>Microservice</b> register, if the JSON object confirm the
 *                   <b>Schema</b>. <br/><br/>Be careful with <b>JSON format</b>.
 *                   Sending a <b>JSON</b> with right syntax, else problems will generate.
 *      requestBody:
 *          description: "Add a JSON on the Raw Body of the Post request.
 *                       The <b>Content</b> of this JSON should be a valid <b>MicroService</b>."
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: Microservice Name
 *                  slug:
 *                    type: string
 *                    example: microservice-name
 *                  description:
 *                    type: string
 *                    example: Microservice description
 *                  based_on:
 *                    type: string
 *                    example: Agent Name
 *                  helmurl:
 *                    type: string
 *                    example: Helm URL
 *                  helm_chartname:
 *                    type: string
 *                    example: helm-chartname
 *                  giturl:
 *                    type: string
 *                    example: GIT URL
 *                  type:
 *                    type: string
 *                    example: microservice
 *                  approval:
 *                    type: string
 *                    example: approved
 *                  domain:
 *                    type: integer
 *                    example: 1
 *                  serviceArea:
 *                    type: integer
 *                    example: 5
 *                  date_modified:
 *                    type: string
 *                    example: 2021-08-06T10:56:28.008Z
 *                  product_number:
 *                    type: string
 *                    example: PRD NO
 *                  discussion_forum_link:
 *                    type: integer
 *                    example: 5
 *                  reusability_level:
 *                    type: integer
 *                    example: 1
 *                  report_service_bugs:
 *                    type: string
 *                    example: report service bugs
 *                  adp_strategy:
 *                    type: string
 *                    example: adp strategy
 *                  adp_organization:
 *                    type: string
 *                    example: adp organization
 *                  adp_realization:
 *                    type: string
 *                    example: adp realization
 *                  service_category:
 *                    type: integer
 *                    example: 1
 *                  service_maturity:
 *                    type: integer
 *                    example: 1
 *                  inval_secret:
 *                    type: string
 *                    example: inval secret
 *                  backlog:
 *                    type: string
 *                    example: backlog details
 *                  request_service_support:
 *                    type: string
 *                    example: request service support details
 *                  approval_comment:
 *                    type: string
 *                    example: approval comments
 *                  team:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        team_role:
 *                          type: integer
 *                          example: 1
 *                        serviceOwner:
 *                          type: boolean
 *                          example: true
 *                        signum:
 *                          type: string
 *                          example: myuser
 *                  teamMails:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: team-mail1@domain.com
 *                  repo_urls:
 *                    type: object
 *                    properties:
 *                      development:
 *                        type: string
 *                        example: development_url
 *                      release:
 *                        type: string
 *                        example: release_url
 *                  menu:
 *                    type: object
 *                    properties:
 *                      manual:
 *                        type: object
 *                        properties:
 *                          release:
 *                            type: array
 *                            example: [{
 *                                        is_cpi_updated: false,
 *                                        version: '1.1.1',
 *                                        documents: [{
 *                                                      name: 'any name',
 *                                                      external_link: 'link',
 *                                                      filepath: 'path',
 *                                                      'default': true,
 *                                                      restricted: true,
 *                                                      slug: 'any-name'
 *                                                   }]
 *                                      }]
 *                          development:
 *                            type: array
 *                            example: [{name: 'Service Overview', slug: 'service-overview'}]
 *                          date_modified:
 *                            type: string
 *                            example: 2021-12-30T12:42:49.020Z
 *                      auto:
 *                        type: object
 *                        properties:
 *                          release:
 *                            type: array
 *                            example: [{
 *                                        is_cpi_updated: false,
 *                                        version: '1.1.1',
 *                                        documents: [{
 *                                                      name: 'any name',
 *                                                      external_link: 'link',
 *                                                      filepath: 'path',
 *                                                      'default': true,
 *                                                      restricted: true,
 *                                                      slug: 'any-name'
 *                                                   }]
 *                                      }]
 *                          development:
 *                            type: array
 *                            example: [{name: 'Service Overview', slug: 'service-overview'}]
 *                          date_modified:
 *                            type: string
 *                            example: 2021-12-30T12:42:49.020Z
 *                  compliance:
 *                    type: array
 *                    example: [{
 *                                group: 2,
 *                                fields: [{
 *                                            field: 1,
 *                                            answer: 4,
 *                                            comment: 'commets'
 *                                          }]
 *                             }]
 *                  team_mailers:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: teammailers@domain.com
 *                  tags:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: Your docker hashtag
 *                  restricted:
 *                    type: integer
 *                    example: 0
 *                  additional_information:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        category:
 *                          type: string
 *                          example: tutorial
 *                        title:
 *                          type: string
 *                          example: Tutorial Example Link Text
 *                        link:
 *                          type: string
 *                          example: www.exampletutoriallink.com
 *                  menu_auto:
 *                    type: boolean
 *                    example: true
 *                  check_cpi:
 *                    type: boolean
 *                    example: false
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
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packname = 'global.adp.endpoints.microservice.create';
  const newMicroService = REQ.body;
  if (newMicroService === null || newMicroService === undefined) {
    global.adp.Answers.answerWith(400, RES, timer, 'Missing Microservice Data');
  } else {
    const user = REQ.user.docs[0];
    const USR = {
      signum: (`${user.signum}`).trim().toLowerCase(),
      role: user.role,
    };
    global.adp.microservice.create(newMicroService, USR)
      .then((expectedOBJ) => {
        global.adp.Answers.answerWith(200, RES, timer, null, expectedOBJ);
        adp.echoLog(`Microservice created in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packname);
      })
      .catch((ERROR) => {
        const errorText = `Error in [ adp.microservice.create ] in ${(new Date()).getTime() - timer.getTime()}ms`;
        const errorOBJ = {
          user: USR,
          newMicroService,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packname, true);
        if (Array.isArray(ERROR)) {
          global.adp.Answers.answerWith(
            400,
            RES,
            timer,
            'Microservice Data Incorrect',
            ERROR,
          );
        } else {
          global.adp.Answers.answerWith(500, RES, timer);
        }
      });
  }
};
// ============================================================================================= //
