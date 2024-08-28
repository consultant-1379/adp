function makeCommit(id, project, dateStringYMD, insertions, deletions, owner, subjectValue = 'does not vary') {
  return {
    id,
    project,
    branch: 'master',
    hashtags: [],
    change_id: 'doesnotvary',
    subject: subjectValue,
    status: 'MERGED',
    submitted: `${dateStringYMD} 03:06:52.849000000`,
    insertions,
    deletions,
    owner,
  };
}

function sampleCommitter(signum, name, email) {
  return {
    _account_id: 1234567,
    name,
    email,
    signum,
    username: signum,
  };
}

const esupuse = sampleCommitter('esupuse', 'Super User', 'super-user@adp-test.com');
const emesuse = sampleCommitter('emesuse', 'Messy User', 'messy-user@adp-test.com');
const etesuse = sampleCommitter('etesuse', 'Test User', 'test-user@adp-test.com');
const eterase = sampleCommitter('eterase', 'Rase User', 'eterase-user@adp-test.com');
const etesase = sampleCommitter('etesase', 'Sase User', 'etesase-user@adp-test.com');
const etesuse2 = sampleCommitter('etesuse2', 'Test User2', 'test-user2@adp-test.com');
const epesuse = sampleCommitter('epesuse', 'Pest User', 'pest-user@adp-test.com');
const etasase = sampleCommitter('etasase', 'Asase User', 'asase-user@adp-test.com');
const etarase = sampleCommitter('etarase', 'Arase User', 'arase-user@adp-test.com');
const etapase = sampleCommitter('etapase', 'Apase User', 'apase-user@adp-test.com');

const dateFormat = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toJSON().split('T')[0];
};

const todaysDate = dateFormat(1);
const twoMonthsAgoDate = dateFormat(60);
const threeMonthsAgoDate = dateFormat(89);
const fiveMonthsAgoDate = dateFormat(150);
const yearPlusAgoDate = dateFormat(360);

module.exports = {
  mockCommitList: [
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I362e50ff94a4535208d933306247811157c250fc',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      20,
      0,
      esupuse,
      'Comment test 1 \r\r@InnerSource',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I2557c6b5af394e93d07a3472a8d64005b5925598',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      30,
      10,
      emesuse,
      'Comment test 2',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~Ic31f592ab274ba7bbdba11f95ae1884ae3825af3',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      14,
      14,
      etesuse,
      'Comment test 3',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~Ic31f592ab274ba7bbdba11f95ae1884ae3825rtu',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      6,
      0,
      etesuse,
      'Comment test 4',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~Ic31f592ab274ba7bbdba11f95ae1884ae3825fgh',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      0,
      6,
      etesuse,
      'Comment test 5',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~3b08dc27b0b2db2c9c27752399aa1c8d462e64f7',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      12,
      20,
      eterase,
      'Comment test 6',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~52a9aa75d6105353c16e764f36ecd47fb5afbace',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      6,
      5,
      etesase,
      'Comment test 7',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I25ae5d4b998a4d8fa20e6600e8fa2e14cf10e31d',
      'adp-gs/adp-gs-cntrreg',
      twoMonthsAgoDate,
      20,
      10,
      esupuse,
      'Comment test 8',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I2557c6b5af394e93d07a3472a8d64005b5925678',
      'adp-gs/adp-gs-cntrreg',
      twoMonthsAgoDate,
      45,
      12,
      etesuse2,
      'Comment test 9',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I3d48d54f21deaf2e9e6978b40c3858a1db41c7bf',
      'adp-gs/adp-gs-cntrreg',
      threeMonthsAgoDate,
      20,
      10,
      esupuse,
      '@InnerSource Comment test 10',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~Iea281b81042ef421d5d40f6c4825b31450abc461',
      'adp-gs/adp-gs-cntrreg',
      threeMonthsAgoDate,
      20,
      10,
      esupuse,
      'Comment test 11',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~275e5c6d71042a07ddefad23af29e01911d4835d',
      'adp-gs/adp-gs-cntrreg',
      threeMonthsAgoDate,
      20,
      10,
      eterase,
      'Comment test 12',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~225e5c6a71042a07ddefad23af29e01911d48356',
      'adp-gs/adp-gs-cntrreg',
      threeMonthsAgoDate,
      20,
      10,
      etapase,
      'Comment test 13',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~5bb0d5571ab458fc52a0b73ae346c217dca316bc',
      'adp-gs/adp-gs-cntrreg',
      threeMonthsAgoDate,
      20,
      10,
      etesase,
      'Comment test 14',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I7a8cefe0406e51ec4616e5537d946c8d9af9375a',
      'adp-gs/adp-gs-cntrreg',
      fiveMonthsAgoDate,
      40,
      10,
      esupuse,
      'Comment test 15',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I033514c10ac9d1e6a0d21bc3379873aa09450d46',
      'adp-gs/adp-gs-cntrreg',
      fiveMonthsAgoDate,
      10,
      10,
      etesuse,
      'Comment @InnerSource test 16',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~Ia331eb31e1b8280704db4de2b3a0182c0152a0f6',
      'adp-gs/adp-gs-cntrreg',
      fiveMonthsAgoDate,
      20,
      10,
      etesuse,
      'Comment test 17',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I87a26014028807413b58511855dfb1e4bd08dfdd',
      'adp-gs/adp-gs-cntrreg',
      fiveMonthsAgoDate,
      30,
      10,
      etesuse,
      'Comment test 18 \r\r @InnerSource',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I362e51ff94a4535288l933306247811157c250fz',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      20,
      0,
      etesuse2,
      'Comment test 19',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I302e51ff94a4533288l933306247811156c251fi',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      20,
      0,
      epesuse,
      'Comment test 20',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I302e51tf94a4533188l933306247841156c201fp',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      20,
      0,
      etasase,
      'Comment test 21',
    ),
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I302v51tf94a8533188l933306247841156c201fa',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      20,
      0,
      etarase,
      'Comment test 22 \r\r@InnerSource',
    ),

    // Akshay
    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I302v51tf94a8533188l933306247841156c201fa',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      null,
      null,
      etapase,
      'Comment test 23',
    ),

    makeCommit(
      'adp-gs%2Fadp-gs-cntrreg~master~I302v51tf94a8533188l933306247841156c201fa',
      'adp-gs/adp-gs-cntrreg',
      todaysDate,
      10,
      20,
      etarase,
      'Comment test 24',
    ),
  ],
};
