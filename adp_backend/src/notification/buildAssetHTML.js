/* eslint-disable no-param-reassign */
// ============================================================================================= //
/**
* [ global.adp.notification.buildAssetHTML ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MAILOBJECT => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.notification.buildAssetHTML';

  let emailHtml = '';
  const isUpdate = state => state === 'update' || state === 'updateadminnotify';
  /**
   * Builds the html of a group of items in a single row
   * @param {arr} itemGroupArray the group of children items to fit within the row
   * @param {str} dataColumnStyle they inline css styles of the column
   * @returns {str} html of a items group data that will be inserted into a single row
   * @author Cein
   */
  function itemGroupHtmlBuild(itemGroupArray, dataColumnStyle) {
    let htmlToReturn = `<td ${dataColumnStyle}>`;
    if (Array.isArray(itemGroupArray)) {
      for (let itemIndex = 0; itemIndex < itemGroupArray.length; itemIndex += 1) {
        const itemObj = itemGroupArray[itemIndex];
        if (itemObj.value) {
          if (typeof itemObj.value === 'boolean') {
            if (itemObj.value) {
              const fieldName = (itemObj.field !== undefined && itemObj.field.trim() !== '' ? `${itemObj.field}` : '');
              htmlToReturn += `${fieldName}`;
            }
          } else {
            const fieldName = (itemObj.field !== undefined && itemObj.field.trim() !== '' ? `${itemObj.field}:` : '');
            htmlToReturn += `${fieldName} ${itemObj.value}`;
          }
          htmlToReturn += (itemIndex === (itemGroupArray.length - 1) ? '' : '<br/>');
        }
      }
    }
    htmlToReturn += '</td>';

    return htmlToReturn;
  }

  /**
   * Fomats an assets data into html table rows
   * @param {arr} tableDataArray data to convert to html the resides within the table content
   * @param {str} actionState the state that triggered this email
   * @returns {str} generated table row html containing the assets state data
   * @author Cein
   */
  function buildTableRowHtml(tableDataArray, actionState) {
    let htmlToReturn = '';
    if (actionState === 'changedomainnotify') {
      const oldDomain = tableDataArray[0].oldvalue ? tableDataArray[0].oldvalue : 'Common Asset';
      const newDomain = tableDataArray[0].value ? tableDataArray[0].value : 'Common Asset';
      return `<span>The domain of service is changed from ${oldDomain} to ${newDomain}.
      If you are an admin of Domain ${newDomain}, you will continue to receive the updates for this service</span>`;
    }
    const firstRowStyle = 'style="text-transform : capitalize;border-top: 1px solid #CCC;vertical-align:top"';
    const dataColumnStyle = 'style="border-top: 1px solid #CCC;"';

    if (Array.isArray(tableDataArray)) {
      tableDataArray.forEach((firstLevelObj) => {
        const highlightWhenChanged = firstLevelObj.highlight;
        if (firstLevelObj.items.values.length > 0 || firstLevelObj.items.oldValues.length > 0) {
          // rows to one parent label
          let largestArrayCount = 0;
          const itemsValuesArray = firstLevelObj.items.values;
          const itemsOldValuesArray = firstLevelObj.items.oldValues;
          largestArrayCount = (itemsValuesArray.length > itemsOldValuesArray.length
            ? itemsValuesArray.length : itemsOldValuesArray.length);

          for (let itemLevelIndex = 0; itemLevelIndex < largestArrayCount; itemLevelIndex += 1) {
            htmlToReturn += '<tr>';
            // first column
            if (itemLevelIndex === 0) {
              htmlToReturn += `<td ${firstRowStyle} ><b>${firstLevelObj.field}</b></td>`;
            } else {
              htmlToReturn += '<td></td>';
            }
            // second col
            htmlToReturn += itemGroupHtmlBuild(itemsValuesArray[itemLevelIndex], dataColumnStyle);
            // third col
            if (isUpdate(actionState)) {
              htmlToReturn
              += itemGroupHtmlBuild(itemsOldValuesArray[itemLevelIndex], dataColumnStyle);
            }
            htmlToReturn += '</tr>';
          }
        } else {
          const textFormat = (textValue) => {
            if (textValue === undefined || textValue === null) {
              textValue = '';
            }
            if (highlightWhenChanged) {
              return `<span style="color:red">${textValue}</span>`;
            }
            return textValue;
          };
          // build single row
          htmlToReturn += `<tr>
          <td ${firstRowStyle} ><b>${textFormat(firstLevelObj.field)}</b></td>
          <td ${dataColumnStyle} >${textFormat(firstLevelObj.value)}</td>`;
          htmlToReturn += (isUpdate(actionState) ? `<td ${dataColumnStyle}>${textFormat(firstLevelObj.oldvalue)}</td>` : '');
          htmlToReturn += '</tr>';
        }
      });
    }
    return htmlToReturn;
  }

  /**
   * Builds the emails user title and email title
   * @param {str} action the action that triggered this email
   * @param {obj} userObject object containing the initiating users information
   * @returns {obj} a object containing the emails title and the initiated users title
   * @author Cein
   */
  function buildEmailHeadings(action, userObject, asset) {
    const assetName = asset.name;
    let assetTypes = '';
    let assetType = asset.type;
    if (typeof assetType === 'string' && assetType.length > 0) {
      assetType = assetType.charAt(0).toUpperCase() + assetType.slice(1);
      assetTypes = assetType === 'Microservice' ? 'Microservices' : 'Assemblies';
    }

    const actionStateObj = {
      delete: {
        by: 'Deleted By',
        heading: `Deleted ${assetType}`,
        subject: `${assetTypes} Marketplace – ${assetName} Deleted`,
      },
      create: {
        by: 'Created By',
        heading: `New ${assetType} Properties`,
        subject: `${assetTypes} Marketplace – ${assetName} Created`,
      },
      update: {
        by: 'Updated By',
        heading: 'Change Log',
        subject: `${assetTypes} Marketplace – ${assetName} Updated`,
      },
      changedomainnotify: {
        by: 'Updated By',
        heading: '',
        subject: `${assetName}: Domain Changed`,
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
   * @param {str} assetName the name of the asset
   * @param {str} actionState the state that triggered this email
   * @param {obj} titleObj a object containing the emails title and the initiated users title
   * @param {str} tableHtml generated table html
   * @param {str} serviceSlug the slug of the service used for making links
   * @returns {str} full generated email html
   * @author Cein
   */
  function generateTheHtmlBody(assetName, actionState, titlesObj, tableHtml, serviceSlug) {
    let assetType = '';
    let assetTypes = '';
    if (MAILOBJECT && MAILOBJECT.asset && MAILOBJECT.asset.type) {
      assetType = MAILOBJECT.asset.type;
      if (typeof assetType === 'string' && assetType.length > 0) {
        assetType = assetType.charAt(0).toUpperCase() + assetType.slice(1);
        assetTypes = assetType === 'Microservice' ? 'Microservices' : 'Assemblies';
      }
    }
    const tableHeaderStyle = 'style="font-size: 12px; text-align: left; background-color: #c8c8c8; padding: 5px;"';
    const serviceLink = actionState !== 'delete' ? `<br>Link: <a href="${global.adp.config.baseSiteAddress}/marketplace/${serviceSlug}">${assetName}</a>` : '';
    function getMailServiceBody() {
      if (actionState === 'changedomainnotify') {
        return tableHtml;
      }
      return `<table width="100%" style="font-size:12px; vertical-align: text-top;" class="emailTable">
          <tr>
            <th ${tableHeaderStyle}></th>
            ${(isUpdate(actionState) ? `<th width="40%" ${tableHeaderStyle}><b>Updated</b></th>` : '')}
            <th width="${(isUpdate(actionState) ? '40%' : '60%')}" ${tableHeaderStyle} >
              <b>${(isUpdate(actionState) ? 'Original' : '')}</b>
            </th>
          </tr>
          ${tableHtml}
        </table>`;
    }
    return `
      <style>
        .emailTable tr td:first-child{
          text-transform: capitalize;
        }
      </style>
      <html style="width:100%; font-family: Oswald-Regular, Arial, sans-serif; font-size:12px" >
        <body>
          <div style="background-color:black; width:100%">
            <div style="border:15px solid #000">
              &nbsp;<span style="color: white;text-transform: uppercase; font-size:25px;">ADP</span>
            </div>
          </div>
          <p style="font-size: 10px">
            This is an automated e-mail notification from the <a href="https://adp.ericsson.se/marketplace">${assetTypes} Marketplace</a>.<b>Do not reply to this e-mail.</b>
          </p>
          <h2>
            <${assetType} : ${assetName} <br/>
            <span style="font-size: 10px">
              ${titlesObj.userTitle}
            </span>
          </h2>
          <h3>${titlesObj.emailTitle}</h3>
          ${getMailServiceBody()}
          <br/>
          ${serviceLink}
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
   * @author Cein
   */
  function validateIncomingData(mailObj) {
    if (mailObj.assetData === undefined || mailObj.assetData.length === 0) {
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
      MAILOBJECT.asset,
      MAILOBJECT.assetData);
    const builtTableHtml = buildTableRowHtml(MAILOBJECT.assetData, MAILOBJECT.action);
    if (builtTableHtml.trim() !== '') {
      emailHtml = generateTheHtmlBody(MAILOBJECT.asset.name, MAILOBJECT.action, titlesObj,
        builtTableHtml, MAILOBJECT.asset.slug);
      // eslint-disable-next-line no-param-reassign
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
