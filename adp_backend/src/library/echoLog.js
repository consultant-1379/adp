/* eslint-disable no-console */
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
/*
  Server Status Code List
  1xx: Informational Response
  2xx: Success
  3xx: Redirection
  4xx: Client Errors
  5xx: Server Errors
*/
// ============================================================================================= //
const regExpHighLight = new RegExp(/\[([\S\s]+?)\]/gim);
const regExpNumberHL = new RegExp(/\[\+[(0-9)]+?\]/gim);
const regExpSingleQuotes = new RegExp(/'[\s\S]+?'/gim);
const regExpDoubleQuotes = new RegExp(/"[\s\S]+?"/gim);
const regExpMilliSeconds = new RegExp(/( )([0-9]+?)ms/gim);
const chalk = require('chalk');

/**
 * This function is used to validate the parameters of echoLog function
* @param {str} TXT String with a message to display/save.
* @param {obj} OBJ JSON Object to display/save.
* @param {number} LEVEL Number/Code following the table below.
* @param {string} PACKNAME Name of origin from the message.
* @param {null} DATABASE Any value different of null will save this on adpLog.
* @returns true/false depending on the validity
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 */
function validateParameters(TXT, OBJ, LEVEL, PACKNAME, DATABASE) {
  const checkIt = [];
  if (TXT && typeof TXT !== 'string') {
    checkIt.push(`${`- TXT should be a string. Got ${typeof TXT} ( ${TXT} ).`}`);
  }
  if (LEVEL && typeof LEVEL !== 'number') {
    checkIt.push(`${`- LEVEL should be a number or null. Got ${typeof LEVEL} ( ${LEVEL} ).`}`);
  }
  if (PACKNAME && typeof PACKNAME !== 'string') {
    checkIt.push(`${`- PACKNAME should be a string or null. Got ${typeof PACKNAME} ( ${PACKNAME} ).`}`);
  }
  if (DATABASE && typeof DATABASE !== 'boolean') {
    checkIt.push(`${`- DATABASE should be a boolean or null. Got ${typeof DATABASE} ( ${DATABASE} ).`}`);
  }
  if (checkIt.length) {
    console.log(' ');
    if (chalk) {
      console.log(`${chalk.redBright.bold('[ adp.echoLog ] ERRORS:')}`);
    } else {
      console.log('[ adp.echoLog ] ERRORS:');
    }
    checkIt.forEach((ERROR) => {
      if (chalk) {
        console.log(chalk.red(ERROR));
      } else {
        console.log(ERROR);
      }
    });
    if (chalk) {
      console.log(`${chalk.redBright.bold('adp.echoLog')}("${chalk.red(TXT)}", ${chalk.red(OBJ)}, ${chalk.red(LEVEL)}, "${chalk.red(PACKNAME)}", ${chalk.red(DATABASE)});`);
    } else {
      console.log(`adp.echoLog ("${TXT}", ${OBJ}, ${LEVEL}, "${PACKNAME}", ${DATABASE});`);
    }
    console.log(' ');
    return false;
  }
  return true;
}

/**
 * This function is used to the color in case of color mode depending on status code
 * @param {number} LEVEL Number/Code following the table below
 * @return color name
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 */
function getColor(LEVEL) {
  let color = 'blue';
  if (LEVEL !== null) {
    if (LEVEL > 0 && LEVEL < 300) {
      // 1xx: Informational Response
      // 2xx: Success
      color = 'blueBright';
    } else if (LEVEL >= 300 && LEVEL < 400) {
      // 3xx: Redirection
      color = 'magenta';
    } else if (LEVEL >= 400 && LEVEL < 500) {
      // 4xx: Client Errors
      color = 'yellow';
    } else {
      // 5xx: Server Errors
      color = 'red';
    }
  }
  return color;
}

/**
 * This function is used to get the appropriate timestamp
 * @param {string} color to print the log
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns timeStamp
 */
function getTimeStamp(color = null) {
  const ts = global.adp.timeStamp(true);
  if (color) {
    return `${chalk[color]('|')} ${chalk[color](ts)} ${chalk[color]('|')}`;
  }
  return `| ${ts} |`;
}

/**
 * This function is used to get the package name in pretty format
 * @param {string} PACKNAME Name of origin from the message.
 * @param {string} color to print the log
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns packageName
 */
function getPackageName(PACKNAME, color = null) {
  if (PACKNAME === null || PACKNAME === undefined) {
    return '';
  }
  const smallerPackName = `${PACKNAME}`.replace('global.adp.', 'adp.');
  if (color) {
    return ` ${chalk[color]('[')} ${chalk[color].bold(smallerPackName)} ${chalk[color](']')} -`;
  }
  return ` [ ${smallerPackName} ]`;
}

