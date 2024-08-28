/**
 * Private Class, should only be used throught the TeamHistoryController
 * [ adp.teamHistory.LatestSnapshotController ]
 * team history snapshot controller
 * @param {boolean} forceLaunchDate if true it will set the innersourceLaunchDate
 * to a day before currentdate
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);
class LatestSnapshotController {
  constructor(msList, forceLaunchDate = false) {
    this.teamHistContr = new adp.teamHistory.TeamHistoryController();
    this.packageName = 'adp.teamHistory.LatestSnapshotController';
    this.msList = msList;
    this.launchDatePassed = forceLaunchDate;
    this.mailerTracker = {};
    this.preLaunchDate = new Date('January 1, 2020 00:00:00');
  }

  /**
   * Fetches the team members data for the given mail list from the people finder
   * @param {array} mailers a microservice's team_mailers array
   * @param {string} assetSlug asset slug is only needed for logging
   * @returns {object} obj.members {array} of members found from the given mailer list
   * obj.errors {array} any errors found along the way.
   * Any 500 errors will reject this method
   * @author Cein
   */
  pdlMembersFetch(mailers, assetSlug) {
    return new Promise((resolve, reject) => {
      const respObj = { members: [], errors: [] };
      if (Array.isArray(mailers)) {
        if (mailers.length) {
          const pfRecPDLmembers = new adp.peoplefinder.RecursivePDLMembers(
            mailers, true,
          );
          pfRecPDLmembers.searchByMailers().then((memberResp) => {
            if (memberResp.members) {
              respObj.members = memberResp.members;
              if (memberResp.errors && memberResp.errors.length) {
                respObj.errors = [{ assetSlug, errors: memberResp.errors }];
                const found500 = memberResp.errors.filter(error => error.code === 500);
                if (found500.length) {
                  const error = { message: 'Error Fetching PeopleFinder contains fatal errors.', code: 500 };
                  error.data = {
                    error: memberResp.errors, assetSlug, mailers, origin: 'pdlMembersFetch',
                  };
                  adp.echoLog(error.message, error.data, error.code, this.packageName);
                  reject(error);
                }
              }
            }
            resolve(respObj);
          }).catch((errorFetchMembers) => {
            const error = { message: 'Error Fetching PeopleFinder Members.', code: 500 };
            error.data = {
              error: errorFetchMembers, assetSlug, mailers, origin: 'pdlMembersFetch',
            };
            respObj.errors.push(error);
            adp.echoLog(error.message, error.data, error.code, this.packageName);
            reject(respObj);
          });
        }
      } else {
        const error = { message: 'Portal microservice mailers are not of type array', code: 500, data: { mailers, assetSlug, origin: 'pdlMembersFetch' } };
        respObj.errors.push(error);
        adp.echoLog(error.message, error.data, error.code, this.packageName);
        reject(respObj);
      }
    });
  }

  /**
   * Private: Gets the available signum if there is one. Creates the standard team object and
   * adds the found team data to that object.
   * @param {object} memberObj found team object
   * @param {boolean} portalMembSet portal member object is set
   * @param {boolean} pfMembSet peoplefinder member object is set
   * @returns {object} obj.signum {string|undefined} the signumn found
   * obj.standardMemberObj {object} the standard team history team object
   * @author Cein
   */
  static _getTheMembersDetails(memberObj, portalMembSet, pfMembSet) {
    let membSignum = null;
    let standardMemberObj = { peopleFinder: {}, portal: {} };

    if (memberObj.signum) {
      membSignum = memberObj.signum;
      standardMemberObj.portal = memberObj;
    } else if (portalMembSet) {
      membSignum = memberObj.portal.signum;
      standardMemberObj = memberObj;
    } else if (pfMembSet) {
      membSignum = memberObj.peopleFinder.mailNickname;
      standardMemberObj = memberObj;
    }

    return { signum: membSignum, standardMemberObj };
  }

  /**
   * compares if two objects are identical.
   * One dimensional objects only.
   * @param {object} obj1 first single dimensional object to compare
   * @param {object} obj2 second single dimensional object to compare
   * @returns {boolean} true if identical
   * @author Cein
   */
  static object1DCompare(obj1, obj2) {
    let areIdentical = false;
    if (typeof obj1 === typeof obj2 && typeof obj1 === 'object') {
      const obj1keys = Object.keys(obj1);
      if (obj1keys.length === Object.keys(obj2).length) {
        areIdentical = obj1keys.every((objKey) => {
          const obj1Val = obj1[objKey];
          const obj2Val = obj2[objKey];
          if (Array.isArray(obj1Val) && Array.isArray(obj2Val)) {
            return (obj1Val.length === obj2Val.length);
          }
          if (typeof obj1Val === 'object' && obj1Val !== null && obj1Val.constructor === Object) {
            return (Object.keys(obj1Val).length === Object.keys(obj2Val).length);
          }

          return obj1Val === obj2Val;
        });
      }
    }
    return areIdentical;
  }

  /**
   * Private Checks for changes in a single team details compared to the last snapshot data.
   * @param {object} snapshotLookupObj team lookup snapshot where the object key.
   * Example { signum: memberData }
   * @param {object} mergedTeam the latest merged team data from peoplefinder and the adp db
   * @returns {boolean} true if the team has changed compared to the last snapshot data.
   * @author Cein
   */
  static _teamsDetailsChanged(snapshotLookupObj, mergedTeam) {
    if (typeof snapshotLookupObj === 'object' && Array.isArray(mergedTeam)) {
      if (Object.keys(snapshotLookupObj).length === mergedTeam.length) {
        const noChangeDetected = mergedTeam.every((mergedTeamObj) => {
          const portobj = mergedTeamObj.portal;
          const pplFindobj = mergedTeamObj.peopleFinder;
          const portalSignum = (portobj && portobj.signum ? portobj.signum.toLowerCase() : null);
          const haspplFindSig = pplFindobj && pplFindobj.mailNickname;
          const pplFSig = (haspplFindSig ? pplFindobj.mailNickname.toLowerCase() : null);
          let snapshotObj = null;

          if (portalSignum && snapshotLookupObj[portalSignum]) {
            snapshotObj = snapshotLookupObj[portalSignum];
          } else if (pplFSig && snapshotLookupObj[pplFSig]) {
            snapshotObj = snapshotLookupObj[pplFSig];
          }

          if (!snapshotObj) {
            return false;
          }
          const { portal: snapPort, peopleFinder: snapPplFin } = snapshotObj;

          if (portobj && snapPort) {
            if (typeof pplFindobj !== typeof snapPplFin) {
              return false;
            }
            if (!pplFindobj) {
              return (this.object1DCompare(portobj, snapPort));
            }
            return (this.object1DCompare(portobj, snapPort)
            && this.object1DCompare(pplFindobj, snapPplFin));
          }

          if (pplFindobj && snapPplFin) {
            if (typeof portobj !== typeof snapPort) {
              return false;
            }
            return (this.object1DCompare(pplFindobj, snapPplFin));
          }

          return false;
        });

        return !noChangeDetected;
      }
    }
    return true;
  }

  /**
   * Merges the given microservice team from the adp db and the mailers PeopleFinder member results.
   * Removing duplicates and merging data objects.
   * This method also compares this merged team with the previous team history snapshot for
   * differences.
   * @param {array} portalTeam the team list from the microservice object in db adp
   * @param {array} mailerTeam the list of members from the peoplefinder mailer retrieval
   * @param {object|null} [lastSnapshot=null] the last snapshot from the team history db for
   * this service. Null if there is no last snapshot
   * @returns {object} obj.mergedTeam {array} list of unique members after merge
   * obj.requiresSnapshot {boolean} true if there needs to be a new snapshot due to changes.
   * obj.errors {array} list of errors that where encountered along the way.
   * @author Cein
   */
  mergeCompareMembers(portalTeam, mailerTeam, lastSnapshot = null) {
    const respObj = { mergedTeam: [], requiresSnapshot: false, errors: [] };

    const portalMembers = (Array.isArray(portalTeam) ? portalTeam : []);
    const mailerMembers = (Array.isArray(mailerTeam) ? mailerTeam : []);
    const snapShotTracker = this._buildSnapshotMemberTracker(lastSnapshot);
    const snapShotLookup = { ...snapShotTracker };
    const memberTracker = {};
    const mergedMembersToProcess = [...portalMembers, ...mailerMembers];

    mergedMembersToProcess.forEach((memberObj) => {
      const mergedIndex = respObj.mergedTeam.length;
      const portalMembSet = (memberObj.portal && memberObj.portal.signum);
      const pfMembSet = (memberObj.peopleFinder && memberObj.peopleFinder.mailNickname);
      const {
        signum, standardMemberObj,
      } = LatestSnapshotController._getTheMembersDetails(memberObj, portalMembSet, pfMembSet);

      if (signum && typeof signum === 'string') {
        const lowerSignum = signum.toLowerCase();
        if (!memberTracker[lowerSignum]) {
          respObj.mergedTeam.push(standardMemberObj);
          memberTracker[lowerSignum] = { ...standardMemberObj };
          memberTracker[lowerSignum].mergedIndex = mergedIndex;

          if (snapShotTracker[lowerSignum]) {
            delete snapShotTracker[lowerSignum];
          } else {
            respObj.requiresSnapshot = true;
          }
        } else {
          // done in case an existing member is missing either portal or peoplefinder data
          const mergedMemberObj = respObj.mergedTeam[memberTracker[lowerSignum].mergedIndex];
          if (!Object.keys(memberTracker[lowerSignum].portal).length && portalMembSet) {
            mergedMemberObj.portal = standardMemberObj.portal;
          }
          if (!Object.keys(memberTracker[lowerSignum].peopleFinder).length && pfMembSet) {
            mergedMemberObj.peopleFinder = standardMemberObj.peopleFinder;
          }
        }
      } else {
        const error = { message: 'Team object cannot be merged due to the team object structure.', code: 500 };
        error.data = {
          memberObj, signum, portalTeam, mailerTeam, lastSnapshot, origin: 'mergeComparePortalAndMailerMembers',
        };
        respObj.errors.push(error);
        adp.echoLog(error.message, error.data, error.code, this.packageName);
      }
    });
    if (!respObj.requiresSnapshot && Object.keys(snapShotTracker).length) {
      respObj.requiresSnapshot = true;
    } else if (!respObj.requiresSnapshot && Object.keys(snapShotTracker).length === 0) {
      respObj.requiresSnapshot = LatestSnapshotController._teamsDetailsChanged(
        snapShotLookup, respObj.mergedTeam,
      );
    }
    return respObj;
  }

  /**
   * Private: Builds a quick look up object by signum from the snapshotMembers
   * @param {object|null} [lastSnapshot=null] list of members of a snapshot
   * Null if there is no last snapshot
   * @returns {object} obj[signum] {object} the snapshot members object
   * @author Cein
   */
  _buildSnapshotMemberTracker(lastSnapshot = null) {
    const memberTracker = {};
    if (lastSnapshot && lastSnapshot.team) {
      const snapShotMembers = lastSnapshot.team;
      if (Array.isArray(snapShotMembers) && snapShotMembers.length) {
        snapShotMembers.forEach((memberObj) => {
          if (memberObj.portal && memberObj.portal.signum && typeof memberObj.portal.signum === 'string') {
            memberTracker[memberObj.portal.signum.toLowerCase()] = memberObj;
          } else if (memberObj.peopleFinder && memberObj.peopleFinder.mailNickname && typeof memberObj.peopleFinder.mailNickname === 'string') {
            memberTracker[memberObj.peopleFinder.mailNickname.toLowerCase()] = memberObj;
          } else {
            const error = { message: 'The team history snapshot does not contain a signum or a mailNickname.', code: 500, data: { memberObj, origin: '_buildSnapshotMemberTracker' } };
            adp.echoLog(error.message, error.data, error.code, this.packageName);
          }
        });
      }
    }

    return memberTracker;
  }


  /**
   * Private: manages the launchdate rules before the snapshot gets created or updated
   * @param {*} msId the related microservice id
   * @param {*} mergedTeamList the updated team array
   * @param {object|null} [lastSnapshot=null] the lastSnapshot object only needed for
   * updating purposes
   * @returns {object} an object structured for snapshot creating or updating.
   * @author Cein
   */
  _newTeamSnapshotObj(msId, mergedTeamList, lastSnapshot = null) {
    if (lastSnapshot && lastSnapshot._id && !this.launchDatePassed) {
      const respObj = { ...lastSnapshot };
      respObj.team = mergedTeamList;
      respObj.date_updated = new Date();
      respObj.date_created = this.preLaunchDate;
      return respObj;
    }
    return {
      asset_id: msId,
      team: mergedTeamList,
      date_created: (this.launchDatePassed ? new Date() : this.preLaunchDate),
    };
  }

  /**
   * Fetches a list of serves that were bulk created/updated
   * @param {array} snapshotIdsToFetch array of snapshot ids
   * @returns {array} list of retrieved snapshots
   * @author Cein
   */
  _fetchAfterBulkOperations(snapshotIdsList) {
    return new Promise((resolve, reject) => {
      const timer = (new Date()).getTime();
      this.teamHistContr.getSnapshotsById(snapshotIdsList).then((respSnapshots) => {
        adp.echoLog(`Team history get snapshot list by id in ${(new Date()).getTime() - timer}ms`, null, 200, this.packageName);
        if (respSnapshots.docs && respSnapshots.docs.length) {
          resolve(respSnapshots.docs);
        } else {
          const error = { message: 'Snapshot fetch by id did not return an array or is empty.', code: 500 };
          error.data = { respSnapshots, snapshotIdsList, origin: '_fetchBulkProcessedSnapshotList' };
          reject(error);
        }
      }).catch((errorReadSnapshotsById) => {
        const error = { message: 'Bulk snapshot create failure', code: 500 };
        error.data = { error: errorReadSnapshotsById, snapshotIdsList, origin: '_fetchBulkProcessedSnapshotList' };
        reject(error);
      });
    });
  }

  /**
   * private: bulk snapshot operations, create & update of updated teams snapshots.
   * Then reads the newly created/updated snapshots and merges them with the finalSnapshots list.
   * @param {array} finalSnapshots list of last snapshots that do not need to be checked
   * @param {array} bulkOpSnapshots list of snapshot objects ready for creation or updating
   * depending on the given snapshot object form
   * @returns {array} list of final snapshots for the given teams
   * @author Cein
   */
  _bulkOperations(finalSnapshots, bulkOpSnapshots) {
    return new Promise((resolve, reject) => {
      if (bulkOpSnapshots.length) {
        this.teamHistContr.bulkSnapshotUpdateCreate(bulkOpSnapshots).then((updateCreateResp) => {
          // fetch all snapshots
          const snapshotIdsToFetch = [];
          const latestSnapshots = finalSnapshots;
          updateCreateResp.forEach((snapshot) => {
            if (snapshot.team) {
              latestSnapshots.push(snapshot);
            } else if (snapshot.id) {
              snapshotIdsToFetch.push((snapshot.id));
            } else {
              const error = { message: 'Bulk snapshot create/update did not return a snapshot id', error: 500 };
              error.data = {
                updateCreateResp, snapshotIdsToFetch, snapshot, finalSnapshots, bulkOpSnapshots, origin: '_bulkOperations',
              };
            }
          });
          if (snapshotIdsToFetch.length) {
            this._fetchAfterBulkOperations(snapshotIdsToFetch).then((newDBSnapshots) => {
              latestSnapshots.push(...newDBSnapshots);
              resolve(latestSnapshots);
            }).catch(error => reject(error));
          } else {
            resolve(latestSnapshots);
          }
        }).catch(error => reject(error));
      } else {
        resolve(finalSnapshots);
      }
    });
  }

  /**
   * Private: Checks for team changes in the portal user object and the team mailers
   * for a given microservices object.
   * @param {obj} msObj the microservice full object.
   * @param {object|null} [lastSnapshot=null] the last team snapshot
   * @returns {object} obj.newTeamSnapshotObj {object|null} the new team snapshot object
   * ready for update or creation, null if team has not changed
   * obj.errors {array} list of errors that might have occurred in this process
   * @author Cein
   */
  _checkTeamForUpdates(msObj, lastSnapshot = null) {
    return new Promise(async (resolve, reject) => {
      const respObj = { newTeamSnapshotObj: null, errors: [] };
      if (msObj._id) {
        let mailerMembers = [];
        const portalTeam = (msObj.team ? msObj.team : []);
        let peopleFinderFatalErr = null;
        if (msObj.team_mailers) {
          const assetSlug = msObj.slug;
          await this.pdlMembersFetch(msObj.team_mailers, assetSlug).then((memberResp) => {
            mailerMembers = memberResp.members;
            respObj.errors.push(...memberResp.errors);
          }).catch((error) => {
            respObj.errors.push(error);
            peopleFinderFatalErr = error;
          });
        }

        if (peopleFinderFatalErr === null) {
          const mergeCompObj = this.mergeCompareMembers(portalTeam, mailerMembers, lastSnapshot);
          respObj.errors.push(...mergeCompObj.errors);

          if (mergeCompObj.requiresSnapshot) {
            respObj.newTeamSnapshotObj = this._newTeamSnapshotObj(
              msObj._id, mergeCompObj.mergedTeam, lastSnapshot,
            );
          }
          resolve(respObj);
        } else {
          reject(peopleFinderFatalErr);
        }
      } else {
        const error = { message: 'Microservice object does not contain an _id.', code: 400 };
        error.data = { msObj, origin: 'checkTeamForUpdates' };
        respObj.errors.push(error);
        adp.echoLog(error.message, error.data, error.code, this.packageName);
        resolve(respObj);
      }
    });
  }

  /**
   * Checks all given microservices teams changes, creates snapshot objects ready for
   * creation or updating, list snapshots that have not changed and lists any errors
   * that may have occured along the way.
   * @param {array} msArr list of fully formed microservice objects.
   * @param {array} lastSnapshotList list of the very last snapshots that were taken
   * for the list of services given.
   * @returns {object} obj.finalSnapshots {array} list of the latest snapshots that
   * doen't have team changes.
   * obj.bulkOpSnapshots {object} list of fully formed snapshot objects that need to
   * be updated/created
   * obj.errors {object} list of errors that had occurred related processes.
   * @author Cein
   */
  async _msListTeamsUpdates(msArr, lastSnapshotList) {
    const respObj = { finalSnapshots: [], bulkOpSnapshots: [], errors: [] };
    for (let msIndex = 0; msIndex < msArr.length; msIndex += 1) {
      const msId = msArr[msIndex]._id;
      const lastSnapshot = lastSnapshotList.find(
        snapshotObj => snapshotObj.asset_id === msId,
      ) || null;

      // eslint-disable-next-line no-await-in-loop
      await this._checkTeamForUpdates(msArr[msIndex], lastSnapshot).then((teamCheckObj) => {
        if (teamCheckObj.newTeamSnapshotObj) {
          respObj.bulkOpSnapshots.push(teamCheckObj.newTeamSnapshotObj);
        } else {
          respObj.finalSnapshots.push(lastSnapshot);
        }
        if (teamCheckObj.errors && teamCheckObj.errors.length) {
          respObj.errors.push(...teamCheckObj.errors);
        }
      }).catch((errorCheckingForUpdates) => {
        const error = { message: `Failure to check for team updates for asset id [${msId}]`, code: 500 };
        error.data = {
          error: errorCheckingForUpdates, ms: msArr[msIndex], lastSnapshot, origin: 'fetchLatestSnapshots',
        };
        respObj.errors.push(error);
      });
    }

    return respObj;
  }

  /**
   * Entry point: that will check the given list of microservice objects for team history changes
   * within the adp portal team db object and the team mailer members
   * @returns {object} obj.latestSnapshots {array} the checked and update latest team snapshots
   * obj.errors {array} list of errors that have occurred along the way
   * @author Cein
   */
  fetchLatestSnapshots() {
    return new Promise((resolve, reject) => {
      const msArr = this.msList;
      if (Array.isArray(msArr)) {
        this.teamHistContr.fetchLastSnapshotByMsId(this.msList).then(async (lastSnapshotsResp) => {
          const { lastSnapshotList } = lastSnapshotsResp;

          if (Array.isArray(lastSnapshotList)) {
            this._msListTeamsUpdates(msArr, lastSnapshotList).then((updatesResp) => {
              const { finalSnapshots, bulkOpSnapshots, errors } = updatesResp;
              if (bulkOpSnapshots.length) {
                this._bulkOperations(finalSnapshots, bulkOpSnapshots)
                  .then((finalSnapshotList) => {
                    resolve({ latestSnapshots: finalSnapshotList, errors });
                  }).catch((error) => {
                    adp.echoLog(error.message, error.data, error.code, this.packageName);
                    reject(error);
                  });
              } else {
                resolve({ latestSnapshots: finalSnapshots, errors });
              }
            }).catch((error) => {
              reject(error);
            });
          } else {
            const error = { message: 'Team snapshots response incorrect', code: 500, data: { lastSnapshotList, msArr, origin: 'fetchLatestSnapshotsMsList' } };
            adp.echoLog(error.message, error.data, error.code, this.packageName);
            reject(error);
          }
        }).catch((errorFetchingSnapshots) => {
          const error = { message: 'Failure to fetch team snapshots', code: 500, data: { error: errorFetchingSnapshots, msArr, origin: 'fetchLatestSnapshotsMsList' } };
          adp.echoLog(error.message, error.data, error.code, this.packageName);
          reject(error);
        });
      } else {
        const error = { message: 'The given msList is not of type array.', code: 400, data: { msArr, origin: 'fetchLatestSnapshots' } };
        adp.echoLog(error.message, error.data, error.code, this.packageName);
        reject(error);
      }
    });
  }
}

module.exports = LatestSnapshotController;
