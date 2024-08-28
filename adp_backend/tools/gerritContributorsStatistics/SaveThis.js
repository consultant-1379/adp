const InnersourceUserHistoryContr = require('../../src/innerSource/InnersourceUserHistory.controller');
// ============================================================================================= //
/**
* [ cs.SaveThis ]
* @author Armando Dias [zdiaarm]
*
* Receive a LIST from [ cs.getAllStats ], prepares a synchronous queue and
* save each instance on database.
*/
// ============================================================================================= //
class SaveThis {
  // ------------------------------------------------------------------------------------------- //
  /**
   * [ constructor ]
   * The constructor should receive the formated LIST
   * object to save or update into database.
   * @param {object} LIST Specific Object List.
   * @returns {void} Returns nothing.
   * LIST Object Template:
   * {
   *   "<< ASSET DATABASE ID >>": {
   *     "slug": "<< asset slug >>",
   *     "<< user signum >>": {
   *       "name": "<< user name >>",
   *       "email": "<< user email >>",
   *       "day": {
   *         "<< date YY-mm-dd >>": { ////// YOU CAN HAVE HOW MANY DAYS YOU NEED
   *           "commits": << number of commits >>,
   *           "insertions": << number of insertions >>,
   *           "deletions": << number of deletions >>,
   *           "commit-id-list": [ ////// ARRAY OF COMMITS OF THIS DAY, FOR THIS USER
   *             {
   *               "id": "<< commit id >>",
   *               "subject": "<< commit description >>"
   *               "commits": 1,
   *               "insertions": << number of insertions on this commit >>,
   *               "deletions": << number of deletions on this commit >>
   *             }
   *           ]
   *       }
   *     }
   * }
   * @author Armando Dias [ zdiaarm ]
   */
  constructor(LIST, APIURL, HEADER) {
    this.packName = 'cs.SaveThis';
    this.apiURL = APIURL;
    this.apiHeader = HEADER;
    this.magicWordRegExp = new RegExp(/@InnerSource/gim);
    this.IsExternal = adp.teamHistory.IsExternalContribution;
    this.peopleFinderOps = adp.peoplefinder.BaseOperationsInstance;
    this.ids = [];
    this.list = LIST;
    Object.keys(this.list).forEach((KEY) => {
      this.ids.push(KEY);
    });
    this.id = `${this.ids[0]}`;
    this.slug = `${this.list[this.id].slug}`;
    this.users = [];
    Object.keys(this.list[this.id]).forEach((USERKEY) => {
      if (USERKEY !== 'slug') {
        this.users.push(USERKEY);
      }
    });
    this.indexUserLevel = -1;
    this.indexDaysLevel = -1;
    this.exitPromise = null;
    this.exitPromiseResolve = null;
    this.exitPromiseReject = null;
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Just check if got one unique Asset per execution.
   * @returns {object} Object where ok is true if everything is ok.
   * @author Armando Dias [ zdiaarm ]
   */
  checkLIST() {
    if (this.ids.length !== 1) {
      const errorStr = 'Parameter "LIST" is invalid...';
      cs.gitLog(errorStr, { list: this.list }, 400, this.packName);
      return { ok: false, error: errorStr };
    }
    return { ok: true };
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Just send a message to external [ cs.logDetails ] but just once per Asset.
   * @param {string} MESSAGE String with the message to log.
   * @returns {void} Returns nothing.
   * @author Armando Dias [ zdiaarm ]
   */
  logThis(MESSAGE) {
    if (cs.canAddToLogBecauseItIsUnique === undefined) {
      cs.canAddToLogBecauseItIsUnique = [];
    }
    if (cs.canAddToLogBecauseItIsUnique.includes(this.id) === false) {
      cs.canAddToLogBecauseItIsUnique.push(this.id);
      cs.logDetails(MESSAGE);
    }
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Do some preparations and check if the data
   * is valid before run [ saveItInstanceLevel ]
   * @returns {string} "same" if everything is ok,
   * "nextInstance" if should ignore this instance,
   * "nextUserOrAsset" if should go to next user or asset.
   * @author Armando Dias [ zdiaarm ]
   */
  saveItInstanceLevelPreparations() {
    const startText = `[ ${this.runningSlug} ][ ${this.runningUserID} ]`;
    this.indexDaysLevel += 1;
    if (this.indexDaysLevel >= this.runningDaysArray.length) {
      if (this.runningStats.count > 0) {
        let adjust = '';
        if (this.runningStats.count > 1) {
          adjust = 's';
        }
        const text = `${startText} ${this.runningStats.count} register${adjust} created in ${this.runningStats.timer}ms.`;
        const gitObject = {
          asset_id: this.runningID,
          asset_slug: this.runningSlug,
          signum: this.runningUserID,
          registers: this.runningStats.count,
          time: `${this.runningStats.timer}ms`,
          totalTime: cs.executionTimer(),
        };
        cs.gitLog(text, gitObject, 200, this.packName);
      }
      if (this.runningStats.updated > 0) {
        let adjust = '';
        if (this.runningStats.updated > 1) {
          adjust = 's';
        }
        const text = `${startText} ${this.runningStats.updated} register${adjust} updated in ${this.runningStats.updatedtimer}ms.`;
        const gitObject = {
          asset_id: this.runningID,
          asset_slug: this.runningSlug,
          signum: this.runningUserID,
          registers: this.runningStats.updated,
          time: `${this.runningStats.updatedtimer}ms`,
          totalTime: cs.executionTimer(),
        };
        cs.gitLog(text, gitObject, 200, this.packName);
      }
      return 'nextUserOrAsset';
    }
    if ((this.runningDaysArray[this.indexDaysLevel] === undefined)
      || this.runningDaysArray[this.indexDaysLevel] === null) {
      return 'nextInstance';
    }
    const saveThisDayObject = this.runningUserDays[this.runningDaysArray[this.indexDaysLevel]];
    const thisDate = this.runningDaysArray[this.indexDaysLevel];
    const dbID = `[ ${this.runningID} ] [ ${this.runningUserID} ] [ ${thisDate} ]`;
    const checkCommits = typeof saveThisDayObject.commits === 'number';
    const checkInsertions = typeof saveThisDayObject.insertions === 'number';
    const checkDeletions = typeof saveThisDayObject.deletions === 'number';
    if (!checkCommits || !checkInsertions || !checkDeletions) {
      const gitObject = {
        dbID,
        asset_id: this.runningID,
        asset_slug: this.runningSlug,
        objectFailToBeSaved: saveThisDayObject,
        time: `${this.runningStats.updatedtimer}ms`,
        totalTime: cs.executionTimer(),
      };
      cs.gitLog('Something wrong: Register ignored', gitObject, 500, this.packName);
      return 'nextInstance';
    }
    return 'same';
  }

  // ------------------------------------------------------------------------------------------- //
  /**
   * Check if the user is internal or external
   * and if the user is functional or not.
   * @returns {promise} Resolve as boolean true if is a valid
   * InnerSource User. Resolve false if not. Reject if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  isValidInnerSourceUser() {
    return new Promise((RESOLVE, REJECT) => {
      const timer = new Date();
      adp.temporaryTimeStampForDebug = (new Date()).getTime();
      this.IsExternal.checkIt(
        this.runningID,
        this.runningUserID,
        this.runningDaysArray[this.indexDaysLevel],
      ).then((ISEXTERNAL) => {
        if (ISEXTERNAL === false) {
          RESOLVE(false);
        } else {
          this.peopleFinderOps.searchPeopleBySignum(this.runningUserID)
            .then((pplFinderResult) => {
              if (cs.functionalUsersLogList === undefined) {
                cs.functionalUsersLogList = [];
              }

              if (Array.isArray(pplFinderResult) && pplFinderResult.length === 0) {
                if (!(cs.functionalUsersLogList.includes(this.runningUserID))) {
                  cs.functionalUsersLogList.push(this.runningUserID);
                }
                RESOLVE(false);
              } else if (!(cs.functionalUsersLogList.includes(this.runningUserID))
                && pplFinderResult.length === 1) {
                cs.functionalUsersLogList.push(this.runningUserID);
                const updateUser = new cs.UpdateUserData();
                updateUser.update(pplFinderResult[0])
                  .then(() => {
                    this.addExternalUserToTheLog(pplFinderResult);
                    adp.echoLog(`Innersource User Snapshot [${this.runningUserID}] complete in ${(new Date() - timer)}ms`, null, 200, this.package);
                    RESOLVE(true);
                  })
                  .catch(() => {
                    this.addExternalUserToTheLog(pplFinderResult);
                    RESOLVE(true);
                  });
              } else {
                this.addExternalUserToTheLog(pplFinderResult);
                RESOLVE(true);
              }
            })
            .catch((ERROR) => {
              const errorText = 'Error in [ this.peopleFinderOps.searchPeopleBySignum ] at [ isValidInnerSourceUser ]';
              const skippedErrorText = 'Got 5XX error in [ this.peopleFinderOps.searchPeopleBySignum ] and Skipping it for this user';
              const errorObj = {
                signum: this.runningUserID,
                error: ERROR,
              };
              const errCode = (ERROR && ERROR.code) ? ERROR.code : '';
              if (errCode.toString().startsWith('5') || errCode === 404) {
                cs.gitLog(skippedErrorText, errorObj, errCode, this.packName);
                RESOLVE(true);
              } else {
                cs.gitLog(errorText, errorObj, errCode, this.packName);
                REJECT(ERROR);
              }
            });
        }
      }).catch((ERROR) => {
        const errorText = 'Error in [ this.IsExternal.checkIt ] at [ isValidInnerSourceUser ]';
        const errorObj = {
          id: this.runningID,
          username: this.runningUserID,
          date: this.runningDaysArray[this.indexDaysLevel],
          error: ERROR,
        };
        cs.gitLog(errorText, errorObj, 500, this.packName);
        REJECT(ERROR);
      });
    });
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Add external user to the execution log of ContributorStatistics script
   * @returns {void} Returns nothing.
   * @author Armando Dias [ zdiaarm ]
   */
  addExternalUserToTheLog(PEOPLEFINDERRESULT) {
    const pplFinderResult = PEOPLEFINDERRESULT;
    if (Array.isArray(pplFinderResult) && pplFinderResult.length > 0) {
      if (cs.externalContributorsLogList === undefined) {
        cs.externalContributorsLogList = [];
      }
      if (!(cs.externalContributorsLogList.includes(this.runningUserID))) {
        cs.externalContributorsLogList.push(this.runningUserID);
      }
      if (cs.externalContributorsLogObjectByAssetAUX === undefined) {
        cs.externalContributorsLogObjectByAssetAUX = {};
      }
      const shortCutLogAux = cs.externalContributorsLogObjectByAssetAUX;
      if (shortCutLogAux[this.runningSlug] === undefined) {
        shortCutLogAux[this.runningSlug] = [];
      }
      if (!(shortCutLogAux[this.runningSlug].includes(this.runningUserID))) {
        shortCutLogAux[this.runningSlug].push(this.runningUserID);
        if (shortCutLogAux[this.runningSlug] === undefined) {
          shortCutLogAux[this.runningSlug] = [];
        }
        const externalUserData = {
          signum: pplFinderResult[0].profileID,
          name: pplFinderResult[0].displayName,
          email: pplFinderResult[0].email,
        };
        if (cs.externalContributorsLogObjectByAsset === undefined) {
          cs.externalContributorsLogObjectByAsset = {};
        }
        if (cs.externalContributorsLogObjectByAsset[this.runningSlug] === undefined) {
          cs.externalContributorsLogObjectByAsset[this.runningSlug] = [];
        }
        cs.externalContributorsLogObjectByAsset[this.runningSlug].push(externalUserData);
      }
    }
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Check if the date for this asset/user already exists in database
   * @returns {promise} resolve with the register if exists ( should update ),
   * resolve with boolean false if not exists ( should create ).
   * Rejects the promise if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  checkIfAlreadyExists() {
    const dmModelGitstatus = new adp.models.Gitstatus(cs.mode);
    const dbID = `[ ${this.runningID} ] [ ${this.runningUserID} ] [ ${this.runningDaysArray[this.indexDaysLevel]} ]`;
    const timer = (new Date()).getTime();
    return new Promise((RESOLVE, REJECT) => {
      try {
        dmModelGitstatus.getById([dbID])
          .then((FINDRESULT) => {
            this.runningStats.checked += 1;
            this.runningStats.checktimer += (new Date()).getTime() - timer;
            const returned = FINDRESULT.execution_stats
              ? FINDRESULT.execution_stats.results_returned : FINDRESULT.resultsReturned;
            if (returned === 0) {
              RESOLVE(false);
            } else {
              RESOLVE(FINDRESULT.docs[0]);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Catch an error in [ getById @ adp.models.Gitstatus ] at [ checkIfAlreadyExists ]';
            const errorObj = {
              id: dbID,
              error: ERROR,
            };
            cs.gitLog(errorText, errorObj, 500, this.packName);
            REJECT(ERROR);
          });
      } catch (ERROR) {
        const errorText = 'Error on try/catch in [ getById @ adp.models.Gitstatus ] at [ checkIfAlreadyExists ]';
        const errorObj = {
          id: dbID,
          error: ERROR,
        };
        cs.gitLog(errorText, errorObj, 500, this.packName);
        REJECT(ERROR);
      }
    });
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Remove the commit from the 'commit-id-list' if
   * there is no mention about the 'magic word'
   * @returns {boolean} Returns true if the object is empty
   * after the check. Returns false if it still has commits
   * inside of the object.
   * @author Armando Dias [ zdiaarm ]
   */
  removeIfThereIsNoTag(OBJECT) {
    return new Promise((RESOLVE) => {
      const object = OBJECT;
      if (!object['commit-id-list'] && !Array.isArray(object['commit-id-list'])) {
        RESOLVE(true);
        return;
      }
      let foundAtLeastOne = false;
      const clearArray = [];
      const promisesArray = [];
      object['commit-id-list'].forEach((COMMIT) => {
        if (COMMIT && COMMIT.subject && COMMIT.subject.match(this.magicWordRegExp)) {
          foundAtLeastOne = true;
          clearArray.push(COMMIT);
          promisesArray.push(new Promise(RES => RES()));
          return;
        }

        let revisionLink = adp.config.contributorsStatistics.gerritApiRevisionDetail;
        revisionLink = revisionLink.replace('|||:COMMITID:|||', COMMIT.id);
        revisionLink = revisionLink.replace('|||:COMMITREVISION:|||', COMMIT.revision);

        promisesArray.push(new Promise((RESOLVETHISREQUESTANYWAY) => {
          global.request.get({ uri: revisionLink, headers: this.apiHeader }, (ERR, RES, DATA) => {
            if (ERR) {
              RESOLVETHISREQUESTANYWAY(true);
              return;
            }
            const body = JSON.parse((`${DATA}`).substring(5));
            if (body && body.message && body.message.match(this.magicWordRegExp)) {
              foundAtLeastOne = true;
              const commit = COMMIT;
              commit.subject = body.message;
              clearArray.push(commit);
              RESOLVETHISREQUESTANYWAY(false);
            } else {
              RESOLVETHISREQUESTANYWAY(true);
            }
          });
        }));
      });

      Promise.all(promisesArray)
        .then(() => {
          if (!foundAtLeastOne) {
            RESOLVE(true);
            return;
          }
          object.commits = 0;
          object.insertions = 0;
          object.deletions = 0;
          clearArray.forEach((COMMIT) => {
            object.commits += 1;
            object.insertions += COMMIT.insertions;
            object.deletions += COMMIT.deletions;
          });
          object['commit-id-list'] = clearArray;
          RESOLVE(false);
        });
    });
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Save the register for a specific Asset, User, Date.
   * @returns {promise} resolve if successful, rejects if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  async saveThisDay() {
    const dbModelGitstatus = new adp.models.Gitstatus(cs.mode);
    const dbID = `[ ${this.runningID} ] [ ${this.runningUserID} ] [ ${this.runningDaysArray[this.indexDaysLevel]} ]`;
    const saveThisDayObject = this.runningUserDays[this.runningDaysArray[this.indexDaysLevel]];
    const thisDate = this.runningDaysArray[this.indexDaysLevel];
    const innerHistContr = new InnersourceUserHistoryContr();
    const objToSave = {
      _id: dbID,
      asset_id: this.runningID,
      asset_slug: this.slug,
      user_id: this.runningUserID,
      user_name: this.runningUserName,
      user_email: this.runningUserEmail,
      date: thisDate,
      commits: saveThisDayObject.commits,
      insertions: saveThisDayObject.insertions,
      deletions: saveThisDayObject.deletions,
      'commit-id-list': saveThisDayObject['commit-id-list'],
    };

    const innerHistSnap = await innerHistContr.getClosestSnapshot(this.runningUserID, thisDate)
      .then(snapshot => snapshot)
      .catch(() => null);
    if (innerHistSnap) {
      objToSave.innersourceUserHistorySnapshot = innerHistSnap;
    }

    if (cs.mode === 'CLASSICMODE') {
      const timer = (new Date()).getTime();
      return new Promise((RESOLVE, REJECT) => {
        dbModelGitstatus.createOne(objToSave)
          .then((RESULT) => {
            if (RESULT.ok === true) {
              this.runningStats.count += 1;
              this.runningStats.timer += (new Date()).getTime() - timer;
            }
            RESOLVE(true);
          })
          .catch((ERROR) => {
            const errorText = 'Error on [ dbModelGitstatus.createOne ] ( Real Insert Command ) at [ saveThisDay ]';
            const errorOBJ = {
              objectToSave: objToSave,
              error: ERROR,
            };
            cs.gitLog(errorText, errorOBJ, 500, this.packName);
            REJECT(ERROR);
          });
      });
    }
    const timer = (new Date()).getTime();
    return new Promise(async (RESOLVE, REJECT) => {
      const removed = await this.removeIfThereIsNoTag(objToSave);
      if (removed) {
        RESOLVE(true);
        return;
      }
      dbModelGitstatus.createOne(objToSave)
        .then((RESULT) => {
          if (RESULT.ok === true) {
            this.runningStats.count += 1;
            this.runningStats.timer += (new Date()).getTime() - timer;
          }
          RESOLVE(true);
        })
        .catch((ERROR) => {
          const errorText = 'Error on [ dbModelGitstatus.createOne ] ( Real Insert Command ) at [ saveThisDay ]';
          const errorOBJ = {
            objectToSave: objToSave,
            error: ERROR,
          };
          cs.gitLog(errorText, errorOBJ, 500, this.packName);
          REJECT(ERROR);
        });
    });
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Check if there is changes on the commit comparing the register from database
   * and the register from the remote server.
   * @param {object} FROMREMOTE information from the remote server.
   * @param {object} FROMDATABASE register got from local database.
   * @returns {object} "changes" with a number, if > 0 should update because
   * changes were found between both parameters. And the "objToUpdate"
   * with the new register to be used to update the local database.
   * @author Armando Dias [ zdiaarm ]
   */
  calculateChanges(FROMREMOTE, FROMDATABASE) {
    const dbID = `[ ${this.runningID} ] [ ${this.runningUserID} ] [ ${this.runningDaysArray[this.indexDaysLevel]} ]`;
    const commitIDsFromRemote = FROMREMOTE;
    const commitIDsFromDatabase = FROMDATABASE;
    const newCommitsObject = commitIDsFromDatabase;
    let changes = 0;
    commitIDsFromRemote.forEach((FREMOTE) => {
      let foundIt = false;
      commitIDsFromDatabase.forEach((FDATABASE) => {
        if (FDATABASE.id === FREMOTE.id) {
          foundIt = true;
        }
      });
      if (!foundIt) {
        const commitOBJ = {
          id: FREMOTE.id,
          commits: FREMOTE.commits,
          insertions: FREMOTE.insertions,
          deletions: FREMOTE.deletions,
        };
        newCommitsObject.push(commitOBJ);
        changes += 1;
      }
    });
    if (changes > 0) {
      let newCommits = 0;
      let newInsertions = 0;
      let newDeletions = 0;
      newCommitsObject.forEach((COMMIT) => {
        newCommits += 1;
        newInsertions += COMMIT.insertions;
        newDeletions += COMMIT.deletions;
      });
      const objToUpdate = {
        _id: dbID,
        asset_id: this.runningID,
        asset_slug: this.slug,
        user_id: this.runningUserID,
        user_name: this.runningUserName,
        user_email: this.runningUserEmail,
        date: this.runningDaysArray[this.indexDaysLevel],
        commits: newCommits,
        insertions: newInsertions,
        deletions: newDeletions,
        'commit-id-list': newCommitsObject,
      };
      return { changes, objToUpdate };
    }
    return { changes, objToUpdate: null };
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Update the register for a specific Asset, User, Date.
   * Case a specific day, of a specific user from a specific asset already exists in database,
   * the commits will be compared and only new commits will be added on the specific date.
   * @returns {promise} resolve if successful, rejects if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  updateThisDay(REGISTER) {
    const dbModelGitstatus = new adp.models.Gitstatus(cs.mode);
    const doc = REGISTER;
    const saveThisDayObject = this.runningUserDays[this.runningDaysArray[this.indexDaysLevel]];
    const { changes, objToUpdate } = this.calculateChanges(
      adp.clone(saveThisDayObject['commit-id-list']),
      adp.clone(doc['commit-id-list']),
    );
    if (changes > 0) {
      const timer = (new Date()).getTime();
      return new Promise((RESOLVE, REJECT) => {
        try {
          if (cs.mode === 'TAGMODE' && this.removeIfThereIsNoTag(objToUpdate)) {
            RESOLVE(true);
            return;
          }
          dbModelGitstatus.update(objToUpdate)
            .then((RESULT) => {
              if (RESULT.ok === true) {
                this.runningStats.updated += 1;
                this.runningStats.updatedtimer += (new Date()).getTime() - timer;
              }
              RESOLVE(true);
            })
            .catch((ERROR) => {
              const errorText = 'Catch an error in [ update @ adp.models.Gitstatus ] at [ updateThisDay ]';
              const errorOBJ = {
                objectToSave: objToUpdate,
                error: ERROR,
              };
              cs.gitLog(errorText, errorOBJ, 500, this.packName);
              REJECT(errorOBJ);
            });
        } catch (ERROR) {
          const errorText = 'Error on try/catch in [ update @ adp.models.Gitstatus ] at [ updateThisDay ]';
          const errorOBJ = {
            objectToSave: objToUpdate,
            error: ERROR,
          };
          cs.gitLog(errorText, errorOBJ, 500, this.packName);
          REJECT(errorOBJ);
        }
      });
    }
    return new Promise(RESOLVE => RESOLVE(false));
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Organize the methods to save/update an instance of a day, in queue.
   * Calls itself to save the next day of the same user on the same asset or
   * calls [ saveItNowUserLevel ] to move to the next asset/user.
   * Case a specific day, of a specific user from a specific asset already exists in database,
   * the commits will be compared and only new commits will be added on the specific date.
   * @returns {promise} Resolves calling another method, until finish the process.
   * Rejects if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  saveItInstanceLevel() {
    return new Promise((RESOLVE, REJECT) => {
      const preparationsResult = this.saveItInstanceLevelPreparations();
      if (preparationsResult === 'nextUserOrAsset') {
        return RESOLVE(this.saveItNowUserLevel());
      }
      if (preparationsResult === 'nextInstance') {
        return RESOLVE(this.saveItInstanceLevel());
      }
      if (cs.mode === 'TAGMODE') {
        return this.tagRules()
          .then(() => {
            this.saveItInstanceLevel();
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      }
      return this.teamMemberRules()
        .then(() => {
          this.saveItInstanceLevel();
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    });
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * teamMemberRules apply the old style InnerSource decisions to save a commit.
   * @returns {Promise} The promise is resolved if successful or reject if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  teamMemberRules() {
    return new Promise((RESOLVE, REJECT) => this.isValidInnerSourceUser()
      .then((ISVALID) => {
        if (ISVALID !== true) {
          return RESOLVE();
        }
        return this.checkIfAlreadyExists(false)
          .then((EXISTS) => {
            if (EXISTS === false) {
              return this.saveThisDay(false)
                .then(() => RESOLVE())
                .catch((ERROR) => {
                  REJECT(ERROR);
                });
            }
            return this.updateThisDay(EXISTS, false)
              .then(() => RESOLVE())
              .catch((ERROR) => {
                REJECT(ERROR);
              });
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      }));
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * tagRules apply the new style InnerSource decisions to save a commit.
   * @returns {Promise} The promise is resolved if successful or reject if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  tagRules() {
    return new Promise((RESOLVE, REJECT) => this.checkIfAlreadyExists(true)
      .then((EXISTS) => {
        if (EXISTS === false) {
          return this.saveThisDay(true)
            .then(() => RESOLVE())
            .catch((ERROR) => {
              REJECT(ERROR);
            });
        }
        return this.updateThisDay(EXISTS, true)
          .then(() => RESOLVE())
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      }));
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
   * Move the [ this.indexUserLevel ] to next user and
   * check if is valid. Then read the object and request
   * to [ saveItInstanceLevel ] to save
   * day-after-day in queue.
   * This function is responsible for keep the
   * "running" variables updated to feed the other methods.
   * @returns {function} Calls another method:
   * [ this.saveItInstanceLevel() ] to save the information.
   * [ this.saveItNowUserLevel() ] calls itself to get the next user.
   * [ this.exitPromiseResolve() ] to finish the process of this Asset.
   * @author Armando Dias [ zdiaarm ]
   */
  saveItNowUserLevel() {
    this.indexUserLevel += 1;
    const localIndexUserLevel = this.indexUserLevel;
    if (localIndexUserLevel >= this.users.length) {
      return this.exitPromiseResolve();
    }
    if (this.users[localIndexUserLevel] === undefined
      || this.users[localIndexUserLevel] === null) {
      return this.saveItNowUserLevel();
    }
    const thisUserID = this.users[localIndexUserLevel];
    const thisUser = this.list[this.id][thisUserID];
    const thisUserName = thisUser.name;
    const thisUserEmail = thisUser.email;
    const thisUserDays = thisUser.day;
    const daysArray = [];
    Object.keys(thisUserDays).forEach((KEY) => {
      daysArray.push(KEY);
    });
    this.indexDaysLevel = -1;
    const initialStats = {
      count: 0,
      updated: 0,
      checked: 0,
      timer: 0,
      updatedtimer: 0,
      checktimer: 0,
    };
    this.runningID = this.id;
    this.runningSlug = this.slug;
    this.runningUserID = thisUserID;
    this.runningUserName = thisUserName;
    this.runningUserEmail = thisUserEmail;
    this.runningUserDays = thisUserDays;
    this.runningDaysArray = daysArray;
    this.runningStats = initialStats;
    try {
      return this.saveItInstanceLevel();
    } catch (error) {
      return this.exitPromiseResolve();
    }
  }
  // ------------------------------------------------------------------------------------------- //


  // ------------------------------------------------------------------------------------------- //
  /**
 * Start all the process, using the LIST inserted into constructor.
 * @returns {promise} Resolves if everything is ok,
 * rejects if get an error.
 * @author Armando Dias [ zdiaarm ]
 */
  go() {
    this.exitPromise = new Promise((RESOLVE, REJECT) => {
      this.exitPromiseResolve = RESOLVE;
      this.exitPromiseReject = REJECT;
    });
    const listIsOk = this.checkLIST();
    if (listIsOk.ok === false) {
      return new Promise((RESOLVE, REJECT) => REJECT(listIsOk.error));
    }
    this.logThis('Assets successful retrieved from Gerrit API');
    this.saveItNowUserLevel()
      .then(() => {
        this.exitPromiseResolve();
      })
      .catch((ERROR) => {
        const gitLogText = 'Error caught in [ saveItNowUserLevel ] in [ go ]';
        const gitObject = {
          error: ERROR,
          list: this.list,
        };
        cs.gitLog(gitLogText, gitObject, 500, this.packName);
        this.exitPromiseReject(ERROR);
      });
    return this.exitPromise;
  }
  // ------------------------------------------------------------------------------------------- //
}
// ============================================================================================= //

module.exports = SaveThis;
