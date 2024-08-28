/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */

/**
* [ adp.AssetValidation.AssetValidationClass ]
* @author Tirth [zpiptir]
*/
class AssetValidationClass {
  constructor(TYPE = 'microservice') {
    this.type = TYPE;
    this.packName = 'adp.AssetValidation.AssetValidationClass';
    this.serviceMaturityRequiresGIT = [5, 6, 7, 8];
    this.serviceMaturityRequiresHelm = [5, 6, 7];
  }

  domainValidation(ASSETOBJ) {
    if (ASSETOBJ.assembly_category === 1) {
      if (ASSETOBJ.domain === 1) {
        return true;
      } return false;
    } if (ASSETOBJ.domain === undefined) {
      return false;
    } if (ASSETOBJ.domain === 1) {
      return false;
    } return true;
  }

  gitValidation(ASSETOBJ) {
    switch (this.type) {
      case 'microservice':
        if (this.serviceMaturityRequiresGIT.includes(ASSETOBJ.service_maturity)) {
          // service_maturity requires git url
          if (ASSETOBJ.giturl === undefined || ASSETOBJ.giturl.trim() === '') {
            return false;
          }
        } return true;
      case 'assembly':
        if (ASSETOBJ.giturl === undefined || ASSETOBJ.giturl.trim() === '') {
          return false;
        } return true;
      default:
        break;
    }
  }

  helmUrlValidation(ASSETOBJ) {
    switch (this.type) {
      case 'microservice':
        if (this.serviceMaturityRequiresHelm.includes(ASSETOBJ.service_maturity)) {
          // service_maturity requires helm url
          if (ASSETOBJ.helmurl === undefined || ASSETOBJ.helmurl.trim() === '') {
            return false;
          }
        }
        return true;
      case 'assembly':
        if (ASSETOBJ.assembly_maturity === 2 && (ASSETOBJ.helmurl === undefined || ASSETOBJ.helmurl.trim() === '')) {
          return false;
        } return true;
      default:
        break;
    }
  }

  helmChartNameValidation(ASSETOBJ) {
    switch (this.type) {
      case 'microservice':
        if (this.serviceMaturityRequiresHelm.includes(ASSETOBJ.service_maturity)) {
          if (ASSETOBJ.helm_chartname === undefined || ASSETOBJ.helm_chartname.trim() === '') {
            return false;
          }
        }
        return true;
      case 'assembly':
        if (ASSETOBJ.assembly_maturity === 2 && (ASSETOBJ.helm_chartname === undefined || ASSETOBJ.helm_chartname.trim() === '')) {
          return false;
        } return true;
      default:
        break;
    }
  }

  restrictedvalidation(ASSETOBJ) {
    if (ASSETOBJ.service_maturity === 6 && ASSETOBJ.restricted === undefined) {
      return false;
    }
    return true;
  }

  restrictedDescriptionValidation(ASSETOBJ) {
    if (ASSETOBJ.restricted === 1 || ASSETOBJ.restricted === '1') {
      if (ASSETOBJ.restricted_description !== null
            && ASSETOBJ.restricted_description !== undefined
            && typeof ASSETOBJ.restricted_description === 'string'
            && ASSETOBJ.restricted_description.trim().length > 0) {
        return true;
      } return false;
    } return true;
  }

  additionalInfoValidation(ASSETOBJ) {
    let errorOnAdditionalInfo = null;
    if (Array.isArray(ASSETOBJ.additional_information)) {
      if (ASSETOBJ.additional_information.length !== 0) {
        ASSETOBJ.additional_information.forEach((ADDITIONALINFO) => {
          if (ADDITIONALINFO.category === undefined
                    || ADDITIONALINFO.category === ''
                    || ADDITIONALINFO.title === undefined
                    || ADDITIONALINFO.title === ''
                    || ADDITIONALINFO.link === undefined
                    || ADDITIONALINFO.link === '') {
            errorOnAdditionalInfo = ['category / title / link should not be \'none\' when [additional_information] is added'];
          }
        });
      }
    }
    if (errorOnAdditionalInfo !== null) {
      return errorOnAdditionalInfo;
    } return errorOnAdditionalInfo;
  }

  checkCPIValidation(ASSETOBJ) {
    switch (this.type) {
      case 'microservice':
        return true;
      case 'assembly':
        if (ASSETOBJ.assembly_category !== 1) {
          if (ASSETOBJ.check_cpi === undefined) {
            return true;
          } return false;
        } return true;
      default:
        break;
    }
  }

  async tagsValidation(ASSETOBJ, USR) {
    let tagCheckRes = null;
    if (ASSETOBJ.tags !== null && ASSETOBJ.tags !== undefined) {
      await global.adp.tags.checkIt(ASSETOBJ.tags, USR)
        .then((RES) => {
          tagCheckRes = RES;
          return tagCheckRes;
        })
        .catch((ERR) => {
          tagCheckRes = ERR;
        });
    }
    return tagCheckRes;
  }

  async componentServiceValidation(ASSETOBJ) {
    const dbModel = new adp.models.Adp(['microservice']);
    const componentService = [];
    await dbModel.getByNameIfIsNotTheIDByType(ASSETOBJ.component_service)
      .then((RESULT) => {
        if (RESULT.docs.length > 0) {
          componentService.push(...RESULT.docs.map(({ _id }) => _id));
        }
      })
      .catch(ERROR => ERROR);
    return componentService;
  }

  async uniqueAssetNameCheck(ASSETNAME) {
    let uniqueCheck = null;
    await global.adp.microservice.checkName(ASSETNAME)
      .then(() => {
        uniqueCheck = true;
      })
      .catch((ERROR) => {
        if (ERROR === 'DUPLICATE') {
          uniqueCheck = false;
        }
      });
    return uniqueCheck;
  }

  /**
    * Internal. This code should be called three times.
    * Only activate the notification and save the changes into ADPLogs
    * @param {String} ID Microservice ID.
    * @param {Object} ASSET Asset Object.
    * @return Return ID for OK, Code 500 if something went wrong.
    * @author Armando Dias [zdiaarm]
    */
  async notifyAndLogIt(ID, ASSET, USR) {
    const timer = new Date();
    await global.adp.notification.sendAssetMail(USR, 'create', ASSET)
      .then(() => {
        const endTimer = new Date();
        adp.echoLog(`Asset "${ASSET.name}" created by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, this.packName);
      })
      .catch((ERR) => {
        adp.echoLog('Error in [ adp.notification.sendAssetMail ]', { error: ERR }, 500, this.packName, true);
      });
    global.adp.microservice.CRUDLog(ASSET, {}, 'new', USR);
    return ID;
  }

  /**
 * Creates a team history snapshot if there is a change in
 * the team(mailers and contribute flow team)
 * @param {object} newMS new microservice object version ready for saving
 * @param {object} oldMS current db microservice object version
 * @author Omkar
 */
  async teamHistoryCheck(newMS, oldMS) {
    const { areArraysSame } = adp.notification.processEmailObject;
    const mailersChange = !areArraysSame(newMS.team_mailers, oldMS.team_mailers);
    const contriTeamChange = !areArraysSame(newMS.team, oldMS.team);
    if (mailersChange || contriTeamChange) {
      const teamHistInst = new adp.teamHistory.TeamHistoryController();
      teamHistInst.fetchLatestSnapshotsMsList([newMS]);
    }
  }
}

module.exports = AssetValidationClass;
