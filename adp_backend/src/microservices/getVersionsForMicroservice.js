/**
 * Get list of merged Versions based on Microservice from both artifactory & mimer servers
 * [ adp.microservices.getVersionsForMicroservice ]
 * @author Vinod
 */

class GetMicroserviceVersions {
  constructor() {
    this.packName = 'adp.microservices.getVersionsForMicroservice';
  }

  /**
  * getMSVersionsFromArtifactory()
  * Fetch the list of Microservice Version available from both "artifactory/arm"
  * @author Vinod
  */
  getMSVersionsFromArtifactory(devRepo, releaseRepo) {
    return new Promise((RESOLVE, REJECT) => {
      try {
        const { getVersionsFromRepos } = global.adp.artifactoryRepo;
        getVersionsFromRepos(devRepo, releaseRepo)
          .then((versionResp) => {
            let versionResult;
            if (versionResp.length > 0) {
              versionResult = versionResp.map(versions => versions.replace('.yaml', ''));
            } else {
              versionResult = versionResp || [];
            }
            RESOLVE(versionResult);
          });
      } catch (error) {
        adp.echoLog('Error in [getMSVersionsFromArtifactory]', error, 500, this.packName, true);
        // eslint-disable-next-line prefer-promise-reject-errors
        REJECT([]);
      }
    });
  }

  /**
  * getMSVersionsFromMimer()
  * Fetch the list of Microservice Version available from "mimer"
  * @author Vinod
  */
  async getMSVersionsFromMimer(productNumber) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const mimerController = new adp.mimer.MimerControl();
        const msProductNumber = productNumber.replace(/\s/g, '');
        await mimerController.getProduct(msProductNumber)
          .then((VERSIONRESPONSE) => {
            VERSIONRESPONSE.sort(global.adp.versionSort('-version'));
            const SORTEDVERSION = VERSIONRESPONSE.map(({ version }) => version);
            RESOLVE(SORTEDVERSION);
          })
          .catch((ERROR) => {
            adp.echoLog('Error in [getMSVersionsFromMimer]', ERROR, 500, this.packName, true);
            // eslint-disable-next-line prefer-promise-reject-errors
            REJECT([]);
          });
      } catch (error) {
        adp.echoLog('Error in [getMSVersionsFromMimer]', error, 500, this.packName, true);
        // eslint-disable-next-line prefer-promise-reject-errors
        REJECT([]);
      }
    });
  }

  /**
  * getListOfVersionForaMS()
  * Fetch the list of Microservice Versions available from both "artifactory/arm & mimer" servers
  * @author Vinod
  */
  getListOfVersionForaMS(msId) {
    return new Promise(async (RES) => {
      let microservice = null;
      const msInfo = {};
      const dbModel = new adp.models.Adp();
      await dbModel.getAssetByIDorSLUG(msId)
        .then((RESULT) => {
          if (RESULT && RESULT.docs && RESULT.docs.length > 0) {
            /* eslint-disable prefer-destructuring */
            microservice = RESULT.docs[0];
            msInfo.product_number = microservice.product_number;
            msInfo.mimer_version_starter = microservice.mimer_version_starter;
            msInfo._id = microservice._id;
            msInfo.slug = microservice.slug;
            msInfo.name = microservice.name;
            msInfo.menu_auto = microservice.menu_auto;
            msInfo.repo_urls = microservice.repo_urls;
            msInfo.armVersions = [];
            msInfo.mimerVersions = [];
          } else {
            msInfo.product_number = null;
            msInfo.mimer_version_starter = null;
            adp.echoLog(`Microservice not found for the MSID: ${microservice._id}`, null, 200, this.packName);
          }
        })
        .catch((ERROR) => {
          adp.echoLog('Error in [getListOfVersionForaMS]', ERROR, 500, this.packName, true);
        });

      let devRepo = microservice && microservice.repo_urls && microservice.repo_urls.development ? microservice.repo_urls.development : '';
      if ((`${devRepo}`).trim().length > 0) {
        if (devRepo.substr(devRepo.length - 1, 1) !== '/') {
          devRepo = `${devRepo}/`;
        }
      }
      let releaseRepo = microservice && microservice.repo_urls && microservice.repo_urls.release ? microservice.repo_urls.release : '';
      if ((`${releaseRepo}`).trim().length > 0) {
        if (releaseRepo.substr(releaseRepo.length - 1, 1) !== '/') {
          releaseRepo = `${releaseRepo}/`;
        }
      }

      // fetching arm versions
      if (!!devRepo && !!releaseRepo) {
        try {
          await this.getMSVersionsFromArtifactory(devRepo, releaseRepo)
            .then((armVersions) => {
              msInfo.armVersions = [...armVersions];
            });
        } catch (error) {
          msInfo.armVersions = [];
          RES(msInfo);
          adp.echoLog('Error in [getListOfVersionForaMS fetching arm version]', error, 500, this.packName, true);
        }
      } else {
        msInfo.armVersions = [];
        RES(msInfo);
      }

      // fetching mimer version
      if (msInfo.product_number !== undefined && msInfo.product_number !== null) {
        await this.getMSVersionsFromMimer(msInfo.product_number)
          .then((mimerVersions) => {
            msInfo.mimerVersions = mimerVersions !== undefined && mimerVersions !== null
              ? [...mimerVersions] : [];
            RES(msInfo);
          })
          .catch((err) => {
            msInfo.mimerVersions = [];
            RES(msInfo);
            adp.echoLog('Error in [getListOfVersionForaMS fetching mimer version]', err, 500, this.packName, true);
          });
      } else {
        msInfo.mimerVersions = [];
        RES(msInfo);
      }
    });
  }
}

module.exports = GetMicroserviceVersions;
