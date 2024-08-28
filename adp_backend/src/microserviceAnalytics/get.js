// ============================================================================================= //
/**
* [ global.adp.microserviceAnalytics.get ]
* Retrieve a Tableau Analytical data for a MicroService.
* @param {String} msSlug A simple String with the slug of the MicroService.
* @return {JSON} Returns a JSON Object containing the information of the MicroService.
* @author Omkar Sadegaonkar [esdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const packName = 'global.adp.microserviceAnalytics.get';
const { customMetrics } = require('../metrics/register');
const errorLog = require('./../library/errorLog');

/**
 * Fetches the helmchart name
 * @param {*} msSlug the slug of the microservice in question
 * @returns {str} Microservice Helm Chart Name.
 * Returns empty string if not set.
 * @author Cein
 */
const fetchMSHelmName = msSlug => new Promise((resolve) => {
  global.adp.microservice.read(msSlug).then((msResponse) => {
    if (msResponse && typeof msResponse.helm_chartname === 'string') {
      resolve(msResponse.helm_chartname.trim());
    } else {
      resolve('');
    }
  }).catch((errorFetchingHelm) => {
    resolve('');
    adp.echoLog('Error in [ adp.microservice.read ] from [ fetchMSHelmName ]', { msSlug, error: errorFetchingHelm }, 500, packName, true);
  });
});

/**
 * builds the first and last spinnaker query
 * @param {string} [helmchartName = ''] the helmchart name of the microservice
 * @return {object} containing the first and last spinnaker querys
 * @return {string} obj.First_Spinnaker_Pipeline_Trigger  first spinnaker query
 * @returns {string} obj.Last_Spinnaker_Pipeline_Success  last spinnaker query
 * @author Cein
 */
const fetchSpinnakerQueries = (helmchartName = '') => {
  let firstSpinHelmUpdate = '';
  let lastSpinHelmUpdate = '';
  if (helmchartName !== '') {
    firstSpinHelmUpdate = `
    -- Helm Lookup
      SELECT top 1
        [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime],
        0 as [Position]
      FROM (
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_F_General]
        WHERE 
          [PipeLineName] = @pipelineNameHelm AND
          [StageEndTime] IS NOT NULL
          ORDER BY [StageEndTime]
        UNION
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_Retriggers_F]
        WHERE 
          [PipeLineName] = @pipelineNameHelm AND
          [StageEndTime] IS NOT NULL
          ORDER BY [StageEndTime]
      ) PipleLineHelmData
      ORDER BY [StageEndTime]
    
      UNION

    `;

    lastSpinHelmUpdate = `
    --- helm
    SELECT TOP(1)
      [PipeLineName],
      [StageName], 
      [StageStatus], 
      [StageEndTime],
      0 AS [Position]
    FROM (
      SELECT TOP (1) 
        [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime] 
      FROM 
        [BICP].[DMADP].[ADP_Pipeline_Executions_F_General]
      WHERE 
        [PipeLineName] = @pipelineNameHelm AND
        [StageStatus] = 'SUCCEEDED'
      ORDER BY [StageEndTime] DESC
    UNION
      SELECT TOP (1) 
        [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime] 
      FROM 
        [BICP].[DMADP].[ADP_Pipeline_Executions_Retriggers_F]
      WHERE 
        [PipeLineName] = @pipelineNameHelm AND
        [StageStatus] = 'SUCCEEDED'
      ORDER BY [StageEndTime] DESC
    ) PipleLineHelmData
    ORDER BY [StageEndTime] DESC

    UNION
    `;
  }

  return {
    First_Spinnaker_Pipeline_Trigger: `
    SELECT TOP (1)
      [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime],
      [Position]
    FROM(
      ${firstSpinHelmUpdate}
      -- Slug lookup
      SELECT top (1)
        [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime],
        1 as [Position]
      FROM (
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_F_General]
        WHERE 
          [PipeLineName] = @pipelineNameSlug AND
          [StageEndTime] IS NOT NULL
          ORDER BY [StageEndTime]
        UNION
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_Retriggers_F]
        WHERE 
          [PipeLineName] = @pipelineNameSlug AND
          [StageEndTime] IS NOT NULL
          ORDER BY [StageEndTime]
      ) PipleLineSlugData
      ORDER BY [StageEndTime]

    ) as PipleLineHelmData
    ORDER BY [Position]`,
    Last_Spinnaker_Pipeline_Success: `
    SELECT TOP (1)
      [PipeLineName],
      [StageName], 
      [StageStatus], 
      [StageEndTime],
      [Position]
    FROM (
      ${lastSpinHelmUpdate}
      --- slug
      SELECT TOP(1)
        [PipeLineName],
        [StageName], 
        [StageStatus], 
        [StageEndTime],
        1 AS [Position]
      FROM (
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_F_General]
        WHERE 
          [PipeLineName] = @pipelineNameSlug AND
          [StageStatus] = 'SUCCEEDED'
        ORDER BY [StageEndTime] DESC
      UNION
        SELECT TOP (1) 
          [PipeLineName],
          [StageName], 
          [StageStatus], 
          [StageEndTime] 
        FROM 
          [BICP].[DMADP].[ADP_Pipeline_Executions_Retriggers_F]
        WHERE 
          [PipeLineName] = @pipelineNameSlug AND
          [StageStatus] = 'SUCCEEDED'
        ORDER BY [StageEndTime] DESC
      ) PipleLineSlugData
      ORDER BY [StageEndTime] DESC
    
    ) as PipleLineData
    ORDER BY [Position]`,
  };
};

