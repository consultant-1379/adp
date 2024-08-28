// ============================================================================================= //
/**
* [ global.adp.document.asciidoctorHeaderVariables ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MODE, HTML, VARIABLES) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.asciidoctorHeaderVariables';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (MODE === 'get') {
    adp.echoLog('Getting ASCIIDoc Variables...', null, 200, packName);
  } else if (MODE === 'apply') {
    adp.echoLog('Applying ASCIIDoc Variables...', null, 200, packName);
  } else {
    adp.echoLog(`ERROR - MODE param should be "get" or "apply" and not "${MODE}".`, null, 400, packName);
    return null;
  }
  if (typeof HTML !== 'string') {
    adp.echoLog('ERROR - HTML param should be a String.', { HTML }, 400, packName);
    return null;
  }
  if (MODE === 'apply') {
    if (!(Array.isArray(VARIABLES))) {
      adp.echoLog('ERROR - When MODE is "get", VARIABLES should be an Array.', { VARIABLES }, 400, packName);
      return HTML;
    }
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // "GET" Mode
  if (MODE === 'get') {
    const regExpHeaderVariable = new RegExp(/^(:)([\S]*?(:))( )?([\S ]+)/gim);
    const variableAndValue = HTML.match(regExpHeaderVariable);
    if (variableAndValue === null) {
      adp.echoLog('There is no ASCIIDoc Variables in this document.', { variableAndValue }, 200, packName);
      return [];
    }
    adp.echoLog(`Found ${variableAndValue.length} ASCIIDoc Variable(s).`, { variableAndValue }, 200, packName);
    return variableAndValue;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // "APPLY" Mode
  let html = HTML;
  if (VARIABLES.length > 0) {
    const regExpGetVariableName = new RegExp(/^(:)([\S]*?(:))/gim);
    VARIABLES.forEach((eachVar) => {
      let variableName = eachVar.match(regExpGetVariableName).toString();
      let variableValue = '';
      if (variableName !== null) {
        variableValue = eachVar.replace(variableName, '').trim();
        variableName = variableName.replace(/^(:)/gim, '{');
        variableName = variableName.replace(/(:)+?/im, '}');
        const regExpVariableName = new RegExp(variableName, 'gim');
        const founded = html.match(regExpVariableName);
        if (Array.isArray(founded)) {
          adp.echoLog(`Found ${founded.length} ASCIIDoc Variable(s) :: "${variableName}"`, null, 200, packName);
          adp.echoLog(`Changing from "${variableName}" to "${variableValue}"`, null, 200, packName);
          html = html.replace(regExpVariableName, variableValue);
        }
      }
    });
  }
  return html;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
