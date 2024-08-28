// ============================================================================================= //
/**
* [ adp.mimer.MimerElasticSearchSync ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
const errorLog = require('./../library/errorLog');

class MimerElasticSearchSyncClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.mimer.MimerElasticSearchSync';
  }


  /**
   * buildPostID
   * Method to build the postID.
   * @param {String} MSID The Microservice unique ID.
   * @param {Object} DOC The Document Object.
   * @return {String} The postID.
   * @author Armando Dias [zdiaarm]
   */
  buildPostID(MSID, DOC) {
    const docRoute = DOC.doc_route;
    const keyBreaker = 'documentation';
    let result = `${MSID}`;
    let found = false;
    let version = null;
    docRoute.forEach((ITEM) => {
      if (found) {
        if (!version) {
          version = `${ITEM}`;
          result = `${result}_${ITEM}`;
        } else {
          result = `${result}_${adp.slugIt(ITEM)}`;
        }
      }
      if (ITEM === keyBreaker) {
        found = true;
      }
    });
    const doc = DOC;
    doc.doc_version = version;
    return result;
  }


  /**
   * formatMyDocument
   * Convert the Document Object into an Elastic Search Document.
   * @param {Object} DOCUMENT The Document Object to be formatted.
   * @returns The object to be inserted/updated on ElasticSearch.
   * @author Armando Dias [ zidaarm ]
   */
  formatMyDocument(DOCUMENT, ASSETETYPE) {
    const doc = DOCUMENT;
    let assetType;
    if (ASSETETYPE === 'assembly') {
      assetType = 'assembly_documentation';
    } else {
      assetType = 'ms_documentation';
    }
    const newDoc = {
      post_id: doc.post_id,
      post_name: doc.name,
      post_name_version_order: doc.titlePosition,
      post_new_tab: doc.doc_mode === 'newtab',
      post_type: assetType,
      asset_id: doc.ms_id,
      asset_name: doc.ms_name,
      asset_slug: doc.ms_slug,
      version: doc.doc_version,
      title: doc.name,
      title_slug: doc.slug,
      category: doc.category_name,
      category_slug: doc.category_slug,
      document_url: doc.doc_link,
      external_link: doc.url,
      default: doc.default,
      restricted: doc.restricted,
      sync_date: new Date(),
      original: '',
      raw_text: '',
      this_is_from_Mimer: true,
    };
    return newDoc;
  }


  /**
   * sync
   * Synchronize the document with ElasticSearch.
   * @author Armando Dias [zdiaarm]
   */
  sync(
    MSID,
    MSSLUG,
    MSNAME,
    VERSION,
    ISMIMERDEVELOPMENT,
    DOCUMENTNUMBER,
    DOCUMENTREVISION,
    DOCUMENTLANGUAGE,
    ASSETTYPE,
  ) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const assetDocModel = new adp.models.AssetDocuments();
        const docObject = await assetDocModel.getSpecificDocument(MSID, DOCUMENTNUMBER, DOCUMENTREVISION, DOCUMENTLANGUAGE, 'mimer', VERSION);
        const postId = this.buildPostID(MSID, docObject);
        docObject.post_id = postId;
        docObject.ms_id = MSID;
        docObject.ms_slug = MSSLUG;
        docObject.ms_name = MSNAME;
        const document = this.formatMyDocument(docObject, ASSETTYPE);

        const adpModel = new adp.models.Adp();
        const slug = await adpModel.getAssetSlugUsingID(MSID);
        adp.echoLog(`Starting the ES Sync of [ ${document.post_name} ][ ${DOCUMENTNUMBER} ][ ${DOCUMENTREVISION} ][ ${DOCUMENTLANGUAGE} ] of [ ${slug} :: ${VERSION} ]...`, null, 200, this.packName, false);

        // Checking if version is valid :: BEGIN
        const mimerStarterVersion = await adpModel.getJustTheMimerVersionStarterFromAsset(MSID);
        const assetVersionList = await assetDocModel.getMenuVersions(MSID, 'raw');
        const mimerVersionsValid = this.mimerVersionStarterLimit(
          assetVersionList,
          mimerStarterVersion,
        );
        if (!ISMIMERDEVELOPMENT
          && (!mimerVersionsValid.find(ITEM => ITEM.version === document.version)
          && !mimerVersionsValid.includes(document.version))) {
          adp.echoLog('Document Version is not active. Document ignored.', { name: document.post_name, version: document.version, url: document.document_url }, 200, this.packName);
          RESOLVE({ code: 200, message: 'Document Version is not active. Document ignored.', document });
          return;
        }
        // Checking if version is valid :: END

        const esModel = new adp.modelsElasticSearch.MicroserviceDocumentation();
        const esDocument = await esModel.getThisSpecificMSDocument({ post_id: postId });

        if (esDocument.code === 200) {
          await esModel.updateThisSpecificMSDocument(esDocument.docESID, document);
          adp.echoLog(`Document [ ${document.post_name} ] updated on Elastic Search:\n:: [ ${document.document_url} ]`, null, 200, this.packName);
          RESOLVE({ code: 200, message: 'Document Updated', document });
          return;
        }

        if (esDocument.error.substring(0, 25) === 'index_not_found_exception') {
          await esModel.verifyIndex();
          await esModel.createThisSpecificMSDocument(document);
          adp.echoLog(`Document [ ${document.post_name} ] created on Elastic Search:\n:: [ ${document.document_url} ]`, null, 200, this.packName);
          RESOLVE({ code: 200, message: 'Document Created', document });
          return;
        }

        await esModel.createThisSpecificMSDocument(document);
        adp.echoLog(`Document [ ${document.post_name} ] created on Elastic Search:\n:: [ ${document.document_url} ]`, null, 200, this.packName);
        RESOLVE({ code: 200, message: 'Document Created', document });
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ sync ]';
        const errorObject = { error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'sync', this.packName);
        REJECT(errorLogObject);
      }
    });
  }

  /**
   * getElasticDocumentsByAssetID
   * Get documents ( from a specific
   * microservice ) from Elastic Search.
   * @author Armando Dias [zdiaarm]
   */
  async getElasticDocumentsByAssetID(MSID, SEARCHAFTER, SKIP) {
    const esModel = new adp.modelsElasticSearch.MicroserviceDocumentation();
    const elasticDocuments = await esModel.findDocumentsByAssetId(MSID, SEARCHAFTER, SKIP);
    return elasticDocuments;
  }


  /**
   * deleteElasticDocuments
   * Delete documents from ElsticSearch
   * based in an Array of IDs.
   * @author Armando Dias [zdiaarm]
   */
  async deleteElasticDocuments(ELASTICIDS) {
    try {
      const esModel = new adp.modelsElasticSearch.MicroserviceDocumentation();
      const deleteDocument = await esModel.removeDocuments(ELASTICIDS);
      return deleteDocument;
    } catch (error) {
      const obj = {
        ids: ELASTICIDS,
        error,
      };
      adp.echoLog('Error on [ deleteElasticDocuments ]', obj, 500, this.packName);
      return error;
    }
  }


  /**
   * mimerVersionStarterLimit
   * Validates the versions based
   * on mimer_version_starter.
   * @author Armando Dias [zdiaarm]
   */
  mimerVersionStarterLimit(MIMERVERSIONS, MIMERVERSIONSTARTER) {
    const mimerVersions = adp
      && adp.versionSort
      ? MIMERVERSIONS
        .map((VERSION) => { const obj = { version: `${VERSION}` }; return obj; })
        .sort(adp.versionSort('-version'))
        .map(VERSION => `${VERSION.version}`)
      : MIMERVERSIONS;
    const mimerVersionStarter = MIMERVERSIONSTARTER;
    const mimerVersionsValid = [];
    let mimerVersionsFound = false;
    mimerVersions.forEach((VERSION) => {
      if (mimerVersionsFound) return;
      if (!mimerVersionsValid.includes(VERSION)) mimerVersionsValid.push(VERSION);
      if (VERSION === mimerVersionStarter) mimerVersionsFound = true;
    });
    return mimerVersionsValid;
  }


  /**
   * clearElasticDocuments
   * Delete documents from disabled versions.
   * @author Armando Dias [zdiaarm]
   */
  clearElasticDocuments(MSID) {
    return new Promise(async (RES) => {
      const toDelete = [];
      let allDocs = [];
      let mimerVersionsValid;
      let index = 0;
      let searchAfter = [];

      try {
        const adpModel = new adp.models.Adp();
        const mimerStarterVersion = await adpModel.getJustTheMimerVersionStarterFromAsset(MSID);
        const assetDocModel = new adp.models.AssetDocuments();
        const assetVersionList = await assetDocModel.getMenuVersions(MSID, 'mimer');
        mimerVersionsValid = this.mimerVersionStarterLimit(
          assetVersionList,
          mimerStarterVersion,
        );
        const mimerDevelopmentVersion = await adpModel.getMimerDevelopmentVersionFromYAML(MSID);
        if (mimerDevelopmentVersion && !mimerVersionsValid.includes(mimerVersionsValid)) {
          mimerVersionsValid.push(mimerDevelopmentVersion);
        }
        const deletionResult = await assetDocModel.hardDeleteInvalidVersionsFromDatabase(
          MSID,
          mimerVersionsValid,
        );
        let deletionMessage = '';
        switch (deletionResult.n) {
          case 0:
            deletionMessage = 'No Mimer Versions were removed from database!';
            break;
          case 1:
            deletionMessage = 'One Mimer Version was removed from database!';
            break;
          default:
            deletionMessage = `${deletionResult.n} Mimer Versions were removed from database!`;
            break;
        }
        adp.echoLog(deletionMessage, null, 200, this.packName);
      } catch (ERROR) {
        const errorObj1 = {
          message: `Caught an error on try/catch block 1 at clearElasticDocuments() [ ${this.packName} ]`,
          error: ERROR,
        };
        return errorObj1;
      }

      const checkAllDocuments = () => {
        while (allDocs[index]) {
          const theDoc = allDocs[index];
          index += 1;
          if (!theDoc) break;
          const theDocUniqueElasticID = theDoc
            && theDoc._id
            ? `${theDoc._id}`
            : null;
          const theDocAssetID = theDoc
            && theDoc._source
            && theDoc._source.asset_id
            ? `${theDoc._source.asset_id}`
            : null;
          const theDocAssetVersion = theDoc
            && theDoc._source
            && theDoc._source.version
            ? `${theDoc._source.version}`
            : null;
          const thisIsFromMimer = theDoc
            && theDoc._source
            && theDoc._source.this_is_from_Mimer
            ? theDoc._source.this_is_from_Mimer
            : null;
          if (thisIsFromMimer && (theDocAssetID === `${MSID}`)) {
            if (!mimerVersionsValid.find(ITEM => ITEM.version === theDocAssetVersion)
            && !mimerVersionsValid.includes(theDocAssetVersion)) {
              toDelete.push(theDocUniqueElasticID);
            }
          }
        }
        return true;
      };

      try {
        const getAllDocuments = async () => {
          const docs = await this.getElasticDocumentsByAssetID(MSID, searchAfter, 1000);
          if (Array.isArray(docs) && docs.length === 1000) {
            allDocs = allDocs.concat(docs);
            searchAfter = docs.slice(-1)[0].sort;
            return getAllDocuments();
          }
          if (Array.isArray(docs) && docs.length !== 1000 && docs.length > 0) {
            allDocs = allDocs.concat(docs);
          }
          return checkAllDocuments();
        };
        await getAllDocuments();
      } catch (ERROR) {
        const errorObj2 = {
          message: `Caught an error on try/catch block 2 at clearElasticDocuments() [ ${this.packName} ]`,
          error: ERROR,
        };
        return errorObj2;
      }

      try {
        if (toDelete.length > 0) {
          const deletedResult = await this.deleteElasticDocuments(toDelete);
          let message = 'One document was removed from ElasticSearch.';
          if (deletedResult && deletedResult.body && deletedResult.body.deleted > 1) {
            message = `${deletedResult.body.deleted} documents were removed from ElasticSearch.`;
          }
          adp.echoLog(message, null, 200, this.packName);
          return RES({
            statusCode: 200,
            message,
            deleted_count: toDelete.length,
            deleted_elasticsearch_ids: toDelete,
          });
        }
        const msg = 'No documents were removed from ElasticSearch.';
        adp.echoLog(msg, null, 200, this.packName);
        return RES({
          statusCode: 200,
          msg,
          deleted_count: 0,
          deleted_elasticsearch_ids: [],
        });
      } catch (ERROR) {
        const errorObj3 = {
          message: `Caught an error on try/catch block 3 at clearElasticDocuments() [ ${this.packName} ]`,
          error: ERROR,
        };
        return errorObj3;
      }
    });
  }
}
// ============================================================================================= //
module.exports = MimerElasticSearchSyncClass;
// ============================================================================================= //
