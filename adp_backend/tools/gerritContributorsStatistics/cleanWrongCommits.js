// ============================================================================================= //
/**
* [ cs.cleanWrongCommits ]
* @author Armando Dias [zdiaarm]
*
* Clear from database wrong commits ( User is not an external contributor )
*/
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  if (cs && cs.mode === 'TAGMODE') {
    RESOLVE();
    return;
  }
  const packName = 'cs.cleanWrongCommits';
  const IsExternal = adp.teamHistory.IsExternalContribution;
  const dbModelGitstatus = new adp.models.Gitstatus(cs.mode);
  const pplFinderContr = new adp.peoplefinder.BaseOperations();
  const innerSourceUserSnap = new cs.UpdateUserData();
  const deletedCommits = [];
  const innerSourceUserLookup = {};
  const quant = 1;
  let skipIt = 0;
  let checkIt;

  const nextStep = (LASTLENGTH) => {
    if (LASTLENGTH === 0) {
      let gitText = '';
      let gitObject = null;
      if (deletedCommits.length === 0) {
        gitText = 'No wrong commits were detected';
      } else {
        gitText = 'Deleted wrong commits';
        gitObject = { quant: deletedCommits.length, deletedCommitsIDs: deletedCommits };
      }
      cs.gitLog(gitText, gitObject, 200, packName)
        .then(() => {
          RESOLVE();
        })
        .catch((ERROR) => {
          adp.echoLog('Error on [ cs.gitLog ] in [ nextStep ]', { error: ERROR }, 500, packName);
          REJECT();
        });
    } else {
      checkIt();
    }
  };

  checkIt = () => {
    dbModelGitstatus.getCommitsSequentially(quant, skipIt)
      .then((RESULT) => {
        const docLen = RESULT.docs.length;
        if (docLen === 1) {
          const commit = RESULT.docs[0];
          if ((`${commit.date}`).trim() < '2020-01-01') {
            deletedCommits.push({ commit_id: commit._id, fullcommit: commit });
            dbModelGitstatus.deleteOne(commit._id)
              .then(() => {
                nextStep(docLen);
              })
              .catch((ERROR) => {
                const objError = {
                  commit,
                  error: ERROR,
                };
                adp.echoLog('Catch an error on first [ dbModelGitstatus.deleteOne @ adp.models.Gitstatus ]', objError, 500, packName);
                REJECT();
              });
          } else {
            IsExternal.checkIt(commit.asset_id, commit.user_id, commit.date)
              .then((ISEXTERNAL) => {
                if (ISEXTERNAL === false) {
                  deletedCommits.push({ commit_id: commit._id, fullcommit: commit });
                  dbModelGitstatus.deleteOne(commit._id)
                    .then(() => {
                      nextStep(docLen);
                    })
                    .catch((ERROR) => {
                      const objError = {
                        commit,
                        error: ERROR,
                      };
                      adp.echoLog('Catch an error on second [ dbModelGitstatus.deleteOne @ adp.models.Gitstatus ]', objError, 500, packName);
                      REJECT();
                    });
                } else {
                  const signum = commit.user_id.toLowerCase().trim();
                  if (!innerSourceUserLookup[signum]) {
                    pplFinderContr.searchPeopleBySignum(signum).then((respPplFinder) => {
                      if (respPplFinder.length) {
                        innerSourceUserSnap.update(respPplFinder[0]).then(() => {
                          innerSourceUserLookup[signum] = true;
                        });
                      }
                    }).catch((errorFetchPplFinderPerson) => {
                      adp.echoLog('Failure retrieving peoplefinder person.', { error: errorFetchPplFinderPerson, signum, origin: 'checkIt' }, 500, packName);
                    });
                  }
                  skipIt += quant;
                  nextStep(docLen);
                }
              })
              .catch((ERROR) => {
                adp.echoLog('Catch an error on [ IsExternal.checkIt ]', { error: ERROR }, 500, packName);
                REJECT();
              });
          }
        } else {
          nextStep(0);
        }
      })
      .catch((ERROR) => {
        const errorText = 'Catch an error on [ dbModelGitstatus.getCommitsSequentially @ adp.models.Gitstatus ]';
        adp.echoLog(errorText, { error: ERROR }, 500, packName);
        REJECT();
      });
  };

  checkIt();
});
// ============================================================================================= //
