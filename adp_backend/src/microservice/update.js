/* eslint-disable max-len */
// ============================================================================================= //
/**
* [ global.adp.microservice.update ]
* Update a Microservice. <b>Permissions should be checked before</b>.
* @param {String} ID A simple String, with the ID of the Microservice.
* @param {JSON} MS A JSON Object with the fields has to been changed or added.
* @returns {Number} Returns a 200 if everything is ok.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const errorLog = require('./../library/errorLog');
// ============================================================================================= //

module.exports = (ID, MS, USR, NOTIFY = true) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const assetValidation = new global.adp.assetValidation.AssetValidationClass();
  const timer = new Date();
  const packName = 'global.adp.microservice.update';
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
      const oldMS = body.docs[0];
      const isValid = global.adp.microservice.validateSchema(MS, 'microservice');
      if (Array.isArray(isValid)) {
        const errorArray = isValid;
        REJECT(errorArray);
        return errorArray;
      }

      const selectCheck = await global.adp.microservice.validateListOptionSelections(MS);
      if (!selectCheck.valid) {
        REJECT(selectCheck.errorList);
        return selectCheck.errorList;
      }

      let newMS = MS;
      const uniqueJobGroupObjective = `${newMS.slug}__${(new Date()).getTime()}`;
      const queueStatusLink = await adp.queue.obtainObjectiveLink(uniqueJobGroupObjective);

      newMS._id = ID;
      if (newMS.service_category === 1 || newMS.service_category === 2) {
        if (newMS.domain !== 1 && newMS.service_category === 1) {
          const errorOnDomainField = ['"Domain" should not be provided if "Service Category" is "ADP Generics Services".'];
          REJECT(errorOnDomainField);
          return errorOnDomainField;
        }

        const gitValidation = assetValidation.gitValidation(newMS);
        if (!gitValidation) {
          const errorOnGIT = [`[giturl] is mandatory if [service_maturity] === ${newMS.service_maturity}.`];
          REJECT(errorOnGIT);
          return errorOnGIT;
        }

        const helmChartNameValidation = assetValidation.helmChartNameValidation(newMS);
        if (!helmChartNameValidation) {
          const errorOnHelm = [`[helm_chartname] is mandatory if [service_maturity] === ${newMS.service_maturity}.`];
          REJECT(errorOnHelm);
          return errorOnHelm;
        }

        const helmUrlValidation = assetValidation.helmUrlValidation(newMS);
        if (!helmUrlValidation) {
          const errorOnHelm = [`[helmurl] is mandatory if [service_maturity] === ${newMS.service_maturity}.`];
          REJECT(errorOnHelm);
          return errorOnHelm;
        }

        const restrictedvalidation = assetValidation.restrictedvalidation(newMS);
        if (!restrictedvalidation) {
          const errorOnRestricted = [`[restricted] is mandatory if [service_maturity] === 6 if [service_catgory] === ${newMS.service_category}.`];
          REJECT(errorOnRestricted);
          return errorOnRestricted;
        }
      } else if (typeof newMS.domain !== 'number' || newMS.domain === 1) {
        const errorOnDomainField = ['Appropriate "Domain" value is required'];
        REJECT(errorOnDomainField);
        return errorOnDomainField;
      } else if (newMS.check_cpi === true) {
        const errorOnCheckCpiField = [`Check_Cpi should be false if [service_category] === ${newMS.service_category}.`];
        REJECT(errorOnCheckCpiField);
        return errorOnCheckCpiField;
      }

      if (newMS.service_category === 4) {
        if (newMS.reusability_level !== 4) {
          const errorOnReusability = ['[reusability_level] should be \'none\' (id: 4) when [service_category] is \'ADP Application Specific Services\' (id: 4).'];
          REJECT(errorOnReusability);
          return errorOnReusability;
        }
      }

      const additionalInfoValidation = assetValidation.additionalInfoValidation(newMS);
      if (additionalInfoValidation) {
        REJECT(additionalInfoValidation);
        return additionalInfoValidation;
      }

      let restrictedChecker = true;
      if (newMS.restricted === 1 || newMS.restricted === '1') {
        restrictedChecker = false;
        if (newMS.restricted_description !== null && newMS.restricted_description !== undefined) {
          if (typeof newMS.restricted_description === 'string') {
            if (newMS.restricted_description.trim().length > 0) {
              restrictedChecker = true;
            }
          }
        }
      } else {
        newMS.restricted_description = '';
      }
      if (!restrictedChecker) {
        const errorOnRestricted = ['[restricted_description] is mandatory if [restricted] === 1.'];
        REJECT(errorOnRestricted);
        return errorOnRestricted;
      }

      let errorInTags = null;
      if (newMS.tags !== null && newMS.tags !== undefined) {
        await global.adp.tags.checkIt(newMS.tags, USR)
          .then((RES) => { newMS.tags = RES; })
          .catch((ERR) => {
            errorInTags = ERR;
          });
      }
      if (errorInTags !== null) {
        adp.echoLog('Error in Tags', errorInTags, 500, packName, true);
        REJECT(errorInTags);
        return errorInTags;
      }


      if (newMS.name !== oldMS.name) {
        const uniqueAssetNameCheck = await assetValidation.uniqueAssetNameCheck(newMS.name);
        if (!uniqueAssetNameCheck) {
          const errorOnDuplicate = [`"${newMS.name}" is not an unique name. Cannot update microservice`];
          adp.echoLog(errorOnDuplicate[0], null, 500, packName, true);
          REJECT(errorOnDuplicate);
          return errorOnDuplicate;
        }
      }

      if (!newMS.team_mailers) {
        newMS.team_mailers = [];
      }
      if (newMS.compliance) {
        const { valid, validationResult, formattedArray } = global.adp.compliance.validator
          .validate(newMS.compliance);
        if (!valid) {
          const error = [validationResult];
          adp.echoLog('Error in compliance', { id: ID, error }, 500, packName, true);
          REJECT(error);
          return error;
        }
        newMS.compliance = formattedArray;
      } else {
        newMS.compliance = [];
      }
      newMS.tutorial = newMS.tutorial || '';
      newMS.backlog = newMS.backlog || '';
      // ------------------------------------------------------------------------------------- //
      // --- Checking if the Readonly Fields are the same ------------------------------------ //
      // ------------------------------------------------------------------------------------- //
      if (USR !== undefined && USR !== null) {
        if (USR.role !== 'admin') {
          let fieldPermissionError = null;
          await global.adp.permission.fieldIsEditableByPermissionRules(newMS, USR.signum)
            .then((READONLYFIELDS) => {
              if (Array.isArray(READONLYFIELDS)) {
                if (READONLYFIELDS.length > 0) {
                  READONLYFIELDS.forEach((FIELD) => {
                    if (oldMS[FIELD] !== newMS[FIELD]) {
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

      await global.adp.user.createFromTeam(newMS);
      const microServiceSlugged = await global.adp.migration.slugItNow(newMS);
      if (microServiceSlugged !== true) {
        newMS = microServiceSlugged;
      }
      if (typeof newMS.restricted === 'undefined') {
        newMS.restricted = undefined;
      }
      // remove any updates to the inval_secret
      if (newMS.inval_secret !== undefined) {
        delete newMS.inval_secret;
      }

      /**
      * Internal. This code should be called three times. Avoid triplicated code.
      * Activates the notification.
      * @author Armando Dias [zdiaarm]
      */
      const notifyNow = async () => {
        if (NOTIFY) {
          try {
            await global.adp.notification.sendAssetMail(USR, 'update', newMS, oldMS);
            await global.adp.notification.sendAssetMail(USR, 'changedomainnotify', newMS, oldMS);
            const endTimer = new Date();
            adp.echoLog(`Asset "${newMS.name}" updated by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
          } catch (ERR) {
            adp.echoLog('Error in [ adp.notification.sendAssetMail ]', ERR, 500, packName, true);
          }
        } else {
          // Skipping notifications
          const endTimer = new Date();
          adp.echoLog(`Asset "${newMS.name}" updated by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
        }
      };

      /**
      * Internal. Only save the changes into ADPLogs.
      * @author Armando Dias [zdiaarm]
      */
      const logItOnDatabase = () => global.adp.microservice.CRUDLog(newMS, oldMS, 'update', USR);

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
            .then(async (FROMDATABASE) => {
              // eslint-disable-next-line prefer-destructuring
              newMS = FROMDATABASE.docs[0];
              adp.echoLog(`Microservice ${ID} Updated!`, null, 200, packName);
              newMS.queueStatusLink = queueStatusLink;
              RESOLVE(newMS);
              await notifyNow();
              logItOnDatabase();
              return 200;
            })
            .catch((ERROR) => {
              adp.echoLog('Error in [ dbModel.getById ]', ERROR, 500, packName, true);
              const errorCode = 500;
              return errorCode;
            });
        }
        newMS = global.adp.microservice.menuPrepareDocumentBeforeProceed(newMS, oldMS);
        return dbModel.update(newMS)
          .then((afterUpdate) => {
            if (afterUpdate.ok === true) {
              return dbModel.getById(ID)
                .then(async (FROMDATABASE) => {
                  // eslint-disable-next-line prefer-destructuring
                  newMS = FROMDATABASE.docs[0];
                  adp.echoLog(`Microservice ${ID} Updated!`, null, 200, packName);
                  RESOLVE(newMS);
                  await notifyNow();
                  logItOnDatabase();
                  assetValidation.teamHistoryCheck(newMS, oldMS);
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

      const uniqueStringForObjective = `${newMS.slug}__${(new Date()).getTime()}`;
      const objectiveForMSRefresh = `microserviceSync_${uniqueStringForObjective}`;
      const objectiveForDocRefresh = `documentRefresh_${uniqueStringForObjective}`;
      const objectiveForDocSync = `documentSync_${uniqueStringForObjective}`;
      const objectiveForMimerSync = `mimerDocumentSync_${uniqueStringForObjective}`;

      let singleJob = await adp.queue.addJob(
        'microserviceElasticSync',
        newMS._id,
        'adp.microservice.synchronizeWithElasticSearch',
        [newMS._id, null],
        objectiveForMSRefresh,
        0,
        0,
      );
      newMS.queueStatusLink = await adp.queue
        .obtainObjectiveLink(singleJob.queue, true);

      if (global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(newMS, oldMS) === true) {
        try {
          singleJob = await adp.queue.addJob(
            'documentRefresh',
            newMS._id,
            'adp.integration.documentRefresh.update',
            [newMS, objectiveForDocRefresh, 'ALL'],
            objectiveForDocRefresh,
            0,
            1,
          );
          newMS.queueStatusLinkDocRefresh = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          singleJob = adp.queue.addJob(
            'mimerDocumentUpdateFromAssetUpdate',
            newMS._id,
            'adp.mimer.updateDocumentMenu',
            [newMS._id, false, null, objectiveForMimerSync],
            objectiveForMimerSync,
            0,
            2,
          );

          newMS.queueStatusLinkMimerDocSync = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          singleJob = await adp.queue.addJob(
            'microserviceDocumentsElasticSync',
            newMS._id,
            'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
            [[newMS._id], null, null, objectiveForDocSync, 'ALL', newMS.check_pvi, 'microserviceDocumentsElasticSync', 'microservice'],
            objectiveForDocSync,
            0,
            3,
          );
          newMS.queueStatusLinkDocSync = await adp.queue
            .obtainObjectiveLink(singleJob.queue, true);

          await adp.queue.startJobs();
        } catch (ERROR) {
          errorLog(
            ERROR && ERROR.code ? ERROR.code : 500,
            ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
            { id: newMS._id, error: ERROR },
            'main',
            packName,
          );
        }
        return updateAfterDocumentRefresh(newMS);
      }

      return global.adp.microservice.menuApplyRulesOnManual(newMS.menu)
        .then((RESULT) => {
          newMS.menu = RESULT;
          let newManualMenuToCompare = '';
          let oldManualMenuToCompare = '';
          let oldManualDateModify = '';
          if (newMS.menu !== undefined && newMS.menu !== null) {
            if (newMS.menu.manual !== undefined && newMS.menu.manual !== null) {
              const cloneNewManualMenu = global.adp.clone(newMS.menu.manual);
              delete cloneNewManualMenu.date_modified;
              newManualMenuToCompare = JSON.stringify(cloneNewManualMenu);
            }
          }
          if (oldMS.menu !== undefined && oldMS.menu !== null) {
            if (oldMS.menu.manual !== undefined && oldMS.menu.manual !== null) {
              const cloneOldManualMenu = global.adp.clone(oldMS.menu.manual);
              oldManualDateModify = cloneOldManualMenu.date_modified;
              delete cloneOldManualMenu.date_modified;
              oldManualMenuToCompare = JSON.stringify(cloneOldManualMenu);
            }
          }
          if (newManualMenuToCompare === oldManualMenuToCompare) {
            if (newMS.menu !== null && newMS.menu !== undefined) {
              if (newMS.menu.manual !== null && newMS.menu.manual !== undefined) {
                newMS.menu.manual.date_modified = oldManualDateModify;
              }
            }
          }
          newMS = global.adp.microservice.menuPrepareDocumentBeforeProceed(newMS, oldMS);
          global.adp.masterCache.clear('ALLASSETS', null, ID);
          global.adp.masterCache.clear('DOCUMENTS', ID);
          newMS.date_modified = new Date();
          return adp.migration.checkCpiInMSDocs(newMS)
            .then(() => dbModel.update(newMS)
              .then((afterUpdate) => {
                if (afterUpdate.ok === true) {
                  dbModel.getById(ID)
                    .then(async (MSUPDATED) => {
                      if (Array.isArray(MSUPDATED.docs)) {
                        adp.echoLog(`Microservice ${ID} Updated!`, null, 200, packName);
                        // eslint-disable-next-line prefer-destructuring
                        newMS = MSUPDATED.docs[0];
                        try {
                          singleJob = await adp.queue.addJob(
                            'microserviceDocumentsElasticSync',
                            newMS._id,
                            'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
                            [[newMS._id], null, null, objectiveForDocSync, 'ALL', newMS.check_pvi, 'microserviceDocumentsElasticSync', 'microservice'],
                            objectiveForDocSync,
                            0,
                            2,
                          );
                          newMS.queueStatusLinkDocSync = await adp.queue
                            .obtainObjectiveLink(singleJob.queue, true);

                          await adp.queue.startJobs();
                        } catch (ERROR) {
                          errorLog(
                            ERROR && ERROR.code ? ERROR.code : 500,
                            ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                            { id: newMS._id, error: ERROR },
                            'main',
                            packName,
                          );
                        }
                        RESOLVE(newMS);
                        await notifyNow();
                        logItOnDatabase();
                        assetValidation.teamHistoryCheck(newMS, oldMS);
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
              }));
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
// ============================================================================================= //
