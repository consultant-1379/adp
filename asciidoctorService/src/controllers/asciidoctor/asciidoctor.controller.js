const asciidoctor = require('asciidoctor')();
/**
 * Controller for any interaction with asciidoctor
 */

/**
 * Converts ascii text to html
 * @param {string} ascii ascii text
 * @param {object} [settings={}] any conversion settings for asciidoctor
 * @returns {promise<object>} {string} obj.html version of the given ascii
 * {object} obj.logs asciidoctor logs
 * @author Cein
 */
const getHtml = (ascii, settings = {}) => new Promise((resolve, reject) => {
  if (typeof ascii !== 'string') {
    const error = { message: 'Given ascii parameter is not of type string', code: 400, data: { ascii, settings } };
    reject(error);
    return;
  }
  if (typeof settings !== 'object' || settings === null) {
    const error = { message: 'Given conversion parameter is not of type object', code: 400, data: { ascii, settings } };
    reject(error);
    return;
  }

  try {
    // capture ascii conversion errors
    const asciiDocloggerManager = asciidoctor.LoggerManager;
    const asciiMemoryLogger = asciidoctor.MemoryLogger.$new();
    asciiDocloggerManager.setLogger(asciiMemoryLogger);

    const html = asciidoctor.convert(ascii, settings);

    const asciidoctorLogOBJ = asciiMemoryLogger.getMessages();
    const asciidoctorLogList = [];
    if (Array.isArray(asciidoctorLogOBJ)) {
      asciidoctorLogOBJ.forEach((item) => {
        const sourceLocation = item.getSourceLocation();
        const logObj = {
          severity: item.getSeverity(),
          text: item.message.text,
          path: sourceLocation.getPath(),
          linenumber: sourceLocation.getLineNumber(),
        };
        asciidoctorLogList.push(logObj);
      });
    }

    resolve({ html, logs: asciidoctorLogList });
  } catch (errorConverting) {
    const error = { message: 'Failure converting ascii to html', code: 500, data: { error: errorConverting, ascii, settings } };
    reject(error);
  }
});


module.exports = {
  getHtml,
};
