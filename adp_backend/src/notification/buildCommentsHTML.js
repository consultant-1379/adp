/* eslint-disable no-param-reassign */
// ============================================================================================= //
/**
* [ global.adp.notification.buildCommentsHTML ]
* Build inline comments mail html data for sending mail
* @author Varshini
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MAILOBJECT => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.notification.buildCommentsHTML';

  let emailHtml = '';

  /**
   * Capitalize first letter
   * @param {string} s the given string
   * @returns {string} the capitalize string
   * @author Rinosh Cherian
   */
  function capitalizeFirstLetter(s) {
    return (s && s[0].toUpperCase() + s.slice(1)) || '';
  }

  /**
   * Fomats an comments data into html table rows
   * @param {arr} tableData data to convert to html the resides within the table content
   * @param {str} actionState the state that triggered this email
   * @returns {str} generated table row html containing the comments data
   * @author Varshini
   */
  function buildTableRowHtml(tableData, actionState) {
    let htmlToReturn = '';
    const tableData1Style = 'style="width:11%; padding: 5px; font-weight: bold;  vertical-align: top;"';
    const tableData2ResolveStyle = 'style="width:20%; padding: 5px; font-weight: normal;  vertical-align: top;"';
    const tableData2Style = 'style="width:7%; padding: 5px; font-weight: normal;  vertical-align: top;"';
    const tableData3Style = 'style="width:11%; padding: 5px; font-weight:bold; vertical-align: top;"';
    const tableData4ResolveStyle = 'style="width:56%; padding: 5px; font-weight:normal;  vertical-align: top;"';
    const tableData4Style = 'style="width:69%; padding: 5px; font-weight: normal;  vertical-align: top;"';

    htmlToReturn += '<table  width="100%" style="font-size:12px; vertical-align: text-top; border-collapse:collapse;">';
    htmlToReturn += '<tr style="border-bottom: 1px solid #c8c8c8; border-top: 1px solid #c8c8c8;">';
    htmlToReturn += `<td ${tableData1Style}>Comment added by:</td>`;
    htmlToReturn += `<td ${actionState === 'resolve' ? tableData2ResolveStyle : tableData2Style}>${tableData.nm_author}</td>`;
    htmlToReturn += '<td style="width:2%;"></td>';
    htmlToReturn += `<td ${tableData3Style}>Comment added on:</td>`;
    htmlToReturn += `<td ${actionState === 'resolve' ? tableData4ResolveStyle : tableData4Style}>${tableData.dt_last_update}</td>`;
    htmlToReturn += '</tr>';

    htmlToReturn += '<tr style="border-bottom: 1px solid #c8c8c8;">';
    htmlToReturn += `<td ${tableData1Style}>Action to be taken by:</td>`;
    htmlToReturn += `<td ${actionState === 'resolve' ? tableData2ResolveStyle : tableData2Style}>${tableData.location_author}</td>`;
    htmlToReturn += '<td style="width:2%;"></td>';

    if (actionState === 'add') {
      htmlToReturn += `<td ${tableData3Style}>Comment description:</td>`;
      htmlToReturn += `<td ${tableData4Style}>${tableData.desc_comment}</td>`;
    }
    if (actionState === 'update') {
      htmlToReturn += `<td ${tableData3Style}>Comment description:</td>`;
      htmlToReturn += `<td ${tableData4Style}>${tableData.desc_comment}</td>`;
    }
    if (actionState === 'delete') {
      htmlToReturn += `<td ${tableData3Style}>Deleted comment description:</td>`;
      htmlToReturn += `<td ${tableData4Style}>${tableData.desc_comment}</td>`;
    }
    if (actionState === 'resolve') {
      htmlToReturn += `<td ${tableData3Style}>Resolved by:</td>`;
      htmlToReturn += `<td ${tableData4ResolveStyle}>${tableData.resolve_author}</td>`;
    }

    htmlToReturn += '</tr>';
    if (actionState === 'resolve') {
      htmlToReturn += '<tr style="border-bottom: 1px solid #c8c8c8;">';
      htmlToReturn += `<td ${tableData1Style}>Resolved date:</td>`;
      htmlToReturn += `<td ${tableData2ResolveStyle}>${tableData.dt_resolve}</td>`;
      htmlToReturn += '<td style="width:2%;"></td>';
      htmlToReturn += `<td ${tableData3Style}>Resolution comments:</td>`;
      htmlToReturn += `<td ${tableData4ResolveStyle}>${tableData.desc_resolve}</td>`;
      htmlToReturn += '</tr>';
    }

    htmlToReturn += '<tr style="border-bottom: 1px solid #c8c8c8;">';
    htmlToReturn += `<td ${tableData1Style}>Resolution status:</td>`;
    htmlToReturn += `<td ${actionState === 'resolve' ? tableData2ResolveStyle : tableData2Style}>${tableData.resolve ? 'Resolved' : 'Unresolved'}</td>`;
    htmlToReturn += '<td style="width:2%;"></td>';
    htmlToReturn += '</tr>';
    htmlToReturn += '</table>';

    return htmlToReturn;
  }

  /**
   * Builds the emails user title and email title
   * @param {str} action the action that triggered this email
   * @param {obj} userObject object containing the initiating users information
   * @returns {obj} a object containing the emails title and the initiated users title
   * @author Varshini
   */
  function buildEmailHeadings(action, userObject, comment) {
    const actionStateObj = {
      delete: {
        by: 'Deleted By',
        heading: 'Deleted comment',
        subject: `${comment.location_type === 'msdocumentation' ? 'Microservice' : capitalizeFirstLetter(comment.location_type)} - Comment Deleted`,
      },
      add: {
        by: 'Created By',
        heading: 'Created comment',
        subject: `${comment.location_type === 'msdocumentation' ? 'Microservice' : capitalizeFirstLetter(comment.location_type)} - Comment Added`,
      },
      update: {
        by: 'Updated By',
        heading: 'Updated comment',
        subject: `${comment.location_type === 'msdocumentation' ? 'Microservice' : capitalizeFirstLetter(comment.location_type)} - Comment Updated`,
      },
      resolve: {
        by: 'Resolved By',
        heading: 'Resolved comment',
        subject: `${comment.location_type === 'msdocumentation' ? 'Microservice' : capitalizeFirstLetter(comment.location_type)} - Comment Resolved`,
      },
    };
    const titleObj = {
      userTitle: '',
      emailTitle: '',
    };

    let currentActionStateObj = actionStateObj[action];
    if (currentActionStateObj === undefined) {
      currentActionStateObj = { by: '', heading: '' };
      const errorText = 'Error: building asset email html could not match the assets action state.';
      adp.echoLog(errorText, currentActionStateObj, 500, packName, false);
    }

    titleObj.emailTitle = currentActionStateObj.heading;

    titleObj.userTitle += (currentActionStateObj.by.trim() === '' ? '' : `${currentActionStateObj.by}: `);
    titleObj.userTitle += (userObject.name === undefined ? '' : `${userObject.name} `);
    titleObj.userTitle += (userObject.signum === undefined || userObject.signum.trim() === '' ? '' : `- ${userObject.signum} `);
    titleObj.userTitle += (userObject.email === undefined || userObject.email.trim() === '' ? '' : `- ${userObject.email}`);
    titleObj.subject = currentActionStateObj.subject;
    return titleObj;
  }

  /**
   * Pieces together the email html data from all built data
   * @param {str} comment the comment object
   * @param {str} actionState the state that triggered this email
   * @param {obj} titleObj a object containing the emails title and the initiated users title
   * @param {str} tableHtml generated table html
   * @returns {str} full generated email html
   * @author Varshini
   */
  function generateTheHtmlBody(comment, actionState, titlesObj, tableHtml) {
    function getMailServiceBody() {
      return tableHtml;
    }
    return `
      <html style="width:100%; font-family: Oswald-Regular, Arial, sans-serif; font-size:12px" >
        <body>
          <div style="background-color:black; width:100%">
            <div style="border:15px solid #000">
              &nbsp;<span style="color: white;text-transform: uppercase; font-size:25px;">ADP</span>
            </div>
          </div>
          <p style="font-size: 10px">
            This is an automated e-mail notification from the <a href="https://adp.ericsson.se/marketplace">Microservices Marketplace</a>.<b>Do not reply to this e-mail.</b>
          </p>
          <h2 style="text-transform: capitalize;">
          ${comment.location_type === 'msdocumentation' ? 'Microservice' : capitalizeFirstLetter(comment.location_type)} : ${comment.location_title}
          </h2>
          <h2 style="font-size: 12px; text-align: left; background-color: #c8c8c8;  padding: 5px;">Comment details</h2>
          ${getMailServiceBody()}
          <br/>
          <p>
            <b>Regards<br/>
            ADP Portal Team</b>
          </p>
        </body>
      </html>`;
  }

  /**
   * Checks if all required data is given
   * @param {obj} mailObj the given mail object
   * @returns {bool} if the incoming data is valid
   * @author Varshini
   */
  function validateIncomingData(mailObj) {
    if (mailObj.comment === undefined || mailObj.comment.length === 0) {
      const errorText = 'Error: Could not generate email when asset data is empty.';
      adp.echoLog(errorText, { mailObj }, 500, packName, true);
      return false;
    }
    if (mailObj.action === undefined || mailObj.action.trim() === '') {
      const errorText = 'Error: Could not generate email when the asset action does not exist.';
      adp.echoLog(errorText, { mailObj }, 500, packName, true);
      return false;
    }
    if (mailObj.usr === undefined || mailObj.usr.length === 0) {
      const errorText = 'Error: Could not generate email when no user data is supplied.';
      adp.echoLog(errorText, { mailObj }, 500, packName, true);
      return false;
    }
    return true;
  }

  if (validateIncomingData(MAILOBJECT)) {
    const titlesObj = buildEmailHeadings(MAILOBJECT.action,
      MAILOBJECT.usr[0],
      MAILOBJECT.comment);
    const builtTableHtml = buildTableRowHtml(MAILOBJECT.comment, MAILOBJECT.action);
    if (builtTableHtml.trim() !== '') {
      emailHtml = generateTheHtmlBody(MAILOBJECT.comment, MAILOBJECT.action, titlesObj,
        builtTableHtml);

      MAILOBJECT.messageHTML = emailHtml;
      // eslint-disable-next-line no-param-reassign
      MAILOBJECT.subject = titlesObj.subject;
      // log email build success
      adp.echoLog('Email for asset action generated successful.', null, 200, packName);
      RESOLVE(MAILOBJECT);
    } else {
      const errMsg = 'Error: Build html data is returned empty.';
      adp.echoLog(errMsg, { builtTableHtml }, 500, packName, true);
      REJECT(errMsg);
    }
  } else {
    const errorMsg = 'Error: Could not generate email if the mailobj is missing curcial data.';
    adp.echoLog(errorMsg, { MAILOBJECT }, 500, packName, true);
    REJECT(errorMsg);
  }
});
