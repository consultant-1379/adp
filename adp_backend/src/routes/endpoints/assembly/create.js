// ============================================================================================= //
/**
* [ global.adp.endpoints.assembly.create ]
* @author Githu Jeeva Savy
*/
// ============================================================================================= //
/**
 * @swagger
 * /assembly:
 *    post:
 *      description: Create an <b>Assembly</b> register, if the JSON object confirm the
 *                   <b>Schema</b>. <br/><br/>Be careful with <b>JSON format</b>.
 *                   Sending a <b>JSON</b> with right syntax, else problems will generate.
 *      requestBody:
 *          description: "Add a JSON on the Raw Body of the Post request.
 *                       The <b>Content</b> of this JSON should be a valid <b>Assembly</b>."
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: Assembly Name
 *                  slug:
 *                    type: string
 *                    example: Assembly-name
 *                  description:
 *                    type: string
 *                    example: Assembly description
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
 *                    example: assembly
 *                  domain:
 *                    type: integer
 *                    example: 1
 *                  date_modified:
 *                    type: string
 *                    example: 2021-08-06T10:56:28.008Z
 *                  date_created:
 *                    type: string
 *                    example: 2021-08-06T10:56:28.008Z
 *                  product_number:
 *                    type: string
 *                    example: PRD NO
 *                  mimer_version_starter:
 *                    type: string
 *                    example: 1.1.1
 *                  discussion_forum_link:
 *                    type: string
 *                    example: discussion_forum_link
 *                  report_service_bugs:
 *                    type: string
 *                    example: report service bugs
 *                  inval_secret:
 *                    type: string
 *                    example: inval secret
 *                  backlog:
 *                    type: string
 *                    example: backlog details
 *                  request_service_support:
 *                    type: string
 *                    example: request service support details
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
 *                  contributors:
 *                    type: object
 *                  restricted_description:
 *                    type: string
 *                    example: Restricted Description
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
 *                  assembly_category:
 *                    type: integer
 *                    example: 1
 *                  assembly_maturity:
 *                    type: integer
 *                    example: 1
 *                  component_service:
 *                    type: array
 *                    example: [{}]
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
 */

// ============================================================================================== //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packname = 'global.adp.endpoints.assembly.create';
  const newAssembly = REQ.body;
  if (newAssembly === null || newAssembly === undefined) {
    global.adp.Answers.answerWith(400, RES, timer, 'Missing Assembly Data');
  } else {
    const user = REQ.user.docs[0];
    const USR = {
      signum: (`${user.signum}`).trim().toLowerCase(),
      role: user.role,
    };
    global.adp.assembly.create(newAssembly, USR)
      .then((expectedOBJ) => {
        global.adp.Answers.answerWith(200, RES, timer, null, expectedOBJ);
        adp.echoLog(`Assembly created in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packname);
      })
      .catch((ERROR) => {
        const errorText = `Error in [ adp.assembly.create ] in ${(new Date()).getTime() - timer.getTime()}ms`;
        const errorOBJ = {
          user: USR,
          newAssembly,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packname, true);
        if (Array.isArray(ERROR)) {
          global.adp.Answers.answerWith(
            400,
            RES,
            timer,
            'Assembly Data Incorrect',
            ERROR,
          );
        } else {
          global.adp.Answers.answerWith(500, RES, timer);
        }
      });
  }
};
// ============================================================================================== //
