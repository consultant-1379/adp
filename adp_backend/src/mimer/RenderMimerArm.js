// ============================================================================================= //
/**
* [ adp.mimer.RenderMimerArm ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class RenderMimerArmClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.mimer.RenderMimerArmClass';
  }

  /**
   * _prepareArmAutoMenuVersions ( PRIVATE )
   * Organize all the versions of
   * Arm Auto Menu for comparison.
   * @param VERSIONS Array where the
   * result will be saved.
   * @param ARMAUTOMENU Arm Auto Menu Object
   * from Microservice Object.
   * @author Armando Dias [zdiaarm]
   */
  _prepareArmAutoMenuVersions(VERSIONS, ARMAUTOMENU) {
    if (ARMAUTOMENU) {
      if (Array.isArray(ARMAUTOMENU.development)) {
        const found = VERSIONS.filter(ITEM => ITEM.version === 'development');
        if (found.length > 0) {
          found[0].source.push('auto');
        } else {
          const obj = {
            version: 'development',
            source: ['auto'],
          };
          VERSIONS.push(obj);
        }
      }
      if (Array.isArray(ARMAUTOMENU.release)) {
        ARMAUTOMENU.release.forEach((ITEM) => {
          const found = VERSIONS.filter(ITEMVERSION => ITEMVERSION.version === ITEM.version);
          if (found.length > 0) {
            found[0].source.push('auto');
          } else {
            const obj = {
              version: `${ITEM.version}`,
              source: ['auto'],
            };
            VERSIONS.push(obj);
          }
        });
      }
    }
  }


  /**
   * _prepareArmManualMenuVersions ( PRIVATE )
   * Organize all the versions of
   * Arm Manual Menu for comparison.
   * @param VERSIONS Array where the
   * result will be saved.
   * @param ARMMANUALMENU Arm Manual Menu Object
   * from Microservice Object.
   * @author Armando Dias [zdiaarm]
   */
  _prepareArmManualMenuVersions(VERSIONS, ARMMANUALMENU) {
    if (ARMMANUALMENU) {
      if (Array.isArray(ARMMANUALMENU.development)) {
        const found = VERSIONS.filter(ITEM => ITEM.version === 'development');
        if (found.length > 0) {
          found[0].source.push('manual');
        } else {
          const obj = {
            version: 'development',
            source: ['manual'],
          };
          VERSIONS.push(obj);
        }
      }
      if (Array.isArray(ARMMANUALMENU.release)) {
        ARMMANUALMENU.release.forEach((ITEM) => {
          const found = VERSIONS.filter(ITEMVERSION => ITEMVERSION.version === ITEM.version);
          if (found.length > 0) {
            found[0].source.push('manual');
          } else {
            const obj = {
              version: `${ITEM.version}`,
              source: ['manual'],
            };
            VERSIONS.push(obj);
          }
        });
      }
    }
  }


  /**
   * _getMS ( PRIVATE )
   * Get Microservice Object from Database.
   * @param MSID String with the Microservice ID.
   * @returns Resolve a Promise with the
   * Microservice Object or rejects if something
   * wrong happens.
   * @author Armando Dias [zdiaarm]
   */
  _getMS(MSID) {
    return new Promise((RESOLVE, REJECT) => {
      const adpModel = new adp.models.Adp();
      adpModel.getOneById(MSID)
        .then((RESULT) => {
          if (RESULT && RESULT.docs && RESULT.docs[0]) {
            RESOLVE(RESULT.docs[0]);
          } else {
            const errorCode = 500;
            const errorMessage = 'Error caught on [ adpModel.getOneById(MSID) ]';
            const errorObject = {
              message: 'Unexpected Result from adpModel.getOneById(MSID)',
              msid: MSID,
              error: RESULT,
            };
            const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getMS', this.packName);
            REJECT(errorLogObject);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getOneById(MSID) ]';
          const errorObject = { msid: MSID, error: ERROR };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getMS', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * _updateMicroservice ( PRIVATE )
   * Update the Microservice Object
   * ( Only necessary fields + _id ).
   * @param MS Microservice Object.
   * @returns Resolve a Promise if
   * successful or rejects if gets
   * an error.
   * @author Armando Dias [zdiaarm]
   */
  _updateMicroservice(MS) {
    return new Promise((RESOLVE, REJECT) => {
      const adpModel = new adp.models.Adp();
      adpModel.update(MS)
        .then(() => {
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.update(MS) ]';
          const errorObject = { error: ERROR, ms: MS };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_updateMergedMenu', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * _getMinimalMimerMergeVersion ( PRIVATE )
   * Shortcut to get the Minimal
   * Mimer Merge Version.
   * @param ASSETID String with the Asset ID.
   * @returns The Minimal Mimer
   * Merge Version or NULL if
   * the object is undefined/null.
   * @author Armando Dias [zdiaarm]
   */
  _getMinimalMimerMergeVersion(ASSETID) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const adpModel = new adp.models.Adp();
        const mimerStarterVersion = await adpModel.getJustTheMimerVersionStarterFromAsset(ASSETID);
        if (typeof mimerStarterVersion === 'string') {
          RESOLVE(`${mimerStarterVersion}`);
        } else {
          RESOLVE(null);
        }
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ _getMinimalMimerMergeVersion ]';
        const errorObject = { error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getMinimalMimerMergeVersion', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * _getARMMenuVersions ( PRIVATE )
   * Shortcut to get the ARM
   * Versions List from Database.
   * @param ASSETID String with the Asset ID.
   * @returns Array with the Version list.
   * @author Armando Dias [zdiaarm]
   */
  _getARMMenuVersions(ASSETID) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const adpModel = new adp.models.Adp();
        const armMenu = await adpModel.getARMMenu(ASSETID);
        const hasDevelopment = armMenu
          && armMenu.menu
          && armMenu.menu.auto
          && armMenu.menu.auto.development;
        const releaseShortcut = armMenu
          && armMenu.menu
          && armMenu.menu.auto
          && Array.isArray(armMenu.menu.auto.release)
          ? armMenu.menu.auto.release
          : [];
        const armResultArray = [];
        if (hasDevelopment) armResultArray.push('development');
        releaseShortcut.forEach((ITEM) => {
          armResultArray.push(ITEM.version);
        });
        RESOLVE(armResultArray);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ _getARMMenuVersions ]';
        const errorObject = { error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getARMMenuVersions', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * _getMimerMenuVersions ( PRIVATE )
   * Shortcut to get the Mimer
   * Versions List from Database.
   * @param ASSETID String with the Asset ID.
   * @returns Array with the Version list.
   * @author Armando Dias [zdiaarm]
   */
  _getMimerMenuVersions(ASSETID) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const assetDocModel = new adp.models.AssetDocuments();
        const allMimerVersions = await assetDocModel.getMenuVersions(ASSETID, 'mimer');
        if (Array.isArray(allMimerVersions)) {
          RESOLVE(allMimerVersions);
        } else {
          RESOLVE([]);
        }
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ _getMimerMenuVersions ]';
        const errorObject = { error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_getMimerMenuVersions', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * _generateQueueForMenuRenderPerVersion ( PRIVATE )
   * Generates a queue to render the menu per version.
   * @param MSID String with the Microservice ID.
   * @param MSSLUG String with the Microservice Slug.
   * @param QUEUEOBJECTIVE String with the Queue Objective ID.
   * @param MIMERVERSIONSTARTER String with the lowest version
   * we should consider to use Mimer Documentation.
   * @param ALLVERSIONS Array with all the versions found
   * from Mimer and Arm for this Microservice.
   * @returns Successful Promise or a rejection with the error.
   * @author Armando Dias [zdiaarm]
   */
  async _generateQueueForMenuRenderPerVersion(
    MSID,
    QUEUEOBJECTIVE,
    MIMERVERSIONSTARTER,
    ALLVERSIONS,
  ) {
    let limitPerExecution;
    const versionsLength = ALLVERSIONS.length;
    if (versionsLength <= 100) {
      limitPerExecution = 50;
    } else if (versionsLength <= 500) {
      limitPerExecution = 100;
    } else if (versionsLength <= 1000) {
      limitPerExecution = 200;
    } else {
      limitPerExecution = 300;
    }

    const adpModel = new adp.models.Adp();
    const mimerDevelopmentVersion = await adpModel.getMimerDevelopmentVersionFromYAML(MSID);
    let index = await adp.queue.getNextIndex(QUEUEOBJECTIVE);
    const allVersions = ALLVERSIONS.sort(adp.versionSort('-version'));
    return new Promise((RESOLVE, REJECT) => {
      const queueJobs = [];
      const groups = [];
      let limitIndex = 0;
      allVersions.forEach((ITEM) => {
        if (groups && !groups[limitIndex]) groups.push([]);
        if (groups[limitIndex].length >= limitPerExecution) {
          groups.push([]);
          limitIndex += 1;
        }
        groups[limitIndex].push([ITEM.version, ITEM.source]);
      });

      groups.forEach((ITEM) => {
        const jobQueuePreparation = {
          command: 'adp.mimer.renderMimerArmMenuVersion',
          parameters: [
            MSID,
            MIMERVERSIONSTARTER,
            ITEM,
            QUEUEOBJECTIVE,
          ],
          index,
        };
        queueJobs.push(jobQueuePreparation);
        index += 1;
      });

      queueJobs.push({
        command: 'adp.mimer.renderMimerArmMenuFinisher',
        parameters: [MSID, mimerDevelopmentVersion],
        index,
      });

      adp.queue.addJobs(
        'mimerDocumentUpdate',
        MSID,
        QUEUEOBJECTIVE,
        queueJobs,
      )
        .then(() => {
          RESOLVE(true);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adp.queue.addJobs ]';
          const errorObject = { error: ERROR };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', this.packName);
          REJECT(errorLogObject);
        });
    });
  }


  /**
   * _getClassicArmRender ( PRIVATE )
   * Retrieve the Arm Document after the denormalization.
   * @param MS Microservice Object.
   * @return The required menu. Or null if not found.
   * @author Armando Dias [zdiaarm]
   */
  async _getClassicArmRender(MS) {
    try {
      const preRender = await adp.microservice.updateAssetDocSettings(MS);
      const msRendered = await adp.feRendering.prepareDocStructureForRendering(preRender);
      if (msRendered && msRendered.documentsForRendering) {
        Object.keys(msRendered.documentsForRendering).forEach((INDEX) => {
          const version = msRendered.documentsForRendering[INDEX];
          Object.keys(version).forEach((CATINDEX) => {
            const category = version[CATINDEX];
            if (Array.isArray(category)) {
              category.forEach((DOCUMENT) => {
                const document = DOCUMENT;
                document.document_server_source = 'arm';
              });
            }
          });
        });
        return msRendered.documentsForRendering;
      }
      return null;
    } catch (ERROR) {
      return null;
    }
  }


  /**
   * _getMimerMenuByVersion ( PRIVATE )
   * Retrieve the Mimer Document Version
   * @param MS Microservice Object.
   * @param VERSION String with the required version.
   * @return The required menu. Or null if not found.
   * @author Armando Dias [zdiaarm]
   */
  async _getMimerMenuByVersion(MS, VERSION) {
    try {
      if (MS && MS.mimer_menu && MS.mimer_menu[VERSION]) {
        return MS.mimer_menu[VERSION];
      }
      return null;
    } catch (ERROR) {
      return null;
    }
  }


  /**
   * _verifyMimerVersion ( PRIVATE )
   * Checks if the Current Version is allowed to be used
   * case it is equal or greater than the starter version.
   * @param MIMERVERSIONSTARTER String with the Starter Version.
   * @param CURRENTVERSION String with the Current Version.
   * @return Boolean. True if we can Use/Merge Mimer Menu.
   * @author Armando Dias [zdiaarm]
   */
  _verifyMimerVersion(MIMERVERSIONSTARTER, CURRENTVERSION) {
    if (!MIMERVERSIONSTARTER) {
      return false;
    }
    if (MIMERVERSIONSTARTER === CURRENTVERSION) {
      return true;
    }
    const originalArray = [
      { version: MIMERVERSIONSTARTER, result: false },
      { version: CURRENTVERSION, result: true },
    ];
    const sortedArray = originalArray.sort(adp.versionSort('-version'));
    return sortedArray[0].result;
  }


  /**
   * _addArmMenu ( PRIVATE )
   * Method used case you want to add an Arm Menu Version.
   * @param MSID String with the Microservice ID.
   * @param CURRENTVERSION String with the Current Version.
   * @param MENUOBJECT Original ARM Menu full object.
   * @return Resolved Promise if successful.
   * Rejected if it fails.
   * @author Armando Dias [zdiaarm]
   */
  async _addArmMenu(
    ASSETID,
    ASSETSLUG,
    CURRENTVERSION,
    MENUOBJECT,
    MIMERVERSIONSTARTER,
    MIMERDEVVERSION,
  ) {
    try {
      const startTimer = (new Date()).getTime();
      let currentVersion = `${CURRENTVERSION}`;
      if (currentVersion.indexOf('+') >= 0) {
        currentVersion = currentVersion.replace('+', '');
      }
      let armMenu = MENUOBJECT[currentVersion];
      if (!armMenu) {
        return new Promise(RESOLVE => RESOLVE(true));
      }
      armMenu.versionLabel = `${CURRENTVERSION}`;
      armMenu.isMimerCertificated = this._verifyMimerVersion(MIMERVERSIONSTARTER, CURRENTVERSION);

      // Applying Rules
      armMenu = await this._recategorizeDocuments(armMenu, 'arm', MIMERVERSIONSTARTER, MIMERDEVVERSION);
      armMenu = await this._reOrderAllCategories(armMenu);
      armMenu = await this._setDefaultDocument(currentVersion, armMenu);

      const assetDocuments = new adp.models.AssetDocuments();
      armMenu = this.documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter(armMenu);
      await assetDocuments.createOrUpdate(ASSETID, ASSETSLUG, 'merged', CURRENTVERSION, armMenu);
      const endTimer = (new Date()).getTime();
      if ((endTimer - startTimer) > 1000) {
        adp.echoLog(`Merged Menu [ ${ASSETID} :: ${CURRENTVERSION} ]( _addArmMenu ) took too much time to be updated on database: ${endTimer - startTimer}ms`, null, 200, this.packName);
      }
      return new Promise(RESOLVE => RESOLVE(true));
    } catch (ERROR) {
      return new Promise((RESOLVE, REJECT) => REJECT(ERROR));
    }
  }


  /**
   * _addMimerMenu ( PRIVATE )
   * Method used case you want to add a Mimer Menu Version.
   * @param ASSETID String with the Asset ID.
   * @param CURRENTVERSION String with the Current Version.
   * @param MIMERVERSIONS Array with mimer menu versions.
   * @return Resolved Promise if successful.
   * Rejected if it fails.
   * @author Armando Dias [zdiaarm]
   */
  async _addMimerMenu(
    ASSETID,
    ASSETSLUG,
    CURRENTVERSION,
    MIMERVERSIONS,
    MIMERVERSIONSTARTER,
    MIMERDEVVERSION,
  ) {
    try {
      const startTimer = (new Date()).getTime();
      let mimerMenu = null;
      for (let index = 0; index < MIMERVERSIONS.length; index += 1) {
        const menu = MIMERVERSIONS[index];
        if (!mimerMenu && `${menu.version}` === `${CURRENTVERSION}`) {
          mimerMenu = menu;
          break;
        }
      }
      if (mimerMenu) {
        // Applying Rules
        mimerMenu = await this._recategorizeDocuments(mimerMenu, 'mimer', MIMERVERSIONSTARTER, MIMERDEVVERSION);
        mimerMenu = await this._reOrderAllCategories(mimerMenu);
        mimerMenu = await this._setDefaultDocument(CURRENTVERSION, mimerMenu);
        mimerMenu.isMimerCertificated = this._verifyMimerVersion(
          MIMERVERSIONSTARTER,
          CURRENTVERSION,
        );
        const assetDocuments = new adp.models.AssetDocuments();
        this.documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter(mimerMenu);
        await assetDocuments.createOrUpdate(ASSETID, ASSETSLUG, 'merged', CURRENTVERSION, mimerMenu);
        const endTimer = (new Date()).getTime();
        if ((endTimer - startTimer) > 1000) {
          adp.echoLog(`Merged Menu [ ${mimerMenu.asset_slug} :: ${CURRENTVERSION} ]( _addMimerMenu ) took too much time to be updated on database: ${endTimer - startTimer}ms`, null, 200, this.packName);
        }
      }
      return new Promise(RESOLVE => RESOLVE(true));
    } catch (ERROR) {
      return new Promise((RESOLVE, REJECT) => REJECT(ERROR));
    }
  }


  /**
   * _addMergedMenu ( PRIVATE )
   * Method used case you want to merge a Mimer Menu
   * Version with the Arm Menu of the same version.
   * @param MSID String with the Microservice ID.
   * @param CURRENTVERSION String with the Current Version.
   * @return Resolved Promise if successful.
   * Rejected if it fails.
   * @author Armando Dias [zdiaarm]
   */
  async _addMergedMenu(
    ASSETID,
    ASSETSLUG,
    CURRENTVERSION,
    ARMMENU,
    MIMERMENU,
    MIMERVERSIONSTARTER,
    MIMERDEVVERSION,
  ) {
    const startTimer = (new Date()).getTime();
    let armMenu = null;
    let mimerMenu = null;

    // Retrieve the current version menus from ARMMENU and MIMERMENU parameters
    try {
      for (let index = 0; index < MIMERMENU.length; index += 1) {
        const menu = MIMERMENU[index];
        if (!mimerMenu
          && `${menu.version}` === `${CURRENTVERSION}`
          && menu.docs) {
          mimerMenu = menu.docs;
          break;
        }
      }
      let currentVersion = `${CURRENTVERSION}`;
      if (currentVersion.indexOf('+') >= 0) {
        currentVersion = currentVersion.replace('+', '');
      }
      armMenu = ARMMENU[currentVersion];
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch ]';
      const errorObject = {
        assetid: ASSETID,
        assetslug: ASSETSLUG,
        currentversion: CURRENTVERSION,
        error: ERROR,
        armmenu: ARMMENU,
        mimermenu: MIMERMENU,
      };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_addMergedMenu', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }

    // Merging menus
    try {
      let mergedMenu = {};
      mergedMenu.versionLabel = mimerMenu
        && mimerMenu.versionLabel
        ? mimerMenu.versionLabel
        : '';
      mergedMenu.isCpiUpdated = armMenu
        && armMenu.isCpiUpdated
        ? armMenu.isCpiUpdated
        : false;
      mergedMenu.isMimerCertificated = this._verifyMimerVersion(
        MIMERVERSIONSTARTER,
        CURRENTVERSION,
      );
      mergedMenu['release-documents'] = [];
      mergedMenu['additional-documents'] = [];
      const mimerSlugs = [];
      if (mimerMenu) {
        Object.keys(mimerMenu).forEach((KEY) => {
          if (Array.isArray(mimerMenu[KEY])) {
            mimerMenu[KEY].forEach((DOC) => {
              const doc = DOC;
              doc.document_server_source = 'mimer';
              mimerSlugs.push(doc.slug);
              mergedMenu['release-documents'].push(doc);
            });
          }
        });
      }
      if (armMenu) {
        Object.keys(armMenu).forEach((KEY) => {
          if (Array.isArray(armMenu[KEY])) {
            armMenu[KEY].forEach((DOC) => {
              const doc = adp.clone(DOC);
              doc.document_server_source = 'arm';
              if (!mergedMenu[doc.category_slug]) {
                mergedMenu[doc.category_slug] = [];
              }
              mergedMenu[doc.category_slug].push(doc);
            });
          }
        });
      }

      // Applying Rules
      mergedMenu = await this._recategorizeDocuments(mergedMenu, 'merged', MIMERVERSIONSTARTER, MIMERDEVVERSION);
      mergedMenu = await this._reOrderAllCategories(mergedMenu);
      mergedMenu = await this._setDefaultDocument(CURRENTVERSION, mergedMenu);
      mimerMenu = mimerMenu && mimerMenu.docs ? mimerMenu.docs : mimerMenu;

      // Saving Version Menu
      const assetDocuments = new adp.models.AssetDocuments();
      mergedMenu = this.documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter(mergedMenu);
      await assetDocuments.createOrUpdate(ASSETID, ASSETSLUG, 'merged', CURRENTVERSION, mergedMenu);

      // Finishing...
      const endTimer = (new Date()).getTime();
      if ((endTimer - startTimer) > 1000) {
        adp.echoLog(`Merged Menu [ ${ASSETSLUG} :: ${CURRENTVERSION} ]( _addMergedMenu ) took too much time to be updated on database: ${endTimer - startTimer}ms`, null, 200, this.packName);
      }
      return new Promise(RESOLVE => RESOLVE(true));
    } catch (ERROR) {
      return new Promise((RESOLVE, REJECT) => REJECT(ERROR));
    }
  }


  /**
   * mainQueuePreparation
   * This method starts the process of
   * analysis of all versions.
   * @param MSID String with the Microservice ID.
   * @param QUEUEOBJECTIVE String with the Queue Objective ID.
   * @author Armando Dias [zdiaarm]
   */
  async mainQueuePreparation(MSID, QUEUEOBJECTIVE) {
    try {
      const armFullVersionList = await this._getARMMenuVersions(MSID);
      const mimerFullVersionList = await this._getMimerMenuVersions(MSID);
      const mimerVersionStarter = await this._getMinimalMimerMergeVersion(MSID);
      const versions = [];
      armFullVersionList.forEach((ITEM) => {
        const obj = {
          version: `${ITEM}`,
          source: ['auto'],
        };
        versions.push(obj);
      });
      mimerFullVersionList.forEach((ITEM) => {
        if (armFullVersionList.includes(`${ITEM}`)) {
          versions.forEach((SUBITEM) => {
            if (SUBITEM.version === ITEM) {
              SUBITEM.source.push('mimer');
            }
          });
        } else {
          const obj = {
            version: `${ITEM}`,
            source: ['mimer'],
          };
          versions.push(obj);
        }
      });
      await this._generateQueueForMenuRenderPerVersion(
        MSID,
        QUEUEOBJECTIVE,
        mimerVersionStarter,
        versions,
      );
      return new Promise(RESOLVE => RESOLVE(true));
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch ]';
      const errorObject = { msid: MSID, queueObjective: QUEUEOBJECTIVE, error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'mainQueuePreparation', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }
  }


  /**
   * versionDocumentPreparation
   * Build the new menu applying the rules
   * under the "menu_merged_wip" field.
   * @param ASSETID String with the Asset ID.
   * @param MIMERVERSIONSTARTER String with the Starter Version.
   * @param VERSIONS Array of objects, with versions and sources.
   * @author Armando Dias [zdiaarm]
   */
  async versionDocumentPreparation(
    ASSETID,
    MIMERVERSIONSTARTER,
    VERSIONS,
  ) {
    let originalARMMenuFromDatabase = null;
    let necessaryMimerVersionsFromDatabase = null;

    let slug;
    try {
      slug = await this._getAssetSlug(ASSETID);
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught calling _getAssetSlug';
      const errorObject = { assetid: ASSETID, error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'versionDocumentPreparation', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }

    // Retrieving menus for the group execution :: BEGIN //
    try {
      let thereIsARM = false;
      let thereIsMimer = false;
      const onlyMimerVersionsList = [];
      VERSIONS.forEach((ITEM) => {
        if (!thereIsARM && ITEM[1].includes('auto')) thereIsARM = true;
        if (ITEM[1].includes('mimer')) {
          onlyMimerVersionsList.push(ITEM[0]);
          thereIsMimer = true;
        }
      });
      if (thereIsARM) {
        const startDate = (new Date()).getTime();
        const adpModel = new adp.models.Adp();
        const classicMenuFromDatabase = await adpModel.getARMMenu(ASSETID);
        classicMenuFromDatabase.slug = slug;
        const addOneBecauseDevelopment = classicMenuFromDatabase
          && classicMenuFromDatabase.menu
          && classicMenuFromDatabase.menu.auto
          && classicMenuFromDatabase.menu.auto.development
          ? 1
          : 0;
        const releaseVersionsSize = classicMenuFromDatabase
          && classicMenuFromDatabase.menu
          && classicMenuFromDatabase.menu.auto
          && classicMenuFromDatabase.menu.auto.release
          ? classicMenuFromDatabase.menu.auto.release.length
          : 0;
        const armVersionsQuant = addOneBecauseDevelopment + releaseVersionsSize;
        const endDate = (new Date()).getTime();
        adp.echoLog(`${armVersionsQuant} ARM Menu Version objects [ ${slug} ] retrieved from database in ${endDate - startDate}ms`, null, 200, this.packName);
        const startDenormDate = (new Date()).getTime();
        originalARMMenuFromDatabase = await this._getClassicArmRender(classicMenuFromDatabase);
        const endDenormDate = (new Date()).getTime();
        adp.echoLog(`${armVersionsQuant} ARM Menu Version objects [ ${slug} ] denormalized in ${endDenormDate - startDenormDate}ms`, null, 200, this.packName);
      }
      if (thereIsMimer) {
        const startDate = (new Date()).getTime();
        const AssetDocModel = new adp.models.AssetDocuments();
        necessaryMimerVersionsFromDatabase = await AssetDocModel.getSpecificVersion(
          ASSETID,
          'mimer',
          onlyMimerVersionsList,
        );
        if (necessaryMimerVersionsFromDatabase
          && Array.isArray(necessaryMimerVersionsFromDatabase.docs)) {
          necessaryMimerVersionsFromDatabase = necessaryMimerVersionsFromDatabase.docs;
        }
        const endDate = (new Date()).getTime();
        adp.echoLog(`${necessaryMimerVersionsFromDatabase.length} Mimer versions [ ${slug} ] retrieved from database in ${endDate - startDate}ms`, null, 200, this.packName);
      }
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch - First Block ]';
      const errorObject = { assetid: ASSETID, error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'versionDocumentPreparation', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }
    // Retrieving menus for the group execution :: END //

    // Performing group execution, in order :: BEGIN //
    try {
      let versionStartTimer = null;
      let devVersion;
      return new Promise((RESOLVE) => {
        let index = 0;
        const run = async () => {
          if (!versionStartTimer) versionStartTimer = (new Date()).getTime();
          if (VERSIONS && !VERSIONS[index]) {
            const versionEndTimer = (new Date()).getTime();
            adp.echoLog(`Merged Menu [ ${slug} :: ${index} Versions ] processed and updated on database in: ${versionEndTimer - versionStartTimer}ms`, null, 200, this.packName);
            return RESOLVE(true);
          }
          const currentVersion = VERSIONS[index][0];
          const currentSource = VERSIONS[index][1];
          let merge = this._verifyMimerVersion(MIMERVERSIONSTARTER, currentVersion);
          if (!merge) {
            const adpModel = new adp.models.Adp();
            devVersion = await adpModel.getMimerDevelopmentVersionFromYAML(ASSETID);
            if (devVersion === currentVersion) {
              merge = true;
            }
          }
          const hasMimer = currentSource.includes('mimer');
          const hasAuto = currentSource.includes('auto');

          if ((!merge && hasAuto) || (merge && !hasMimer && hasAuto)) {
            await this._addArmMenu(
              ASSETID,
              slug,
              currentVersion,
              originalARMMenuFromDatabase,
              MIMERVERSIONSTARTER,
              devVersion,
            );
          } else if (merge && hasMimer && !hasAuto) {
            this._addMimerMenu(
              ASSETID,
              slug,
              currentVersion,
              necessaryMimerVersionsFromDatabase,
              MIMERVERSIONSTARTER,
              devVersion,
            );
          } else if (merge && hasMimer && hasAuto) {
            this._addMergedMenu(
              ASSETID,
              slug,
              currentVersion,
              originalARMMenuFromDatabase,
              necessaryMimerVersionsFromDatabase,
              MIMERVERSIONSTARTER,
              devVersion,
            );
          }
          index += 1;
          return run();
        };
        return run();
      });
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch - Second Block ]';
      const errorObject = { assetid: ASSETID, error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'versionDocumentPreparation', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }
    // Performing group execution, in order :: END //
  }


  /**
   * [ PRIVATE ] _getAssetSlug
   * Retrieve the Asset's Slug from Database.
   * @param ASSETID String with the Asset's ID.
   * @returns String with the Asset's slug;
   * @author Armando Dias [zdiaarm]
   */
  _getAssetSlug(ASSETID) {
    return new Promise(async (RESOLVE, REJECT) => {
      try {
        const adpModel = new adp.models.Adp();
        const slug = await adpModel.getAssetSlugUsingID(ASSETID);
        RESOLVE(slug);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch - Second Block ]';
        const errorObject = { assetid: ASSETID, error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'versionDocumentPreparation', this.packName);
        REJECT(errorLogObject);
      }
    });
  }


  /**
   * [ PRIVATE ] _recategorizeDocuments
   * Read the menu list and re-categorize
   * the documents in the right in a new category;
   * @param MENU Object with menu list inside.
   * @param MENUTYPE String, if the menu is
   * "mimer", "arm" or "merged".
   * @returns nothing. The menu is updated
   * at the end of this function.
   * @author Armando Dias [zdiaarm]
   */
  _recategorizeDocuments(MENU, MENUTYPE, MIMERVERSIONSTARTER, MIMERDEVVERSION) {
    const menu = MENU && MENU.docs ? MENU.docs : MENU;
    const isEqualOrNewer = this._verifyMimerVersion(MIMERVERSIONSTARTER, menu.versionLabel);
    const menuStatic = adp.clone(menu);
    if (!MIMERDEVVERSION && menu.versionLabel === 'development') {
      return menuStatic;
    }
    const newMenu = {
      versionLabel: menu && menu.versionLabel ? menu.versionLabel : undefined,
      isCpiUpdated: menu && menu.isCpiUpdated ? menu.isCpiUpdated : false,
      isMimerCertificated: menu && menu.isMimerCertificated ? menu.isMimerCertificated : false,
    };
    const dpiTitleArray = [
      'User Guide',
      'API Specification',
      'Application Developers Guide',
    ];
    const innerSourceTitleArray = [
      'Inner Source README',
      'Contributing Guideline',
    ];
    Object.keys(menuStatic).forEach((CATEGORY) => {
      const category = menuStatic[CATEGORY];
      if (Array.isArray(category)) {
        for (let index = 0; index < category.length; index += 1) {
          const document = category[index];
          let changed = false;
          if (isEqualOrNewer
            && (document.category_slug === 'dpi'
            || document.category_slug === 'release-documents')
            && document.document_server_source === 'arm'
          ) {
            changed = true;
          } else if (isEqualOrNewer
            || (!isEqualOrNewer && menuStatic.versionLabel === MIMERDEVVERSION)) {
            changed = this._moveCategory(newMenu, document, 'dpi', 'Developer Product Information', 'mimer', dpiTitleArray, changed);
            changed = this._moveCategory(newMenu, document, 'inner-source', 'Inner Source', 'arm', innerSourceTitleArray, changed);
            changed = this._moveCategory(newMenu, document, 'release-documents', 'Release Documents', 'mimer', null, changed);
            changed = this._moveCategory(newMenu, document, 'additional-documents', 'Additional Documents', 'arm', null, changed);
          } else {
            if (!newMenu[document.category_slug]) {
              newMenu[document.category_slug] = [];
            }
            newMenu[document.category_slug].push(document);
          }
        }
      }
    });
    if (menu && menu['release-documents']
    && menu['release-documents'].some(item => item.name.includes('Software Vendor List'))
    && newMenu && newMenu['release-documents']
    && !newMenu['release-documents'].some(item => item.name.includes('Software Vendor List'))
    ) {
      const svl = menu['release-documents'].find(item => item.name.includes('Software Vendor List'));
      newMenu['release-documents'].push(svl);
    }
    return newMenu;
  }


  /**
   * [ PRIVATE ] _moveCategory
   * Move a document from one category to another
   * @param MENU Object at menu level.
   * @param DOCUMENT Object at document level.
   * @param CATSLUG Category Slug.
   * @param CATTITLE Category Title.
   * @param SOURCE String as "arm" or "mimer".
   * @param TITLEARRAY Array with Titles to move.
   * @param CHANGED Boolean with the status.
   * @returns BOOLEAN, from CHANGE parameter ( to keep the status )
   * or true ( if the category was changed ).
   * @author Armando Dias [zdiaarm]
   */
  _moveCategory(NEWMENU, DOCUMENT, CATSLUG, CATTITLE, SOURCE, TITLEARRAY, CHANGED) {
    if (CHANGED) return CHANGED;
    if (DOCUMENT.document_server_source !== SOURCE) return CHANGED;
    if (Array.isArray(TITLEARRAY) && !TITLEARRAY.includes(DOCUMENT.name)) return CHANGED;

    let previousCat;
    const document = DOCUMENT;
    document.category_name = CATTITLE;
    document.category_slug = CATSLUG;

    if (document && document.doc_route && document.doc_link) {
      previousCat = document.doc_route[document.doc_route.length - 2];
      document.doc_link = document.doc_link.split(previousCat).join(CATSLUG);
      document.doc_route[document.doc_route.length - 2] = CATSLUG;
    }

    const newMenu = NEWMENU;
    if (newMenu && !newMenu[document.category_slug]) {
      newMenu[document.category_slug] = [];
    }
    if (!newMenu[document.category_slug].includes(document.name)) {
      newMenu[document.category_slug].push(adp.clone(document));
    }

    return true;
  }


  /**
   * [ PRIVATE ] _reOrderAllCategories
   * Reorder the categories inside of each version;
   * Those sequence comes from database;
   * @param CHANGES Object with menu_merged inside.
   * @returns re-ordered categories object.
   * @author Armando Dias [zdiaarm]
   */
  async _reOrderAllCategories(MERGED) {
    const listOptions = new adp.models.Listoption();
    const rawCategories = await listOptions.getItemsForGroup(10);
    const categories = rawCategories
      && rawCategories.docs
      ? await rawCategories.docs.sort(adp.dynamicSort('order'))
      : null;
    if (categories === null) return MERGED;
    const categoriesTemplate = {};
    categories.forEach((CAT) => {
      categoriesTemplate[CAT.slug] = [];
    });
    const merged = MERGED;
    const categoryPreparation = {};
    Object.keys(merged).forEach((CAT) => {
      if (!Array.isArray(merged[CAT])) {
        categoryPreparation[CAT] = merged[CAT];
      }
    });
    Object.keys(categoriesTemplate).forEach((CAT) => {
      if (merged[CAT] && Array.isArray(merged[CAT])) {
        categoryPreparation[CAT] = adp.clone(merged[CAT]);
      }
    });
    return categoryPreparation;
  }


  /**
   * [ PRIVATE ] _reOrderVersions
   * Reorder the versions;
   * @param CHANGES Object with menu_merged inside.
   * @returns nothing. The menu_merged is updated
   * at the end of this function.
   * @author Armando Dias [zdiaarm]
   */
  _reOrderVersions(CHANGES) {
    const versions = Object.keys(CHANGES.menu_merged).map((VALUE) => {
      const obj = { version: VALUE };
      return obj;
    });
    const newSequence = {};
    const orderArray = versions.sort(adp.versionSort('-version'));
    orderArray.forEach((VERSION) => {
      newSequence[VERSION.version] = CHANGES.menu_merged[VERSION.version];
    });
    const changes = CHANGES;
    changes.menu_merged = newSequence;
  }


  async _reSyncElasticSearchAfterMimerDevelopmentChanges(ASSETID, MDEV) {
    const esModels = new adp.modelsElasticSearch.MicroserviceDocumentation();
    const esDocs = await esModels.findDocumentsByAssetId(ASSETID, 0, 1000);
    const toUpdate = [];
    const toDelete = [];

    esDocs.forEach(async (ESDOC) => {
      const esDoc = ESDOC;
      const version = esDoc
        && esDoc._source
        && esDoc._source.version
        ? esDoc._source.version
        : null;
      const category = esDoc
        && esDoc._source
        && esDoc._source.category_slug
        ? esDoc._source.category_slug
        : null;

      if (version === 'development' && (category === 'dpi' || category === 'release-documents')) {
        toDelete.push(esDoc._id);
      }
      if (version === `${MDEV}` && (category === 'dpi' || category === 'release-documents')) {
        const theID = esDoc._id;
        esDoc._source.post_id = esDoc._source.post_id.split(`_${MDEV}_`).join('_development_');
        esDoc._source.version = 'development';
        esDoc._source.document_url = esDoc._source.document_url.split(`/${MDEV}/`).join('/development/');
        toUpdate.push({ update: { _index: `${adp.config.elasticSearchMsDocumentationIndex}`, _id: theID } });
        toUpdate.push({ doc: esDoc._source });
      }
      if (version === `${MDEV}` && category !== 'dpi' && category !== 'release-documents') {
        toDelete.push(esDoc._id);
      }
    });

    const startUpdateTimer = (new Date()).getTime();
    let endUpdateTimer;
    if (toUpdate.length > 0) {
      let updated;
      try {
        updated = await esModels.updateDocument(toUpdate);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch ] ( updateDocument )';
        const errorObject = { assetid: ASSETID, error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_reSyncElasticSearchAfterMimerDevelopmentChanges', this.packName);
        return errorLogObject;
      }
      const updateQuant = updated
        && updated.body
        && updated.body.items
        ? updated.body.items.length
        : null;
      let msg;
      endUpdateTimer = (new Date()).getTime();
      if (updateQuant === 1) {
        msg = `1 document was updated on Elastic Search in ${endUpdateTimer - startUpdateTimer}ms`;
      } else if (updateQuant > 1) {
        msg = `${updateQuant} documents were updated on Elastic Search in ${endUpdateTimer - startUpdateTimer}ms`;
      }
      if (msg) adp.echoLog(msg, null, 200, this.packName);
    }

    const startDeleteTimer = (new Date()).getTime();
    let endDeleteTimer;
    if (toDelete.length > 0) {
      let deleted;
      try {
        deleted = await esModels.removeDocuments(toDelete);
      } catch (ERROR) {
        const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch ] ( removeDocuments )';
        const errorObject = { assetid: ASSETID, error: ERROR };
        const errorLogObject = errorLog(errorCode, errorMessage, errorObject, '_reSyncElasticSearchAfterMimerDevelopmentChanges', this.packName);
        return errorLogObject;
      }
      const delQuant = deleted
        && deleted.body
        && deleted.body.deleted
        ? deleted.body.deleted
        : null;
      let msg;
      endDeleteTimer = (new Date()).getTime();
      if (delQuant === 1) {
        msg = `1 document was deleted from Elastic Search in ${endDeleteTimer - startDeleteTimer}ms`;
      } else if (delQuant > 1) {
        msg = `${delQuant} documents were deleted from Elastic Search in ${endDeleteTimer - startDeleteTimer}ms`;
      }
      if (msg) adp.echoLog(msg, null, 200, this.packName);
    }
    return true;
  }


  async _setAsMimerDevelopmentVersion(ASSETID, MDEV, MIMERVERSIONSTARTER) {
    const startTimer = (new Date()).getTime();
    if (!MDEV) return;
    let thisIsMerged = false;
    const assetDocModel = new adp.models.AssetDocuments();
    const armOriginalDevVersion = await assetDocModel.getSpecificVersion(ASSETID, 'merged', ['development']);
    const mimerDevVersion = await assetDocModel.getSpecificVersion(ASSETID, 'merged', [`${MDEV}`]);

    if (mimerDevVersion && Array.isArray(mimerDevVersion.docs) && mimerDevVersion.docs[0]) {
      const mDVersion = mimerDevVersion.docs[0];
      Object.keys(mDVersion.docs).forEach((KEY) => {
        if (Array.isArray(mDVersion.docs[KEY])) {
          mDVersion.docs[KEY].forEach((DOC) => {
            const doc = DOC;
            doc.doc_route[doc.doc_route.length - 3] = 'development';
            doc.doc_link = doc.doc_link.split(MDEV).join('development');
            doc.mimer_original_version = `${MDEV}`;
          });
        }
      });

      if (armOriginalDevVersion
        && Array.isArray(armOriginalDevVersion.docs)
        && armOriginalDevVersion.docs[0]) {
        const originalDevelopment = armOriginalDevVersion.docs[0];
        const mDocs = mDVersion.docs;
        const aDocs = originalDevelopment.docs;
        const newDocs = {};

        newDocs.versionLabel = 'development';
        if (aDocs && aDocs.isCpiUpdated === true) {
          newDocs.isCpiUpdated = true;
        } else {
          newDocs.isCpiUpdated = false;
        }
        newDocs.isMimerCertificated = this._verifyMimerVersion(MIMERVERSIONSTARTER, 'development');
        if (mDocs && mDocs.dpi) newDocs.dpi = adp.clone(mDocs.dpi);
        if (aDocs && aDocs['inner-source']) newDocs['inner-source'] = adp.clone(aDocs['inner-source']);
        if (mDocs && mDocs['release-documents']) newDocs['release-documents'] = adp.clone(mDocs['release-documents']);
        if (aDocs && aDocs['additional-documents']) newDocs['additional-documents'] = adp.clone(aDocs['additional-documents']);
        mDVersion.docs = newDocs;
        thisIsMerged = true;
      }

      await assetDocModel.hardDeleteThoseVersionsFromDatabase(ASSETID, 'merged', ['development']);
      // eslint-disable-next-line max-len
      mDVersion.docs = this.documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter(mDVersion.docs);
      await assetDocModel.createOrUpdate(
        ASSETID,
        mDVersion.asset_slug,
        'merged',
        'development',
        mDVersion.docs,
      );
      // Commented below code cleanup record here included in "getProduct.js" file
      //   await assetDocModel.hardDeleteThoseVersionsFromDatabase(ASSETID, 'merged', [`${MDEV}`]);
      await this._reSyncElasticSearchAfterMimerDevelopmentChanges(ASSETID, MDEV, mDVersion);
      const endTimer = (new Date()).getTime();
      if (thisIsMerged) {
        adp.echoLog('', null, 200, this.packName);
        adp.echoLog(`ARM [ development ] version merged with Mimer [ ${MDEV} ] version in ${endTimer - startTimer}ms`, null, 200, this.packName);
        adp.echoLog('', null, 200, this.packName);
      } else {
        adp.echoLog('', null, 200, this.packName);
        adp.echoLog(`ARM [ development ] version replaced by Mimer [ ${MDEV} ] version in ${endTimer - startTimer}ms`, null, 200, this.packName);
        adp.echoLog('', null, 200, this.packName);
      }
    }
  }


  /**
   * finshRenderProcess
   * Move the generated content "menu_merged_wip"
   * to the final position "menu_merged".
   * @param MSID String with the Microservice ID.
   * @param {string} MDEV Mimer Development Version.
   * @author Armando Dias [zdiaarm]
   */
  async finshRenderProcess(ASSETID, MDEV) {
    try {
      const startTimer = (new Date()).getTime();
      const adpModel = new adp.models.Adp();
      const mimerStarterVersion = await adpModel.getJustTheMimerVersionStarterFromAsset(ASSETID);
      const assetDocModel = new adp.models.AssetDocuments();
      await this._setAsMimerDevelopmentVersion(ASSETID, MDEV, mimerStarterVersion);

      const toClearRawVersions = [];
      const toClearMimerVersions = [];
      const toClearMergedVersions = [];

      let allRawVersions = await assetDocModel.getMenuVersions(ASSETID, 'raw');
      let allMimerVersions = await assetDocModel.getMenuVersions(ASSETID, 'mimer');
      const allMergedVersions = await assetDocModel.getMenuVersions(ASSETID, 'merged');
      const armFullVersionList = await this._getARMMenuVersions(ASSETID);

      if (!allRawVersions.includes(mimerStarterVersion)) {
        allRawVersions.push(mimerStarterVersion);
      }
      allRawVersions = allRawVersions.map((ITEM) => {
        const obj = { version: `${ITEM}` };
        return obj;
      });
      allRawVersions = allRawVersions.sort(adp.versionSort('-version'));
      allRawVersions.map(ITEM => `${ITEM.version}`);

      if (!allMimerVersions.includes(mimerStarterVersion)) {
        allMimerVersions.push(mimerStarterVersion);
      }
      allMimerVersions = allMimerVersions.map((ITEM) => {
        const obj = { version: `${ITEM}` };
        return obj;
      });
      allMimerVersions = allMimerVersions.sort(adp.versionSort('-version'));
      allMimerVersions.map(ITEM => `${ITEM.version}`);

      let foundRawVersionStarter = false;
      allRawVersions.forEach((MENU) => {
        const { version } = MENU;
        if (foundRawVersionStarter) {
          toClearRawVersions.push(version);
        }
        if (version === mimerStarterVersion) {
          foundRawVersionStarter = true;
        }
      });

      let foundMimerVersionStarter = false;
      allMimerVersions.forEach((MENU) => {
        const { version } = MENU;
        if (foundMimerVersionStarter) {
          toClearMimerVersions.push(version);
        }
        if (version === mimerStarterVersion) {
          foundMimerVersionStarter = true;
        }
      });

      allMergedVersions.forEach((MENU) => {
        const version = MENU;
        const ifVersionShouldBeClearedByMimer = toClearMimerVersions.includes(version);
        const ifVersionShouldBeClearedByARM = !armFullVersionList.includes(version);
        if (ifVersionShouldBeClearedByMimer && ifVersionShouldBeClearedByARM) {
          toClearMergedVersions.push(version);
        }
      });
      const slug = await adpModel.getAssetSlugUsingID(ASSETID);
      const endTimer = (new Date()).getTime();
      adp.echoLog(`Cleaning decisions of [ ${slug} ] taken in ${endTimer - startTimer}ms`, null, 200, this.packName);

      const startRawTimer = (new Date()).getTime();
      const rawMenuDelete = await assetDocModel.hardDeleteThoseVersionsFromDatabase(ASSETID, 'raw', toClearRawVersions);
      if (rawMenuDelete.n > 0) {
        const endRawTimer = (new Date()).getTime();
        adp.echoLog(`${rawMenuDelete.n} versions were deleted from raw menu in ${endRawTimer - startRawTimer}ms`, null, 200, this.packName);
      }

      const startMimerTimer = (new Date()).getTime();
      const mimerMenuDelete = await assetDocModel.hardDeleteThoseVersionsFromDatabase(ASSETID, 'mimer', toClearMimerVersions);
      if (mimerMenuDelete.n > 0) {
        const endMimerTimer = (new Date()).getTime();
        adp.echoLog(`${mimerMenuDelete.n} versions were deleted from mimer menu in ${endMimerTimer - startMimerTimer}ms`, null, 200, this.packName);
      }

      const startMergedTimer = (new Date()).getTime();
      const mergedMenuDelete = await assetDocModel.hardDeleteThoseVersionsFromDatabase(ASSETID, 'merged', toClearMergedVersions);
      if (mergedMenuDelete.n > 0) {
        const endMergedTimer = (new Date()).getTime();
        adp.echoLog(`${mergedMenuDelete.n} versions were deleted from merged menu in ${endMergedTimer - startMergedTimer}ms`, null, 200, this.packName);
      }

      await adpModel.updateLastSyncDate(ASSETID);
      return new Promise(RESOLVE => RESOLVE(true));
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ try/catch ]';
      const errorObject = { assetid: ASSETID, error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'finshRenderProcess', this.packName);
      return new Promise((RESOLVE, REJECT) => REJECT(errorLogObject));
    }
  }


  /**
   * _setDefaultDocument [ PRIVATE ]
   * If there is no default document, this method will choose one.
   * @param {object} DOCVERSION The unique ID of the Product in Mimer Server.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _setDefaultDocument(VERSION, DOCVERSION) {
    let foundDefault = false;
    let foundNotRestricted = false;
    let foundApiMode = false;
    let foundNotRestrictedAndApiMode = false;

    Object.keys(DOCVERSION).forEach((KEY) => {
      if (!Array.isArray(DOCVERSION[KEY])) return;
      const category = DOCVERSION[KEY];
      category.forEach((DOCUMENT) => {
        if (DOCUMENT.default === true) {
          foundDefault = true;
        }
        if (DOCUMENT.restricted === false) foundNotRestricted = true;
        if (DOCUMENT.doc_mode === 'api') foundApiMode = true;
        if (DOCUMENT.restricted === false && DOCUMENT.doc_mode === 'api') foundNotRestrictedAndApiMode = true;
      });
    });

    if (foundDefault) return DOCVERSION;

    let firstOfItsKind = true;
    let changed = -1;

    // [1] First, try to get Service User guide in Not Restricted mode.
    // [2] If service user guide not present or present in Restricted mode,
    //     try to get a document not restricted able to be rendered.
    // [3] If there is none, try to get the first not restricted.
    Object.keys(DOCVERSION).forEach((KEY) => {
      if (!Array.isArray(DOCVERSION[KEY])) return;
      const category = DOCVERSION[KEY];
      category.forEach((DOCUMENT) => {
        if ((DOCUMENT.name === 'Service User Guide' || DOCUMENT.name === 'User Guide')
        && DOCUMENT.restricted === false) {
          const doc = DOCUMENT;
          doc.default = true;
          firstOfItsKind = false;
          adp.echoLog(`The [ ${DOCUMENT.name} ] was selected as the default document of the version [ ${VERSION} ] by the [ RenderMimerArm ] class...`, null, 200, this.packName);
        }
      });
    });

    if ((foundNotRestricted || foundApiMode || foundNotRestrictedAndApiMode) && firstOfItsKind) {
      Object.keys(DOCVERSION).forEach((KEY) => {
        if (!Array.isArray(DOCVERSION[KEY])) return DOCVERSION;
        const category = DOCVERSION[KEY];
        category.forEach((DOCUMENT) => {
          if (!firstOfItsKind) return;
          const doc = DOCUMENT;
          if (firstOfItsKind
            && foundNotRestrictedAndApiMode
            && doc.restricted === false
            && doc.doc_mode === 'api'
          ) {
            doc.default = true;
            firstOfItsKind = false;
            changed = 0;
          }
          if (firstOfItsKind
            && foundNotRestricted
            && doc.restricted === false
          ) {
            doc.default = true;
            firstOfItsKind = false;
            changed = 0;
          }
          if (changed === 0) {
            adp.echoLog(`The [ ${DOCUMENT.name} ] was selected as the default document of the version [ ${VERSION} ] by the [ RenderMimerArm ] class...`, null, 200, this.packName);
            changed = 1;
          }
        });
        return DOCVERSION;
      });
    }

    // Nothing worked. Get the first document!
    if (firstOfItsKind && changed) {
      Object.keys(DOCVERSION).forEach((KEY) => {
        if (!DOCVERSION[KEY] || !DOCVERSION[KEY].versionLabel) return;
        Object.keys(DOCVERSION[KEY]).forEach((CATKEY) => {
          if (!Array.isArray(DOCVERSION[KEY][CATKEY])) return;
          if (!DOCVERSION[KEY][CATKEY][0]) return;
          const firstDocument = DOCVERSION[KEY][CATKEY][0];
          firstDocument.default = true;
          firstOfItsKind = false;
          adp.echoLog(`The [ ${firstDocument.name} ] (The first document) was selected as the default document of the version [ ${VERSION} ] by the [ RenderMimerArm ] class...`, null, 200, this.packName);
        });
      });
    }

    return DOCVERSION;
  }


  /**
   * documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter
   * Sort documents by name if the version is inside of the range
   * based on Mimer Version Starter.
   * @param {object} CATEGORIES The documents object.
   * @return {object} With the expected result.
   * @author Armando Dias [zdiaarm]
   */
  documentsInAlphabeticalOrderIfItIsValidMimerVersionStarter(CATEGORIES) {
    const categories = CATEGORIES;
    if (categories && categories.isMimerCertificated !== true) {
      return categories;
    }
    Object.keys(categories).forEach((KEY) => {
      if (Array.isArray(categories[KEY])) {
        categories[KEY] = categories[KEY].sort(adp.dynamicSort('name'));
      }
    });
    return categories;
  }
}
// ============================================================================================= //
module.exports = RenderMimerArmClass;
// ============================================================================================= //
