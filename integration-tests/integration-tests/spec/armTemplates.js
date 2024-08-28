const { ArmScenarios } = require('./armScenarios');

/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-escape */

class ArmTemplates {
  // =========================================================================================== //


  constructor(MOCK) {
    this.armMockServer = `${MOCK}armserver/`;
    this.mockServer = null;
    this.allPromises = [];
  }


  // =========================================================================================== //


  async mockArmObject(MOCKSERVER, SCENARIONAME) {
    this.mockServer = MOCKSERVER;
    this.allPromises = [];
    const scene = new ArmScenarios().buildScenario(SCENARIONAME);
    this._mockIndexes(scene);
    this._mockYAMLs(scene);

    await Promise.all(this.allPromises);
  }


  // =========================================================================================== //


  slugIt(TEXT) {
    let textSlug = `${TEXT}`.trim();
    if (textSlug.length > 0) {
      textSlug = textSlug.toLowerCase();
      textSlug = textSlug.replace(/\s+/g, '-'); // Replace spaces with -
      textSlug = textSlug.replace(/[^\w.\-]/g, ''); // Remove all non-word chars ( Except dots )
      textSlug = textSlug.replace(/\-\-+/g, '-'); // Replace multiple - with single -
      textSlug = textSlug.replace(/^-+/, ''); // Trim - from start of text
      textSlug = textSlug.replace(/-+$/, ''); // Trim - from end of text
    }
    return textSlug;
  }


  // =========================================================================================== //


  _mockIndexes(SCENE) {
    Object.keys(SCENE).forEach((MODE) => {
      this._mockThisIndexHTML(MODE, SCENE[MODE]);
    });
  }

  // =========================================================================================== //


  _mockYAMLs(SCENE) {
    Object.keys(SCENE).forEach((MODE) => {
      Object.keys(SCENE[MODE]).forEach((VERSION) => {
        this._mockThisYAML(MODE, SCENE[MODE][VERSION]);
      });
    });
  }


  // =========================================================================================== //


