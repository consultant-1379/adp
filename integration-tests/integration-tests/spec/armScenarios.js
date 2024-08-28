/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
class ArmScenarios {
  // =========================================================================================== //
  buildScenario(SCENARIONAME) {
    const scene = {};
    let devYamlVersion;

    switch (SCENARIONAME.trim().toLowerCase()) {
      // ======================================================================================= //
      case 'tcmimerarmcategory01':
      case 'tcmimerarmcategory02':
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        scene.dev = {};

        devYamlVersion = '1.0.5';
        if (SCENARIONAME.trim().toLowerCase() === 'tcmimerarmcategory02') {
          devYamlVersion = '1.0.0';
        }

        scene.dev['1.0.5'] = { version: devYamlVersion, is_cpi_updated: false, documents: [] };
        scene.dev['1.0.5'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Complex Anchor Example', default: false, restricted: false, filepath: 'complex_anchor.zip' });
        scene.dev['1.0.5'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.dev['1.0.5'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release = {};

        scene.release['1.0.7'] = { version: '1.0.7', is_cpi_updated: false, documents: [] };
        scene.release['1.0.7'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.7'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.3'] = { version: '1.0.3', is_cpi_updated: true, documents: [] };
        scene.release['1.0.3'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.3'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.2'] = { version: '1.0.2', is_cpi_updated: false, documents: [] };
        scene.release['1.0.2'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.2'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.1'] = { version: '1.0.1', is_cpi_updated: true, documents: [] };
        scene.release['1.0.1'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.1'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        break;
      // ======================================================================================= //
      case 'tc02': // tc02
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        scene.dev = {};

        scene.dev['1.0.1'] = { version: '1.0.1', documents: [] };
        scene.dev['1.0.1'].documents.push({ name: 'Sample 1', default: true, filepath: 'custom.html' });
        scene.dev['1.0.1'].documents.push({ name: 'Sample 2', filepath: 'custom.html' });
        scene.dev['1.0.1'].documents.push({ name: 'An External', 'external-link': 'https://www.ericsson.se' });

        scene.release = {};

        scene.release['1.0.1'] = { version: '1.0.1', documents: [] };
        scene.release['1.0.1'].documents.push({ name: 'Sample 1', default: true, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Sample 2', filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'An External', 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.2'] = { version: '1.0.2', documents: [] };
        scene.release['1.0.2'].documents.push({ name: 'Sample 3', default: true, filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Sample 4', filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'Sample 5', filepath: 'custom.html' });
        scene.release['1.0.2'].documents.push({ name: 'An External 2', 'external-link': 'https://www.ericsson.se' });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        break;
      // ======================================================================================= //
      case 'tcarmmimerversionslist01': // tcarmmimerversionslist01
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        scene.dev = {};

        devYamlVersion = '1.0.5';

        scene.dev['1.0.5'] = { version: devYamlVersion, is_cpi_updated: false, documents: [] };
        scene.dev['1.0.5'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Complex Anchor Example', default: false, restricted: false, filepath: 'complex_anchor.zip' });
        scene.dev['1.0.5'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.dev['1.0.5'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release = {};

        scene.release['1.0.7'] = { version: '1.0.7', is_cpi_updated: false, documents: [] };
        scene.release['1.0.7'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.7'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.3'] = { version: '1.0.3', is_cpi_updated: true, documents: [] };
        scene.release['1.0.3'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.3'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.1'] = { version: '1.0.1', is_cpi_updated: true, documents: [] };
        scene.release['1.0.1'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.1'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        break;
      // ======================================================================================= //
      case 'tcarmmimerversionslist02': // tcarmmimerversionslist02
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        scene.dev = {};

        devYamlVersion = '1.0.5';

        scene.dev['1.0.5'] = { version: devYamlVersion, is_cpi_updated: false, documents: [] };
        scene.dev['1.0.5'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.dev['1.0.5'].documents.push({ name: 'Complex Anchor Example', default: false, restricted: false, filepath: 'complex_anchor.zip' });
        scene.dev['1.0.5'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.dev['1.0.5'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release = {};

        scene.release['1.0.7'] = { version: '1.0.7', is_cpi_updated: false, documents: [] };
        scene.release['1.0.7'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.7'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.7'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.4'] = { version: '1.0.4', is_cpi_updated: false, documents: [] };
        scene.release['1.0.4'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.4'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.4'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.3'] = { version: '1.0.3', is_cpi_updated: true, documents: [] };
        scene.release['1.0.3'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.3'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.3'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });

        scene.release['1.0.1'] = { version: '1.0.1', is_cpi_updated: true, documents: [] };
        scene.release['1.0.1'].documents.push({ name: 'Application Developers Guide', default: true, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Service User Guide', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Inner Source README', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Contributing Guideline', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Product Revision Information (PRI)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Test Specification', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Risk Assessment & Privacy Impact Assessment', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Vulnerability Analysis Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Software Vendor List (SVL)', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'PM Metrics', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Secure Coding Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'Characteristics Summary Report', default: false, restricted: false, filepath: 'custom.html' });
        scene.release['1.0.1'].documents.push({ name: 'API Documentation', default: false, 'external-link': 'https://www.ericsson.se' });
        scene.release['1.0.1'].documents.push({ name: 'API Specification', default: false, 'external-link': 'https://www.ericsson.se' });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        break;
      // ======================================================================================= //
      default: // tc01
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        scene.dev = {};

        scene.dev['1.0.1'] = { version: '1.0.1', documents: [] };
        scene.dev['1.0.1'].documents.push({ name: 'Sample 1', default: true, filepath: 'CAS_Deployment_Guide.zip' });
        scene.dev['1.0.1'].documents.push({ name: 'Sample 2', filepath: 'test.html' });
        scene.dev['1.0.1'].documents.push({ name: 'An External', 'external-link': 'https://www.ericsson.se' });

        scene.release = {};

        scene.release['1.0.1'] = { version: '1.0.1', documents: [] };
        scene.release['1.0.1'].documents.push({ name: 'Sample 1', default: true, filepath: 'CAS_Deployment_Guide.zip' });
        scene.release['1.0.1'].documents.push({ name: 'Sample 2', filepath: 'test.html' });
        scene.release['1.0.1'].documents.push({ name: 'An External', 'external-link': 'https://www.ericsson.se' });
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        break;
      // ======================================================================================= //
    }
    return scene;
  }
  // =========================================================================================== //
}

module.exports = { ArmScenarios };
