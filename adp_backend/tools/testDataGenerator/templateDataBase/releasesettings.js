/**
* Test data for the releasesettings collection
*
* @return Object containing release settings
* @author Michael Coughlan [zmiccou]
*/
// ============================================================================================= //
module.exports = () => {
  const releaseSettings = [
    {
      key: 'e2e-off',
      isEnabled: false,
      target: 'frontend',
      value: {
        message: 'This feature has been switched off. Please contact ADP Portal.',
      },
    },
    {
      key: 'e2e-on',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'releaseDocumentRefreshIntegration',
      isEnabled: true,
      target: 'backend',
      value: {
        message: 'This endpoint is temporarily disabled. Please enter in contact with ADP Portal.',
      },
    },
    {
      key: 'contributors-tile',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'top-organisations',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'content-search',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'alertbanner',
      isEnabled: true,
      target: 'frontend',
      value: {
        message: 'Warning Message to be shown',
      },
    },
    {
      key: 'table-row-drilldown',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'gitstatus-by-tag',
      isEnabled: false,
      target: 'backend',
      value: null,
    },
    {
      key: 'documentSyncAfterDocumentRefresh',
      isEnabled: true,
      target: 'backend',
      value: null,
    },
    {
      key: 'release-mimer-documents-to-download',
      isEnabled: true,
      target: 'backend',
      value: null,
    },
    {
      key: 'sitemap',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'mimer',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'document-sync-status',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'assembly-toggle',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'playgroundrefresh',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'assets-manual-sync',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'pvi-report',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
    {
      key: 'comments',
      isEnabled: true,
      target: 'frontend',
      value: null,
    },
  ];

  return releaseSettings;
};
// ============================================================================================= //
