/* eslint-disable max-len */
// ============================================================================================= //
/**
* [ global.adp.assembly.create ]
* Create an Assembly.
* @param {JSON} ASSEMBLYOBJ a JSON Object with the Assembly. Must follow the schema.
* @return Return ID for OK, Code 500 if something went wrong.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //

module.exports = (ASSEMBLYOBJ, USR) => new Promise(async (RESOLVE, REJECT) => {
  // const timer = new Date();
  const packName = 'global.adp.microservice.create';
  const dbModel = new adp.models.Adp();
  const isValid = await global.adp.microservice.validateSchema(ASSEMBLYOBJ, 'assembly');
  const assetValidation = new global.adp.assetValidation.AssetValidationClass('assembly');
  if (isValid === true) {
    const newAssembly = ASSEMBLYOBJ;
    newAssembly.type = 'assembly';

    const selectCheck = await global.adp.microservice.validateListOptionSelections(ASSEMBLYOBJ);
    if (!selectCheck.valid) {
      REJECT(selectCheck.errorList);
      return selectCheck.errorList;
    }

    const uniqueAssetNameCheck = await assetValidation.uniqueAssetNameCheck(newAssembly.name);
    if (!uniqueAssetNameCheck) {
      const errorOnDuplicate = [`"${newAssembly.name}" is not an unique name. Cannot create an Assembly`];
      adp.echoLog(errorOnDuplicate[0], null, 500, packName, true);
      REJECT(errorOnDuplicate);
      return errorOnDuplicate;
    }

    if (newAssembly.assembly_maturity !== undefined
      && newAssembly.assembly_category !== undefined
      && newAssembly.assembly_maturity !== null
      && newAssembly.assembly_category !== null) {
      const domainValidation = assetValidation.domainValidation(newAssembly);
      if (!domainValidation) {
        const errorOnDomainField = ['"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".'];
        REJECT(errorOnDomainField);
        return errorOnDomainField;
      }

      const gitValidation = assetValidation.gitValidation(newAssembly);
      if (!gitValidation) {
        const errorOnGIT = ['[giturl] is mandatory when creating an Assembly'];
        REJECT(errorOnGIT);
        return errorOnGIT;
      }

      const helmChartNameValidation = assetValidation.helmChartNameValidation(newAssembly);
      if (!helmChartNameValidation) {
        const errorOnHelm = [`[helm_chartname] is mandatory if [assembly_maturity] === ${newAssembly.assembly_maturity}.`];
        REJECT(errorOnHelm);
        return errorOnHelm;
      }

      const helmUrlValidation = assetValidation.helmUrlValidation(newAssembly);
      if (!helmUrlValidation) {
        const errorOnHelm = [`[helmurl] is mandatory if [assembly_maturity] === ${newAssembly.assembly_maturity}.`];
        REJECT(errorOnHelm);
        return errorOnHelm;
      }

      const restrictedDescriptionValidation = assetValidation.restrictedDescriptionValidation(newAssembly);
      if (!restrictedDescriptionValidation) {
        const errorOnRestricted = ['[restricted_description] is mandatory if [restricted] === 1.'];
        REJECT(errorOnRestricted);
        return errorOnRestricted;
      }

      const additionalInfoValidation = assetValidation.additionalInfoValidation(newAssembly);
      if (additionalInfoValidation) {
        REJECT(additionalInfoValidation);
        return additionalInfoValidation;
      }

      let errorInTags = null;
      if (newAssembly.tags !== null && newAssembly.tags !== undefined) {
        await global.adp.tags.checkIt(newAssembly.tags, USR)
          .then((RES) => { newAssembly.tags = RES; })
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
      const errorForRequiredFields = ['Required fields are not defined in the Assembly Object'];
      REJECT(errorForRequiredFields);
      return errorForRequiredFields;
    }

    const componentServiceValidation = await assetValidation.componentServiceValidation(newAssembly);
    if (Array.isArray(componentServiceValidation)) {
      newAssembly.component_service = componentServiceValidation;
    } else {
      newAssembly.component_service = [];
    }


    if (newAssembly.compliance) {
      const { valid, validationResult, formattedArray } = global.adp.compliance.validator
        .validate(newAssembly.compliance);
      if (!valid) {
        const error = [validationResult];
        adp.echoLog('Error on "valid" variable from [ adp.compliance.validator.validate ]', error[0], 500, packName, true);
        REJECT(error);
        return error;
      }
      newAssembly.compliance = formattedArray;
    } else {
      newAssembly.compliance = [];
    }
    await global.adp.user.createFromTeam(newAssembly);

    newAssembly.date_modified = new Date();
    newAssembly.date_created = new Date();

    newAssembly.inval_secret = Math.random().toString(36).substring(3);

    if (typeof newAssembly.name === 'string' && newAssembly.name.length > 0) {
      newAssembly.slug = await global.adp.slugIt(newAssembly.name.trim());
    } else {
      const invalidName = [`${newAssembly.name} is not a valid name. Cannot create.`];
      adp.echoLog('Error validating the name', { error: invalidName[0] }, 500, packName, true);
      REJECT(invalidName);
      return invalidName;
    }

    const cpiValidation = assetValidation.checkCPIValidation(newAssembly);
    if (!cpiValidation) {
      const errorOnCpiCheck = [`[cpi_check] should not be provided if [assembly_category] === ${newAssembly.assembly_category}.`];
      REJECT(errorOnCpiCheck);
      return errorOnCpiCheck;
    }
    // If check_cpi hasn't been passed with the request, add `false` by default
    if (!newAssembly.check_cpi) {
      newAssembly.check_cpi = false;
    }

    newAssembly.menu = global.adp.microservice.menuBasicStructure(newAssembly.menu);
    return global.adp.microservice.menuApplyRulesOnManual(newAssembly.menu)
      .then((RESULT) => {
        newAssembly.menu = RESULT;
        return dbModel.createOne(newAssembly)
          .then(async (expectedOBJ) => {
            if (expectedOBJ.ok === true) {
              newAssembly._id = expectedOBJ.id;
              const uniqueStringForObjective = `${newAssembly.slug}__${(new Date()).getTime()}`;
              const objectiveForMSRefresh = `assemblySync_${uniqueStringForObjective}`;
              const priorityForMSRefresh = 0;

              const objectiveForDocRefresh = `documentRefresh_${uniqueStringForObjective}`;
              const priorityForDocRefresh = 1;

              const objectiveForDocSync = `documentSync_${uniqueStringForObjective}`;
              const priorityForDocSync = 2;

              try {
                const singleJob = await adp.queue.addJob(
                  'assemblyElasticSync',
                  newAssembly._id,
                  'adp.microservice.synchronizeWithElasticSearch',
                  [newAssembly._id, null, 'assembly'],
                  objectiveForMSRefresh,
                  0,
                  priorityForMSRefresh,
                );
                newAssembly.queueStatusLink = adp.queue
                  .obtainObjectiveLink(singleJob.queue, true);
              } catch (ERROR) {
                errorLog(
                  ERROR && ERROR.code ? ERROR.code : 500,
                  ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                  { id: newAssembly._id, error: ERROR },
                  'main',
                  packName,
                );
              }
              const teamHistInst = new adp.teamHistory.TeamHistoryController();
              teamHistInst.fetchLatestSnapshotsMsList([newAssembly]).catch(
                errorSnapshot => adp.echoLog('Failure to create team snapshot', { error: errorSnapshot, origin: 'global.adp.assembly.create' }, 500, packName),
              );
              if (global.adp.microservice.menuCheckIfShouldCallDocumentRefresh(newAssembly) === true) {
                try {
                  const singleJob = await adp.queue.addJob(
                    'documentRefresh',
                    newAssembly._id,
                    'adp.integration.documentRefresh.update',
                    [newAssembly, objectiveForDocRefresh, 'ALL'],
                    objectiveForDocRefresh,
                    0,
                    priorityForDocRefresh,
                  );
                  newAssembly.queueStatusLinkDocRefresh = adp.queue
                    .obtainObjectiveLink(singleJob.queue, true);
                } catch (ERROR) {
                  errorLog(
                    ERROR && ERROR.code ? ERROR.code : 500,
                    ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                    { id: newAssembly._id, error: ERROR },
                    'main',
                    packName,
                  );
                }
              }
              try {
                const singleJob = await adp.queue.addJob(
                  'assemblyDocumentsElasticSync',
                  newAssembly._id,
                  'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
                  [[newAssembly._id], null, null, objectiveForDocSync, 'ALL', false, 'microserviceDocumentsElasticSync', 'assembly'],
                  objectiveForDocSync,
                  0,
                  priorityForDocSync,
                );
                newAssembly.queueStatusLinkDocSync = adp.queue
                  .obtainObjectiveLink(singleJob.queue, true);
              } catch (ERROR) {
                errorLog(
                  ERROR && ERROR.code ? ERROR.code : 500,
                  ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                  { id: newAssembly._id, error: ERROR },
                  'main',
                  packName,
                );
              }
              const result = {
                id: newAssembly._id,
                queueStatusLink: newAssembly.queueStatusLink,
                queueStatusLinkDocRefresh: newAssembly.queueStatusLinkDocRefresh,
                queueStatusLinkDocSync: newAssembly.queueStatusLinkDocSync,
              };
              RESOLVE(result);
              await adp.queue.startJobs();
              return assetValidation.notifyAndLogIt(expectedOBJ.id, newAssembly, USR);
            }
            const errorCode = 500;
            REJECT(errorCode);
            return errorCode;
          });
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
