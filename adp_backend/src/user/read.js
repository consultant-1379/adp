// ============================================================================================= //
/**
* [ global.adp.user.read ]
* Retrieve a User for reading.
* @param {String} ID A simple String with the ID of the User.
* @return {JSON} Returns a JSON Object containing the information of the User.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = ID => new Promise((RESOLVE, REJECT) => {
  global.adp.user.thisUserShouldBeInDatabase(ID)
    .then((USER) => {
      RESOLVE(USER);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
