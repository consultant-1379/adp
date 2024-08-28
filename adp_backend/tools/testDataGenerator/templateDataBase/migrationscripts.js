// ============================================================================================= //
module.exports = () => {
// --------------------------------------------------------------------------------------------- //
  const migrationScripts = [
    {
      _id: '60423709544a470006fab6e5',
      commandName: 'injectContentPermissionFromWordpress',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      // This should be always active for test environments
      // because the Wordpress Content may vary and this
      // will inject Content Static Permissions.
    },
    {
      _id: '616ebc909f20d70007e15e74',
      commandName: 'synchronizeMicroservicesWithElasticSearch',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.915Z',
    },
    {
      _id: '61a4ace165f6ddbb3fc0b6d2',
      commandName: 'microserviceDocumentationSync',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.915Z',
    },
    {
      _id: '5c2941141c64cfbcea47e8b1600a7825',
      commandName: 'trimName',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.915Z',
    },
    {
      _id: '5c2941141c64cfbcea47e8b1600cbfc3',
      commandName: 'slugItNow',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '3217c1211daf90c6abf493834700125d',
      commandName: 'updateListoptionsDocCat',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '604a7d94fc17fc59289c15a16505fde7',
      commandName: 'dateModifiedRecovery',
      version: '1.0.88',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '313e315448e259caa9e8d0c31f00406e',
      commandName: 'marketplaceUpliftServiceCategoryReusability',
      version: '1.0.94',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: 'd9c27cea92fde3da5b4e558769058c4a',
      commandName: 'statusToServiceMaturity',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: 'df59bbbeafe6e90e995d181be20055ac',
      commandName: 'generateIntegrationSecret',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '6ccf980c194fef6c1a07a6bfd5001252',
      commandName: 'yamlDocumentMenu',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '7300eec7e6868a3005e1cbe08c001451',
      commandName: 'checkMicroserviceSchema',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '3c1f7dfc4270ac8f87a40d3f53001853',
      commandName: 'documentationMenuStructure',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: 'bc997cfa3d699fb03b7561c9c100a12d',
      commandName: 'reusabilityIsNoneIfServiceIsSpecific',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: 'df9299324217a60ee663550b600024e1',
      commandName: 'createComplianceoptions',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '691b71560051b8fadfacefc13800700b',
      commandName: 'scriptFromCouchToMongo',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '6047577426456800065d791f',
      commandName: 'createDefaultGroups',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '60423709544a470006fab6e4',
      commandName: 'assignDefaultPermissionGroup',
      version: '1.0.46',
      focus: 'user',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '60d325720e4bf30008d81778',
      commandName: 'fixRBACGroupsIDOnUsers',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '613f3eb96bb802bd90c1fe0a',
      commandName: 'gitStatusAddInnersourceSnapshot',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2019-08-12T07:38:44.917Z',
    },
    {
      _id: '616eb78675d71e9e89c9487b',
      commandName: 'checkCpiDocumentation',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2021-11-01T13:50:03.917Z',
    },
    {
      _id: '616eb78675d71e9e89c9as7y',
      commandName: 'checkCpiInMSDocs',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2022-06-14T15:11:53.103Z',
    },
    {
      _id: '61a4ace16asd8dbb3fc0b6d2',
      commandName: 'xidGroupConversion',
      version: '1.0.46',
      focus: 'database',
      runOnce: true,
      lastRun: '2021-11-01T13:50:03.917Z',
    },
    {
      _id: '616eb78675d71e9e86d7487b',
      commandName: 'addCreationDate',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
      lastRun: '2022-06-14T15:12:06.062Z',
    },
    {
      _id: '616eb78675d71e9e87e7487b',
      commandName: 'addTutorialToAdditionalInfo',
      version: '1.0.46',
      focus: 'asset',
      runOnce: true,
    },
  ];
  return migrationScripts;
// --------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
