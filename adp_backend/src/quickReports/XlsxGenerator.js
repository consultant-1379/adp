global.adp.docs.list.push(__filename);
/**
 * Xlsx workbook generator
 * [global.adp.quickReports.XlsxGenerator]
 * @param {string} fileName name of the xlxs file without the extension
 * @param {Array} sheetNames array of objects of sheet slugs and names which must
 * relates to the object name in the headers and data objects
 * @param {object} headers object of sheetSlugs containing sheet heading name objects
 * example: { overview: { name : 'Name Heading', description: 'Desc Heading' } }
 * @param {object} data object of sheetSlugs containing arrays of heading to data objects
 * example: { overview: [{ name : 'service name', description: 'This is a description'}] }
 * @author Cein-Sven Da Costa [edaccei]
 */
class XlsxGenerator {
  constructor(fileName, sheetNames, headers, data) {
    this.fileName = fileName;
    this.sheetNames = sheetNames;
    this.headers = headers;
    this.data = data;
    this.packName = 'global.adp.quickReports.XlsxGenerator';
    this.XLSX = global.xlsx;
  }

  /**
   * Checks the file name.
   * If the file name is not set or of incorrect type a timestamp will be returned.
   * Strips any special characters
   * @param {string} name the name of the file in which to clean
   * @returns {string} the clean file name
   * @author Cein
   */
  static cleanFileName(name) {
    if (typeof name !== 'string' || (typeof name === 'string' && name.trim() === '')) {
      const timeStamp = global.adp.timeStamp(false, false).replace(/[_\W]+/g, '');
      return `adpmarketplace_${timeStamp}`;
    }
    return name.replace(/[_\W]+/g, '');
  }

  /**
   * Sets the column sizes of a sheet
   * @param {object} rowObj single row to match the width against
   * @returns {array} of column widths
   * @author Cein
   */
  static sheetColumnWidth(rowObj) {
    const minWidth = 20;
    const colWidths = [];
    Object.values(rowObj).forEach((itemVal) => {
      colWidths.push({ width: (itemVal.length > minWidth ? itemVal.length : minWidth) });
    });
    return colWidths;
  }

  /**
   * Create a workbook sheet with the given sheetSlug which relates to the given
   * data and header objects
   * @param {*} sheetSlug the slug of the sheet to relate to the header and data object,
   * this is the same name used for the sheet name
   * @returns {object} XLSX worksheet
   * @author Cein
   */
  createSheet(sheetSlug) {
    const header = this.headers[sheetSlug];
    const data = this.data[sheetSlug] ? this.data[sheetSlug] : [];
    let colWidths = [];
    if (header) {
      colWidths = XlsxGenerator.sheetColumnWidth(header);
      data.unshift(header);
      const worksheet = this.XLSX.utils.sheet_add_json(header, { skipHeader: true, origin: 'A1' });
      this.XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true });
      worksheet['!cols'] = colWidths;
      return worksheet;
    }
    colWidths = XlsxGenerator.sheetColumnWidth(data[0]);
    const worksheet = this.XLSX.utils.sheet_add_json(data);
    worksheet['!cols'] = colWidths;
    return worksheet;
  }

  /**
   * Creates and writes a xlsx workbook with any given sheets
   * to the quickReports directory
   * @returns {promise} the filepath to fetch the generated file.
   * @author Cein
   */
  createWorkbook() {
    return new Promise((resolve, reject) => {
      const ext = 'xlsx';
      const workbook = this.XLSX.utils.book_new();
      if (Array.isArray(this.sheetNames) && this.sheetNames.length) {
        this.sheetNames.forEach((sheetName) => {
          const worksheet = this.createSheet(sheetName.slug);
          this.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.name);
        });
      }

      global.adp.document.checkThisPath('quickReports').then((reportPath) => {
        const fileName = XlsxGenerator.cleanFileName(this.fileName);
        const filePath = `${reportPath}/${fileName}.${ext}`;
        this.XLSX.writeFile(workbook, filePath);
        resolve({ filePath, fileName, ext });
      }).catch((errorFetchingPath) => {
        const errorText = 'Error in [ adp.document.checkThisPath ] at [ createWorkbook ]';
        const errorOBJ = {
          parameter: 'quickReports',
          error: errorFetchingPath,
        };
        adp.echoLog(errorText, errorOBJ, 500, this.packName, true);
        reject(errorFetchingPath);
      });
    });
  }
}

module.exports = XlsxGenerator;
