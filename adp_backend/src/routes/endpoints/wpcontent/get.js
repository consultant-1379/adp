// ============================================================================================= //
/**
* [ adp.endpoints.wpcontent.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
 * @swagger
 * /wpcontent/{wppath}:
 *    get:
 *      description: Retrieve content from Wordpress
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
 *        - Wordpress Content Proxy
 *    parameters:
 *      - name: wppath
 *        description: The endpoint from Wordpress you want to reach.
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *          enum: [ "fetchArticleValidatePath", "fetchTutorialPageValidatePath", "preview"]
 *      - name: articleSlug
 *        in: query
 *        description: The Article Slug, use in case of "fetchArticleValidatePath".
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: tutorialSlug
 *        in: query
 *        description: The Tutorial Slug, use in "fetchTutorialPageValidatePath".
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: articleType
 *        in: query
 *        description: The Type of the content.
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *          enum: [ "page", "post" ]
 *      - name: parentSlugArray
 *        in: query
 *        description: The Parents Slug Array. Should not be used case wppath is "preview".
 *        required: false
 *        type: array
 *        schema:
 *          items:
 *            type: string
 */
// ============================================================================================= //
const packName = 'adp.endpoints.wpcontent.get';
// ============================================================================================= //
/**
* [ Private Function :: removeLinksFromSideMenuIfNecessary ]
* Function to remove from side menu all the links the user can't access.
* IMPORTANT: For some reason, the "linked_menu" is an Array inside of another Array.
* @param {Object} OBJ At the level where we can find a "linked_menu" attribute.
* @param {Array} WPUSERMENUS All available menus permissions for the specific user.
* Those values are generated by [ adp.middleware.RBACClass ] middleware.
* @returns nothing, but the linked_menu of OBJ will be updated to be filtered
* following the RBAC result.
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
const removeLinksFromSideMenuIfNecessary = (OBJ, WPUSERMENUS) => {
  if (!Array.isArray(OBJ.linked_menu)
    || (Array.isArray(OBJ.linked_menu) && OBJ.linked_menu.length === 0)) {
    return;
  }
  const obj = OBJ;
  const newLinkedMenu = [];
  obj.linked_menu.forEach((MENUITEMARRAY) => {
    if (Array.isArray(MENUITEMARRAY)) {
      MENUITEMARRAY.forEach((MENUITEM) => {
        if (WPUSERMENUS.includes(MENUITEM.object_id)) {
          newLinkedMenu.push(MENUITEM);
        }
      });
    }
  });
  obj.linked_menu = [newLinkedMenu];
};
// ============================================================================================= //
/**
* [ adp.endpoints.wpcontent.get ]
* Main function of this file. Retrieve content from Wordpress.
* The Parameters have to be extracted and validated
* by [ adp.middleware.RBACContentPreparationClass ]
* before the [ adp.middleware.rbac ] allow/deny
* access to the requested content.
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const proxy = new adp.proxy.ProxyClass(adp.config.wordpress.url);
  const { wppath, payload } = REQ.wpcontent ? REQ.wpcontent : {};
  if (wppath === undefined || payload === undefined) {
    let errorText = 'Necessary preparation not found.';
    errorText = `${errorText} The [ adp.middleware.RBACContentPreparationClass ]`;
    errorText = `${errorText} has to be called before this function.`;
    const errorObject = {
      origin: 'Main Function',
      error: errorText,
      wpcontent: REQ.wpcontent ? REQ.wpcontent : {},
    };
    const errorCode = 500;
    adp.echoLog(errorText, errorObject, errorCode, packName);
    const errorMessage = `Error ${errorCode}`;
    adp.Answers.answerWith(errorCode, RES, timer, errorMessage);
    return;
  }

  proxy.getData(wppath, payload)
    .then(async (CONTENT) => {
      const content = CONTENT;

      if (content && Array.isArray(content.slugResults) && content.slugResults[0]) {
        const postId = content.slugResults[0].ID;
        const postType = content.slugResults[0].post_type;
        const postContent = content.slugResults[0].post_content;
        const postAuthor = content.slugResults[0].post_author;
        const instrument = new adp.comments.InstrumentClass();
        content.slugResults[0].location_id = instrument.getLocationIDWP(
          postType,
          postId,
        );
        content.slugResults[0].post_content = instrument.apply(postContent);
        content.slugResults[0].post_author_signum = [];
        content.slugResults[0].post_author_name = [];
        content.slugResults[0].post_author_email = [];
        const modelCommentDL = new adp.models.CommentsDL();
        const commentDL = await modelCommentDL.getCommentsDL();
        if (commentDL && commentDL.docs && commentDL.docs.length) {
          const dl = commentDL.docs.find(x => x.type === postType);
          if (dl && dl.active) {
            const pfRecPDLmembers = new adp.peoplefinder.RecursivePDLMembers(dl.dlName, false);
            const rpdl = await pfRecPDLmembers.searchByMailers();
            if (rpdl && rpdl.members && rpdl.members.length) {
              content.slugResults[0].post_author_email = dl.dlEmail;
              rpdl.members.forEach(member => {
                content.slugResults[0].post_author_signum.push(member.peopleFinder.mailNickname);
                content.slugResults[0].post_author_name.push(member.peopleFinder.displayName);
              });
            }
          }
        }
      }

      let isAdmin = false;
      const signum = REQ && REQ.userRequest && REQ.userRequest._id
        ? REQ.userRequest._id : null;
      if (signum && REQ.rbac && REQ.rbac[signum]) {
        isAdmin = REQ.rbac[signum].admin;
        const res = adp.setHeaders(RES);
        res.statusCode = 200;
        if (isAdmin) {
          res.end(JSON.stringify(content));
        } else {
          if (Array.isArray(REQ.wpFullUserMenu[signum])
            && Array.isArray(content.slugResults)) {
            content.slugResults.forEach((CHILD) => {
              removeLinksFromSideMenuIfNecessary(CHILD, REQ.wpFullUserMenu[signum]);
            });
          }
          if (Array.isArray(REQ.wpFullUserMenu[signum])
            && Array.isArray(content.parentSlugResults)) {
            content.parentSlugResults.forEach((PARENT) => {
              removeLinksFromSideMenuIfNecessary(PARENT, REQ.wpFullUserMenu[signum]);
            });
          }
          res.end(JSON.stringify(content));
        }
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ proxy.getData ] @ [ adp.proxy.ProxyClass ]';
      const errorObject = {
        wppath,
        serverURL: adp.config.wordpress.url,
        class: 'adp.proxy.ProxyClass',
        origin: 'Main Function',
        error: ERROR,
      };
      const errorCode = typeof ERROR.code === 'number' ? ERROR.code : 500;
      adp.echoLog(errorText, errorObject, errorCode, packName, true);
      const errorMessage = `Error ${errorCode}`;
      adp.Answers.answerWith(errorCode, RES, timer, errorMessage);
    });
};
// ============================================================================================= //