  _mockThisIndexHTML(MODE, VERSIONOBJ) {
    let versionName;
    let stringFiles = '';

    Object.keys(VERSIONOBJ).forEach((VERSIONKEY) => {
      if (MODE === 'dev') {
        versionName = 'development';
        stringFiles = `${stringFiles}\n      <a href="indevelopment.yaml">indevelopment.yaml</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="indevelopment.yaml.md5">indevelopment.yaml.md5</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="indevelopment.yaml.sha1">indevelopment.yaml.sha1</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="indevelopment.yaml.sha256">indevelopment.yaml.sha256</a> 15-May-2023 16:08 50.00 KB`;
        this.mockTheHash('indevelopment.yaml.md5', '2018de603c1a09df8e9905da27639465  indevelopment.yaml', 'dev');
        this.mockTheHash('indevelopment.yaml.sha1', '2018de603c1a09df8e9905da27639465  indevelopment.yaml', 'dev');
        this.mockTheHash('indevelopment.yaml.sha256', '2018de603c1a09df8e9905da27639465  indevelopment.yaml', 'dev');
      } else {
        versionName = VERSIONKEY;
        stringFiles = `${stringFiles}\n      <a href="${versionName}/">${versionName}/</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="${versionName}.yaml">${versionName}.yaml</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="${versionName}.yaml.md5">${versionName}.yaml.md5</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="${versionName}.yaml.sha1">${versionName}.yaml.sha1</a> 15-May-2023 16:08 50.00 KB`;
        stringFiles = `${stringFiles}\n      <a href="${versionName}.yaml.sha256">${versionName}.yaml.sha256</a> 15-May-2023 16:08 50.00 KB`;
        this.mockTheHash(`${versionName}.yaml.md5`, `2018de603c1a09df8e9905da27639465  ${versionName}.yaml`, 'release');
        this.mockTheHash(`${versionName}.yaml.sha1`, `2018de603c1a09df8e9905da27639465  ${versionName}.yaml`, 'release');
        this.mockTheHash(`${versionName}.yaml.sha256`, `2018de603c1a09df8e9905da27639465  ${versionName}.yaml`, 'release');
      }
    });

    const template = `      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
      <html>
      <head><title>Index of Mock [[[ ${versionName} ]]] docker-v2-global-local/aia/adp</title>
      </head>
      <body>
      <h1>Index of Mock [[[ ${versionName} ]]] docker-v2-global-local/aia/adp</h1>
      <pre>Name                                                 Last modified      Size</pre><hr/>
      <pre><a href="../">../</a>
      <a href="adp-angular-build/">adp-angular-build/</a>                                    26-Jul-2018 17:54    -
      <a href="adp-angular-build-alpine/">adp-angular-build-alpine/</a>                             26-Jul-2018 18:08    -
      <a href="adp-backend/">adp-backend/</a>                                          12-Sep-2018 14:15    -
      <a href="adp-gui-container/">adp-gui-container/</a>                                    23-Aug-2018 12:23    -
      <a href="adp-portal-e2e-test/">adp-portal-e2e-test/</a>                                  06-Mar-2020 10:16    -
      <a href="adp-portal-logstash/">adp-portal-logstash/</a>                                  02-Apr-2019 19:04    -
      <a href="portal-gatling/">portal-gatling/</a>                                       05-Feb-2020 19:32    -
      <a href="portal-wordpress/">portal-wordpress/</a>                                     05-Nov-2019 16:17    -
      <a href="portal-wordpress-test/">portal-wordpress-test/</a>                                04-Feb-2020 09:22    -
      <!-- Dynamic :: Begin -->
      ${stringFiles}
      <!-- Dynamic :: End -->
      <a href="document-test.doc">document-test.doc</a>                                     11-Feb-2020 10:44  21.50 KB
      <a href="document-test.doc.md5">document-test.doc.md5</a>                                 11-Feb-2020 10:44  32 bytes
      <a href="document-test.doc.sha1">document-test.doc.sha1</a>                                11-Feb-2020 10:44  40 bytes
      <a href="document-test.doc.sha256">document-test.doc.sha256</a>                              11-Feb-2020 10:44  64 bytes
      <a href="index.zip">index.zip</a>                                             12-Nov-2019 11:47  174 bytes
      <a href="index.zip.md5">index.zip.md5</a>                                         12-Nov-2019 11:47  32 bytes
      <a href="index.zip.sha1">index.zip.sha1</a>                                        12-Nov-2019 11:47  40 bytes
      <a href="index.zip.sha256">index.zip.sha256</a>                                      12-Nov-2019 11:47  64 bytes
      <a href="multiple_pages.zip">multiple_pages.zip</a>                                    04-Dec-2019 12:44  822 bytes
      <a href="multiple_pages.zip.md5">multiple_pages.zip.md5</a>                                04-Dec-2019 12:44  32 bytes
      <a href="multiple_pages.zip.sha1">multiple_pages.zip.sha1</a>                               04-Dec-2019 12:44  40 bytes
      <a href="multiple_pages.zip.sha256">multiple_pages.zip.sha256</a>                             04-Dec-2019 12:44  64 bytes
      <a href="src_static_zip_CAS_Deployment_Guide_HTML.zip">src_static_zip_CAS_Deployment_Guide_HTML.zip</a>          03-Dec-2019 12:06  84.23 KB
      <a href="src_static_zip_CAS_Deployment_Guide_HTML.zip.md5">src_static_zip_CAS_Deployment_Guide_HTML.zip.md5</a>      03-Dec-2019 12:06  32 bytes
      <a href="src_static_zip_CAS_Deployment_Guide_HTML.zip.sha1">src_static_zip_CAS_Deployment_Guide_HTML.zip.sha1</a>     03-Dec-2019 12:06  40 bytes
      <a href="src_static_zip_CAS_Deployment_Guide_HTML.zip.sha256">src_static_zip_CAS_Deployment_Guide_HTML.zip.sha256</a>   03-Dec-2019 12:06  64 bytes
      <a href="test.html">test.html</a>                                             06-Mar-2020 15:26  207 bytes
      <a href="test.html.md5">test.html.md5</a>                                         06-Mar-2020 15:26  32 bytes
      <a href="test.html.sha1">test.html.sha1</a>                                        06-Mar-2020 15:26  40 bytes
      <a href="test.html.sha256">test.html.sha256</a>                                      06-Mar-2020 15:26  64 bytes
      </pre>
      <hr/><address style="font-size:small;">Artifactory/6.15.1 Server at arm.epk.ericsson.se Port 80</address></body></html>\n`;

    let theMockPath = '/armserver/dev/';
    if (MODE === 'release') theMockPath = '/armserver/release/';

    const objToMock = {
      httpRequest: {
        method: 'GET',
        path: theMockPath,
      },
      httpResponse: {
        statusCode: 200,
        body: template,
      },
      times: {
        unlimited: true,
      },
    };
    this.allPromises.push(this.mockServer.mockAnyResponse(objToMock));
  }


  // =========================================================================================== //


  async mockTheHash(FILE, CONTENT, MODE) {
    const objHash = {
      httpRequest: {
        method: 'GET',
        path: `/armserver/${MODE}/${FILE}`,
      },
      httpResponse: {
        statusCode: 200,
        body: CONTENT,
      },
      times: {
        unlimited: true,
      },
    };
    this.allPromises.push(this.mockServer.mockAnyResponse(objHash));
    return true;
  }


  // =========================================================================================== //


