// ============================================================================================= //
/**
* [ global.adp.microservice.create ]
* Create a Microservice.
* @param {JSON} MICROSERVICEOBJ a JSON Object with the Microservice. Must follow the schema.
* @return Return ID for OK, Code 500 if something went wrong.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (MICROSERVICEOBJ, USR) => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.microservice.create';
  const dbModel = new adp.models.Adp();
  const isValid = await global.adp.microservice.validateSchema(MICROSERVICEOBJ, 'microservice');
  const assetValidation = new adp.assetValidation.AssetValidationClass();

  if (isValid === true) {
    const newMS = MICROSERVICEOBJ;
    newMS.type = 'microservice';

    const selectCheck = await global.adp.microservice.validateListOptionSelections(MICROSERVICEOBJ);
    if (!selectCheck.valid) {
      REJECT(selectCheck.errorList);
      return selectCheck.errorList;
    }

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

    const restrictedDescriptionValidation = assetValidation.restrictedDescriptionValidation(newMS);
    if (!restrictedDescriptionValidation) {
      const errorOnRestricted = ['[restricted_description] is mandatory if [restricted] === 1.'];
      REJECT(errorOnRestricted);
      return errorOnRestricted;
    }

    const additionalInfoValidation = assetValidation.additionalInfoValidation(newMS);
    if (additionalInfoValidation) {
      REJECT(additionalInfoValidation);
      return additionalInfoValidation;
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

    const uniqueAssetNameCheck = await assetValidation.uniqueAssetNameCheck(newMS.name);
    if (!uniqueAssetNameCheck) {
      const errorOnDuplicate = [`"${newMS.name}" is not an unique name. Cannot create.`];
      adp.echoLog(errorOnDuplicate[0], null, 500, packName, true);
      REJECT(errorOnDuplicate);
      return errorOnDuplicate;
    }

    if (newMS.compliance) {
      const { valid, validationResult, formattedArray } = global.adp.compliance.validator
        .validate(newMS.compliance);
      if (!valid) {
        const error = [validationResult];
        adp.echoLog('Error on "valid" variable from [ adp.compliance.validator.validate ]', error[0], 500, packName, true);
        REJECT(error);
        return error;
      }
      newMS.compliance = formattedArray;
    } else {
      newMS.compliance = [];
    }
    await global.adp.user.createFromTeam(newMS);


    newMS.date_modified = new Date();
    newMS.date_created = new Date();

    newMS.inval_secret = Math.random().toString(36).substring(3);


    if (typeof newMS.name === 'string' && newMS.name.length > 0) {
      newMS.slug = await global.adp.slugIt(newMS.name.trim());
    } else {
      const invalidName = [`${newMS.name} is not a valid name. Cannot create.`];
      adp.echoLog('Error validating the name', { error: invalidName[0] }, 500, packName, true);
      REJECT(invalidName);
      return invalidName;
    }

    // If check_cpi hasn't been passed with the request, add `false` by default
    if (!newMS.check_cpi) {
      newMS.check_cpi = false;
    }

    newMS.menu = global.adp.microservice.menuBasicStructure(newMS.menu);
    return global.adp.microservice.menuApplyRulesOnManual(newMS.menu)
      .then((RESULT) => {
        newMS.menu = RESULT;
        return adp.migration.checkCpiInMSDocs(newMS)
          .then(() => dbModel.createOne(newMS)
            .then(async (expectedOBJ) => {
              if (expectedOBJ.ok === true) {
                newMS._id = expectedOBJ.id;
                const uniqueStringForObjective = `${newMS.slug}__${(new Date()).getTime()}`;
                const objectiveForMSRefresh = `microserviceSync_${uniqueStringForObjective}`;
                const priorityForMSRefresh = 0;

                const objectiveForDocRefresh = `documentRefresh_${uniqueStringForObjective}`;
                const priorityForDocRefresh = 1;

                const objectiveForDocSync = `documentSync_${uniqueStringForObjective}`;
                const priorityForDocSync = 2;

                try {
                  const singleJob = await adp.queue.addJob(
                    'microserviceElasticSync',
                    newMS._id,
                    'adp.microservice.synchronizeWithElasticSearch',
                    [newMS._id, null],
                    objectiveForMSRefresh,
                    0,
                    priorityForMSRefresh,
                  );
                  newMS.queueStatusLink = adp.queue
                    .obtainObjectiveLink(singleJob.queue, true);
                } catch (ERROR) {
                  errorLog(
                    ERROR && ERROR.code ? ERROR.code : 500,
                    ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                    { id: newMS._id, error: ERROR },
                    'main',
                    packName,
                  );
                }
                const teamHistInst = new adp.teamHistory.TeamHistoryController();
                teamHistInst.fetchLatestSnapshotsMsList([newMS]).catch(
                  errorSnapshot => adp.echoLog('Failure to create team snapshot', { error: errorSnapshot, origin: 'global.adp.microservice.create' }, 500, packName),
                );
                if (global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(newMS) === true) {
                  try {
                    const singleJob = await adp.queue.addJob(
                      'documentRefresh',
                      newMS._id,
                      'adp.integration.documentRefresh.update',
                      [newMS, objectiveForDocRefresh, 'ALL'],
                      objectiveForDocRefresh,
                      0,
                      priorityForDocRefresh,
                    );
                    newMS.queueStatusLinkDocRefresh = adp.queue
                      .obtainObjectiveLink(singleJob.queue, true);
                  } catch (ERROR) {
                    errorLog(
                      ERROR && ERROR.code ? ERROR.code : 500,
                      ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                      { id: newMS._id, error: ERROR },
                      'main',
                      packName,
                    );
                  }
                }
                try {
                  const singleJob = await adp.queue.addJob(
                    'microserviceDocumentsElasticSync',
                    newMS._id,
                    'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
                    [[newMS._id], null, null, objectiveForDocSync, 'ALL', newMS.check_pvi, 'microserviceDocumentsElasticSync', 'microservice'],
                    objectiveForDocSync,
                    0,
                    priorityForDocSync,
                  );
                  newMS.queueStatusLinkDocSync = adp.queue
                    .obtainObjectiveLink(singleJob.queue, true);
                } catch (ERROR) {
                  errorLog(
                    ERROR && ERROR.code ? ERROR.code : 500,
                    ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                    { id: newMS._id, error: ERROR },
                    'main',
                    packName,
                  );
                }
                const result = {
                  id: newMS._id,
                  queueStatusLink: newMS.queueStatusLink,
                  queueStatusLinkDocRefresh: newMS.queueStatusLinkDocRefresh,
                  queueStatusLinkDocSync: newMS.queueStatusLinkDocSync,
                };
                RESOLVE(result);
                await adp.queue.startJobs();
                return assetValidation.notifyAndLogIt(expectedOBJ.id, newMS, USR);
              }
              const errorCode = 500;
              REJECT(errorCode);
              return errorCode;
            })
            .catch(() => {
              const errorCode = 500;
              REJECT(errorCode);
              return errorCode;
            }));
      })
      .catch((error) => {
        adp.echoLog('ERROR FROM [ menuApplyRulesOnManual ]', error, 500, packName, true);
        REJECT(error);
        return error;
      });
  }
  REJECT(isValid);
  return isValid;
});
// ============================================================================================= //
