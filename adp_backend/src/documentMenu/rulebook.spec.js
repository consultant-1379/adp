// ============================================================================================= //
/**
* Unit test for [ global.adp.documentMenu.rulebook ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing the rules behavior of [ global.adp.documentMenu.rulebook ].', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.documentMenu = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.document = {
      id: '/menu_item',
      type: 'object',
      properties: {
        name: {
          description: 'The Name of the document',
          type: 'string',
          maxLength: '255',
          mail_name: 'Document Name',
          mail_order: 1,
        },
        slug: {
          description: 'The Slug of the document',
          type: 'string',
          maxLength: '255',
        },
        filepath: {
          description: 'The relative path of the document',
          type: 'string',
          mail_name: 'Document path',
          mail_order: 2,
        },
        external_link: {
          description: 'The external link for this document',
          type: 'string',
          mail_name: 'Document Link',
          mail_order: 3,
        },
        restricted: {
          description: 'For external links, indicates restricted status.',
          type: 'boolean',
          mail_name: 'Restricted',
          mail_order: 4,
        },
        default: {
          description: 'The Name of the Document',
          type: 'boolean',
          default: false,
          mail_name: 'Default',
          mail_order: 5,
        },
      },
      oneOf: [
        { required: ['name', 'filepath'] },
        { required: ['name', 'external_link'] },
      ],
    };
    global.Jsonschema = require('jsonschema').Validator; // eslint-disable-line global-require
    global.adp.clone = require('../library/clone'); // eslint-disable-line global-require
    global.adp.documentMenu.rulebook = require('./rulebook'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ name ] Check if the name of document follow the rules', (done) => {
    const mockDocument = {
      name: 'Valid mockName',
    };
    const addError = (MSG) => {
      // This function cannot run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.name(mockDocument, addError);

    // 'result' should be true to be successful in this case.
    expect(result).toBeTruthy();
    done();
  });


  it('[ name ] Should detect error "Name cannot be undefined"', (done) => {
    const mockDocument = {};
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.name(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ name ] Should detect error "Name cannot be null"', (done) => {
    const mockDocument = {
      name: null,
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.name(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ name ] Should detect error "Name should be a string"', (done) => {
    const mockDocument = {
      name: 123,
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.name(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ name ] Should detect error "Name cannot be an empty string"', (done) => {
    const mockDocument = {
      name: '',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.name(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Check a positive case, with "filepath"', (done) => {
    const mockDocument = {
      filepath: '1.0.1/document.html',
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be true to be successful in this case.
    expect(result).toBeTruthy();
    done();
  });


  it('[ link ] Check a positive case, with "external_link"', (done) => {
    const mockDocument = {
      external_link: 'https://mock.url.com/document.html',
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be true to be successful in this case.
    expect(result).toBeTruthy();
    done();
  });


  it('[ link ] Detecting error when there is no "filepath" nor "external_link"', (done) => {
    const mockDocument = {};
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Detecting error when there is both "filepath" and "external_link"', (done) => {
    const mockDocument = {
      filepath: '1.0.1/document.html',
      external_link: 'https://mock.url.com/document.html',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Testing if "filepath" get the error "filepath should be a string"', (done) => {
    const mockDocument = {
      filepath: 123,
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Testing if "filepath" get the error "filepath cannot be an empty string"', (done) => {
    const mockDocument = {
      filepath: '',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Testing if "external_link" get the error "external_link should be a string"', (done) => {
    const mockDocument = {
      external_link: 123,
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ link ] Testing if "external_link" get the error "external_link cannot be an empty string"', (done) => {
    const mockDocument = {
      external_link: '',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.link(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });


  it('[ restricted ] Check a positive case of restricted rule', (done) => {
    const mockDocument = {
      external_link: 'https://mock.url.com/document.html',
      restricted: true,
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.restricted(mockDocument, addError);

    // 'result' should be true to be successful in this case.
    expect(result).toBeTruthy();
    done();
  });


  it('[ restricted ] Detect an error if there is no external_link with a true restricted field', (done) => {
    const mockDocument = {
      restricted: true,
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.restricted(mockDocument, addError);

    // 'result' should be false to be successful in this case.
    expect(result).toBeFalsy();
    done();
  });

  it('[ slug ] Check a positive case of slug rule', (done) => {
    // eslint-disable-next-line global-require
    global.adp.slugIt = require('../library/slugIt');
    const mockDocument = {
      name: 'Valid Mock Name',
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = theRulebook.slug(mockDocument);

    // 'result' should be true to be successful in this case.
    expect(result).toBeTruthy();
    // 'mockDocument.slug' should be an specific value to be successful in this case.
    expect(mockDocument.slug).toBe('valid-mock-name');

    done();
  });


  it('[ notAllowedField ] Check a valid document, should not generate any warning', (done) => {
    const mockDocument = {
      name: 'Valid Mock Name',
      external_link: 'https://mock.url.com/document.html',
      restricted: true,
      default: true,
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.notAllowedField(mockDocument, addError);

    const fieldsQuant = Object.keys(mockDocument).length;

    expect(fieldsQuant).toBe(4);
    done();
  });


  it('[ notAllowedField ] Check a document with not allowed fields, should remove them and generate a warning', (done) => {
    const mockDocument = {
      name: 'Valid Mock Name',
      external_link: 'https://mock.url.com/document.html',
      restricted: true,
      default: true,
      potato: '10Kg',
      eggs: '12 units',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.notAllowedField(mockDocument, addError);

    const fieldsQuant = Object.keys(mockDocument).length;

    expect(fieldsQuant).toBe(4);
    done();
  });


  it('[ uniqueDocName ] Positive case, the mock group there is only unique names for each document', (done) => {
    const mockMenuObject = {
      development: [
        {
          name: 'Valid Mock Name A',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name B',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
          default: true,
        },
        {
          name: 'Valid Mock Name C',
          external_link: 'https://mock.url.com/document.html',
        },
      ],
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.uniqueDocName(mockMenuObject, 'development', addError);

    const fieldsQuant = Object.keys(mockMenuObject.development).length;

    expect(fieldsQuant).toBe(3);
    done();
  });


  it('[ uniqueDocName ] Negative case, the mock group there is repeated names', (done) => {
    const mockMenuObject = {
      development: [
        {
          name: 'Valid Mock Name',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
          default: true,
        },
        {
          name: 'Valid Mock Name',
          external_link: 'https://mock.url.com/document.html',
        },
      ],
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.uniqueDocName(mockMenuObject, 'development', addError);

    const fieldsQuant = Object.keys(mockMenuObject.development).length;

    expect(fieldsQuant).toBe(1);
    done();
  });


  it('[ onlyOneDefaultAtMaximum ] Positive case, the mock group there is only one default attribute', (done) => {
    const mockMenuObject = {
      development: [
        {
          name: 'Valid Mock Name A',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name B',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
          default: true,
        },
        {
          name: 'Valid Mock Name C',
          external_link: 'https://mock.url.com/document.html',
        },
      ],
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.onlyOneDefaultAtMaximum(mockMenuObject, 'development', addError);

    const fieldsQuant = Object.keys(mockMenuObject.development).length;

    expect(fieldsQuant).toBe(3);
    done();
  });


  it('[ onlyOneDefaultAtMaximum ] Detect, Warning and fix: There is two documents as default', (done) => {
    const mockMenuObject = {
      development: [
        {
          name: 'Valid Mock Name A',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name B',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
          default: true,
        },
        {
          name: 'Valid Mock Name C',
          external_link: 'https://mock.url.com/document.html',
          default: true,
        },
      ],
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.onlyOneDefaultAtMaximum(mockMenuObject, 'development', addError);

    expect(mockMenuObject.development[0].default).toBeUndefined();
    expect(mockMenuObject.development[1].default).toBeDefined();
    expect(mockMenuObject.development[2].default).toBeUndefined();

    done();
  });


  it('[ onlyOneDefaultAtMaximum ] Detect, Warning and fix: There is no document as default', (done) => {
    const mockMenuObject = {
      development: [
        {
          name: 'Valid Mock Name A',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name B',
          external_link: 'https://mock.url.com/document.html',
          restricted: true,
        },
        {
          name: 'Valid Mock Name C',
          external_link: 'https://mock.url.com/document.html',
        },
      ],
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.onlyOneDefaultAtMaximum(mockMenuObject, 'development', addError);

    expect(mockMenuObject.development[0].default).toBeDefined();
    expect(mockMenuObject.development[1].default).toBeUndefined();
    expect(mockMenuObject.development[2].default).toBeUndefined();

    done();
  });


  it('[ uniqueVersionName ] Positive case, all versions have unique names', (done) => {
    const mockMenuObject = {
      release: [
        {
          version: '1.0.0',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.1',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.2',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
      ],
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.uniqueVersionName(mockMenuObject, 'release', addError);

    const versionQuant = Object.keys(mockMenuObject.release).length;

    expect(versionQuant).toBe(3);
    done();
  });


  it('[ uniqueVersionName ] Negative case, should remove repeated Version Names', (done) => {
    const mockMenuObject = {
      release: [
        {
          version: '1.0.0',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.1',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.0',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
      ],
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.uniqueVersionName(mockMenuObject, 'release', addError);

    const versionQuant = Object.keys(mockMenuObject.release).length;

    expect(versionQuant).toBe(2);
    done();
  });


  it('[ removeEmptyVersions ] Positive case, all versions have at least one document', (done) => {
    const mockMenuObject = {
      release: [
        {
          version: '1.0.0',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.1',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.2',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
      ],
    };
    const addError = (MSG) => {
      // This function should not run to be successful in this case.
      expect(MSG).toBeFalsy();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.removeEmptyVersions(mockMenuObject, 'release', addError);

    const versionQuant = Object.keys(mockMenuObject.release).length;

    expect(versionQuant).toBe(3);
    done();
  });

  it('[ removeEmptyVersions ] Negative case, the version which have no documents should be removed', (done) => {
    const mockMenuObject = {
      release: [
        {
          version: '1.0.0',
          documents: [],
        },
        {
          version: '1.0.1',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
        {
          version: '1.0.2',
          documents: [
            {
              name: 'Valid Mock Name A',
              external_link: 'https://mock.url.com/document.html',
              restricted: true,
            },
          ],
        },
      ],
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    theRulebook.removeEmptyVersions(mockMenuObject, 'release', addError);

    const versionQuant = Object.keys(mockMenuObject.release).length;

    expect(versionQuant).toBe(2);
    done();
  });

  it('[ schemaValidation ] Send error if character limit is exceeded by document title', async (done) => {
    const mockDocument = {
      name: `test exceeds the character limit that caused showing error on documentation
      popup and test exceeds the character limit that caused showing error on documentation popup and test exceeds
      the character limit that caused showing error on documentation popup`,
      external_link: 'mock link',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.schemaValidation(mockDocument, addError);

    expect(result).toBeFalsy();
    done();
  });

  it('[ schemaValidation ] do not send error if character limit is not exceeded by document title', async (done) => {
    const mockDocument = {
      name: 'Valid mockName',
      external_link: 'mock link',
    };
    const addError = (MSG) => {
      // This function should run to be successful in this case.
      expect(MSG).toBeDefined();
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.schemaValidation(mockDocument, addError);

    expect(result).toBeTruthy();
    done();
  });


  it('[ checkCPI ] testing the checkCPI behavior - Successful Case', async (done) => {
    const mockVersionObject = {
      version: 'Version Mock Name',
      is_cpi_updated: true,
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.checkCPI(mockVersionObject, true, 'Version Mock Name', null, null);

    expect(result).toBeFalsy();
    done();
  });


  it('[ checkCPI ] testing the checkCPI behavior - If CPI is disabled on MS but true on the Version Object', async (done) => {
    const mockVersionObject = {
      version: 'Version Mock Name',
      is_cpi_updated: true,
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.checkCPI(mockVersionObject, false, 'Version Mock Name', () => {}, () => {});

    expect(result).toBeTruthy();
    done();
  });


  it('[ checkCPI ] testing the checkCPI behavior - cpi_updated is not a boolean', async (done) => {
    const mockVersionObject = {
      version: 'Version Mock Name',
      is_cpi_updated: 'wrong',
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.checkCPI(mockVersionObject, true, 'Version Mock Name', () => {}, () => {});

    expect(result).toBeTruthy();
    done();
  });


  it('[ checkCPI ] testing the checkCPI behavior - cpi_updated is undefined', async (done) => {
    const mockVersionObject = {
      version: 'Version Mock Name',
    };
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.checkCPI(mockVersionObject, true, 'Version Mock Name', () => {}, () => {});

    expect(result).toBeTruthy();
    done();
  });


  it('[ checkCPI ] testing the checkCPI behavior - if the version object is undefined', async (done) => {
    const theRulebook = global.adp.documentMenu.rulebook;
    const result = await theRulebook.checkCPI(undefined, true, 'Version Mock Name', () => {}, () => {});

    expect(result).toBeTruthy();
    done();
  });
});
// ============================================================================================= //
