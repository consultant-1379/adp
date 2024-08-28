/**
 * Maps asset data to report headers
 * [ global.adp.quickReports.AssetReportMapHeaders ]
 * @param {array} assets list of full db asset objects to map
 * @param {object} headers asset report header object
 * @author Cein
 */
class AssemblyReportMapHeaders {
  constructor(dbAssets, headerObj) {
    this.givenAssets = dbAssets;
    this.headers = headerObj;
    this.dataObj = {
      data_overview: [],
      data_documentation: [],
      data_team: [],
      data_additional_information: [],
      data_services: [],
    };
    this.autoRepoUrls = {
      development: '',
      field_name: '',
    };
    this.packName = 'global.adp.quickReports.AssemblyReportMapHeaders';
  }

  /**
   * Converts array of denormalised tags into a comma separated string
   * of tags.
   * @param {Array} tags array of tags ids
   * @returns {string} comma seperated string of all tags
   * @author Cein
   */
  static denormalizeTags(tags) {
    let tagString = '';

    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach((tag) => {
        let denormTag = '';
        if (typeof tag === 'string') {
          denormTag = global.adp.tags.getLabel(tag);
        } else if (typeof tag === 'object' && tag.label) {
          denormTag = tag.label;
        }
        tagString += `${(tagString === '' ? '' : ', ')}${denormTag}`;
      });
    }
    return tagString;
  }

  /**
   * Builds the absolute document path from the repoUrl if needed.
   * @param {object} docObj the document object.
   * @param {string} repoUrl the related repoUrl.
   * @returns {string} the absolute document url path.
   * @author Cein
   */
  static getDocUrlPath(docObj, repoUrl) {
    let url = '';
    if (docObj.filepath) {
      const filepath = docObj.filepath.trim();
      url = `${repoUrl}${(repoUrl[(repoUrl.length - 1)] === '/' ? '' : '/')}${filepath}`;
    } else if (docObj.external_link) {
      url = docObj.external_link;
    } else {
      const errorText = 'Error in [ getDocUrlPath ]: No documentation filepath or external link found';
      const errorOBJ = {
        docObj,
        repoUrl,
      };
      adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
    }
    return url;
  }

  /**
   * Maps a header object to the asset object while mapping in denormalised items
   * @param {object} assetObj the asset object
   * @param {object} overviewHeaderObj the schema headers object for overview
   * @param {object} denormAssetObj the denormalised values of an asset
   * @returns {object} the report header mapped ojbect
   * @author Cein
   */
  static mapAsset(assetObj, overviewHeaderObj, denormAssetObj) {
    const { ...mappedAsset } = overviewHeaderObj;
    Object.keys(mappedAsset).forEach((assetKey) => {
      if (typeof assetObj[assetKey] !== 'undefined') {
        const dbval = assetObj[assetKey];
        const denormVal = denormAssetObj[assetKey];

        if (assetKey === 'tags') {
          mappedAsset[assetKey] = AssemblyReportMapHeaders.denormalizeTags(assetObj.tags);
        } else if (typeof denormVal !== 'undefined') {
          mappedAsset[assetKey] = (denormVal !== null ? denormVal : '');
        } else if (typeof dbval === 'boolean') {
          mappedAsset[assetKey] = (dbval ? 'Yes' : 'No');
        } else {
          mappedAsset[assetKey] = (dbval === null ? '' : dbval);
        }
        mappedAsset[assetKey] = Array.isArray(mappedAsset[assetKey]) ? mappedAsset[assetKey].join(', ') : mappedAsset[assetKey];
      } else {
        mappedAsset[assetKey] = '';
      }
    });

    return mappedAsset;
  }

  static mapComponentService(assemblyMS, componentServicesObj) {
    const denormAssemblyMS = [];
    assemblyMS.forEach((MS) => {
      const { ...mappedAsset } = componentServicesObj;
      Object.keys(mappedAsset).forEach((assetKey) => {
        if (typeof MS[assetKey] !== 'undefined') {
          const dbval = MS[assetKey];
          const denormVal = MS.denorm[assetKey];

          if (assetKey === 'tags') {
            mappedAsset[assetKey] = AssemblyReportMapHeaders.denormalizeTags(MS.tags);
          } else if (typeof denormVal !== 'undefined') {
            mappedAsset[assetKey] = (denormVal !== null ? denormVal : '');
          } else if (typeof dbval === 'boolean') {
            mappedAsset[assetKey] = (dbval ? 'Yes' : 'No');
          } else {
            mappedAsset[assetKey] = (dbval === null ? '' : dbval);
          }
          mappedAsset[assetKey] = Array.isArray(mappedAsset[assetKey]) ? mappedAsset[assetKey].join(', ') : mappedAsset[assetKey];
        } else {
          mappedAsset[assetKey] = '';
        }
      });
      denormAssemblyMS.push(mappedAsset);
    });

    return denormAssemblyMS;
  }

  /**
   * Maps a single document object to the document header
   * @param {object} docObj the denormalised document object from the documentsForRendering object
   * @param {object} docHeaderObj documentation report header object
   * @param {string} assetName the name of the service the team belongs to.
   * @param {string} docVer the version of the document
   * @param {string} menuAuto the string indicating manual or auto
   * @param {object} repoUrlObj containing the development & release repo urls
   * @param {boolean} isCpiUpdated flag indicating if the document version's CPI has been updated
   * @returns {object} the report header mapped document
   * @author Cein
   */
  static mapDoc(
    docObj,
    docHeaderObj,
    assetName,
    docVer,
    menuAuto,
    repoUrlObj,
    isCpiUpdated,
  ) {
    const mappedDoc = { ...docHeaderObj };
    const repoVersion = (docVer === 'development' ? 'development' : 'release');
    const repoObj = {
      repo_urls_development: repoUrlObj.development,
      repo_urls_release: repoUrlObj.release,
    };

    Object.keys(docHeaderObj).forEach((docKey) => {
      const value = docObj[docKey];
      if (docKey === 'service_name') {
        mappedDoc[docKey] = assetName;
      } else if (docKey === 'version') {
        mappedDoc[docKey] = (docVer === 'development' ? 'In Development' : docVer);
      } else if (docKey === 'category') {
        mappedDoc[docKey] = (docObj.category_name ? docObj.category_name : '');
      } else if (docKey === 'url') {
        mappedDoc[docKey] = AssemblyReportMapHeaders.getDocUrlPath(docObj, repoUrlObj[repoVersion]);
      } else if (docKey === 'menu_auto') {
        mappedDoc[docKey] = `${menuAuto[0].toUpperCase()}${menuAuto.substring(1)}`;
      } else if (docKey === 'repo_urls_development' || docKey === 'repo_urls_release') {
        mappedDoc[docKey] = repoObj[docKey];
      } else if (docKey === 'isCpiUpdated') {
        let cpiValue = '';

        if (typeof isCpiUpdated === 'undefined') {
          cpiValue = '';
        } else {
          cpiValue = isCpiUpdated ? 'Yes' : 'No';
        }

        mappedDoc[docKey] = cpiValue;
      } else if (typeof value === 'boolean' || docKey === 'restricted' || docKey === 'default') {
        mappedDoc[docKey] = (value ? 'Yes' : 'No');
      } else {
        mappedDoc[docKey] = (typeof value !== 'undefined' ? value : '');
      }
    });
    return mappedDoc;
  }

  /**
   * Maps an assets documents to the header object
   * @param {object} dbDocObj the documentsForRendering object from the microservice read function
   * @param {object} docHeaderObj documentation report header object
   * @param {string} assetName the name of the service the team belongs to.
   * @param {string} menuAuto the s   this.fromDate = fromDate;
    this.toDate = toDate;tring indicating manual or auto
   * @param {object} repoUrlObj containing the development & release repo urls
   * @returns {array} the heading aligned compliance data
   * @author Cein
   */
  static mapDocs(dbDocObj, docHeaderObj, assetName, menuAuto, repoUrlObj) {
    const docReport = [];

    Object.keys(dbDocObj).forEach((docVer) => {
      const verObj = dbDocObj[docVer];
      Object.keys(verObj).forEach((docCatSlug) => {
        if (docCatSlug !== 'versionLabel' && docCatSlug !== 'isCpiUpdated') {
          const docArr = verObj[docCatSlug];
          docArr.forEach((docObj) => {
            docReport.push(AssemblyReportMapHeaders.mapDoc(
              docObj, docHeaderObj, assetName, docVer, menuAuto, repoUrlObj, verObj.isCpiUpdated,
            ));
          });
        }
      });
    });

    return docReport;
  }

  /**
   * maps the team data to the report team headers
   * @param {array} dbAssetTeam list of denormalised team members
   * @param {object} teamHeader team report header object
   * @param {string} assetName the name of the service the team belongs to.
   * @param {array} denormTeams denormalised team array.
   * @returns {array} the heading aligned team data
   * @author Cein
   */
  static mapTeamData(dbAssetTeam, teamHeader, assetName, denormTeams) {
    const teamArr = [];

    dbAssetTeam.forEach((teamObj, teamIndex) => {
      const newRow = { ...teamHeader };
      const denormTeam = denormTeams[teamIndex];
      Object.keys(teamHeader).forEach((headerKey) => {
        if (headerKey === 'service_name') {
          newRow.service_name = assetName;
          return;
        } if (headerKey === 'serviceOwner') {
          newRow.serviceOwner = (teamObj.serviceOwner ? 'Yes' : 'No');
          return;
        } if (headerKey === 'team_role') {
          newRow.team_role = (denormTeam && denormTeam.team_role ? denormTeam.team_role : '');
        } else {
          newRow[headerKey] = (teamObj[headerKey] ? teamObj[headerKey] : '');
        }
      });
      teamArr.push(newRow);
    });
    return teamArr;
  }

  /**
   * maps the additional information - tutorials / demo data to
   * report additional information headers
   * @param {array} dbAssetAddInfo list of additional information details
   * @param {object} addInfoHeader Additional Information report header object
   * @param {string} assetName the name of the service the team belongs to.
   * @returns {array} the heading aligned additional information data
   * @author Ravikiran G [zgarsri]
   */
  static mapAdditionalInfoData(dbAssetAddInfo, addInfoHeader, assetName) {
    const addInfoArr = [];
    if (dbAssetAddInfo !== undefined) {
      dbAssetAddInfo.forEach((addInfoObj) => {
        const newRow = { ...addInfoHeader };
        Object.keys(addInfoHeader).forEach((headerKey) => {
          if (headerKey === 'service_name') {
            newRow.service_name = assetName;
            return;
          }
          newRow[headerKey] = (addInfoObj[headerKey] !== null && addInfoObj[headerKey] !== undefined) ? addInfoObj[headerKey] : '';
        });
        addInfoArr.push(newRow);
      });
    }
    return addInfoArr;
  }

  /**
   * Get Async data required for the report
   * @param {object} compHead the compliance header object
   * @returns {promise} object containing ComplianceQues and Contributors data
   * @author Tirth
   */
  // eslint-disable-next-line class-methods-use-this
  getAsyncData(assemblyObj) {
    return new Promise((RESOLVE, REJECT) => {
      adp.assembly.getComponentServicesFromAssembly(assemblyObj).then((ASSEMBLYMS) => {
        RESOLVE(ASSEMBLYMS);
      }).catch((ERROR) => { REJECT(ERROR); });
    });
  }

  /**
   * Maps all asset data to the given headers
   * @returns {promise} object containing the headers and the data mapped into rows
   * @author Cein
   */
  mapAllHeaders() {
    return new Promise(async (resolve, reject) => {
      const assets = this.givenAssets;
      const {
        heading_overview: ovHead,
        heading_documentation: docHead,
        heading_team: teamHead,
        heading_additional_information: addInfoHead,
        heading_services: svHead,
      } = this.headers;
      const dataObj = { ...this.dataObj };

      this.getAsyncData(this.givenAssets).then((Data) => {
        dataObj.data_services = AssemblyReportMapHeaders.mapComponentService(Data, svHead);
        assets.forEach((assetObj) => {
          const {
            name,
            menu_auto: menuAutoBool,
            denorm: denormAsset,
            documentsForRendering: docObj,
            repo_urls: repoUrls,
          } = assetObj;

          let menuAuto = '';
          if (denormAsset && denormAsset.menu_auto) {
            menuAuto = denormAsset.menu_auto;
          } else {
            menuAuto = (menuAutoBool ? 'Automated' : 'Manual');
          }

          const denormTeam = (denormAsset && denormAsset.team ? denormAsset.team : []);
          // eslint-disable-next-line max-len
          dataObj.data_overview.push(AssemblyReportMapHeaders.mapAsset(assetObj, ovHead, denormAsset));
          dataObj.data_documentation.push(
            ...AssemblyReportMapHeaders.mapDocs(docObj, docHead, name, menuAuto, repoUrls),
          );
          dataObj.data_team.push(
            ...AssemblyReportMapHeaders.mapTeamData(assetObj.team, teamHead, name, denormTeam),
          );
          dataObj.data_additional_information.push(
            ...AssemblyReportMapHeaders.mapAdditionalInfoData(assetObj.additional_information,
              addInfoHead, name),
          );
        });

        const report = { ...this.headers, ...dataObj };
        resolve(report);
      }).catch((errorCompServ) => {
        reject(errorCompServ);
      });
    });
  }
}

module.exports = AssemblyReportMapHeaders;