module.exports = msSlug => new Promise(async (RESOLVE, REJECT) => {
  const getDataForThisMicroService = {};
  const appendingValue = '-E2E-Flow';
  const pipelineNameSlug = `${msSlug}${appendingValue}`;
  const helmchartName = await fetchMSHelmName(msSlug);
  const queryParamObj = { pipelineNameSlug };
  adp.echoLog('fetching helmchartName ', { 'microservice name': msSlug, 'helm chart name': helmchartName, ...queryParamObj }, 200, packName, true);

  const queryPromises = [];
  const result = {
    First_Spinnaker_Pipeline_Trigger: {},
    Last_Spinnaker_Pipeline_Success: {},
  };
  const sqlQueries = fetchSpinnakerQueries(helmchartName);
  const errors = {
    dbConnectionError: { message: `Unable to connect with Tableau Database for this ${msSlug}`, code: 400 },
  };

  /**
   * This method check if the object is empty or not
   * @param object To be checked if its empty or not
   * @returns true/false
   * @author Omkar Sadegaonkar
   */
  function isEmpty(object) {
    let isEmptyObject = true;
    Object.keys(object).some((field) => {
      if (object[field] && object[field].length > 0) {
        isEmptyObject = false;
        return true;
      }
      return false;
    });
    return isEmptyObject;
  }

  adp.echoLog(`Looking for analytical data for microservice: [ ${getDataForThisMicroService.name} ] <===> ${msSlug} `, null, 200, packName);
  global.mssql.close();
  global.mssql.connect(global.adp.config.mssqldb).then((pool) => {
    const startTime = new Date();
    Object.keys(sqlQueries).forEach((state) => {
      const prepState = new global.mssql.PreparedStatement(pool);

      prepState.input('pipelineNameSlug', global.mssql.VarChar(255));

      if (helmchartName !== '') {
        queryParamObj.pipelineNameHelm = `${helmchartName}${appendingValue}`;
        prepState.input('pipelineNameHelm', global.mssql.VarChar(255));
      }

      queryPromises.push(
        new Promise((queryResolve, queryReject) => {
          prepState.prepare(sqlQueries[state], (prepFailure) => {
            if (prepFailure) {
              queryReject(prepFailure);
              adp.echoLog(`prepare statement failed: ${prepFailure}`, 500, packName, true);
              return;
            }
            prepState.execute(queryParamObj, (queryFailure, queryResult) => {
              if (queryFailure) {
                queryReject(queryFailure);
                adp.echoLog(`MSSQL Query excution failed: ${queryFailure}`, 500, packName, true);
                return;
              }

              result[state] = queryResult.recordset;
              adp.echoLog(`Successfully able to fetch data from MSSQL server: ${JSON.stringify(result)}`, 200, packName, true);
              prepState.unprepare();
              customMetrics.ciTableauRequestMonitoringHistogram.observe(new Date() - startTime);
              queryResolve(queryResult);
            });
          });
        }),
      );
    });
    Promise.all(queryPromises)
      .then(() => {
        if (isEmpty(result)) {
          RESOLVE([]);
        } else {
          RESOLVE(result);
        }
      }).catch((queryPromisesError) => {
        customMetrics.externalErrorCounter.inc();
        const errorCode = queryPromisesError.code || 500;
        const errorMessage = queryPromisesError.message || 'Error occured while fetching the data from mysql';
        const errorObject = {
          error: queryPromisesError,
          queryPromises,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'global.mssql.connect', packName));
      }).finally(() => {
        global.mssql.close();
      });
  }).catch((mssqlConnectionError) => {
    customMetrics.externalErrorCounter.inc();
    adp.echoLog('Error in [ global.mssql.connect ]', { error: mssqlConnectionError, 'microservice name': msSlug }, 500, packName, true);
    global.mssql.close();
    REJECT(errors.dbConnectionError);
  });
  return true;
});
// ============================================================================================= //
