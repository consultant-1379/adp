// ============================================================================================= //
/**
* [ global.adp.frontEndVersionSync ]
* This will block all requests except /login and /logged endpts if Front end API version doesn't
* match the current version, it will return a 426.
* This will return a header variable of API-Deployment-Version with the latest version of the API
* @param {obj} req This is the header request.
* @param {obj} res This is the header response.
* @returns {bool} returns true if the api version is not correct.
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (req, res) => {
  // ------------------------------------------------------------------------------------------- //
  /**
  * Check the version
  * @return {Boolean} Returns true if is ok, false if the version is different.
  * @author Cein-Sven Da Costa [edaccei], Armando Dias [zdiaarm]
  */
  const checkVersion = () => {
    const frontEndAPIVersion = req.get('API-Deployment-Version');
    if (req.path !== '/login' && req.path !== '/logged'
      && frontEndAPIVersion !== undefined && frontEndAPIVersion !== null) {
      if (global.adp.versionConf !== frontEndAPIVersion && frontEndAPIVersion !== '0.0.0.0') {
        return true;
      }
    }
    return false;
  };
  // ------------------------------------------------------------------------------------------- //
  if (global.adp.versionConf !== undefined) {
    res.header('API-Deployment-Version', global.adp.versionConf);
    // if not a GET and the Frontend api version is incorrect reject it
    if (req !== undefined && req !== null) {
      return checkVersion();
    }
    return false;
  }
  const versionPath = './.ver/version.conf';
  if (global.fs.existsSync(versionPath)) {
    const versionFileContent = global.fs.readFileSync(versionPath, 'utf8');
    if (versionFileContent !== undefined) {
      const deploymentVersion = JSON.parse(versionFileContent);
      global.adp.versionConf = deploymentVersion.current;
      if (global.adp.versionConf !== undefined) {
        // update the header
        res.header('API-Deployment-Version', global.adp.versionConf);
        // if not a GET and the Frontend api version is incorrect reject it
        return checkVersion();
      }
    }
  }
  return false;
};
// ============================================================================================= //