  _mockThisYAML(MODE, SCENEOBJ) {
    const mode = MODE;
    // eslint-disable-next-line camelcase
    const { version, is_cpi_updated, documents } = SCENEOBJ;
    let versionPath = `${version}/`;
    let yaml = '';

    if (mode === 'dev') versionPath = '';
    if (version) yaml = `${yaml}version: ${version}\n`;
    // eslint-disable-next-line camelcase
    if (is_cpi_updated === true) yaml = `${yaml}is_cpi_updated: true\n`;

    yaml = `${yaml}documents:\n`;

    documents.forEach((DOC) => {
      let first = true;
      const docName = DOC.name;
      Object.keys(DOC).forEach((ATTR) => {
        let spacer = '    ';
        if (first) spacer = '  - ';
        const isFilePath = (ATTR === 'filepath');
        const isCustomHTML = (DOC[ATTR] === 'custom.html');
        const isBoolean = (DOC[ATTR] === 'boolean');
        const isBooleanTrue = (DOC[ATTR] === true);

        if (isFilePath && isCustomHTML) {
          const docSlug = this.slugIt(docName);
          const theFilePath = `${versionPath}custom_${docSlug}.html`;
          yaml = `${yaml}${spacer}${ATTR}: ${theFilePath}\n`;
          this._mockThisCustomHTML(mode, docName, theFilePath);
        }

        if (isFilePath && !isCustomHTML) {
          const physicalPath = `testFiles/${DOC[ATTR]}`;
          const logicalPath = `${versionPath}${DOC[ATTR]}`;
          this._mockThisFile(mode, logicalPath, physicalPath);
          yaml = `${yaml}${spacer}${ATTR}: ${logicalPath}\n`;
        }

        if (!isFilePath && isBoolean && isBooleanTrue) {
          yaml = `${yaml}${spacer}${ATTR}: true\n`;
        }

        if (!isFilePath && !isBoolean) {
          yaml = `${yaml}${spacer}${ATTR}: ${DOC[ATTR]}\n`;
        }

        first = false;
      });
    });

    let thePath = `/armserver/${mode}/${version}.yaml`;
    if (mode === 'dev') thePath = `/armserver/${mode}/indevelopment.yaml`;

    const objYAML = {
      httpRequest: {
        method: 'GET',
        path: thePath,
      },
      httpResponse: {
        statusCode: 200,
        body: yaml,
      },
      times: {
        unlimited: true,
      },
    };

    this.allPromises.push(this.mockServer.mockAnyResponse(objYAML));
  }


  // =========================================================================================== //


  _generateCustomHTML(MODE, DOCNAME, THEPATH) {
    const docName = DOCNAME;
    const thePath = THEPATH.replace('/armserver/', '');
    const fullPath = `${this.armMockServer}${MODE}/${thePath}`;
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>Mock :: ${docName}</title>
      </head>
      <body>
      Mock HTML document for <b>${docName}</b>.<br/>
      Got this file from <b><a href="${fullPath}">${fullPath}</a></b>
      </body>
      </html>`;
    return template;
  }


  // =========================================================================================== //


  _getMockFileHeader(CONTENTTYPE, FILEREMOTENAME) {
    let fileName = FILEREMOTENAME;
    // eslint-disable-next-line prefer-destructuring
    if (fileName.indexOf('/') >= 0) fileName = fileName.split('/')[1];
    const headersVariable = {
      'set-cookie': [
        'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
        'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
      ],
      'content-type': [`${CONTENTTYPE}`],
      'content-disposition': [`form-data; name='${fileName}'; filename*=UTF-8''${fileName}`],
      etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
      'x-content-type-options': ['nosniff'],
      'x-xss-protection': ['1; mode=block'],
      'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
      pragma: ['no-cache'],
      expires: ['0'],
      'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
      'x-frame-options': ['DENY'],
      'content-length': ['54513'],
      date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
      'Access-Control-Allow-Origin': ['*'],
      'Access-Control-Allow-Credentials': ['true'],
      'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
      'Access-Control-Max-Age': ['-1'],
      'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
      'Access-Control-Expose-Headers': ['alertbanner'],
      connection: ['close'],
    };
    return headersVariable;
  }


  // =========================================================================================== //


  _mockThisCustomHTML(MODE, DOCNAME, FILEPATH) {
    const mockHTML = this._generateCustomHTML(MODE, DOCNAME, FILEPATH);
    const mockFileHeader = this._getMockFileHeader('text/html; charset=utf-8', FILEPATH);
    const httpRequestVariable = { path: `/armserver/${MODE}/${FILEPATH}` };
    const timesVariable = { unlimited: true };
    const objFile = {
      httpRequest: httpRequestVariable,
      httpResponse: {
        headers: mockFileHeader,
        body: mockHTML,
      },
      times: timesVariable,
    };
    this.allPromises.push(this.mockServer.mockAnyResponse(objFile));
  }


  // =========================================================================================== //


  async _mockThisFile(MODE, LOGICALPATH, PHYSICALPATH) {
    const fs = require('fs');
    const BufferResponse = fs.readFileSync(`${__dirname}/${PHYSICALPATH}`);
    const theFile = await BufferResponse.toString('base64');
    const mockFileHeader = this._getMockFileHeader('application/zip', LOGICALPATH);
    const httpRequestVariable = { path: `/armserver/${MODE}/${LOGICALPATH}` };
    const timesVariable = { unlimited: true };
    const objFile = {
      httpRequest: httpRequestVariable,
      httpResponse: {
        headers: mockFileHeader,
        body: {
          type: 'BINARY',
          base64Bytes: theFile,
        },
      },
      times: timesVariable,
    };
    this.allPromises.push(this.mockServer.mockAnyResponse(objFile));
  }


  // =========================================================================================== //
}

module.exports = { ArmTemplates };
