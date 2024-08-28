// ============================================================================================= //
const packName = 'adp.restoreElasticsearch';

const _deleteIndex = async (INDEX) => {
  const exists = await adp.elasticSearch.indices.exists({ index: INDEX }).then()
    .catch((ERROR) => {
      const errorText = 'Error in [ exists ] at _deleteIndex';
      const errorOBJ = {
        errorindex: INDEX,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
  if (exists.body === true && exists.statusCode === 200) {
    await adp.elasticSearch.indices.delete({ index: INDEX }).then().catch();
    adp.echoLog(`Deleted [ ${INDEX} ] from ElasticSearch.`, null, 200, packName);
    return { code: 200, message: 'Successfully deleted index from ElastiSearch.' };
  }
  adp.echoLog(`[ ${INDEX} ] already deleted from ElasticSearch.`, null, 200, packName);
  return { code: 200, message: 'Index already deleted from ElasticSearch' };
};

const createElasticSearch = (INDEX, DOCUMENT) => new Promise((RESOLVE, REJECT) => {
  const microserviceDocumentation = new adp.modelsElasticSearch.MicroserviceDocumentation();
  this.index = INDEX;
  if (INDEX.includes('documentation')) {
    return microserviceDocumentation.verifyIndex()
      .then(() => microserviceDocumentation.createDocuments(DOCUMENT)
        .then(() => {
          adp.echoLog(`Created [ ${INDEX} ] from ElasticSearch. Added ${DOCUMENT.length} documents.`, null, 200, packName);
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ createDocuments ] at createElasticSearch() for index microservice-documentation';
          const errorOBJ = {
            index: INDEX,
            document: DOCUMENT,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        }))
      .catch((ERROR) => {
        const errorText = 'Error in [ verifyIndex ] at createElasticSearch() for index microservice-documentation';
        const errorOBJ = {
          index: INDEX,
          document: DOCUMENT,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      });
  } if (INDEX.includes('microservices')) {
    const microservices = new adp.modelsElasticSearch.Microservices();
    this.index = INDEX;
    return microservices.verifyIndex()
      .then(() => {
        const allMsPromise = [];
        DOCUMENT.forEach((MS) => {
          allMsPromise.push(microservices.insertElasticSearchDocument(MS).then()
            .catch((ERROR) => {
              const errorText = 'Error in [ insertElasticSearchDocument ] at createElasticSearch() for index microservices';
              const errorOBJ = {
                index: INDEX,
                document: DOCUMENT,
                error: ERROR,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              REJECT(ERROR);
            }));
        });
        return Promise.all(allMsPromise)
          .then(() => {
            adp.echoLog(`Created [ ${INDEX} ] from ElasticSearch. Added ${DOCUMENT.length} documents.`, null, 200, packName);
            RESOLVE();
          })
          .catch((ERROR) => {
            const errorText = 'Error in Promise.all() at createElasticSearch() for index microservics';
            const errorOBJ = {
              index: INDEX,
              document: DOCUMENT,
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(ERROR);
          });
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ verifyIndex ] at createElasticSearch() for index microservics';
        const errorOBJ = {
          index: INDEX,
          document: DOCUMENT,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      });
  }
  return RESOLVE();
});

const deleteIndex = (INDEX, DOCUMENT) => new Promise((RESOLVE, REJECT) => {
  _deleteIndex(INDEX)
    .then(() => {
      createElasticSearch(INDEX, DOCUMENT)
        .then(() => RESOLVE())
        .catch((ERROR) => {
          const errorText = 'Error in [ createElasticSearch ] at _deleteIndex() ';
          const errorOBJ = {
            index: INDEX,
            document: DOCUMENT,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ _deleteIndex ] at deleteIndex() ';
      const errorOBJ = {
        index: INDEX,
        document: DOCUMENT,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});

const recreateElasticSearch = (INDEX, DOCUMENT) => new Promise((RESOLVE, REJECT) => {
  deleteIndex(INDEX, DOCUMENT)
    .then(() => RESOLVE())
    .catch((ERROR) => {
      const errorText = 'Error in [ deleteIndex ] at recreateElasticSearch() ';
      const errorOBJ = {
        index: INDEX,
        document: DOCUMENT,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});

// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const dynamicObject = adp.dynamicData();
  const recreateElasticsearchIndex = INDEX => new Promise(((RESOLVETHIS, REJECTTHIS) => {
    let filePath = '';
    if (INDEX.includes('microservices')) {
      filePath = `${__dirname}/templateElasticsearch/microservices.js`;
    } else if (INDEX.includes('documentation')) {
      filePath = `${__dirname}/templateElasticsearch/microservice-documentation.js`;
    } else {
      filePath = `${__dirname}/templateElasticsearch/wordpress.js`;
    }
    if (!global.fs.existsSync(filePath)) {
      const msgObject = {
        error: 'File not found',
        filePath,
      };
      adp.echoLog(`File not found. Cannot restore "${INDEX}" index.`, msgObject, 404, packName);
      return REJECTTHIS();
    }
    // eslint-disable-next-line import/no-dynamic-require
    const dataCommand = require(filePath);
    const dataArray = dataCommand(dynamicObject);
    if (!dataArray.length > 0) {
      adp.echoLog(`File empty. Cannot restore "${INDEX}" index. This index file is empty.`);
      return RESOLVETHIS();
    }
    adp.echoLog(`File "${INDEX}.js" found! Starting to restore "${INDEX}"...`, null, 200, packName);
    return recreateElasticSearch(INDEX, dataArray)
      .then(() => {
        RESOLVETHIS();
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ recreateElasticSearch ] at adp.restoreElasticsearch.recreateElasticsearchIndex';
        const errorOBJ = {
          param: INDEX,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      });
  }));

  // ============================================================================ //

  let localIndex = -1;
  const indexs = [adp.config.elasticSearchMicroservicesIndex,
    adp.config.elasticSearchMsDocumentationIndex,
    adp.config.elasticSearchWordpressIndex];
  const runIndex = () => {
    localIndex += 1;
    if (indexs[localIndex]) {
      adp.actionCounter.collections += 1;
      recreateElasticsearchIndex(indexs[localIndex])
        .then(() => runIndex())
        .catch((ERROR) => {
          const errorText = 'Error in [ recreateElasticsearchIndex ]';
          const errorOBJ = {
            param: indexs[localIndex],
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    } else {
      RESOLVE('DONE!');
    }
  };
  runIndex();
});
// ============================================================================================= //
