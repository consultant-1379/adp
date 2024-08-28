const packName = 'global.adp.contributions.get';

/**
 * This method is returning error response in standard form
 * @param {string} msg Error message for response
 * @param {number} code Error code for response
 * @returns Error response Object
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const rejectResp = (msg, code) => ({
  msg,
  code,
});

/**
 * This function is used to fetch date before specified number of days
 * @param {number} days in past for which start date is needed
 * @returns Past Date string
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getStartDate = (days) => {
  const date = new Date();
  switch (days) {
    case 1:
      date.setDate(date.getDate() - 1);
      break;
    case 7:
      date.setDate(date.getDate() - 7);
      break;
    case 30:
      date.setMonth(date.getMonth() - 1);
      break;
    case 90:
      date.setMonth(date.getMonth() - 3);
      break;
    case 180:
      date.setMonth(date.getMonth() - 6);
      break;
    case 270:
      date.setMonth(date.getMonth() - 9);
      break;
    case 365: {
      const prevYear = date.getFullYear() - 1;
      if (prevYear < 2020) {
        date.setDate(1);
        date.setMonth(0);
        date.setFullYear(2020);
      } else {
        date.setFullYear(prevYear);
      }
      break;
    }
    default:
      break;
  }
  return date;
};

/**
 * This function is used to make db request call and get contributors data
 * @param {string} id microservice id for which data is needed
 * @param {number} days number of days for which data is needed
 * @param {number} usersCount number of users to which response should be restricted
 * @returns Promise with response users
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const fetchUsers = (id, days, usersCount) => new Promise((RES, REJ) => {
  const gitstatusModel = new global.adp.models.Gitstatus();
  const date = getStartDate(days);
  const dateString = date.toISOString().slice(0, 10);
  gitstatusModel.getCommitsByAssetForPeriod(id, dateString).then((commitsData) => {
    let users = [];
    const signums = commitsData.docs.map(reg => reg.signum).filter((v, i, a) => a.indexOf(v) === i);
    signums.forEach((user) => {
      const userRegistors = commitsData.docs.filter(reg => reg.signum === user);
      users.push(userRegistors.reduce((accVal, curVal) => ({
        commits: accVal.commits + curVal.commits,
        deletions: accVal.deletions + curVal.deletions,
        insertions: accVal.insertions + curVal.insertions,
        name: curVal.name,
        email: curVal.email,
        signum: curVal.signum,
        organisation: curVal.organisation || '',
      })));
    });
    users = users.sort(global.adp.dynamicSort('-insertions'));
    users = users.splice(0, usersCount);
    RES(users);
  })
    .catch((ERROR) => {
      adp.echoLog('Error Fetching contributors from DB', ERROR, 500, packName, true);
      REJ(rejectResp('Error while accessing Database', 500));
    });
});

/**
 * This function is used to get the date in the appropriate format
 * to be shown on FE
 * @param {date} date that needs to be formatted
 * @return formatted date string
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const dateResponse = (date) => {
  const dateResp = date.toDateString().slice(4).split('');
  dateResp.splice(6, 0, ',');
  return dateResp.join('');
};

/**
 * This method is used to prepare parameters for db request
 * @param {Object} REQ API request object
 * @returns Promise with response of contributors
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getContributors = REQ => new Promise((RES, REJ) => {
  const req = REQ;
  let days = 180;
  let users = 99999;
  if (Object.entries(req.query).length === 0) {
    REJ(rejectResp('Microservice id is required', 400));
    return;
  }
  if (typeof req.query.asset !== 'string') {
    REJ(rejectResp('Microservice id should be of type String', 400));
    return;
  }
  const id = req.query.asset;
  const expectedDays = [1, 7, 30, 90, 180, 270, 365];
  if (req.query.days) {
    if (!expectedDays.includes(parseInt(req.query.days, 10))) {
      REJ(rejectResp('Invalid value for Days', 400));
      return;
    }
    days = parseInt(req.query.days, 10);
  }
  if (req.query.users) {
    users = parseInt(req.query.users, 10);
  }

  global.adp.microservice.checkId(id).then(() => {
    fetchUsers(id, days, users).then((contributors) => {
      const respObj = {
        dateFrom: dateResponse(getStartDate(days)),
        dateTo: dateResponse(getStartDate(1)),
        contributors,
      };
      RES(respObj);
    })
      .catch((err) => {
        REJ(err);
      });
  })
    .catch(() => {
      REJ(rejectResp('Invalid Microservice ID', 400));
    });
});

module.exports = {
  getContributors,
  getStartDate,
};
