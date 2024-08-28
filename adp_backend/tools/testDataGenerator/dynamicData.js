// ============================================================================================= //
const packName = 'adp.dynamicData';
// ============================================================================================= //
module.exports = () => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const format = adp.dateLogSystemFormat;
  const todayDateObject = new Date();
  const todaySimpleDate = format(todayDateObject).simple;
  const twoMonthsDateObject = new Date();
  twoMonthsDateObject.setMonth(twoMonthsDateObject.getMonth() - 2);
  const twoMonthsSimpleDate = format(twoMonthsDateObject).simple;
  const threeMonthsDateObject = new Date();
  threeMonthsDateObject.setMonth(threeMonthsDateObject.getMonth() - 3);
  const threeMonthsSimpleDate = format(threeMonthsDateObject).simple;
  const fiveMonthsDateObject = new Date();
  fiveMonthsDateObject.setMonth(fiveMonthsDateObject.getMonth() - 5);
  const fiveMonthsSimpleDate = format(fiveMonthsDateObject).simple;
  const moreThanAYearDateObject = new Date();
  moreThanAYearDateObject.setFullYear(moreThanAYearDateObject.getFullYear() - 1);
  moreThanAYearDateObject.setDate(moreThanAYearDateObject.getDate() - 1);
  const moreThanAYearSimpleDate = format(moreThanAYearDateObject).simple;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const {
    mockArtifactoryAddress,
    mockArtifactoryEnvTag,
    siteAddress,
    environmentID,
    mockServer,
  } = adp.config;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let envTag = 'local';
  if (environmentID) {
    envTag = environmentID;
  } else if (!environmentID && mockArtifactoryEnvTag) {
    envTag = mockArtifactoryEnvTag;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let mockServerString = mockServer;
  const mockServerLastChar = (`${mockServerString}`)[(`${mockServerString}`).length - 1];
  if (mockServerLastChar !== '/') {
    mockServerString = `${mockServerString}/`;
  }
  const dynamicObject = {
    MOCK_ARTIFACTORY_LINK: `${mockArtifactoryAddress}${envTag}/`,
    MOCK_ARTIFACTORY_DEPRECATED_LINK: `${mockArtifactoryAddress}local/`,
    MOCK_ARM_LINK: `${mockServerString}armserver/`,
    MOCK_SITE_ADDRESS: `${siteAddress}/`,
    MOCK_TODAY_DATE: todaySimpleDate,
    MOCK_TWO_MONTHS_AGO_DATE: twoMonthsSimpleDate,
    MOCK_THREE_MONTHS_AGO_DATE: threeMonthsSimpleDate,
    MOCK_FIVE_MONTHS_AGO_DATE: fiveMonthsSimpleDate,
    MOCK_MORE_THAN_A_YEAR_AGO_DATE: moreThanAYearSimpleDate,
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  adp.echoDivider();
  adp.echoLog('AUTOMATED VALUES REPLACEMENT', null, 200, packName, false);
  let text = `Today --------------------------- ${dynamicObject.MOCK_TODAY_DATE}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Two Months ago ---------------------- ${dynamicObject.MOCK_TWO_MONTHS_AGO_DATE}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Three Months ago -------------------- ${dynamicObject.MOCK_THREE_MONTHS_AGO_DATE}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Five Months ago --------------------- ${dynamicObject.MOCK_FIVE_MONTHS_AGO_DATE}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `More than a Year ago ---------------- ${dynamicObject.MOCK_MORE_THAN_A_YEAR_AGO_DATE}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Mock Artifactory Link --------------- ${dynamicObject.MOCK_ARTIFACTORY_LINK}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Mock Artifactory (Deprecated) Link -- ${dynamicObject.MOCK_ARTIFACTORY_DEPRECATED_LINK}`;
  adp.echoLog(text, null, 200, packName, false);
  text = `Mock ARM Link ----------------------- ${dynamicObject.MOCK_ARM_LINK}`;
  adp.echoLog(text, null, 200, packName, false);
  adp.echoDivider();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  return dynamicObject;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