/**
 * This function is used to handle the square brackets in the log text
 * @param {string} txt log text to be shown
 * @param {string} color to print the log
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns processed text
 */
function handleSquareBrackets(txt, color) {
  let txtResp = txt;
  if (txtResp.indexOf('[') >= 0 && txtResp.indexOf(']') >= 0) {
    const highLights = txtResp.match(regExpHighLight);
    if (Array.isArray(highLights)) {
      const grayA = 150;
      const grayB = 170;
      highLights.forEach((ITEM) => {
        let newItem = '';
        if (Array.isArray(ITEM.match(regExpNumberHL))) {
          newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA).bold('[')}`;
          newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA).bold(ITEM.substr(1, (ITEM.length - 2)))}`;
          newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA).bold(']')}`;
        } else {
          newItem = `${newItem}${color ? chalk[`${color}`].bold('[') : '['}`;
          newItem = `${newItem}${chalk.rgb(grayB, grayB, grayB)(ITEM.substr(1, (ITEM.length - 2)))}`;
          newItem = `${newItem}${color ? chalk[`${color}`].bold(']') : ']'}`;
        }
        txtResp = txtResp.replace(ITEM, newItem);
      });
    }
  }
  return txtResp;
}

/**
 * This function is used to handle the milliseconds part in the log text
 * @param {string} txt processed log text
 * @param {string} TXT original text to be shown
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns processed text
 */
function handleMilliseconds(txt, TXT) {
  let txtResp = txt;
  let speed;
  if (txtResp.indexOf('ms') >= 0) {
    const milliSeconds = TXT.match(regExpMilliSeconds);
    if (Array.isArray(milliSeconds)) {
      milliSeconds.forEach((ITEM) => {
        const justNumber = ITEM.replace('ms', '');
        let justString = TXT.replace(ITEM, 'XXXms');
        const leftOver = justString.match(regExpMilliSeconds);
        if (Array.isArray(leftOver)) {
          leftOver.forEach((SUBITEM) => {
            justString = justString.replace(SUBITEM, 'YYYms');
          });
        }
        const speedObject = {
          milliSeconds: parseInt(justNumber, 10),
          message: justString,
          datetime: new Date(),
        };
        if (speed === undefined) {
          speed = [];
        }
        speed.push(speedObject);
        const newItem = `${chalk.green.bold(`${ITEM}`.trim())}`;
        txtResp = txtResp.replace(ITEM, ` ${newItem}`);
      });
    }
  }
  return txtResp;
}

/**
 * This function is used to handle the single quotes part in the log text
 * @param {string} txt processed log text
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns processed text
 */
function handleSingleQuotes(txt) {
  let txtResp = txt;
  if (txt.indexOf('\'') >= 0) {
    const singleQuotes = txt.match(regExpSingleQuotes);
    const grayA = 175;
    if (Array.isArray(singleQuotes)) {
      singleQuotes.forEach((ITEM) => {
        let newItem = '';
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)('\'')}`;
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)(ITEM.substr(1, (ITEM.length - 2)))}`;
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)('\'')}`;
        txtResp = txt.replace(ITEM, newItem);
      });
    }
  }
  return txtResp;
}

/**
 * This function is used to handle the double quotes part in the log text
 * @param {string} txt processed log text
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns processed text
 */
function handleDoubleQuotes(txt) {
  let txtResp = txt;
  if (txt.indexOf('"') >= 0) {
    const doubleQuotes = txt.match(regExpDoubleQuotes);
    const grayA = 175;
    if (Array.isArray(doubleQuotes)) {
      doubleQuotes.forEach((ITEM) => {
        let newItem = '';
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)('"')}`;
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)(ITEM.substr(1, (ITEM.length - 2)))}`;
        newItem = `${newItem}${chalk.rgb(grayA, grayA, grayA)('"')}`;
        txtResp = txt.replace(ITEM, newItem);
      });
    }
  }
  return txtResp;
}

/**
 * This function is used to get pretty text for the log
 * @param {str} TXT String with a message to display/save.
 * @param {string} color to print the log
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 */
function getText(TXT, color = null) {
  let txt = TXT;
  txt = handleSquareBrackets(txt, color);
  txt = handleMilliseconds(txt, TXT);
  txt = handleSingleQuotes(txt);
  txt = handleDoubleQuotes(txt);
  return txt;
}

/**
 * This function is used to get the divider line
 * @param {number} LEVEL Number/Code following the table below
 * @param {boolean} USECOLOR True/False if have to use color
 * @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
 * @returns lineText
 */
function getLine(LEVEL, USECOLOR) {
  const theLine = `|${('=').repeat(26)}|${('=').repeat(72)}`;
  if (USECOLOR === true) {
    return `${chalk[`${getColor(LEVEL)}`](theLine)}`;
  }
  return theLine;
}

