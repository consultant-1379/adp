// ============================================================================================= //
/**
* [ global.adp.document.checkLink ]
* Check if the link is valid.<br/>
* For now, only supports https://gerrit-gamma.gic.ericsson.se/gitweb (ASCIIDoc).<br/>
* Also checks if the link contains the parameters <b>project</b>, <b>blob</b>
* and the path of the <b>file</b>.
* @param {String} LINK A String with the URL of the document.
* @return {Object} Returns an <b>Object</b> with the result.
* In this <b>Object</b> we have:<br/><br/>
* - <b>ok</b> as boolean to indicate <b>success</b> (true) or <b>error</b> (false),<br/>
* - <b>mode</b> as integer to indicate the origin of document ( <b>0</b> for
* <b>https://gerrit-gamma.gic.ericsson.se/gitweb</b>, <b>1</b> for
* <b>https://gerrit-gamma.gic.ericsson.se/plugins/</b> { Not supported yet }, etc. ).<br/>
* - <b>msg</b> as array with friendly string messages.<br/><br/>
* Example of success:
* <PRE>
* {
* &nbsp;&nbsp;ok: true,
* &nbsp;&nbsp;mode: 0,
* &nbsp;&nbsp;msg: [
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ]
* The LINK looks valid to https://gerrit-gamma.gic.ericsson.se/gitweb"
* &nbsp;&nbsp;]
* }
* </PRE>
* Example of error:
* <PRE>
* {
* &nbsp;&nbsp;ok: false,
* &nbsp;&nbsp;mode: 0,
* &nbsp;&nbsp;msg: [
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ]
* LINK ( Remote origin of the document ) cannot be null or undefined..."
* &nbsp;&nbsp;]
* }
* </PRE>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (LINK) => {
  const toReturn = { ok: true, mode: 0, msg: [] };
  const quickURL = adp.config.eridocServer;
  if (typeof LINK === 'string' && LINK.substring(0, quickURL.length) === quickURL) {
    toReturn.ok = true;
    toReturn.mode = 3;
    toReturn.msg.push('EriDoc document detect');
    return toReturn;
  }

  const errorInit = `ERROR ON LINK ( ${LINK} ) - `;
  if (LINK === null || LINK === undefined) {
    const errorText = `${errorInit} cannot be null or undefined...`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
    return toReturn;
  }
  if (Array.isArray(LINK)) {
    const errorText = `${errorInit} cannot be an Array...`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
    return toReturn;
  }
  if (LINK === {} || typeof LINK === 'object') {
    const errorText = `${errorInit} cannot be an Object...`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
    return toReturn;
  }
  if (typeof LINK === 'number') {
    const errorText = `${errorInit} cannot be a Number...`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
    return toReturn;
  }
  if ((LINK.trim()) === '') {
    const errorText = `${errorInit} cannot be an Empty String...`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
    return toReturn;
  }
  const regExpItIsGerritGitWeb = new RegExp(/^([http|https])*:\/\/gerrit-gamma.gic.ericsson.se\/gitweb\?/gim);
  const regExpHasMarkDown = new RegExp(/\.md(?![a-zA-Z0-9])+/gim);
  const isGerritWeb = (LINK.match(regExpItIsGerritGitWeb) !== null)
    && (LINK.match(regExpHasMarkDown) === null);

  const regExpItIsArtifactory = new RegExp(/^([http|https])*:\/\/([\s\S]+)ericsson.se\/artifactory\//gim);
  let isArtifactory = LINK.match(regExpItIsArtifactory) !== null;
  // for mock artifactory
  if (!isArtifactory) {
    const regMockArtifactory = new RegExp(/^.*?(mockartifactory\b)[^$]*$/gim);
    isArtifactory = LINK.match(regMockArtifactory) !== null;
    if (!isArtifactory) {
      const regMockLocalHostArtifactory = new RegExp(/^.*?(localhost\b)[^$]*$/gim);
      isArtifactory = LINK.match(regMockLocalHostArtifactory) !== null;
    }
    if (!isArtifactory) {
      const regMockLocalHostArtifactory = new RegExp(/^.*?(\/armserver\/\b)[^$]*$/gim);
      isArtifactory = LINK.match(regMockLocalHostArtifactory) !== null;
    }
  }
  const regExpIsOurBackend = new RegExp(/(http(s)?:\/\/([\s\S])+?\/api\/document\/)|(https:\/\/localhost:9999\/document\/)/gim);
  const isOurBackend = LINK.match(regExpIsOurBackend) !== null;

  if (!isGerritWeb && !isOurBackend && (!isArtifactory && LINK !== 'EXCEPTION')) {
    const errorText = `${errorInit} has to be a gerrit or artifactory link."`;
    toReturn.ok = false;
    toReturn.msg.push(errorText);
  } else if (isArtifactory || LINK === 'EXCEPTION') {
    const okText = 'The LINK is a valid artifactory link';
    toReturn.msg.push(okText);
    toReturn.mode = 2;
    toReturn.isDownload = false;
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = LINK.match(regExpExtension);
    if (Array.isArray(fileExtensionFinder)) {
      if (fileExtensionFinder[0] !== '.html' && fileExtensionFinder[0] !== '.htm' && fileExtensionFinder[0] !== '.zip') {
        toReturn.isDownload = true;
      }
    }
  } else if (isOurBackend) {
    const okText = 'The LINK is for our Backend';
    toReturn.msg.push(okText);
    toReturn.mode = 2;
  } else {
    const regExpHaveProject = new RegExp(/(p=)+([a-zA-Z/._-])*/im);
    if (!(LINK.match(regExpHaveProject))) {
      const errorText = `${errorInit} for Gerrit have to has a Project Parameter (p=...)`;
      toReturn.ok = false;
      toReturn.msg.push(errorText);
    }
    const regExpHaveBlobRequest = new RegExp(/(a=)+([a-zA-Z/._-])*/im);
    if (!(LINK.match(regExpHaveBlobRequest))) {
      const errorText = `${errorInit} for Gerrit have to has a Blob Parameter (a=...)`;
      toReturn.ok = false;
      toReturn.msg.push(errorText);
    }
    const regExpHaveFile = new RegExp(/(f=)+([a-zA-Z/._-])*/im);
    if (!(LINK.match(regExpHaveFile))) {
      const errorText = `${errorInit} for Gerrit have to has a File Parameter (f=...)`;
      toReturn.ok = false;
      toReturn.msg.push(errorText);
    }
    const okText = 'The LINK looks valid to https://gerrit-gamma.gic.ericsson.se/gitweb';
    toReturn.msg.push(okText);
  }
  return toReturn;
};
// ============================================================================================= //
// ============================================================================================= //
