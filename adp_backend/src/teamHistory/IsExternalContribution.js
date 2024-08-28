/**
 * [ adp.teamHistory.IsExternalContribution ]
 * Check if the commit is external contribution based on Team History.
 * @author Armando Dias [zdiaarm]
 */

adp.docs.list.push(__filename);

class IsExternalContribution extends adp.models.TeamHistory {
  constructor() {
    super();
    this.package = 'adp.teamHistory.IsExternalContribution';
  }

  /**
   * Check if the commit is external contribution.
   * @param {string} msId microservice Id.
   * @param {string} userSignum User Unique Id ( Signum ).
   * @param {string} commitDate Date of the Commit to compare with the SnapShots.
   * @returns {promise} will resolve with boolean true ( is external )
   * or false ( not external ) as result. Will reject if get an error.
   * @author Armando Dias [ zdiaarm ]
   */
  checkIt(msId, userSignum, commitDate) {
    return new Promise((RESOLVE, REJECT) => {
      super.getByAssetIDSignumDate(msId, commitDate)
        .then((SNAPSHOTS) => {
          const stringifiedSnapshot = JSON.stringify(SNAPSHOTS);
          const userSignumRegex = new RegExp(userSignum, 'gim');
          const found = stringifiedSnapshot.match(userSignumRegex);
          if (found === null) {
            RESOLVE(true);
          } else {
            RESOLVE(false);
          }
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ super.getByAssetIDSignumDate ] at [ checkIt ]';
          const errorObject = {
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.package);
          REJECT();
        });
    });
  }
}

module.exports = IsExternalContribution;