/**
* This function is used to decide and save errors in log db
* @param {str} TXT String with a message to display/save.
* @param {obj} OBJ JSON Object to display/save.
* @param {number} LEVEL Number/Code following the table below.
* @param {string} PACKNAME Name of origin from the message.
* @param {null} DATABASE Any value different of null will save this on adpLog.
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
function saveInDatabase(TXT, OBJ, LEVEL, PACKNAME, DATABASE) {
  const situationA = LEVEL < 500
    && DATABASE !== null
    && DATABASE !== undefined
    && DATABASE !== false;

  const situationB = LEVEL >= 500
    && DATABASE !== false;

  if (situationA || situationB) {
    const logJSON = {
      datetime: new Date(),
      code: LEVEL,
      packName: PACKNAME,
      message: TXT,
      object: OBJ,
    };
    if (adp.db === undefined) {
      return true;
    }
    if (adp.db.create === undefined) {
      return true;
    }
    const echoLogModel = new adp.models.EchoLog();
    echoLogModel.createOne(logJSON)
      .then(() => {})
      .catch((ERROR) => {
        console.log(' ');
        console.log('Error in [ localMongo.collection(\'echoLog\').insertOne(logJSON) ] inside of [ adp.echoLog ]');
        console.log(ERROR);
        console.log(' ');
      });
  }
  return true;
}

/**
* This function is used to get the textLine in case of color mode
* The testLine will have data including timestamp, packageName and text
* @param {str} TXT String with a message to display/save.
* @param {number} LEVEL Number/Code following the table below.
* @param {string} PACKNAME Name of origin from the message.
* @returns textLine
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
function echoLogColourMode(TXT, PACKNAME, LEVEL) {
  const color = getColor(LEVEL);
  return `${getTimeStamp(color)}${getPackageName(PACKNAME, color)} ${getText(TXT, color)}`;
}

/**
* This function is used to get the textLine in case of normal mode
* The testLine will have data including timestamp, packageName and text
* @param {str} TXT String with a message to display/save.
* @param {string} PACKNAME Name of origin from the message.
* @returns textLine
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
function echoLog(TXT, PACKNAME) {
  return `${getTimeStamp()}${getPackageName(PACKNAME)} ${getText(TXT)}`;
}

/**
* [ adp.echoLog ]
* Get a string and generate an apropriate console.log() for the terminal and if this is an
* error save it on adpLog database.
* Important: [ adp.echoDebugConsoleMode ] must be true or this feature will be OFF.
* @param {str} TXT String with a message to display/save.
* @param {obj} OBJ JSON Object to display/save.
* @param {number} LEVEL Number/Code following the table below.
* @param {string} PACKNAME Name of origin from the message.
* @param {null} DATABASE Any value different of null will save this on adpLog.
* @author Armando Dias [zdiaarm]
*/
module.exports = (TXT, OBJ = null, LEVEL = null, PACKNAME = null, DATABASE = null) => {
  let toPrint;
  if (adp.echoDebugConsoleMode !== true) {
    return false;
  }
  const level = ((LEVEL !== null || LEVEL !== undefined) && LEVEL >= 0) ? LEVEL : 500;
  if (!validateParameters(TXT, OBJ, level, PACKNAME, DATABASE)) {
    return false;
  }
  let useColor = false;
  try {
    if (adp.config.siteAddress) {
      useColor = adp.config.siteAddress.includes('localhost:');
      if (useColor) {
        toPrint = echoLogColourMode(TXT, PACKNAME, level);
      } else {
        toPrint = echoLog(TXT, PACKNAME);
      }
    } else {
      toPrint = echoLog(TXT, PACKNAME);
    }
    const theLine = getLine(level, useColor);
    if (OBJ !== null) {
      console.log(theLine);
    }
    console.log(toPrint);
    if (OBJ !== null) {
      if (typeof OBJ === 'object') {
        try {
          const objectAsString = JSON.stringify(OBJ, null, 2);
          if (objectAsString.trim().length < 10) {
            console.log(OBJ);
          } else {
            const limit = 1000;
            if (objectAsString.length > limit) {
              console.log(objectAsString.substr(0, limit));
              console.log(`[[[ HUGE OBJECT - SHOWING ONLY FIRST ${limit} CHARACTERS... ]]]`);
            } else {
              console.log(objectAsString);
            }
          }
        } catch (ERROR) {
          console.log(OBJ);
        }
      } else {
        console.log(OBJ);
      }
      console.log(theLine);
    }
  } catch (ERROR) {
    console.log('Error in [ adp.echoLog ]:', ERROR);
  }
  saveInDatabase(TXT, OBJ, LEVEL, PACKNAME, DATABASE);
  return true;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
