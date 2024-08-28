/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-concat */
/* eslint-disable space-infix-ops */
// ============================================================================================= //
/**
* [ adp.mimer.MimerTranslation ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class MimerControlClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.mimer.MimerTranslation';
    this.apiURL = adp.config.primDDServer;
    this.XMLParser = new global.FastXmlParser.XMLParser();
    this.headers = { Authorization: `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}` };
  }


  /**
   * _getMimerTableFromDatabase ( PRIVATE )
   * Get the comparison table from database.
   * @returns Promise with the object with
   * the table content.
   * @author Tirth [zpiptir]
   */
  _getMimerTableFromDatabase() {
    const primeDDTable = new adp.models.PrimeDDTable();
    return primeDDTable.getAll()
      .then((RESPONSE) => {
        const primeDDTableObject = {};
        RESPONSE.docs.forEach((DOCTYPE) => {
          const objKey = DOCTYPE.slug;
          const descriptor = {
            value: DOCTYPE,
            enumerable: true,
          };

          Object.defineProperty(primeDDTableObject, objKey, descriptor);
        });
        return new Promise(RES => RES(primeDDTableObject));
      })
      .catch((ERROR) => {
        const errorLogObject = errorLog(404, 'Error caught from [ getAdll @ adp.models.PrimeDDTable ] at _getMimerTableFromDatabase',
          ERROR, 'main', this.packName);
        return new Promise((RES, REJ) => REJ(errorLogObject));
      });
  }


  /**
   * _getMicroservice ( PRIVATE )
   * Get the microservice from database.
   * @param MSID String with the document number.
   * @returns Promise with the MS Object.
   * @author Armando Dias [zdiaarm]
   */
  _getMicroservice(MSID) {
    const adpModel = new adp.models.Adp();
    return adpModel.getOneById(MSID)
      .then((MS) => {
        if (!(MS) || !(MS.docs) || !(Array.isArray(MS.docs)) || MS.docs.length === 0) {
          const errorCode = 404;
          const errorMessage = 'Error caught because [ getOneById @ adp.models.Adp ] returned empty.';
          const errorObject = { microserviceID: MSID };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getMicroservice', this.packName);
          return new Promise((RES, REJ) => REJ(errorLogObject));
        }
        return new Promise(RES => RES(MS.docs[0]));
      });
  }


  /**
   * _getDocumentation ( PRIVATE )
   * Get the specific document from database.
   * @param ASSETID String with the asset id.
   * @param DOCUMENTID String with the document number.
   * @param REVISION String with the document revision.
   * @param LANGUAGE String with the document language.
   * @param TYPE String with the type of the document.
   * @param VERSION String with the version of the document.
   * @returns Promise with the Document Object.
   * @author Armando Dias [zdiaarm]
   */
  _getDocumentation(ASSETID, DOCUMENTID, REVISION, LANGUAGE, TYPE, VERSION) {
    const assetDocumentsModel = new adp.models.AssetDocuments();
    return assetDocumentsModel.getSpecificDocument(
      ASSETID,
      DOCUMENTID,
      REVISION,
      LANGUAGE,
      TYPE,
      VERSION,
    )
      .then((DOCUMENT) => {
        if (!DOCUMENT) {
          const errorCode = 404;
          const errorMessage = 'Error caught because [ getSpecificDocument @ adp.models.AssetDocuments ] returned empty.';
          const errorObject = {
            assetID: ASSETID,
            documentID: DOCUMENTID,
            type: TYPE,
            version: VERSION,
            result: DOCUMENT,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getDocumentation', this.packName);
          return new Promise((RES, REJ) => REJ(errorLogObject));
        }
        return new Promise(RES => RES(DOCUMENT));
      });
  }


  /**
   * _saveThisDocument ( PRIVATE )
   * Create/Update the document into database.
   * @param ASSETID String with the asset id.
   * @param DOCUMENTID String with the document number.
   * @param REVISION String with the document revision.
   * @param LANGUAGE String with the document language.
   * @param VERSION String with the version of the document.
   * @param TYPE String with the type of the document.
   * @param DOCUMENTOBJECT Object with the document.
   * @returns Promise with the result.
   * @author Armando Dias [zdiaarm]
   */
  _saveThisDocument(ASSETID, DOCUMENTID, REVISION, LANGUAGE, VERSION, TYPE, DOCUMENTOBJECT) {
    const assetDocumentsModel = new adp.models.AssetDocuments();
    return assetDocumentsModel.saveThisSpecificDocument(
      ASSETID,
      DOCUMENTID,
      REVISION,
      LANGUAGE,
      VERSION,
      TYPE,
      DOCUMENTOBJECT,
    )
      .then((RESULT) => {
        if (!(RESULT) || (RESULT.ok !== true)) {
          const errorCode = 404;
          const errorMessage = 'Error caught because [ _saveThisDocument ] failed.';
          const errorObject = {
            assetID: ASSETID,
            documentID: DOCUMENTID,
            type: TYPE,
            version: VERSION,
            result: RESULT,
          };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_saveThisDocument', this.packName);
          return new Promise((RES, REJ) => REJ(errorLogObject));
        }
        return new Promise(RES => RES(RESULT.ok));
      });
  }


  /**
   * _updateMicroservice ( PRIVATE )
   * Update the microservice from database.
   * @param MS Object with the Microservice.
   * @returns Promise with the result.
   * @author Armando Dias [zdiaarm]
   */
  _updateMicroservice(MS) {
    this.something = 'something';
    const adpModel = new adp.models.Adp();
    return adpModel.update(MS)
      .then((UPDATEDMS) => {
        if (UPDATEDMS.ok === true) {
          return new Promise(RES => RES(UPDATEDMS));
        }
        return new Promise((RES, REJ) => REJ(UPDATEDMS));
      });
  }


  /**
   * _retrieveDataFromPrimDD ( PRIVATE )
   * Retrieve data from Prim-DD Server.
   * @param THEURL String with the URL.
   * @author Armando Dias [zdiaarm]
   */
  _retrieveDataFromPrimDD(THEURL) {
    const primDDTimer = (new Date()).getTime();
    adp.echoLog(`Requesting data from [ ${THEURL} ]. This could take a while...`, null, 200, this.packName, false);
    return new Promise((RESOLVE, REJECT) => {
      global.request.get({ url: THEURL, headers: this.headers }, (ERROR, RESPONSE, BODY) => {
        if (ERROR) {
          const error = {
            url: THEURL,
            error: ERROR,
          };
          REJECT(error);
          return;
        }
        const JObject = this.XMLParser.parse(BODY);
        const primDDEndTimer = (new Date()).getTime() - primDDTimer;
        adp.echoLog(`Data from [ ${THEURL} ] in ${primDDEndTimer}ms.`, null, 200, this.packName, false);
        RESOLVE(JObject);
      });
    });
  }

  /**
   * _getDocumentHeader ( PRIVATE )
   * Retrieve the file header from Eridoc Server.
   * @param THEURL String with the URL.
   * @author Armando Dias [zdiaarm]
   */
  _getDocumentHeader(THEURL) {
    return new Promise((RESOLVE, REJECT) => {
      const eridocTimer = (new Date()).getTime();
      adp.echoLog(`Requesting file header from: \n:: [ ${THEURL} ]...`, null, 200, this.packName, false);
      global.request.head({ url: THEURL, headers: this.headers }, (ERROR, RESPONSE) => {
        if (ERROR) {
          const error = {
            url: THEURL,
            error: ERROR,
          };
          REJECT(error);
          return;
        }
        if (RESPONSE.statusCode === 403) {
          const eridocEndTimer = (new Date()).getTime() - eridocTimer;
          adp.echoLog(`Header got [ status: 403 ] in ${eridocEndTimer}ms.`, null, 200, this.packName, false);
          RESOLVE({ status: 403, fileName: null, type: null });
          return;
        }
        const contentDisposition = RESPONSE
          && RESPONSE.headers
          && RESPONSE.headers['content-disposition']
          ? RESPONSE.headers['content-disposition'].split('\'\'')
          : null;

        let fileName = null;
        let type = [null];
        if (Array.isArray(contentDisposition) && contentDisposition.length > 1) {
          fileName = decodeURIComponent(contentDisposition[1]);
          const regExpGetExtension = new RegExp(/.[0-9a-z]+$/gim);
          type = fileName.match(regExpGetExtension);
          type = (`${type[0]}`).substring(1, (`${type[0]}`).length);
        }
        const eridocEndTimer = (new Date()).getTime() - eridocTimer;
        adp.echoLog(`Header got [ status: ${RESPONSE.statusCode} ][ fileName: ${fileName} ] in ${eridocEndTimer}ms.`, null, 200, this.packName, false);
        RESOLVE({ status: RESPONSE.statusCode, fileName, type });
      });
    });
  }


  /**
   * getDocumentDetails
   * Start the Mimer Document Translation Data.
   * @param MSID String with the Microservice ID.
   * @param DOCUMENTID String with the document number.
   * @param REVISION String with the revision of the document.
   * @param LANGUAGE String with the language of the document.
   * @param VERSION String with the version of the document.
   * @author Armando Dias [zdiaarm]
   */
  async getDocumentDetails(MSID, DOCUMENTID, REVISION = null, LANGUAGE = null, VERSION = null) {
    try {
      const adpModel = new adp.models.Adp();
      const { slug, name } = await adpModel.getAssetSlugAndNameUsingID(MSID);
      adp.echoLog(`Starting the translation of [ ${DOCUMENTID} ][ ${REVISION} ][ ${LANGUAGE} ] of [ ${slug} :: ${VERSION} ]...`, null, 200, this.packName, false);

      let rule = '[ No rule were applied ]';
      const table = await this._getMimerTableFromDatabase();
      const documentation = await this._getDocumentation(MSID, DOCUMENTID, REVISION, LANGUAGE, 'raw', VERSION);

      let revision = 'AllRevStates';
      if (REVISION) {
        revision = REVISION;
      }
      const documentID = DOCUMENTID;
      let theURL = `${this.apiURL}${encodeURIComponent(documentID)}/${encodeURIComponent(revision)}`;
      if (LANGUAGE) {
        if (LANGUAGE.length > 2) {
          theURL = `${theURL}/${LANGUAGE.substr(LANGUAGE.length - 2, 2)}`;
        } else {
          theURL = `${theURL}/${LANGUAGE}`;
        }
      }
      const primDD = await this._retrieveDataFromPrimDD(theURL);
      const primDDData = this.extractDocumentName(primDD, DOCUMENTID, name, VERSION);

      const tableReference = [];
      Object.keys(table).forEach((KEY) => {
        const primDDDecimalClass = primDD
          && primDD.Document
          && primDD.Document.DecimalClass
          ? primDD.Document.DecimalClass
          : null;
        const tableDecimalClass = parseInt((table[KEY].decimalClass), 10);
        if (primDDDecimalClass === tableDecimalClass) {
          tableReference.push(table[KEY]);
        }
      });

      let document = documentation;
      if (!document) {
        document = {};
      }

      // Setting Default Values
      document.name = documentID;
      document.slug = `${adp.slugIt(documentID)}`;
      document.restricted = true;
      document.doc_mode = 'newtab';

      let documentHeader = null;
      if (document) {
        documentHeader = await this._getDocumentHeader(document.url);
      }

      if (!primDDData
        && tableReference
        && Array.isArray(tableReference)
        && tableReference.length === 1) {
        document.name = tableReference[0].name;
        document.slug = `${adp.slugIt(tableReference[0].name)}`;
        rule = '[ PrimDD Local Table ]';
      }

      if (documentHeader && documentHeader.status === 200) {
        document.physical_file_name = documentHeader.fileName;
        document.physical_file_extension = documentHeader.type;
        document.physical_file_status = 200;

        if (document.physical_file_extension.toLowerCase().trim() === 'zip' || document.physical_file_extension.toLowerCase().trim() === 'html') {
          document.restricted = false;
          document.doc_mode = 'api';
        } else if (document.physical_file_extension.toLowerCase().trim() === 'pdf' || document.physical_file_extension.toLowerCase().trim() === 'doc' || document.physical_file_extension.toLowerCase().trim() === 'docx') {
          document.restricted = false;
          document.doc_mode = 'download';
        } else {
          document.doc_link = document.external_link;
          document.restricted = false;
          document.doc_mode = 'newtab';
        }

        // commented Below to keep the marketplacevisulazation logic generic

        // if (Array.isArray(tableReference)) {
        // const result = tableReference.filter(obj =>
        // primDDData.documentName.includes(obj.name));
        // if (result.length > 0) {
        //   document.name = result[0].name;
        //   document.slug = `${adp.slugIt(result[0].name)}`;
        //   result[0].doc.forEach((TYPE) => {
        //     if (TYPE.type.includes(`${document.physical_file_extension}`.toLowerCase().trim())) {
        //       if (TYPE.restricted === true) {
        //         document.restricted = true;
        //         document.doc_mode = 'newtab';
        //         document.doc_link = document.external_link;
        //       } else if (TYPE.download === true) {
        //         document.restricted = false;
        //         document.doc_mode = 'download';
        //       } else if (TYPE.render === true) {
        //         document.restricted = false;
        //         document.doc_mode = 'api';
        //       } else if (TYPE.newtab === true) {
        //         document.doc_link = document.external_link;
        //         document.restricted = false;
        //         document.doc_mode = 'newtab';
        //       }
        //     }
        //   });
        // } else {
        //   tableReference.forEach((ITEM) => {
        //     ITEM.doc.forEach((TYPE) => {
        //       document.name = ITEM.name;
        //       document.slug = `${adp.slugIt(ITEM.name)}`;
        //       if (TYPE.type.includes(`${document.physical_file_extension}`
        // .toLowerCase().trim())) {
        //         if (TYPE.restricted === true) {
        //           document.restricted = true;
        //           document.doc_mode = 'newtab';
        //           document.doc_link = document.external_link;
        //         } else if (TYPE.download === true) {
        //           document.restricted = false;
        //           document.doc_mode = 'download';
        //         } else if (TYPE.render === true) {
        //           document.restricted = false;
        //           document.doc_mode = 'api';
        //         } else if (TYPE.newtab === true) {
        //           document.doc_link = document.external_link;
        //           document.restricted = false;
        //           document.doc_mode = 'newtab';
        //         }
        //       }
        //     });
        //   });
        // }
        // }

        rule = '[ EriDoc Server ]';
      } else if (documentHeader && documentHeader.status === 403) {
        document.physical_file_status = 403;
        document.restricted = true;
        document.doc_mode = 'newtab';
        document.doc_link = document.external_link;
      }

      if (primDDData) {
        document.name = primDDData.documentName;
        document.slug = `${adp.slugIt(primDDData.documentName)}`;
        rule = '[ PrimDD Server ]';
      }

      document.doc_route.pop();
      document.doc_route.push(document.slug);
      if (!['newtab', 'restricted'].includes(document.doc_mode)) {
        document.doc_link = document.doc_link.split('/');
        document.doc_link.pop();
        document.doc_link.push(document.slug);
        document.doc_link = document.doc_link.join('/');
      } else {
        document.doc_link = document.external_link;
      }

      if (document && document.physical_file_extension) {
        const ext = document.physical_file_extension;
        document.restricted = false;
        if (ext === 'htm' || ext === 'html' || ext === 'zip') {
          document.doc_mode = 'api';
          rule = '[ Eridoc Server ]';
        }
      }

      if (primDD && primDD.Document && primDD.Document.LanguageIssue) {
        if (`${primDD.Document.LanguageIssue.DocumentStatus}`.toUpperCase().trim() === 'FREE') {
          document.approval_date = (`${primDD.Document.LanguageIssue.DocumentStatusChangeDate}`).trim();
        }
      }

      await this._saveThisDocument(MSID, DOCUMENTID, REVISION, LANGUAGE, VERSION, 'mimer', document);

      const report = {
        primDD: primDDData,
        tableReference,
        documentHeader,
        document,
      };

      adp.echoLog(`[ Translation Rule ] :: Document defined as [ ${document.name} ] because the ${rule}.`, null, 200, this.packName, false);
      return new Promise(RES => RES(report));
    } catch (error) {
      return new Promise((RES, REJ) => REJ(error));
    }
  }


  /**
   * extractDocumentName
   * @author John Dolan
   */
  extractDocumentName(primDD, DOCUMENTID, NAME, VERSION) {
    const clean = (string) => {
      const lString = string ? string.toLowerCase() : '';
      if (!NAME || !VERSION) {
        return string;
      }
      // lString = lString.replace(/[_-]/g, ' ');
      const serviceName = (`${NAME}`).toLowerCase();
      const version = (`${VERSION}`).toLowerCase();

      const toTitleCase = str => str.replace(
        /\w\S*/g,
        (txt) => {
          const first = txt.charAt(0) ? txt.charAt(0).toUpperCase() : '';
          const rest = txt.substr(1) ? txt.substr(1).toLowerCase() : '';
          return first + rest;
        },
      );
      const capitalizeAcronyms = (inString) => {
        const lowercaseSearchList = ['pri', 'cis', 'cat', 'pia', 'ra', 'va', 'api'];
        let working = inString;
        lowercaseSearchList.forEach((term) => {
          const regex = `(\\W*)((?<!\\w)${term}(?!\\w))(\\W*)`;
          const re = new RegExp(regex, 'gim');
          const matches = working.matchAll(re);
          let token;
          // eslint-disable-next-line no-restricted-syntax
          for (const match of matches) {
            // eslint-disable-next-line prefer-destructuring
            token = match[2];
            token = token.toUpperCase();
            if (token) {
              break;
            }
          }
          working = working.replace(re, `$1${token}$3`);
        });
        return working;
      };
      const removeServiceName = (inpString) => {
        const splitResult = inpString.split(' ');
        let finalstr = '';
        if (splitResult.length > 0) {
          let strResult = splitResult.filter(word => !serviceName.split(' ').includes(word));
          strResult = strResult.filter(word => word !== version);
          strResult = strResult.filter(word => word !== 'service');
          strResult = strResult.filter(word => word !== '');
          finalstr = strResult.join(' ');
        }
        return finalstr;
      };
      const process = (inString) => {
        if (inString === '' || inString === null) {
          return removeServiceName(lString);
        }
        // eslint-disable-next-line no-param-reassign
        inString = removeServiceName(inString);
        const titled = toTitleCase(inString);
        const specialCap = capitalizeAcronyms(titled);
        return specialCap;
      };

      const checkForWord = (str, fullStr) => {
        /* eslint-disable prefer-template */
        const regex1 = new RegExp('\\b' + str + '\\b', 'gi');
        const matchResult = `${fullStr}`.match(regex1);
        /* eslint-disable no-unneeded-ternary */
        return matchResult !== null ? true : false;
      };

      if (checkForWord('report for', `${lString}`)) {
        return process(`${lString.replace(new RegExp('\\b'+'report for'+'\\b', 'gi'), '')} Report`);
      }
      if (checkForWord('for', `${lString}`)) {
        return process(`${lString.replace(new RegExp('\\b'+'for'+'\\b', 'gi'), '')} Report`);
      }
      if (checkForWord('report', `${lString}`)) {
        return process(`${lString.replace(new RegExp('\\b'+'report'+'\\b', 'gi'), '')} Report`);
      }
      const nameTrailingComma = `${serviceName.toLowerCase()},`;
      if (lString.includes(nameTrailingComma)) {
        return process(`${lString.split(nameTrailingComma)[1].trim()}`);
      }
      return process(lString);
    };
    let primDDData;
    if (primDD && primDD.Document) {
      const oDocName = primDD
        && primDD.Document
        && primDD.Document.DescriptionDisplayAttribute
        && primDD.Document.DescriptionDisplayAttribute.trim().length > 0
        ? clean(primDD.Document.DescriptionDisplayAttribute)
        : DOCUMENTID;
      primDDData = {
        documentNumber: primDD.Document.DocumentNumber,
        documentName: oDocName,
        decimalClass: primDD.Document.DecimalClass,
        decimalClassPrefix: primDD.Document.DecimalClassPrefix,
      };
    }
    return primDDData;
  }
}
// ============================================================================================= //
module.exports = MimerControlClass;
// ============================================================================================= //
