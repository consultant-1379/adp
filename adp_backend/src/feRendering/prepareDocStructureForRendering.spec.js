// ============================================================================================= //
/**
* Unit test for [ feRendering.prepareDocStructureForRendering ]
* @author Omkar
*/
// ============================================================================================= //
const testPackage = require('./prepareDocStructureForRendering');

describe('Testing [ feRendering.prepareDocStructureForRendering ] ', () => {
  const mockListoptions = [
    {
      id: 10,
      group: 'Documentation Categories Auto',
      slug: 'documentation-categories-auto',
      testID: 'group-documentation-categories-auto',
      items: [
        {
          id: 1,
          documentationCategories: 0,
          name: 'DPI',
          order: 0,
          adminOnly: false,
          slug: 'dpi',
        },
        {
          id: 2,
          documentationCategories: 0,
          name: 'Inner Source',
          order: 1,
          adminOnly: false,
          slug: 'inner-source',
        },
        {
          id: 3,
          documentationCategories: 0,
          name: 'Release Documents',
          order: 3,
          adminOnly: false,
          slug: 'release-documents',
        },
        {
          id: 4,
          documentationCategories: 0,
          name: 'Additional Documents',
          order: 4,
          adminOnly: false,
          slug: 'additional-documents',
        },
      ],
      order: 10,
      showAsFilter: false,
    },
    {
      id: 11,
      group: 'Documentation Titles Auto',
      slug: 'documentation-titles-auto',
      testID: 'group-documentation-titles-auto',
      items: [
        {
          id: 1,
          documentationCategories: 1,
          name: 'Service Overview',
          order: 0,
          adminOnly: false,
          slug: 'service-overview',
        },
        {
          id: 1,
          documentationCategories: 2,
          name: 'Inner Source README',
          order: 0,
          adminOnly: false,
          slug: 'inner-source-readme',
        },
        {
          id: 1,
          documentationCategories: 3,
          name: 'Product Revision Information (PRI)',
          order: 0,
          adminOnly: false,
          slug: 'product-revision-information-pri',
        },
        {
          id: 2,
          documentationCategories: 1,
          name: 'Service Deployment Guide',
          order: 1,
          adminOnly: false,
          slug: 'service-deployment-guide',
        },
        {
          id: 2,
          documentationCategories: 2,
          name: 'Contributing Guideline',
          order: 1,
          adminOnly: false,
          slug: 'contributing-guideline',
        },
        {
          id: 2,
          documentationCategories: 3,
          name: 'Test Report',
          order: 1,
          adminOnly: false,
          slug: 'test-report',
        },
        {
          id: 3,
          documentationCategories: 1,
          name: 'Service Troubleshooting Guide',
          order: 2,
          adminOnly: false,
          slug: 'service-troubleshooting-guide',
        },
        {
          id: 3,
          documentationCategories: 3,
          name: 'Test Specification',
          order: 2,
          adminOnly: false,
          slug: 'test-specification',
        },
        {
          id: 4,
          documentationCategories: 1,
          name: 'Application Developers Guide',
          order: 3,
          adminOnly: false,
          slug: 'application-developers-guide',
        },
        {
          id: 4,
          documentationCategories: 3,
          name: 'Risk Assessment & Privacy Impact Assessment',
          order: 3,
          adminOnly: false,
          slug: 'risk-assessment-privacy-impact-assessment',
        },
        {
          id: 5,
          documentationCategories: 1,
          name: 'API Documentation',
          order: 4,
          adminOnly: false,
          slug: 'api-documentation',
        },
        {
          id: 5,
          documentationCategories: 3,
          name: 'Vulnerability Analysis Report',
          order: 4,
          adminOnly: false,
          slug: 'vulnerability-analysis-report',
        },
        {
          id: 6,
          documentationCategories: 1,
          name: 'Service User Guide',
          order: 5,
          adminOnly: false,
          slug: 'service-user-guide',
        },
        {
          id: 6,
          documentationCategories: 3,
          name: 'Software Vendor List (SVL)',
          order: 5,
          adminOnly: false,
          slug: 'software-vendor-list-svl',
        },
        {
          id: 7,
          documentationCategories: 3,
          name: 'Export Control Report',
          order: 6,
          adminOnly: false,
          slug: 'export-control-report',
        },
      ],
      order: 11,
      showAsFilter: false,
    },
  ];
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.listOptions = {
      cache: {
        options: JSON.stringify(mockListoptions),
      },
    };
    // eslint-disable-next-line global-require
    global.adp.dynamicSort = require('../library/dynamicSort');
    // eslint-disable-next-line global-require
    global.adp.slugIt = require('../library/slugIt');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should [ feRendering.prepareDocStructureForRendering ] render structured documents array.', async (done) => {
    const mockMsObj = {
      menu_auto: true,
      menu: {
        manual: {
          date_modified: '2020-03-04T10:50:11.942Z',
          release: [],
          development: [],
        },
        auto: {
          date_modified: '2020-03-04T10:50:11.942Z',
          development: [
            {
              name: 'Service Deployment Guide',
              slug: 'service-deployment-guide',
              category_name: 'DPI',
              category_slug: 'dpi',
            },
            {
              name: 'Test Specification',
              slug: 'test-specification',
              category_name: 'Release Documents',
              category_slug: 'release-documents',
            },
            {
              name: 'Inner Source README',
              slug: 'inner-source-readme',
              category_name: 'Inner Source',
              category_slug: 'inner-source',
            },
            {
              name: 'An External',
              slug: 'an-external',
              category_name: 'Additional Documents',
              category_slug: 'additional-documents',

            },
            {
              name: 'Product Revision Information (PRI)',
              slug: 'product-revision-information-pri',
              category_name: 'Release Documents',
              category_slug: 'release-documents',

            },
          ],
          release: [
            {
              version: '2.0.1',
              documents: [
                {
                  name: 'Sample 1',
                  default: true,
                  slug: 'sample-1',
                  category_name: 'Additional Documents',
                  category_slug: 'additional-documents',
                },
                {
                  name: 'Service Deployment Guide',
                  slug: 'service-deployment-guide',
                  category_name: 'DPI',
                  category_slug: 'dpi',
                },
                {
                  name: 'API documentation',
                  slug: 'api-documentation',
                  category_name: 'DPI',
                  category_slug: 'dpi',
                },
                {
                  name: 'Test Specification',
                  slug: 'test-specification',
                  category_name: 'Release Documents',
                  category_slug: 'release-documents',
                },
                {
                  name: 'Service Overview',
                  slug: 'service-overview',
                  category_name: 'DPI',
                  category_slug: 'dpi',
                },
              ],
            },
            {
              version: '1.1.1',
              documents: [
                {
                  name: 'Service Deployment Guide',
                  slug: 'service-deployment-guide',
                  category_name: 'DPI',
                  category_slug: 'dpi',
                },
                {
                  name: 'API documentation',
                  slug: 'api-documentation',
                  category_name: 'DPI',
                  category_slug: 'dpi',
                },
                {
                  name: 'Test Specification',
                  slug: 'test-specification',
                  category_name: 'Release Documents',
                  category_slug: 'release-documents',
                },
              ],
            },
          ],
        },
      },
    };
    await testPackage.prepareDocStructureForRendering(mockMsObj)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        expect(expectedOBJ.documentsForRendering).toBeDefined();
        expect(expectedOBJ.menu_auto).toBeTruthy();
        expect(Object.keys(expectedOBJ.documentsForRendering)).toContain('development');
        expect(Object.keys(expectedOBJ.documentsForRendering)).toContain('2.0.1');
        expect(Object.keys(expectedOBJ.documentsForRendering)).toContain('1.1.1');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
