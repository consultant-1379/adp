/**
* [ cs.updateUserData ]
* @author Armando Dias [zdiaarm]
*
* Create/Update a snapshot of the department/organisation of the user.
*/
class UpdateUserData {
  /**
   * [ constructor ]
   * @author Armando Dias [ zdiaarm ]
   */
  constructor() {
    this.packName = 'cs.UpdateUserData';
    this.innerSourceUserModel = new adp.models.InnersourceUserHistory();
  }

  /**
   * Fetches the organisation of a user from the peoplefinder operationalUnit
   * @param {string} operationalUnit the user's peoplefinder operationalUnit
   * @returns {object} obj.valid {boolean} if the organisation was found according to the bdgs rules
   * obj.organisation {string} the found organisation
   * obj.error {object} if an error was found
   * @author Cein
   */
  getDepartment(operationalUnit) {
    const respObj = { valid: false, organisation: '', error: {} };
    if (typeof operationalUnit !== 'string' || operationalUnit.trim() === '') {
      const error = {
        code: 400,
        message: '[ operationalUnit ] attribute is not a string or is empty.',
        data: { operationalUnit, origin: this.packName },
      };
      if (operationalUnit !== null) {
        adp.echoLog(error.message, error.data, error.code, this.packName, true);
      }
      return respObj;
    }

    const sliceAndJoin = (arr, end) => arr.slice(0, end).join(' ');

    // regex reduces consecutive spaces to one space
    const orgArr = operationalUnit.replace(/\s\s+/g, ' ').trim().split(' ');
    const [w1, w2, , w4] = orgArr.map(word => word.toLowerCase());
    if (w1 === 'bdgs') {
      if (w2 === 'sa') {
        if (w4 === 'pdu') {
          respObj.organisation = sliceAndJoin(orgArr, 5);
        } else {
          respObj.organisation = sliceAndJoin(orgArr, 4);
        }
      } else if (w2 === 'rdps') {
        respObj.organisation = sliceAndJoin(orgArr, 3);
      } else {
        respObj.organisation = sliceAndJoin(orgArr, 2);
      }
    } else if (w1 === 'bnew') {
      if (w2 === 'dnew') {
        respObj.organisation = sliceAndJoin(orgArr, 3);
      } else {
        respObj.organisation = sliceAndJoin(orgArr, 2);
      }
    } else {
      respObj.organisation = sliceAndJoin(orgArr, 2);
    }
    respObj.valid = true;
    return respObj;
  }

  /**
   * Creates a new innersource user snapshot
   * @param {string} signum the lowercase version of the users signum
   * @param {string} fullName the full name of the user taken from the peoplefinder displayName key
   * @param {string} email the current email of the user
   * @param {string} organisation the  current organisation of the user according to bdgs rules
   * @param {object} pplFinderUser the users current peoplefinder object from the people endpoint
   * @returns {promise<boolean>} true if successfully created
   * @author Armando Dias [ zdiaarm ] Cein-Sven Da Costa [ edaccei ]
   */
  createUserSnapshot(signum, fullName, email, organisation, pplFinderUser) {
    return new Promise((resolve, reject) => {
      this.innerSourceUserModel.createUserSnapshot(
        signum, fullName, email, organisation, pplFinderUser,
      ).then(() => {
        cs.UpdateUserDataLocalCacheArray.push(signum);
        return resolve(true);
      }).catch((errorOnCreation) => {
        const error = {
          code: 500,
          message: 'Failure to create Innersource User Snapshot',
          data: {
            error: errorOnCreation, signum, fullName, email, organisation, pplFinderUser,
          },
        };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        return reject(error);
      });
    });
  }

  /**
   * Compares the give people finder user to the last innersource history snapshot
   * if a difference in department is detected a new snapshot will be created.
   * @param {object} pplFinderUser User Object from PeopleFinder.
   * @returns {promise<boolean>} returns true if the user snapshot is up to date.
   * @author Armando Dias [ zdiaarm ] Cein-Sven Da Costa [ edaccei ]
   */
  update(pplFinderUser) {
    return new Promise((resolve, reject) => {
      const {
        profileID, operationalUnit, displayName: fullName, email,
      } = pplFinderUser;
      const signum = (`${profileID}`).toLowerCase().trim();

      if (cs.UpdateUserDataLocalCacheArray.includes(signum) === true) {
        return resolve(true);
      }

      // don't reject on error as users can have empty departments
      const { organisation } = this.getDepartment(operationalUnit);

      return this.innerSourceUserModel.getUserSnapshot(signum, 'latest')
        .then((respLastSnapshot) => {
          if (Array.isArray(respLastSnapshot.docs) && respLastSnapshot.docs.length > 0) {
            const userSnapShot = respLastSnapshot.docs[0];
            const currentOrg = (userSnapShot.organisation ? userSnapShot.organisation : '');
            if (organisation !== currentOrg) {
              return this.createUserSnapshot(signum, fullName, email, organisation, pplFinderUser)
                .then(resolve(true)).catch(error => reject(error));
            }
            cs.UpdateUserDataLocalCacheArray.push(signum);
            return resolve(true);
          }
          return this.createUserSnapshot(signum, fullName, email, organisation, pplFinderUser)
            .then(() => resolve(true)).catch(error => reject(error));
        })
        .catch((errorSnapshotFetch) => {
          const error = {
            code: 500,
            message: 'Failure to fetch a Innersource User Snapshot',
            data: {
              error: errorSnapshotFetch, signum, fullName, email, organisation, pplFinderUser,
            },
          };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          return reject(error);
        });
    });
  }
}

module.exports = UpdateUserData;
