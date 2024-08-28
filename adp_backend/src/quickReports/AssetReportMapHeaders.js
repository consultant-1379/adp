/**
 * Maps asset data to report headers
 * [ global.adp.quickReports.AssetReportMapHeaders ]
 * @param {array} assets list of full db asset objects to map
 * @param {object} headers asset report header object
 * @author Cein
 */
class AssetReportMapHeaders {
  constructor(dbAssets, headerObj, fromDate, toDate) {
    this.givenAssets = dbAssets;
    this.headers = headerObj;
    this.dataObj = {
      data_overview: [],
      data_documentation: [],
      data_compliance: [],
      data_team: [],
      data_additional_information: [],
      data_contributors: [],
    };
    this.autoRepoUrls = {
      development: '',
      field_name: '',
    };
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.packName = 'global.adp.quickReports.AssetReportMapHeaders';
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
          mappedAsset[assetKey] = AssetReportMapHeaders.denormalizeTags(assetObj.tags);
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
        mappedDoc[docKey] = AssetReportMapHeaders.getDocUrlPath(docObj, repoUrlObj[repoVersion]);
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
   * @param {string} menuAuto the string indicating manual or auto
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
            docReport.push(AssetReportMapHeaders.mapDoc(
              docObj, docHeaderObj, assetName, docVer, menuAuto, repoUrlObj, verObj.isCpiUpdated,
            ));
          });
        }
      });
    });

    return docReport;
  }

  /**
   * Maps an assets compliance to the denormalised data and compliance header questions object
   * @param {array} compOptsArr the compliance list of questions objects
   * @param {array} denormCompArr the denormalised compliance answer objects
   * @param {string} assetName the name of the service the team belongs to.
   * @returns {array} the heading questions aligned compliance data
   * @author Cein
   */
  static mapCompliance(compOptsArr, denormCompArr, assetName) {
    const compRows = compOptsArr;
    const updatedRows = [];
    compRows.forEach((standCompRow) => {
      const newRow = { ...standCompRow };
      newRow.service_name = assetName;
      const foundDenormObj = denormCompArr
        .find(denormObj => (newRow.group === denormObj.group && newRow.name === denormObj.name));

      if (foundDenormObj) {
        newRow.status = foundDenormObj.status;
        newRow.comment = foundDenormObj.comment;
      }
      updatedRows.push(newRow);
    });

    return updatedRows;
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
   * maps the contributors data to the report contributors headers
   * @param {array} contriData list commits data for asset
   * @param {object} contriHeader contribute report header object
   * @param {string} assetName the name of the service
   * @returns {array} the heading aligned contributors data
   * @author Omkar, Michael
   */
  static mapContributors(contriData, contriHeader, assetName, fromDate, toDate) {
    const ContrArr = [];
    contriData.forEach((contObj) => {
      const newRow = { ...contriHeader };
      Object.keys(contriHeader).forEach((headerKey) => {
        if (headerKey === 'service_name') {
          newRow.service_name = assetName;
        } else if (headerKey === 'from_date') {
          newRow.from_date = fromDate;
        } else if (headerKey === 'to_date') {
          newRow.to_date = toDate;
        } else {
          // Value can be 0 and should be considered
          newRow[headerKey] = (contObj[headerKey] !== null && contObj[headerKey] !== undefined) ? contObj[headerKey] : '';
        }
      });
      ContrArr.push(newRow);
    });
    return ContrArr;
  }

  /**
   * squashes the compliance denormalised values into a single layer object
   * per array item
   * @param {array} compDenormArr list of raw compliance object from the microservice read method
   * @returns {array} denormalised array with a full object set
   * @author Cein
   */
  static flattenCompDenormList(compDenormArr) {
    const flatDenormCompArr = [];

    compDenormArr.forEach((groupObj) => {
      const { group, fields } = groupObj;
      fields.forEach((fieldObj) => {
        const flatDenormObj = {};
        const { field: name, answer: status, comment } = fieldObj;
        flatDenormObj.group = group;
        flatDenormObj.name = name;
        flatDenormObj.status = status;
        flatDenormObj.comment = comment;
        flatDenormCompArr.push(flatDenormObj);
      });
    });
    return flatDenormCompArr;
  }

  /**
   * builds a standard compliance report array from the compliance headers
   * @param {array} compGroup the compliance options group array that also contains the
   * compliance fields
   * @param {object} compHeaderObj compliance report headers to align the data to
   * @param {string} defaultStatus the default status value
   * @returns {array} standard list of compliance options without service owner results
   * @author Cein
   */
  static buildStandardCompQues(compGroup, compHeaderObj, defaultStatus) {
    const standCompArr = [];
    if (Object.keys(compHeaderObj).length && compHeaderObj.constructor === Object) {
      compGroup.forEach((groupObj) => {
        const { group, fields } = groupObj;
        fields.forEach((fieldObj) => {
          const { slug, name, desc: description } = fieldObj;
          const valueObj = {
            group, slug, name, description,
          };

          const compHeader = { ...compHeaderObj };

          Object.keys(compHeader).forEach((headerkey) => {
            const value = (headerkey === 'status' ? defaultStatus : '');

            compHeader[headerkey] = (valueObj[headerkey] ? valueObj[headerkey] : value);
          });
          standCompArr.push(compHeader);
        });
      });
    }

    return standCompArr;
  }

  /**
   * Fetches all the compliance questions and aligns them to the compliance headers
   * @param {object} compHead the compliance header object
   * @returns {array} of compliance questions aligned to compliance headers
   * @author Cein
   */
  getComplianceQues(compHead) {
    return new Promise((resolve, reject) => {
      const readcompOptions = global.adp.compliance.readComplianceOptions;
      readcompOptions.getComplianceOptions().then((compStr) => {
        const rawCompOptsObj = JSON.parse(compStr);
        let defaultCompStatus = '';
        const defaultObj = rawCompOptsObj.answers.find(compAnsObj => (compAnsObj.default));
        if (defaultObj && defaultObj.name) {
          defaultCompStatus = defaultObj.name;
        }

        const compOptsArr = AssetReportMapHeaders.buildStandardCompQues(
          rawCompOptsObj.groups, compHead, defaultCompStatus,
        );
        if (compOptsArr.length > 0) {
          resolve(compOptsArr);
        } else {
          const error = 'Unable to fetch compliance options';
          reject(error);
        }
      }).catch((errorFetchCompOpts) => {
        const errorText = 'Error in [ readcompOptions.getComplianceOptions ]';
        const errorOBJ = {
          error: errorFetchCompOpts,
        };
        adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
        reject(errorFetchCompOpts);
      });
    });
  }

  /**
   * Get Contributors data required for the report
   * @returns {promise} object containing Contributors data
   * @author Omkar, Michael
   */
  getContributorsData() {
    return new Promise((RES, REJ) => {
      const ids = this.givenAssets.map(asset => asset._id);
      const dbModelGitstatus = new adp.models.Gitstatus();
      dbModelGitstatus.getDataForReport(ids, this.fromDate, this.toDate).then((RESULT) => {
        RES(RESULT.docs);
      })
        .catch((ERR) => {
          adp.echoLog({
            code: 500,
            message: 'Git Status Model Failure',
            data: { error: ERR, ids, origin: 'getContributorsData' },
          });
          REJ(ERR);
        });
    });
  }

  /**
   * Get Async data required for the report
   * @param {object} compHead the compliance header object
   * @returns {promise} object containing ComplianceQues and Contributors data
   * @author Omkar
   */
  getAsyncData(compHead) {
    return new Promise((RESOLVE, REJECT) => {
      const allPromise = [];
      allPromise.push(this.getComplianceQues(compHead));
      allPromise.push(this.getContributorsData());
      Promise.all(allPromise).then((Result) => {
        const Response = {};
        Response.compOptsArr = Result[0] || [];
        Response.contriData = Result[1] || [];
        RESOLVE(Response);
      })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
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
        heading_compliance: compHead,
        heading_team: teamHead,
        heading_additional_information: addInfoHead,
        heading_contributors: contHead,
      } = this.headers;
      const dataObj = { ...this.dataObj };

      this.getAsyncData(compHead).then((Data) => {
        const { compOptsArr, contriData } = Data;
        assets.forEach((assetObj) => {
          const {
            name,
            menu_auto: menuAutoBool,
            denorm: denormAsset,
            documentsForRendering: docObj,
            repo_urls: repoUrls,
          } = assetObj;
          const contriDataForAsset = contriData.filter(commit => commit.asset_id === assetObj._id);
          let menuAuto = '';
          if (denormAsset && denormAsset.menu_auto) {
            menuAuto = denormAsset.menu_auto;
          } else {
            menuAuto = (menuAutoBool ? 'Automated' : 'Manual');
          }

          const deCompArr = (denormAsset && denormAsset.compliance ? denormAsset.compliance : []);
          const flatDenormComp = AssetReportMapHeaders.flattenCompDenormList(deCompArr);
          const denormTeam = (denormAsset && denormAsset.team ? denormAsset.team : []);

          dataObj.data_overview.push(AssetReportMapHeaders.mapAsset(assetObj, ovHead, denormAsset));
          dataObj.data_documentation.push(
            ...AssetReportMapHeaders.mapDocs(docObj, docHead, name, menuAuto, repoUrls),
          );
          dataObj.data_compliance.push(
            ...AssetReportMapHeaders.mapCompliance(compOptsArr, flatDenormComp, name),
          );
          dataObj.data_team.push(
            ...AssetReportMapHeaders.mapTeamData(assetObj.team, teamHead, name, denormTeam),
          );
          dataObj.data_additional_information.push(
            ...AssetReportMapHeaders.mapAdditionalInfoData(assetObj.additional_information,
              addInfoHead, name),
          );
          dataObj.data_contributors.push(
            ...AssetReportMapHeaders.mapContributors(
              contriDataForAsset,
              contHead,
              name,
              this.fromDate,
              this.toDate,
            ),
          );
        });
        const report = { ...this.headers, ...dataObj };
        resolve(report);
      }).catch((errorCompQues) => {
        reject(errorCompQues);
      });
    });
  }
}

module.exports = AssetReportMapHeaders;
