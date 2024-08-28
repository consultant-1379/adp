/* eslint-disable max-len */
// ============================================================================================= //
/**
* [ global.adp.assembly.update ]
* Update an Assembly. <b>Permissions should be checked before</b>.
* @param {String} ID A simple String, with the ID of the Assembly.
* @param {JSON} ASSEMBLY A JSON Object with the fields has to been changed or added.
* @returns {Number} Returns a 200 if everything is ok.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (ID, ASSEMBLY, USR, NOTIFY = true) => new Promise(async (RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const assetValidation = new global.adp.assetValidation.AssetValidationClass('assembly');
  const timer = new Date();
  const packName = 'global.adp.assembly.update';
  dbModel.getById(ID)
    .then(async (body) => {
      if (!Array.isArray(body.docs)) {
        const errorCode = 404;
        REJECT(errorCode);
        return errorCode;
      }
      if (body.docs.length !== 1) {
        const errorCode = 404;
        REJECT(errorCode);
        return errorCode;
      }
      const oldASSEMBLY = body.docs[0];
      const isValid = global.adp.microservice.validateSchema(ASSEMBLY, 'assembly');
      if (Array.isArray(isValid)) {
        const errorArray = isValid;
        REJECT(errorArray);
        return errorArray;
      }

      const selectCheck = await global.adp.microservice.validateListOptionSelections(ASSEMBLY);
      if (!selectCheck.valid) {
        REJECT(selectCheck.errorList);
        return selectCheck.errorList;
      }

      let newASSEMBLY = ASSEMBLY;
      const uniqueJobGroupObjective = `${newASSEMBLY.slug}__${(new Date()).getTime()}`;
      const queueStatusLink = await adp.queue.obtainObjectiveLink(uniqueJobGroupObjective);

      newASSEMBLY._id = ID;
      if (newASSEMBLY.name !== oldASSEMBLY.name) {
        const uniqueAssetNameCheck = await assetValidation.uniqueAssetNameCheck(newASSEMBLY.name);
        if (!uniqueAssetNameCheck) {
          const errorOnDuplicate = [`"${newASSEMBLY.name}" is not an unique name. Cannot create an Assembly`];
          adp.echoLog(errorOnDuplicate[0], null, 500, packName, true);
          REJECT(errorOnDuplicate);
          return errorOnDuplicate;
        }
      }

      if (newASSEMBLY.assembly_maturity !== undefined
      && newASSEMBLY.assembly_category !== undefined
      && newASSEMBLY.assembly_maturity !== null
      && newASSEMBLY.assembly_category !== null) {
        const domainValidation = assetValidation.domainValidation(newASSEMBLY);
        if (!domainValidation) {
          const errorOnDomainField = ['"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".'];
          REJECT(errorOnDomainField);
          return errorOnDomainField;
        }

        const gitValidation = assetValidation.gitValidation(newASSEMBLY);
        if (!gitValidation) {
          const errorOnGIT = ['[giturl] is mandatory when creating Assembly'];
          REJECT(errorOnGIT);
          return errorOnGIT;
        }

        const helmChartNameValidation = assetValidation.helmChartNameValidation(newASSEMBLY);
        if (!helmChartNameValidation) {
          const errorOnHelm = [`[helm_chartname] is mandatory if [assembly_maturity] === ${newASSEMBLY.assembly_maturity}.`];
          REJECT(errorOnHelm);
          return errorOnHelm;
        }

        const helmUrlValidation = assetValidation.helmUrlValidation(newASSEMBLY);
        if (!helmUrlValidation) {
          const errorOnHelm = [`[helmurl] is mandatory if [assembly_maturity] === ${newASSEMBLY.assembly_maturity}.`];
          REJECT(errorOnHelm);
          return errorOnHelm;
        }

        const restrictedDescriptionValidation = assetValidation.restrictedDescriptionValidation(newASSEMBLY);
        if (!restrictedDescriptionValidation) {
          const errorOnRestricted = ['[restricted_description] is mandatory if [restricted] === 1.'];
          REJECT(errorOnRestricted);
          return errorOnRestricted;
        }

        const additionalInfoValidation = assetValidation.additionalInfoValidation(newASSEMBLY);
        if (additionalInfoValidation) {
          REJECT(additionalInfoValidation);
          return additionalInfoValidation;
        }

        let errorInTags = null;
        if (newASSEMBLY.tags !== null && newASSEMBLY.tags !== undefined) {
          await global.adp.tags.checkIt(newASSEMBLY.tags, USR)
            .then((RES) => { newASSEMBLY.tags = RES; })
            .catch((ERR) => {
              errorInTags = ERR;
            });
        }
        if (errorInTags !== null) {
          adp.echoLog('Error in Tags', errorInTags, 500, packName, true);
          REJECT(errorInTags);
          return errorInTags;
        }
      } else {
        const errorForRequiredFields = ['Required fields are not defined in assembly object'];
        REJECT(errorForRequiredFields);
        return errorForRequiredFields;
      }

      const componentServiceValidation = await assetValidation.componentServiceValidation(newASSEMBLY);
      if (Array.isArray(componentServiceValidation)) {
        newASSEMBLY.component_service = componentServiceValidation;
      } else {
        newASSEMBLY.component_service = [];
      }

      const cpiValidation = assetValidation.checkCPIValidation(newASSEMBLY);
      if (!cpiValidation) {
        const errorOnCpiCheck = [`[cpi_check] should not be provided if [assembly_category] === ${newASSEMBLY.assembly_category}.`];
        REJECT(errorOnCpiCheck);
        return errorOnCpiCheck;
      }
      // If check_cpi hasn't been passed with the request, add `false` by default
      if (!newASSEMBLY.check_cpi) {
        newASSEMBLY.check_cpi = false;
      }

      if (!newASSEMBLY.team_mailers) {
        newASSEMBLY.team_mailers = [];
      }

      if (newASSEMBLY.compliance) {
        const { valid, validationResult, formattedArray } = global.adp.compliance.validator
          .validate(newASSEMBLY.compliance);
        if (!valid) {
          const error = [validationResult];
          adp.echoLog('Error on "valid" variable from [ adp.compliance.validator.validate ]', error[0], 500, packName, true);
          REJECT(error);
          return error;
        }
        newASSEMBLY.compliance = formattedArray;
      } else {
        newASSEMBLY.compliance = [];
      }
      newASSEMBLY.tutorial = newASSEMBLY.tutorial || '';
      newASSEMBLY.backlog = newASSEMBLY.backlog || '';

      // ------------------------------------------------------------------------------------- //
      // --- Checking if the Readonly Fields are the same ------------------------------------ //
      // ------------------------------------------------------------------------------------- //
      if (USR !== undefined && USR !== null) {
        if (USR.role !== 'admin') {
          let fieldPermissionError = null;
          await global.adp.permission.fieldIsEditableByPermissionRules(newASSEMBLY, USR.signum)
            .then((READONLYFIELDS) => {
              if (Array.isArray(READONLYFIELDS)) {
                if (READONLYFIELDS.length > 0) {
                  READONLYFIELDS.forEach((FIELD) => {
                    if (oldASSEMBLY[FIELD] !== newASSEMBLY[FIELD]) {
                      const firstLetterUpperCase = `${FIELD.charAt(0).toUpperCase()}${FIELD.slice(1)}`;
                      fieldPermissionError = [`Permission Denied. You should be Admin of the 'Domain' to change its '${firstLetterUpperCase}'.`];
                    }
                  });
                }
              }
            })
            .catch((ERROR) => {
              REJECT(ERROR);
            });
          if (fieldPermissionError !== null) {
            REJECT(fieldPermissionError);
            return fieldPermissionError;
          }
        }
      }
      // ------------------------------------------------------------------------------------- //

      await global.adp.user.createFromTeam(newASSEMBLY);
      const microServiceSlugged = await global.adp.migration.slugItNow(newASSEMBLY);
      if (microServiceSlugged !== true) {
        newASSEMBLY = microServiceSlugged;
      }
      if (typeof newASSEMBLY.restricted === 'undefined') {
        newASSEMBLY.restricted = undefined;
      }
      // remove any updates to the inval_secret
      if (newASSEMBLY.inval_secret !== undefined) {
        delete newASSEMBLY.inval_secret;
      }

      /**
      * Internal. This code should be called three times. Avoid triplicated code.
      * Activates the notification.
      * @author Armando Dias [zdiaarm]
      */
      const notifyNow = () => {
        if (NOTIFY) {
          global.adp.notification.sendAssetMail(USR, 'update', newASSEMBLY, oldASSEMBLY)
            .then(global.adp.notification.sendAssetMail(USR, 'changedomainnotify', newASSEMBLY, oldASSEMBLY))
            .then(() => {
              const endTimer = new Date();
              adp.echoLog(`Asset "${newASSEMBLY.name}" updated by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
            })
            .catch((ERR) => {
              adp.echoLog('Error in [ adp.notification.sendAssetMail ]', ERR, 500, packName, true);
            });
        } else {
          // Skipping notifications
          const endTimer = new Date();
          adp.echoLog(`Asset "${newASSEMBLY.name}" updated by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
        }
      };

      /**
        * Internal. Only save the changes into ADPLogs.
        * @author Armando Dias [zdiaarm]
        */
      const logItOnDatabase = () => global.adp.microservice.CRUDLog(newASSEMBLY, oldASSEMBLY, 'update', USR);

      /**
      * Internal. This code should be called two times. Avoid duplicated code.
      * Takes decision based on the result of the documentRefresh.
      * @param {Object} afterDocumentRefresh The return of documentRefresh.
      * @returns {Number} Returns a 200 if everything is ok.
      * @author Armando Dias [zdiaarm]
      */
      const updateAfterDocumentRefresh = (afterDocumentRefresh) => {
        if (afterDocumentRefresh.dbResponse !== undefined
          && afterDocumentRefresh.yamlErrorsQuant === 0) {
          return dbModel.getById(ID)
            .then((FROMDATABASE) => {
              // eslint-disable-next-line prefer-destructuring
              newASSEMBLY = FROMDATABASE.docs[0];
              adp.echoLog(`Assembly ${ID} Updated!`, null, 200, packName);
              newASSEMBLY.queueStatusLink = queueStatusLink;
              RESOLVE(newASSEMBLY);
              notifyNow();
              logItOnDatabase();
              return 200;
            })
            .catch((ERROR) => {
              adp.echoLog('Error in [ dbModel.getById ]', ERROR, 500, packName, true);
              const errorCode = 500;
              return errorCode;
            });
        }
        newASSEMBLY = global.adp.microservice.menuPrepareDocumentBeforeProceed(newASSEMBLY, oldASSEMBLY);
        return dbModel.update(newASSEMBLY)
          .then((afterUpdate) => {
            if (afterUpdate.ok === true) {
              return dbModel.getById(ID)
                .then((FROMDATABASE) => {
                  // eslint-disable-next-line prefer-destructuring
                  newASSEMBLY = FROMDATABASE.docs[0];
                  adp.echoLog(`Assembly ${ID} Updated!`, null, 200, packName);
                  RESOLVE(newASSEMBLY);
                  notifyNow();
                  logItOnDatabase();
                  assetValidation.teamHistoryCheck(newASSEMBLY, oldASSEMBLY);
                  return 200;
                })
                .catch((ERROR) => {
                  adp.echoLog('Error in [ dbModel.getById ]', { error: ERROR }, 500, packName, true);
                  const errorCode = 500;
                  REJECT(errorCode);
                  return errorCode;
                });
            }
            adp.echoLog('ERROR: Unexpected error on update', { id: ID, error: afterUpdate }, 500, packName, true);
            const errorCode = 500;
            REJECT(errorCode);
            return errorCode;
          })
          .catch((ERROR) => {
            adp.echoLog('Error in [ dbModel.update ]', { error: ERROR }, 500, packName, true);
            const errorCode = 500;
            REJECT(errorCode);
            return errorCode;
          });
      };

      global.adp.masterCache.clear('ALLASSETS', null, ID);
      global.adp.masterCache.clear('DOCUMENTS', ID);

      const uniqueStringForObjective = `${newASSEMBLY.slug}__${(new Date()).getTime()}`;
      const objectiveForMSRefresh = `assemblySync_${uniqueStringForObjective}`;
      const objectiveForDocRefresh = `documentRefresh_${uniqueStringForObjective}`;
      const objectiveForDocSync = `documentSync_${uniqueStringForObjective}`;
      const objectiveForMimerSync = `mimerDocumentSync_${uniqueStringForObjective}`;

      let singleJob = await adp.queue.addJob(
        'microserviceElasticSync',
        newASSEMBLY._id,
        'adp.microservice.synchronizeWithElasticSearch',
        [newASSEMBLY._id, null, 'assembly'],
        objectiveForMSRefresh,
        0,
        0,
      );
      newASSEMBLY.queueStatusLink = await adp.queue
        .obtainObjectiveLink(singleJob.queue, true);

      if (global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(newASSEMBLY, oldASSEMBLY) === true) {
        try {
          singleJob = await adp.queue.addJob(
            'documentRefresh',
            newASSEMBLY._id,
            'adp.integration.documentRefresh.update',
            [newASSEMBLY, objectiveForDocRefresh, 'ALL'],
            objectiveForDocRefresh,
            0,
            1,
          );
          newASSEMBLY.queueStatusLinkDocRefresh = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          singleJob = adp.queue.addJob(
            'mimerDocumentUpdateFromAssetUpdate',
            newASSEMBLY._id,
            'adp.mimer.updateDocumentMenu',
            [newASSEMBLY._id, false, null],
            objectiveForMimerSync,
            0,
            2,
          );

          newASSEMBLY.queueStatusLinkMimerDocSync = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          singleJob = await adp.queue.addJob(
            'assemblyDocumentsElasticSync',
            newASSEMBLY._id,
            'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
            [[newASSEMBLY._id], null, null, objectiveForDocSync, 'ALL', false, 'microserviceDocumentsElasticSync', 'assembly'],
            objectiveForDocSync,
            0,
            3,
          );
          newASSEMBLY.queueStatusLinkDocSync = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          await adp.queue.startJobs();
        } catch (ERROR) {
          errorLog(
            ERROR && ERROR.code ? ERROR.code : 500,
            ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
            { id: newASSEMBLY._id, error: ERROR },
            'main',
            packName,
          );
        }
        return updateAfterDocumentRefresh(newASSEMBLY);
      }

      return global.adp.microservice.menuApplyRulesOnManual(newASSEMBLY.menu)
        .then((RESULT) => {
          newASSEMBLY.menu = RESULT;
          let newManualMenuToCompare = '';
          let oldManualMenuToCompare = '';
          let oldManualDateModify = '';
          if (newASSEMBLY.menu !== undefined && newASSEMBLY.menu !== null) {
            if (newASSEMBLY.menu.manual !== undefined && newASSEMBLY.menu.manual !== null) {
              const cloneNewManualMenu = global.adp.clone(newASSEMBLY.menu.manual);
              delete cloneNewManualMenu.date_modified;
              newManualMenuToCompare = JSON.stringify(cloneNewManualMenu);
            }
          }
          if (oldASSEMBLY.menu !== undefined && oldASSEMBLY.menu !== null) {
            if (oldASSEMBLY.menu.manual !== undefined && oldASSEMBLY.menu.manual !== null) {
              const cloneOldManualMenu = global.adp.clone(oldASSEMBLY.menu.manual);
              oldManualDateModify = cloneOldManualMenu.date_modified;
              delete cloneOldManualMenu.date_modified;
              oldManualMenuToCompare = JSON.stringify(cloneOldManualMenu);
            }
          }
          if (newManualMenuToCompare === oldManualMenuToCompare) {
            if (newASSEMBLY.menu !== null && newASSEMBLY.menu !== undefined) {
              if (newASSEMBLY.menu.manual !== null && newASSEMBLY.menu.manual !== undefined) {
                newASSEMBLY.menu.manual.date_modified = oldManualDateModify;
              }
            }
          }
          newASSEMBLY = global.adp.microservice.menuPrepareDocumentBeforeProceed(newASSEMBLY, oldASSEMBLY);
          global.adp.masterCache.clear('ALLASSETS', null, ID);
          global.adp.masterCache.clear('DOCUMENTS', ID);
          newASSEMBLY.date_modified = new Date();
          return dbModel.update(newASSEMBLY)
            .then((afterUpdate) => {
              if (afterUpdate.ok === true) {
                dbModel.getById(ID)
                  .then(async (MSUPDATED) => {
                    if (Array.isArray(MSUPDATED.docs)) {
                      adp.echoLog(`Assembly ${ID} Updated!`, null, 200, packName);
                      // eslint-disable-next-line prefer-destructuring
                      newASSEMBLY = MSUPDATED.docs[0];
                      try {
                        singleJob = await adp.queue.addJob(
                          'assemblyDocumentsElasticSync',
                          newASSEMBLY._id,
                          'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
                          [[newASSEMBLY._id], null, null, objectiveForDocSync, 'ALL', false, 'microserviceDocumentsElasticSync', 'assembly'],
                          objectiveForDocSync,
                          0,
                          2,
                        );
                        newASSEMBLY.queueStatusLinkDocSync = await adp.queue
                          .obtainObjectiveLink(singleJob.queue, true);

                        await adp.queue.startJobs();
                      } catch (ERROR) {
                        errorLog(
                          ERROR && ERROR.code ? ERROR.code : 500,
                          ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                          { id: newASSEMBLY._id, error: ERROR },
                          'main',
                          packName,
                        );
                      }
                      RESOLVE(newASSEMBLY);
                      notifyNow();
                      logItOnDatabase();
                      assetValidation.teamHistoryCheck(newASSEMBLY, oldASSEMBLY);
                      return 200;
                    }
                    return true;
                  });
              }
            })
            .catch((ERROR) => {
              adp.echoLog('ERROR FROM UPDATE', { id: ID, error: ERROR }, 500, packName, true);
              const errorCode = 500;
              REJECT(errorCode);
              return errorCode;
            });
        })
        .catch((ERROR) => {
          adp.echoLog('ERROR FROM menuApplyRulesOnManual', { id: ID, error: ERROR }, 500, packName, true);
          REJECT(ERROR);
          return ERROR;
        });
    })
    .catch((ERROR) => {
      adp.echoLog('ERROR FROM GET', { id: ID, error: ERROR }, 500, packName, true);
      const errorCode = 404;
      REJECT(errorCode);
      return errorCode;
    });
});
