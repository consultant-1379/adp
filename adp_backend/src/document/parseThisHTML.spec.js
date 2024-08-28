// ============================================================================================= //
/**
* Unit test for [ global.adp.document.parseThisHTML ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-useless-escape */
// ============================================================================================= //
describe('Testing [ global.adp.document.parseThisHTML ] behavior.', () => {
  beforeEach(() => {
    global.parse5 = require('parse5'); // eslint-disable-line global-require
    global.XMLSerializer = require('xmlserializer'); // eslint-disable-line global-require

    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.config = {};
    global.adp.config.siteAddress = 'https://localhost:9999';

    global.fs = {};
    global.fs.unlinkSync = () => {};
    global.fs.readFileSync = (FULLPATH, MODE) => {
      if (MODE !== 'utf-8') {
        return false;
      }
      if (FULLPATH === '/local/work/api/adp/src/static/document/zip_file/index.html') {
        let HTML = '';
        HTML = `${HTML}<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">&#13;\r\n`;
        HTML = `${HTML}<head>&#13;\r\n`;
        HTML = `${HTML}<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8"/>&#13;\r\n`;
        HTML = `${HTML}<meta name="generator" content="AsciiDoc 8.6.9"/>&#13;\r\n`;
        HTML = `${HTML}<title>Test Deployment Guide</title>&#13;\r\n`;
        HTML = `${HTML}</head>&#13;\r\n`;
        HTML = `${HTML}<body class="article">&#13;\r\n`;
        HTML = `${HTML}<div class="content">&#13;\r\n`;
        HTML = `${HTML}<h1>Test Deployment Guide</h1>&#13;\r\n`;
        HTML = `${HTML}<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fermentum venenatis lacus.</p>&#13;\r\n`;
        HTML = `${HTML}[ <a href="#anchorTest1">Go to anchor</a> ]&#13;\r\n`;
        HTML = `${HTML}<img src="image.png" alt="Test Deployment Architecture"/>&#13;\r\n`;
        HTML = `${HTML}<a id="anchorTest1">Anchor Position</a>&#13;\r\n`;
        HTML = `${HTML}<a href="http://external.link.com">Outside</a>&#13;\r\n`;
        HTML = `${HTML}</div>&#13;\r\n`;
        HTML = `${HTML}</body>&#13;\r\n`;
        HTML = `${HTML}</html>&#13;\r\n`;
        return HTML;
      }
      return false;
    };
    global.fs.writeFileSync = (NEWFILE, HTML, MODE) => {
      if (NEWFILE !== '/local/work/api/adp/src/static/document/zip_file/cache/index.html') {
        return false;
      }
      if (MODE !== 'utf8') {
        return false;
      }
      return true;
    };

    global.adp.document = {};
    global.adp.document.checkThisPath = (PATH, FULLPATH) => new Promise((R1, R2) => {
      if (FULLPATH !== 'FULLPATH') {
        R2();
        return false;
      }
      if (PATH === '/local/work/api/adp/src/static/document/zip_file/cache') {
        R1(`${PATH}/`);
        return PATH;
      }
      R2();
      return false;
    });
    global.adp.document.parseThisHTML = require('./parseThisHTML'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Parsing an HTML', (done) => {
    const filename = 'index.html';
    const library = ['index.html', 'image.png'];
    const path = '/local/work/api/adp/src/static/document/zip_file/';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/zip-file';

    global.adp.document.parseThisHTML(filename, library, path, docLink)
      .then((HTML) => {
        const html = JSON.stringify(HTML.trim());
        const answer = '"<div class=\\"content\\">\\r\\n<h1>Test Deployment Guide</h1>\\r\\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fermentum venenatis lacus.</p>\\r\\n[ <a href=\\"#anchorTest1\\">Go to anchor</a> ]\\r\\n<img src=\\"https://localhost:9999/images/zip_file/image.png\\" alt=\\"Test Deployment Architecture\\"/>\\r\\n<a id=\\"anchorTest1\\" class=\\"anchorClass\\">Anchor Position</a>\\r\\n<a href=\\"http://external.link.com\\" target=\\"_blank\\">Outside</a>\\r\\n</div>"';

        expect(html).toBe(answer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
