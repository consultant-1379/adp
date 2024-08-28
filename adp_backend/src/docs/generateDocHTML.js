// ============================================================================================= //
/**
* [ global.adp.docs.generateDocHTML ]
* Usually called by [ global.adp.docs.generateDocs ], the [ global.adp.docs.generateDocHTML ]
* will get a string with the documentation and format this content with HTML code.
* @param {array} COMMENTS Array obeying the format to be formatted visually.
* @return {str} HTML code of all documentation.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MODE, URL, COMMENTS) => {
  let mode = MODE;
  if (MODE === null || MODE === undefined) {
    mode = 'DOC';
  }
  if (mode !== 'REST') {
    mode = 'DOC';
  }
  if (COMMENTS === undefined || COMMENTS === null || COMMENTS === '') {
    return '<b>Nothing to Show!</b>';
  }
  let properties = 0;
  Object.keys(COMMENTS).forEach(() => {
    properties += 1;
  });
  if (properties === 0) {
    return '<b>Nothing to Show!</b>';
  }
  const getEndPointAndVerb = (FILEPATH) => {
    const regExpRemoveBegin = new RegExp(/([\S])+(routes\/endpoints\/)/gim);
    const theEndPointAndVerb = FILEPATH.replace(regExpRemoveBegin, '');
    const regExpTheVerb = new RegExp(/\/([\S]+)/gim);
    const theEndPoint = theEndPointAndVerb.replace(regExpTheVerb, '');
    let theVerb = '';
    const theVerbArray = theEndPointAndVerb.match(regExpTheVerb);
    if (Array.isArray(theVerbArray)) {
      theVerbArray.forEach((verb) => {
        if (theVerb !== '') {
          theVerb = `${theVerb}, `;
        }
        theVerb = `${theVerb}${verb.substr(1, verb.length - 4).toUpperCase()}`;
      });
    }
    return { endPoint: theEndPoint, verb: theVerb };
  };
  let wasDescription = false;
  let waitingForTheFirstAuthor = true;
  const analyseMyFileName = (LINE) => {
    const line = LINE.toString();
    let tableLine = '';
    if (wasDescription === true) {
      tableLine += '</td></tr>';
      wasDescription = false;
    }
    if (mode === 'REST') {
      properties = getEndPointAndVerb(line);
      tableLine += '<tr><td class="firstColumn grayDark">Endpoint:</td>';
      tableLine += `<td class="grayMedium">${URL}<b>${properties.endPoint}</b></td></tr>`;
      tableLine += '<tr><td class="firstColumn grayDark">Verb:</td>';
      tableLine += `<td class="grayMedium"><b>${properties.verb}</b></td></tr>`;
      tableLine += '<tr><td class="firstColumn grayDark">Physical&nbsp;File:</td>';
      tableLine += `<td class="grayMedium">${line}</td></tr>`;
    } else {
      tableLine += '<tr><td class="firstColumn grayDark">File:</td>';
      tableLine += `<td class="grayMedium">${line}</td></tr>`;
    }
    return tableLine;
  };
  const analyseMyLine = (LINE, DEPENDENCIES) => {
    const line = LINE.toString();
    const regExCommandLine = new RegExp(/^(\*\s*\[)[\S\s]*?(\])/gi);
    const regExParameter = new RegExp(/^(\*\s*@)[^\n]*/gi);
    const isCommandLine = line.match(regExCommandLine);
    const isParameter = line.match(regExParameter);
    if (isCommandLine !== null) {
      if (mode !== 'REST') {
        const regExGetOnlyTheText = new RegExp(/([A-Za-z.])+/gi);
        const convertToText = isCommandLine[0].toString();
        let getOnlyTheCommand = convertToText.match(regExGetOnlyTheText).toString();
        const regExLastWord = new RegExp(/([A-Za-z])+$/gi);
        const lastWord = getOnlyTheCommand.match(regExLastWord);
        getOnlyTheCommand = getOnlyTheCommand.replace(lastWord, `<b>${lastWord}</b>`);
        let tableLine = '';
        if (wasDescription === true) {
          tableLine += '</td></tr>';
          wasDescription = false;
        }
        tableLine += '<tr><td class="firstColumn grayDark">Object:</td>';
        tableLine += `<td class="grayMedium">${getOnlyTheCommand}</td></tr>`;
        return tableLine;
      }
    }
    if (isParameter !== null) {
      const regExGetParam = new RegExp(/\*\s*@([\S])*/gi);
      const getParam = isParameter[0].match(regExGetParam);
      let getText = isParameter[0].replace(regExGetParam, '');
      getText = getText.toString().trim();
      const regExGetParamName = new RegExp(/([A-Za-z])+/gi);
      const getParamText = getParam.toString();
      const param = getParamText.match(regExGetParamName);
      let paramText = param.toString();
      paramText = paramText.charAt(0).toUpperCase() + paramText.slice(1);
      const regExGetVariableName = new RegExp(/({[A-Za-z]+})/gi);
      let getVariableName = getText.match(regExGetVariableName);
      if (getVariableName !== null && getVariableName !== undefined) {
        getVariableName = getVariableName.toString();
        getText = getText.replace(getVariableName, '');
        getText = getText.toString();
        getVariableName = getVariableName.replace(/{/, '{&nbsp;<i>');
        getVariableName = getVariableName.replace(/}/, '</i>&nbsp;}');
        if (paramText === 'Param') {
          getText = getText.replace(/\w+/, `<b>${getText.match(/\w+/)}&nbsp=</b>`);
        }
        paramText = `${paramText}&nbsp;${getVariableName}`;
      }
      let tableLine = '';
      if (wasDescription === true) {
        tableLine += '</td></tr>';
        wasDescription = false;
      }
      if (MODE !== 'REST') {
        if (waitingForTheFirstAuthor === true) {
          waitingForTheFirstAuthor = false;
          tableLine += '<tr><td class="firstColumn grayDark">Dependencies:</td>';
          tableLine += `<td class="grayMedium">${DEPENDENCIES}.</td></tr>`;
        }
      }
      tableLine += `<tr><td class="firstColumn grayDark">${paramText}:</td>`;
      tableLine += `<td class="grayMedium">${getText}</td></tr>`;
      return tableLine;
    }
    const lineTrimmed = line.trim();
    if (lineTrimmed !== '/**' && lineTrimmed !== '*/') {
      const regExRemoveFirstSymbol = new RegExp(/(\*)/);
      const convertToText = line.toString();
      const removeFirstSymbol = convertToText.replace(regExRemoveFirstSymbol, '').trim();
      let tableLine = '';
      if (wasDescription === true) {
        tableLine += removeFirstSymbol;
      } else {
        tableLine = '<tr><td class="firstColumn grayDark">&nbsp;</td>';
        tableLine += `<td class="grayLight">${removeFirstSymbol}`;
      }
      wasDescription = true;
      return tableLine;
    }
    if (lineTrimmed === '*/') {
      return '<tr><td colspan="2">&nbsp;</td></tr>';
    }
    return '';
  };

  const formatDependenciesString = (DEPENDENCIESRAWARRAY) => {
    if (DEPENDENCIESRAWARRAY.toString() === 'No Dependencies') {
      return 'No Dependencies';
    }
    let dependenciesFinalResult = '';
    let dependenciesArray = DEPENDENCIESRAWARRAY;
    dependenciesArray = dependenciesArray.sort();
    dependenciesArray.forEach((item) => {
      if (dependenciesFinalResult.length > 0) {
        dependenciesFinalResult = `${dependenciesFinalResult}, `;
      }
      dependenciesFinalResult += `[&nbsp;${item}&nbsp;]`;
    });
    return dependenciesFinalResult;
  };

  const regExIsDoubleBreakline = new RegExp(/\r\n/gim);
  const breakLine = '\r\n';
  let html = '';
  const filenameAsParameter = COMMENTS.filename.trim();
  let textToRealString = '';
  if (COMMENTS.text !== null) {
    textToRealString = COMMENTS.text.toString();
    let textHasToBeArrayOfLines = null;
    if (textToRealString.match(regExIsDoubleBreakline) === null) {
      textHasToBeArrayOfLines = textToRealString.split(/\n/gim);
    } else {
      textHasToBeArrayOfLines = textToRealString.split(/\r\n/gim);
    }
    const dependenciesAsParameter = formatDependenciesString(COMMENTS.dependencies);
    html += breakLine + analyseMyFileName(filenameAsParameter);
    textHasToBeArrayOfLines.forEach((commentLine) => {
      html += breakLine + analyseMyLine(commentLine, dependenciesAsParameter);
    });
  }

  return html;
};
// ============================================================================================= //
