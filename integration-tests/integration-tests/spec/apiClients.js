/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const urljoin = require('url-join');

const request = require('request');
const apiQueueClass = require('./apiQueue');
const login = require('../endpoints/login.js');
const clientLogin = require('../endpoints/clientLogin.js');
const config = require('../test.config.js');
// node_modules/jasmine-xml-reporter/bin/jasmine.js --junitreport --output=${test_output_dir}
// --config=./${test_dir}/${config_file} ${suitesArg}

/**
   * Getting config for the backend
   * @param baseUrl Base URL
   * @returns response data
   */
function configIntegration(baseUrl) {
  return new Promise((resolve, reject) => {
    request.get({
      url: urljoin(baseUrl, 'configForIntegration'),
      strictSSL: false,
      json: true,
    },
    (error, response, body) => {
      if (error) {
        const errorOBJ = { error, response, body };
        reject(errorOBJ);
      } else {
        resolve({ code: response.statusCode, body });
      }
    });
  });
}

class MockArtifactory {
  constructor() {
    this.apiQueue = new apiQueueClass.ApiQueue();
    this.setup();
  }

  async setup() {
    const setupConfigIntegration = await configIntegration(config.baseUrl);
    const mockArtifactoryAddress = setupConfigIntegration.body.mockArtifactoryAddress;

    const environmentTagByConfigIntegration = setupConfigIntegration
      && setupConfigIntegration.body
      && setupConfigIntegration.body.environmentID
      ? setupConfigIntegration.body.environmentID
      : null;

    const environmentTag = config
      && config.environmentTag
      ? config.environmentTag
      : null;

    this.baseUrl = mockArtifactoryAddress;

    if (environmentTagByConfigIntegration) {
      this.environmentTag = environmentTagByConfigIntegration;
      this.artifactorySetFolderUrl = urljoin(mockArtifactoryAddress, 'setfolder', environmentTagByConfigIntegration);
      this.artifactoryReadFolderUrl = urljoin(mockArtifactoryAddress, environmentTagByConfigIntegration, 'dynamic');
      this.mockRequestLoggerUrl = urljoin(mockArtifactoryAddress, 'requestlogger', environmentTagByConfigIntegration);
    } else if (!environmentTagByConfigIntegration && environmentTag) {
      this.environmentTag = environmentTag;
      this.artifactorySetFolderUrl = urljoin(mockArtifactoryAddress, 'setfolder', environmentTag);
      this.artifactoryReadFolderUrl = urljoin(mockArtifactoryAddress, environmentTag, 'dynamic');
      this.mockRequestLoggerUrl = urljoin(mockArtifactoryAddress, 'requestlogger', environmentTag);
    } else {
      this.environmentTag = 'local';
      this.artifactorySetFolderUrl = urljoin(mockArtifactoryAddress, 'setfolder', 'local');
      this.artifactoryReadFolderUrl = urljoin(mockArtifactoryAddress, 'local', 'dynamic');
      this.mockRequestLoggerUrl = urljoin(mockArtifactoryAddress, 'requestlogger', 'local');
    }
  }

  async setFolder(folderName = 'tc01') {
    const url = urljoin(this.artifactorySetFolderUrl, folderName);
    if (global.extraMessagesOnTerminal === true) {
      console.log('[ MockArtifactory - setFolder ] url ::', url);
    }
    return new Promise((resolve, reject) => {
      request.get({
        url,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          console.log(errorOBJ);
          reject(errorOBJ);
        } else if ((`${body}`).indexOf(folderName) >= 0) {
          if (global.extraMessagesOnTerminal === true) {
            console.log('[ MockArtifactory - setFolder ] Message from Server ::', body);
          }
          resolve(body);
        } else {
          const errorOBJ = { error, response, body };
          console.log(errorOBJ);
          reject(errorOBJ);
        }
      });
    });
  }

  reset() {
    return this.setFolder('tc01');
  }

  async setARMFolder(FOLDERNAME, DONE) {
    const mockArtifactoryReturn = await this.setFolder(FOLDERNAME);
    const expectedMockArtifactoryAnswer = `set folder of ${this.environmentTag} to ${FOLDERNAME}`;
    if (mockArtifactoryReturn !== expectedMockArtifactoryAnswer) {
      expect(mockArtifactoryReturn)
        .withContext(`The mockArtifactory should answer with [ ${expectedMockArtifactoryAnswer} ],\n but got [ ${mockArtifactoryReturn} ] instead.`)
        .toEqual(expectedMockArtifactoryAnswer);
      DONE.fail();
    }
  }
}

/**
* Sample usage:
* const portal = new PortalPrivateAPI();
* const token = await portal.login()
* const apiToken = await readAccessTokenForMS('slug', token)
*/
class PortalPrivateAPI {
  constructor() {
    this.token = '';
    this.userToken = '';
    this.baseUrl = config && config.baseUrl ? config.baseUrl : 'https://localhost:9999/';
    this.mockArtifactory = new MockArtifactory();
    this.limitChar = 5000;
    this.apiQueue = new apiQueueClass.ApiQueue();
  }

  startTestLog(ID) {
    console.log(`\n\nStarting ${ID}`);
  }

  login(user = login.optionsAdmin) {
    return new Promise((resolve, reject) => {
      request.post(user, (error, response, body) => {
        if (error) {
          console.log('====================');
          console.log('Login error :: ', error);
          console.log('====================');
          reject(error);
        } else {
          const authToken = `Bearer ${login.callback(error, response, body)}`;
          this.token = authToken;
          resolve(authToken);
        }
      });
    });
  }

  /**
   * Should login for the test user etesuse
   * @returns {Promise} returning Token
   */
  loginTest() {
    return new Promise((resolve, reject) => {
      request.post(login.optionsTest, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const authToken = `Bearer ${login.callback(error, response, body)}`;
          this.token = authToken;
          resolve(authToken);
        }
      });
    });
  }

  userLogin(user = clientLogin.optionsAdmin) {
    return new Promise((resolve, reject) => {
      request.post(user, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const authToken = `Bearer ${clientLogin.callback(error, response, body)}`;
          this.userToken = authToken;
          resolve(authToken);
          console.log(authToken);
        }
      });
    });
  }

  /**
   * Trigger EGSSync
   * @returns {Promise} return queue status when done
   */
  triggerEGSSync(userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'egssync', 'trigger'),
        headers: { Authorization: userAccessToken },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          const queueID = response.body.queueStatusLink;
          resolve(this.apiQueue.queue(queueID, response.body));
        }
      });
    });
  }

  validateRepoURL(msId, devUrl = this.mockArtifactory.artifactoryReadFolderUrl, releaseUrl = '', userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'validate', 'repo_urls', 'false');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {
          id: msId,
          slug: '',
          repo_urls: { development: devUrl, release: releaseUrl },
          menu_auto: true,
          menu: {
            auto: {
              development: [],
              release: [],
              date_modified: '',
              errors:

                { development: [], release: [] },
            },
            manual:

              { development: [], release: [], date_modified: '' },
          },
        },
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
   * Post Comment
   * @param {string} locationType l
   * @param {string} locationId t
   * @param {string} locationTitle t
   * @param {string} locationPage t
   * @param {string} locationAuthor t
   * @param {string} locationEmail t
   * @param {string} locationSignum t
   * @param {string} commentText t
   * @returns {Promise<object>} c
   * @author Armando Dias [ zdiaarm ]
   */
  async postComment(locationId, locationTitle, locationPage, locationAuthor, locationEmail, locationSignum, commentText, userToken = this.token) {
    const objectToSend = {
      location_id: locationId,
      location_title: locationTitle,
      location_page: locationPage,
      location_author: locationAuthor,
      location_email: locationEmail,
      location_signum: locationSignum,
      comment_text: commentText,
    };
    const url = urljoin(this.baseUrl, 'comments');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: objectToSend,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }


  /**
   * Get Comments
   * @param {string} locationId t
   * @returns {Promise<object>} c
   * @author Armando Dias [ zdiaarm ]
   */
  async getComments(locationId, userToken = this.token) {
    const objectToSend = {
      location_id: locationId,
    };
    const url = urljoin(this.baseUrl, 'comments');
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userToken },
        json: objectToSend,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Put Comment
   * @param {string} locationType l
   * @param {string} commentText t
   * @returns {Promise<object>} c
   * @author Armando Dias [ zdiaarm ]
   */
  async putComment(commentID, commentText, userToken = this.token) {
    const objectToSend = {
      comment_id: commentID,
      comment_text: commentText,
    };
    const url = urljoin(this.baseUrl, 'comments');
    return new Promise((resolve, reject) => {
      request.put({
        url,
        headers: { Authorization: userToken },
        json: objectToSend,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Resolve Comment
   * @param {string} commentID l
   * @param {string} resolveText t
   * @returns {Promise<object>} c
   * @author Armando Dias [ zdiaarm ]
   */
  async resolveComment(commentID, resolveText, userToken = this.token) {
    const objectToSend = {
      comment_id: commentID,
      resolve_text: resolveText,
    };
    const url = urljoin(this.baseUrl, 'comments/resolve');
    return new Promise((resolve, reject) => {
      request.put({
        url,
        headers: { Authorization: userToken },
        json: objectToSend,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Delete Comment
   * @param {string} commentID l
   * @returns {Promise<object>} c
   * @author Armando Dias [ zdiaarm ]
   */
  async deleteComment(commentID, userToken = this.token) {
    const objectToSend = {
      comment_id: commentID,
    };
    const url = urljoin(this.baseUrl, 'comments');
    return new Promise((resolve, reject) => {
      request.delete({
        url,
        headers: { Authorization: userToken },
        json: objectToSend,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Confirms that the Xlsx file is being generated
   * @param {object} microserviceIDs list of microservice ids
   * @param {string} userToken the auth token for the user requesting this
   * @returns {Promise<object>} containing the response code, headers and body of the response
   * @author Cein
   */
  async reportAssetsXlsx(microserviceIDs, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'report', 'assets', 'xlsx');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: microserviceIDs,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Confirms that the Xlsx file is being generated
   * @param {object} assembliesIds list of microservice ids
   * @param {string} userToken the auth token for the user requesting this
   * @returns {Promise<object>} containing the response code, headers and body of the response
   * @author Cein
   */
  async reportAssembliesXlsx(assembliesIds, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'report', 'assembly', 'xlsx');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: assembliesIds,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Should get information about component services for assembly
   * @param {object} assembliesIds list of assemblies ids
   * @param {string} userToken the auth token for the user requesting this
   * @returns {Promise<object>} containing the response code, headers and body of the response
   */
  async getComponentServicesFromAssembly(assembliesIds, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'assembly', 'getComponentServicesFromAssembly');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: assembliesIds,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Get information about group permission
   * @param {string} productNumber product number for which versions should be returned
   * @returns {Promise} returning version list and response.statusCode
   */
  mimerGetVersion(productNumber, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'mimer', 'mimerGetVersion', `${productNumber}`),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Creating microservice based on MS object provided
   * @param {object} msObject full MS object to create
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS Id in case of succesfull creation of MS
   */
  createMS(msObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservice'),
        json: msObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const msData = response
            && response.body
            && response.body.data
            ? response.body.data
            : undefined;
          const microserviceID = msData.id;
          resolve(microserviceID);
        }
      });
    });
  }

  /**
   * Creating microservice based on MS object provided
   * @param {object} msObject full MS object to create
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS Id in case of succesfull creation of MS
   */
  createMSAndWaitTheMSElasticQueue(msObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservice'),
        json: msObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const msData = response
            && response.body
            && response.body.data
            ? response.body.data
            : undefined;
          const id = msData.id;
          await this.apiQueue.multipleQueue(msData);
          resolve(id);
        }
      });
    });
  }

  /**
   * Updating microservice based on MS object provided and wait for queue
   * @param {object} msObject full MS object to create
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS Id in case of succesfull creation of MS
   */
  updateMSAndWaitTheMSElasticQueue(msObject, msId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'microservice', msId),
        json: msObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const msData = response
            && response.body
            && response.body.data
            ? response.body.data
            : undefined;
          await this.apiQueue.multipleQueue(msData);
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating microservice based on MS object provided and wait for queue
   * @param {object} msObject MS id to delete
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS Id in case of succesfull creation of MS
   */
  deleteMSAndWaitTheMSElasticQueue(msId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'microservice', msId),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const msData = response
              && response.body
              && response.body.data
            ? response.body.data
            : undefined;
          await this.apiQueue.multipleQueue(msData);
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating MS based on data provided
   * @param {object} msObject full MS object to update
   * @param {string} msId Id of the microservice to update
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS Id in case of succesfull creation of MS
   */
  updateMS(msObject, msId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'microservice', msId),
        json: msObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get MS, no loging required to get data
   * @param {string} msId Id of the microservice to update
   * @returns {Promise} returning MS code and body
   */
  getMS(msId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'microservice', msId),
        headers: { Authorization: userAccessToken },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Get MS, no loging required to get data
   * @param {string} msId Id of the microservice to update
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS code and body
   */
  deleteMS(msId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'microservice', msId),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Create Permission based on data provided
   * @param {object} permissionObject full object to update
   * @param {string} userAccessToken the token of the user who is updating permission
   * @returns {Promise} returning permisson in case of success
   */
  createDomainPermissionforUser(permissionObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'permission'),
        json: permissionObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
  * Delete Permission based on data provided
  * @param {object} permissionObject full object to update
  * @param {string} userAccessToken the token of the user who is updating permission
  * @returns {Promise} returning permisson in case of success
  */
  deleteDomainPermissionforUser(permissionObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'permission'),
        json: permissionObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
* Requesting preview endpoint for rbac
* @param {string} sourceID source for which preview should be shown
* @param {string} userAccessToken the token of the user who is creating MS
* @returns {Promise} returning respone of duplicate
*/
  rbacPreview(sourceID, userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'rbac', 'preview');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {
          source: sourceID,
          target: [],
          preview: true,
          track: false,
        },
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
* Requesting preview endpoint for rbac for specific target
* @param {string} sourceID source for which preview should be shown
* @param {string} targetID specific resource which need to be checked based on Source ID
* @param {string} userAccessToken the token of the user who is creating MS
* @returns {Promise} returning respone of duplicate
*/
  rbacPreviewforTarget(sourceID, targetID, userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'rbac', 'preview');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {
          source: sourceID,
          target: targetID,
          preview: false,
          track: false,
        },
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating permisson Group based on data provided
   * @param {array} groupsArray array with groups IDs to update user with
   * @param {string} userAccessToken the token of the user who is creating MS
   * @param {string} userSignum signum of the user to be updated with a groups
   * @returns {Promise} returning response status code and body in case of succesfull update  of group
   */
  updateUserWithPermissionGroup(groupsArray, userSignum, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'users', userSignum, 'permissions'),
        json: groupsArray,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
* Requesting wp menu endpoint for specific target
* @param {string} munuSlug menu slug for which menu should be requested
* @param {string} userAccessToken the token of the user who is creating MS
* @returns {Promise} returning respone of menu items
* @author Ludmila Omelchenko
*/
  wpMenus(munuSlug = '', userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'wordpress', 'menus', munuSlug);
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
* Requesting sitemap endpoint for dynamic site map
* @param {string} userAccessToken the token of the user who is creating MS
* @returns {Promise} returning respone of menu items
* @author Githu Jeeva Savy
*/
  siteMap(userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'sitemap');
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Call microservices endpoint using in search
   * @param {string} searchInput search parameters and value
   * @returns {Promise} returning MS code and body
   */
  searchMS(searchInput = '', userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'microservices', `${searchInput}`),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  readAccessTokenForMS(microserviceSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservices-by-owner'),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response) => {
        let apiToken;
        response.body.data.forEach((microservice) => {
          if (microservice.slug === microserviceSlug) {
            apiToken = `Bearer ${microservice.access_token}`;
          }
        });
        if (apiToken) {
          resolve(apiToken);
        } else {
          const errorMSG = 'No access token found for test service ( Microservice ).';
          reject(errorMSG);
        }
      });
    });
  }

  readAccessTokenForAssembly(assemblySlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'assemblies-by-owner'),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        body: 'assembly',
      },
      (error, response) => {
        let apiToken;
        response.body.data.forEach((assembly) => {
          if (assembly.slug === assemblySlug) {
            apiToken = `Bearer ${assembly.access_token}`;
          }
        });
        if (apiToken) {
          resolve(apiToken);
        } else {
          const errorMSG = 'No access token found for test service ( Assembly ).';
          reject(errorMSG);
        }
      });
    });
  }

  readMicroserviceId(microserviceSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservices-by-owner'),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response) => {
        let microserviceId;
        response.body.data.forEach((microservice) => {
          if (microservice.slug === microserviceSlug) {
            microserviceId = microservice._id;
          }
        });
        if (microserviceId) {
          resolve(microserviceId);
        } else {
          const errorMSG = `No Id was found for the service ${microserviceSlug}`;
          reject(errorMSG);
        }
      });
    });
  }

  /**
   * Get asset type by id or slug
   * @param {string} Id_slug Id or slug of the asset
   * @returns {Promise} return
   */
  assetsIdSlug(idSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'assets', idSlug),
        headers: { Authorization: userAccessToken },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  readAccessTokenForAssembly(microserviceSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservices-by-owner'),
        json: { assetType: 'assembly' },
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response) => {
        let apiToken;
        response.body.data.forEach((microservice) => {
          if (microservice.slug === microserviceSlug) {
            apiToken = `Bearer ${microservice.access_token}`;
          }
        });
        if (apiToken) {
          resolve(apiToken);
        } else {
          const errorMSG = 'No access token found for test service.';
          reject(errorMSG);
        }
      });
    });
  }

  readAssemblyId(assemblySlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microservices-by-owner'),
        json: { assetType: 'assembly' },
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response) => {
        let microserviceId;
        response.body.data.forEach((microservice) => {
          if (microservice.slug === assemblySlug) {
            microserviceId = microservice._id;
          }
        });
        if (microserviceId) {
          resolve(microserviceId);
        } else {
          const errorMSG = `No Id was found for the service.${assemblySlug}`;
          reject(errorMSG);
        }
      });
    });
  }

  /**
   * Get tutorial menu for particular user, login is required
   * @returns {Promise} returning MS code and body
   */
  tutorialsMenuGet(userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'tutorialsmenu'),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  tutorialsMenuGetLessontId(userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'tutorialsmenu'),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          const menuTutorial = body.data.menu;
          const tutorialLessons = menuTutorial.filter(obj => obj.menu_item_parent !== '0');
          const tutorialLessonId = tutorialLessons[0].object_id;
          resolve(tutorialLessonId);
        }
      });
    });
  }

  /**
   * get tutorial menu and return tutorial ID based on tutorial title
   * @param {string} tutorialTitle tutorial title for which iobject_id will be returned
   * @returns {Promise} returning tutorial id
   */
  tutorialsMenuGetLessontIdfromTitle(tutorialTitle, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'tutorialsmenu'),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          const menuTutorial = body.data.menu;
          const tutorialLessons = menuTutorial.filter(obj => obj.title === tutorialTitle);
          const tutorialLessonId = tutorialLessons[0].object_id;
          resolve(tutorialLessonId);
        }
      });
    });
  }

  /**
   * should return Tutorial title  based on tutorial slug
   * @param {string} tutorialSlug tutorial Slug for which tutorial title will be returned
   * @returns {Promise}  tutorial  responce code and body with responce
   * @author Ludmila
   */
  tutorialGetTitleFromSlug(tutorialSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'tutorialbyslug', tutorialSlug),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  userProgressPost(widPar, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'userprogress', widPar),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  userProgressDelete(widPar, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'userprogress', widPar),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * should get the number of read tutorials
   * @param {string} tutorialdata data from the tutorialAnalytics endpoint
   * @param {string} tutorial name of the tutorial from tutorialAnalytics for which we need to
   * check number
   * @return {string} tutorialValue number associated with the tutorial from tutorialAnalytics
   * @author John Dolan
   */
  static checkTutorialAnalytics(tutorialdata, tutorial) {
    const analyticsArray = tutorialdata.split(/\r?\n/);
    const metrics = analyticsArray.filter(tutorialMetric => tutorialMetric.startsWith('tutorial_metric'));
    let tutorialValue = 0;
    for (let i = 0; i < metrics.length; i += 1) {
      const metric = metrics[i];
      if (metric.includes(tutorial)) {
        tutorialValue = metric.split(' ').pop();
        return tutorialValue;
      }
    }
    return tutorialValue;
  }


  /**
   * should get tutorialAnalytics endpoint data for the tutorials
   */
  tutorialAnalytics() {
    const url = urljoin(this.baseUrl, 'tutorialAnalytics');
    return new Promise((resolve, reject) => {
      request.get({
        url,
        json: true,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Should clear cache for the endpoint provided,  no login is required
   * @returns {Promise} returning status code
   */
  clearCache(endpoint, userToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'clearcache', endpoint),
        headers: { Authorization: userToken },
        strictSSL: false,
        json: true,
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve({ code: response.statusCode });
        }
      });
    });
  }

  /**
   * Fetches the token for a given ms depending if the user token has
   * server ownership access to the ms
   * @param {string} msId the id or the slug of the microservice in which the integration
   * token is needed.
   * @param {string} userToken the token of the user who has service ownship
   * access to the microservice
   * @returns {Promise} the response object of the integration-token endpoint
   */
  integrationToken(msId, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'microservice', 'integration-token', msId);
    return new Promise((resolve, reject) => {
      request.get({
        url,
        json: true,
        headers: { Authorization: userToken },
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * should return listoptions clean object
   * @param {string} groupId the id if group in listoptions
   * @param {string} userToken the token of the user who
   * @returns {Promise} the response object of the listoptionsClean endpoint
   */
  listoptionsClean(groupIds, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'listoptionsClean');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json: groupIds,
        headers: { Authorization: userToken },
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Generate report for the  list of microservices in Json format
   * @param {Array} microserviceIDs array of MS IDs for which report should be generated
   * @author Ludmila Omelchenko
   */
  reportAssetsJson(microserviceIDs, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'report', 'assets', 'json');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: microserviceIDs,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
   * Generate report for the  list of assemblies in Json format
   * @param {Array} assembliesIDs array of MS IDs for which report should be generated
   * @author Ludmila Omelchenko
   */
  reportAssembliesJson(assembliesIDs, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'report', 'assembly', 'json');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: assembliesIDs,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }


  /**
   * Get data for latests snapshot for an array of MS
   * @param {Array} microserviceIDs array of MS IDs for which snapshot should be generated
   * @param  forceLaunchDate if forceLaunchDate is true, then the innersourceLaunchDate
   * will be set to before the current date, else innersourceLauncDate stays the same
   */
  microserviceLatestSnapshot(microserviceIDs, launchDate = true, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'teamHistory', 'updateByMsList');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json: {
          msList: microserviceIDs,
          forceLaunchDate: launchDate,
        },
        headers: { Authorization: userToken },
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get innersource snapshot information for a particular user
   * @returns {Promise} returning response and body
   * @dateParam date parameter for which snapshot should be returned, can be all, latest or yy-mm-dd
   */
  innersourceUserHistoryGet(userId, dateParam) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersourceuserhistory', `${userId}`, `${dateParam}`),
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get playground information
   * @returns {Promise} returning MS code and body
   */

  playground(_id, step, host = null, stat = null, userAccessToken = this.token) {
    let url;
    if (!host && !stat) {
      url = urljoin(this.baseUrl, `playground?id=${_id}&step=${step}`);
    } else if (!host) {
      url = urljoin(this.baseUrl, `playground?id=${_id}&step=${step}&status=${stat}`);
    } else {
      url = urljoin(this.baseUrl, `playground?id=${_id}&step=${step}&host=${host}&status=${stat}`);
    }
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get innersource information for particular microservice
   * @returns {Promise} returning MS code and body
   */
  innersourceMSGet(microserviceId, period, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'analytics', `innersource?asset=${microserviceId}&days=${period}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * To get the git status by tag
   * @returns {Promise} returning response and body
   * @param innersourceGitType is for git type gitstatus/gitstatusbytag should be passed
   * to get the response from which database collection
   * @author Ravikiran G  [ZGARSRI]
   */
  gitStatusByTag(innersourceGitType, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'contributions', 'mode', innersourceGitType),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Delete innersource commits data for a particular user
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, signum, msslug parameter for which commits should be deleted
  */
  innersourceUserHistoryDelete(startDate, endDate, userSignum, msSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, `innersourcebydaterangesignummsid?startdate=${startDate}&enddate=${endDate}&signum=${userSignum}&msslug=${msSlug}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  innersourceUserHistoryDeleteInvalid(endDate, userSignum, msSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, `innersourcebydaterangesignummsid?enddate=${endDate}&signum=${userSignum}&msslug=${msSlug}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Reads innersource top contributors data for the given paramteres
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopContributor(fromDate, toDate, domain, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `contributors?fromDate=${fromDate}&toDate=${toDate}&domain=${domain}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
     * Reads innersource top contributors data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopContributorSkippedDate(toDate, domain, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `contributors?toDate=${toDate}&domain=${domain}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
     * Reads innersource top contributors data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopContributorSkippedDomain(fromDate, toDate, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `contributors?fromDate=${fromDate}&toDate=${toDate}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Reads innersource top contributors data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopContributorNoParameters(limit = '', userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', 'contributors', limit),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  // organisation

  /**
     * Reads innersource top organisations data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopOrganisationNoParameters(limit = '', userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', 'organisations', limit),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Reads innersource top organisations data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopOrganizationSkippedDate(toDate, domain, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `organisations?toDate=${toDate}&domain=${domain}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
     * Reads innersource top organisations data for the given paramteres (skipped parameters)
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopOrganisationSkippedDomain(fromDate, toDate, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `organisations?fromDate=${fromDate}&toDate=${toDate}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Reads innersource top organisation data for the given paramteres
     * @author Akshay Mungekar
     * @returns {Promise} returning response and body
     * @commitsDeleteParameters date, domain, serviceCategory parameter for data should be displayed
  */
  innersourceGetTopOrganisation(fromDate, toDate, domain, serviceCategory, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'innersource', `organisations?fromDate=${fromDate}&toDate=${toDate}&domain=${domain}&service_category=${serviceCategory}`),
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  // ============================================================================================= //

  /**
   * Creating permisson Group based on object provided
   * @param {object} groupObj full Group object to create
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning response status code and body
   */
  createPermissionGroup(groupObj, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'rbac', 'group'),
        json: groupObj,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating permisson Group based on data provided
   * @param {object} groupObj full MS object to update
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning response status code and body in case of succesfull update  of group
   */
  updatePermissionGroup(groupObj, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'rbac', 'group'),
        json: groupObj,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get information about group permission
   * @param {string} groupIdName Id or name of the group to update
   * @returns {Promise} returning MS code and body
   */
  getPermissionGroup(groupIdName, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'rbac', groupIdName),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get information about group permission
   * @param {string} groupName name of the group for which ID need to be returned
   * @returns {Promise} returning MS code and body
   */
  getPermissionGroupID(groupName, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'rbac', `group?name=${groupName}`),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const groupID = response.body.data[0]._id;
          resolve(groupID);
        }
      });
    });
  }

  /**
   * Delete group of permissions
   * @param {string} groupId Id of the microservice to update
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning MS code and body
   */
  deletePermissionGroup(groupId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'rbac', 'group', groupId),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Creating duplicate group based on parameters
   * @param {string} groupId from which to be duplicated
   * @param {string} userAccessToken the token of the user who is creating MS
   * @returns {Promise} returning respone of duplicate
   */
  duplicatePermissionGroup(groupId, newName, userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'rbac', 'group', 'duplicate');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {
          _id: groupId,
          name: newName,
        },
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Creating user based on object provided
   * @param {object} userObj full user object to create
   * @param {string} userAccessToken the token of the user in action
   * @returns {Promise} returning response status code and body
   */
  createUser(userObj, id, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'user', id),
        json: userObj,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get user information
   * @param {string} signum Id or name of the user
   * @returns {Promise} returning user status code and body
   */
  getUser(signum, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'user', signum),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Provide information about the user by ID
   * @param {Array} signumArray array of users sugnums for which data should be returned
   * @author Ludmila Omelchenko
   */
  fetchUsersBySignum(signumArray, userToken = this.token) {
    const url = urljoin(this.baseUrl, 'fetchUsersBySignum');
    return new Promise((resolve, reject) => {
      request.post({
        url,
        headers: { Authorization: userToken },
        json: signumArray,
        strictSSL: false,
      }, (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get wordpress contents from a proxy endpoint with a clean request
   * @param {string} articleSlug slug of the article
   * @param {string} parentSlug slug of the parent of the article
   * @param {string} userAccessToken Optional. Default value will be the loaded token.
   * @returns {Promise} returning content status code and body
   * @author Akshay Mungekar
   */
  getWordpressContentClean(articleSlug, parentSlug, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'wpcontent', parentSlug, articleSlug),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get wordpress contents from a proxy endpoint using parameters
   * @param {string} customURL If you want to request from another WP endpoint. Could be undefined.
   * @param {string} articleSlug slug of the article
   * @param {string} articleType type of the article - page, post
   * @param {Array} parentSlugArray Array with the slugs of the parents
   * @param {string} userAccessToken Optional. Default value will be the loaded token.
   * @returns {Promise} returning wpcontent status code and body
   * @author Akshay Mungekar
   */
  getWordpressContentParameters(customURL = undefined, articleSlug, articleType, parentSlugArray, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      let theNewURL;
      if (customURL === undefined) {
        theNewURL = urljoin(this.baseUrl, 'wpcontent', `?articleSlug=${articleSlug}&articleType=${articleType}&parentSlugArray=${parentSlugArray}`);
      } else {
        theNewURL = urljoin(this.baseUrl, 'wpcontent', customURL, `?articleSlug=${articleSlug}&articleType=${articleType}&parentSlugArray=${parentSlugArray}`);
      }
      request.get({
        url: theNewURL,
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get wordpress contents from a proxy endpoint using parameters
   * @param {string} customURL If you want to request from another WP endpoint. Could be undefined.
   * @param {string} tutorialSlug slug of the article
   * @param {Array} parentSlugArray Array with the slugs of the parents
   * @param {string} userAccessToken Optional. Default value will be the loaded token.
   * @returns {Promise} returning wpcontent status code and body
   * @author Ludmila Omelchenko
   */
  getWordpressTutorialContentParameters(tutorialSlug, parentSlugArray, customURL = 'fetchTutorialPageValidatePath', userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      const theNewURL = urljoin(this.baseUrl, 'wpcontent', customURL, `?tutorialSlug=${tutorialSlug}&parentSlugArray=${parentSlugArray}`);
      request.get({
        url: theNewURL,
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get wordpress contents from a proxy endpoint using parameters, but skipping some parameters.
   * @param {string} customURL If you want to request from another WP endpoint. Could be undefined.
   * @param {string} articleSlug slug of the article
   * @param {string} articleType type of the article - page, post
   * @param {string} parentSlugArray parent slug of the article
   * @param {string} userAccessToken Optional. Default value will be the loaded token.
   * @returns {Promise} returning wpcontent status code and body
   * @author Akshay Mungekar
   */
  getWordpressContentSkipParameters(customURL = undefined, articleSlug, parentSlugArray, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      let theNewURL;
      if (customURL === undefined) {
        theNewURL = urljoin(this.baseUrl, 'wpcontent', `?articleSlug=${articleSlug}&parentSlugArray=${parentSlugArray}`);
      } else {
        theNewURL = urljoin(this.baseUrl, 'wpcontent', customURL, `?articleSlug=${articleSlug}&parentSlugArray=${parentSlugArray}`);
      }
      request.get({
        url: theNewURL,
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating user based on data provided
   * @param {object} userObj full user object to update
   * @param {string} id id or user signum
   * @param {string} userAccessToken the token of the user in action
   * @returns {Promise} returning response status code and body in case of succesfull update  of user
   */
  updateUser(userObj, id, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'user', id),
        json: userObj,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }


  /**
   * Search using Elastic Search endpoint
   * @param {string} keyword A string with the content to search
   * @param {number} page The number of the page
   * @param {number} pagesize How many registers per page
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Armando Dias [zdiaarm]
   */
  elasticSearch(keyword = '', page = 1, pagesize = 20, userAccessToken = this.token) {
    const url = `${urljoin(this.baseUrl, 'contentSearch')}?keyword=${keyword}&page=${page}&pagesize=${pagesize}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Search using Elastic Search endpoint
   * @param {string} keyword A string with the content to search
   * @param {number} page The number of the page
   * @param {string} type Page or Tutorials/ MS
   * @param {number} pagesize How many registers per page
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Liudmyla Omelchenko
   */
  elasticSearchwithType(keyword = '', type = 'page', page = 1, pagesize = 20, userAccessToken = this.token) {
    const url = `${urljoin(this.baseUrl, 'contentSearch')}?keyword=${keyword}&type=${type}&page=${page}&pagesize=${pagesize}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Search using realtime-contentsearch Elastic Search endpoint
   * @param {string} keyword A string with the content to search
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Ludmila Omelchenko
   */
  realTimeElasticSearch(keyword = '', userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'realtime-contentsearch', `?keyword=${keyword}`);
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /** DEPRECATED - use microserviceDocumentationSyncReportQueue instead.
   * Should call documentation sync and generate report for specific microservices
   * @param {array} msArray array with microservice IDs to generate report
   * @param {string} userAccessToken the token of the user who is calling endpoint
   * @returns {Promise} returning response status code and body in case of succesfull report generation
   */
  microserviceDocumentationSyncReport(msArray, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'microserviceElasticSearchDocumentationForceSync'),
        json: msArray,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else if (Array.isArray(response.body)) {
          const links = [];
          response.body.forEach((ITEM) => {
            links.push(ITEM.queueStatusLink);
          });
          resolve(links);
        } else if (response && response.body && response.body.queueStatusLink) {
          const queueID = response.body.queueStatusLink;
          resolve(queueID);
        } else {
          resolve(body);
        }
      });
    });
  }

  /**
   * Should call documentation sync and generate report for specific microservices
   * @param {array} msArray array with microservice IDs to generate report
   * @param {string} userAccessToken the token of the user who is calling endpoint
   * @returns {Promise} returning response status code and body in case of succesfull report generation
   */
  microserviceDocumentationSyncReportQueue(msArray, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, '/elasticSearchSync/msDocForceSync'),
        json: msArray,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else if (Array.isArray(response.body)) {
          const links = [];
          response.body.forEach((ITEM) => {
            const result = this.apiQueue.queue(ITEM.queueStatusLink, ITEM);
            links.push(result);
          });
          Promise.all(links)
            .then((RESULTS) => {
              resolve(RESULTS);
            })
            .catch((ERROR) => {
              resolve(ERROR);
            });
        } else if (response && response.body && response.body.queueStatusLink) {
          const queueID = response.body.queueStatusLink;
          resolve(this.apiQueue.queue(queueID, response.body));
        } else {
          resolve(body);
        }
      });
    });
  }

  /**
   * Search using Elastic Search endpoint
   * @param {string} keyword A string with the content to search
   * @param {number} page The number of the page
   * @param {string} type Page or Tutorials/ MS
   * @param {number} pagesize How many registers per page
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Liudmyla Omelchenko
   */
  documentElasticSearchOneResult(keyword = '', type = 'ms_documentation', page = 1, pagesize = 20, assetSlug = '', titleSlug = '', version = '', userAccessToken = this.token) {
    const url = `${urljoin(this.baseUrl, 'contentSearch')}?keyword=${keyword}&pagesize=${pagesize}&page=${page}&type=${type}&title_slug=${titleSlug}&asset_slug=${assetSlug}&version=${version}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Just apply a JSON.stringfy and set a maximum limit.
   * @param {object} OBJ A JSON Object.
   * @returns {string} The string
   * @author Armando Dias [zdiaarm]
   */
  answer(OBJ) {
    const str = JSON.stringify(OBJ, null, 2);
    if (str.length > this.limitChar) {
      return `${str.substr(0, this.limitChar)}...`;
    }
    return str;
  }

  /**
   * Sync Elastic Search Database while doing document fetch
   * @param {string} assetSlug microservice slug
   * @param {string} version version of the document
   * @param {string} catergorySlug catergory Slug of the document
   * @param {string} titleSlug title slug of the document
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Githu Jeeva Savy
   */
  microserviceDocumentFetch(assetSlug, version, catergorySlug, titleSlug, userAccessToken = this.token) {
    const url = `${config.baseUrl}document/${assetSlug}/${version}/${catergorySlug}/${titleSlug}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
          return;
        }
        resolve({ code: response.statusCode, body });
      });
    });
  }

  /**
   * Sync Elastic Search Database while doing document fetch
   * @param {string} assetSlug microservice slug
   * @param {string} version version of the document
   * @param {string} catergorySlug catergory Slug of the document
   * @param {string} titleSlug title slug of the document
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Githu Jeeva Savy
   */
  elasticDBSyncAfterDocumentFetch(assetSlug, version, catergorySlug, titleSlug, userAccessToken = this.token) {
    const url = `${config.baseUrl}document/${assetSlug}/${version}/${catergorySlug}/${titleSlug}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
          return;
        }
        const result = response && response.body ? response.body : response;
        if (result && result.queueStatus) {
          await this.apiQueue.queue(result.queueStatus, response.body);
          resolve(result);
          return;
        }
        resolve(result);
      });
    });
  }

  /**
   * Sync Elastic Search Database while doing document fetch
   * @param {string} assetSlug microservice slug
   * @param {string} version version of the document
   * @param {string} catergorySlug catergory Slug of the document
   * @param {string} titleSlug title slug of the document
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Liudmyla  Omelchenko
   */
  documentGet(assetSlug, version, catergorySlug, titleSlug, userAccessToken = this.token) {
    const url = `${config.baseUrl}document/${assetSlug}/${version}/${catergorySlug}/${titleSlug}`;
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Search using Elastic Search endpoint
   * @param {number} page The number of the page
   * @param {number} pagesize How many registers per page
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Liudmyla Omelchenko
   */
  documentSyncStatus(userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, 'documentSyncStatus');
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Checking the Document Sync Status Details endpoint
   * @param {string} objective The queue objective
   * @param {string} userAccessToken If you want to use another token
   * @returns {Promise} Return a promise with the result of the request
   * @author Liudmyla Omelchenko - updated by Armando Dias
   */
  documentSyncStatusDetails(objective, userAccessToken = this.token) {
    const url = urljoin(this.baseUrl, `documentSyncStatusDetails?objective=${objective}`);
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
        json: {},
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Get information about documentation per microsevice per version
   * @param {string} msIDSlug Id or slug of the microservice
   * @param {string} version version of the micriservice documentation to retrieve
   * @returns {Promise} returning MS code and body
   */
  getDocumentByVersion(msIDSlug = '', version = '', userAccessToken = this.userToken) {
    return new Promise((resolve, reject) => {
      request.get({
        url: `${urljoin(this.baseUrl, 'clientDocs', 'microservice')}/${msIDSlug}/${version}`,
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Creating assembly based on assembly object provided
   * @param {object} assemblyObject full assembly object to create
   * @param {string} userAccessToken the token of the user who is creating assembly
   * @returns {Promise} returning assembly Id in case of succesfull creation of assembly
   */
  createAssembly(assemblyObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'assembly'),
        json: assemblyObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const msData = response
            && response.body
            && response.body.data
            ? response.body.data
            : undefined;
          const assemblyID = msData.id;
          resolve(assemblyID);
        }
      });
    });
  }

  /**
   * Creating assembly based on assembly object provided
   * @param {object} assemblyObject full assembly object to create
   * @param {string} userAccessToken the token of the user who is creating assembly
   * @returns {Promise} returning assembly Id in case of succesfull creation of assembly
   */
  createAssemblyFail(assemblyObject, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.post({
        url: urljoin(this.baseUrl, 'assembly'),
        json: assemblyObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
   * Updating assembly based on data provided
   * @param {object} assemblyObject full assembly object to update
   * @param {string} assemblyId Id of the assembly to update
   * @param {string} userAccessToken the token of the user who is creating assembly
   * @returns {Promise} returning assembly Id in case of succesfull creation of assembly
   */
  updateAssembly(assemblyObject, assemblyId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.put({
        url: urljoin(this.baseUrl, 'assembly', assemblyId),
        json: assemblyObject,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /**
     * Get assembly, no loging required to get data
     * @param {string} assemblyId Id of the assembly to update
     * @returns {Promise} returning assembly code and body
     */
  getAssembly(assemblyId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.get({
        url: urljoin(this.baseUrl, 'assembly', assemblyId),
        headers: { Authorization: userAccessToken },
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, headers: response.headers, body });
        }
      });
    });
  }

  /**
     * Get assembly, no loging required to get data
     * @param {string} assemblyId Id of the assembly to update
     * @param {string} userAccessToken the token of the user who is creating assembly
     * @returns {Promise} returning assembly code and body
     */
  deleteAssembly(assemblyId, userAccessToken = this.token) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: urljoin(this.baseUrl, 'assembly', assemblyId),
        json: true,
        headers: { Authorization: userAccessToken },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }
}

class PortalPublicAPI {
  constructor(version = 'v1') {
    const serverBaseUrl = config.baseUrl;
    this.publicBaseUrl = urljoin(serverBaseUrl, 'integration', version);
    this.queueDebugMode = true;
    this.apiQueue = new apiQueueClass.ApiQueue();
  }

  /**
  * Calls documentrefresh endpoint to update a microservices automated documentation
  * @param {string} token the token for the microservice in which to update
  * @param {string} specificVersion a version label can be used to trigger
  *                 the update of just one version
  * @returns {Promise} the repsonse object for the documentrefresh endpoint
  */
  documentRefresh(token, specificVersion = null) {
    let url;
    if (!specificVersion) {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh');
    } else {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh', encodeURIComponent(specificVersion));
    }
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json: true,
        headers: { Authorization: token },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, response, body };
          reject(errorOBJ);
        } else {
          resolve({ code: response.statusCode, body });
        }
      });
    });
  }

  /** DEPRECATED because of the Queue System. Use documentRefreshIDQueue instead.
  * Calls documentrefresh endpoint to update a microservices automated documentation
  * @param {string} token the token for the microservice in which to update
  * @param {string} specificVersion a version label can be used to trigger
  *                 the update of just one version
  * @returns {Promise} the repsonse object for the documentrefresh endpoint
  */
  documentRefreshID(token, specificVersion = null) {
    let url;
    if (!specificVersion) {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh');
    } else {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh', specificVersion);
    }
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json: true,
        headers: { Authorization: token },
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
        } else {
          const queueID = response.body.queueStatusLink;
          resolve(queueID);
        }
      });
    });
  }

  /**
  * Calls the queued documentrefresh endpoint to update
  * a microservices automated documentation
  * This method resolves the queued request working
  * together with this.queue().
  * @param {string} TOKEN the token for the microservice in which to update
  * @param {string} specificVersion a version label can be used to trigger
  *                 the update of just one version
  * @returns {Promise} the final result, after the queue finished the request.
  */
  documentRefreshIDQueue(TOKEN, specificVersion = null) {
    let url;
    if (!specificVersion) {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh');
    } else {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh', specificVersion);
    }
    const token = TOKEN.replace(/^(Bearer )/, '');
    const urlWithToken = `${url}?access_token=${token}`;
    return new Promise((resolve, reject) => {
      request.post({
        url: urlWithToken,
        json: true,
        strictSSL: false,
      },
      (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
          return;
        }
        const result = response && response.body ? response.body : response;
        if (result && result.queueStatusLink) {
          resolve(this.apiQueue.queue(result.queueStatusLink, response.body));
          return;
        }
        resolve(result);
      });
    });
  }

  /**
  * Calls the queued documentrefresh endpoint to update
  * a microservices automated documentation
  * This method resolves the queued request working
  * together with this.queue().
  * @param {string} TOKEN the token for the microservice in which to update
  * @param {string} specificVersion a version label can be used to trigger
  *                 the update of just one version
  * @returns {Promise} the final result, after the queue finished the request.
  */
  documentRefreshIDMultipleQueue(TOKEN, specificVersion = null) {
    let url;
    if (!specificVersion) {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh');
    } else {
      url = urljoin(this.publicBaseUrl, 'microservice', 'documentrefresh', specificVersion);
    }
    const token = TOKEN.replace(/^(Bearer )/, '');
    const urlWithToken = `${url}?access_token=${token}`;
    return new Promise((resolve, reject) => {
      request.post({
        url: urlWithToken,
        json: true,
        strictSSL: false,
      },
      async (error, response, body) => {
        if (error) {
          const errorOBJ = { error, code: response.statusCode, body };
          reject(errorOBJ);
          return;
        }
        const result = response && response.body ? response.body : response;
        if (result && result.queueStatusLink) {
          await this.apiQueue.multipleQueue(result);
          resolve({ code: response.statusCode, body });
          return;
        }
        resolve(result);
      });
    });
  }

  /**
  * Calls documentrefresh report for a microservice
  * @param {string} reportLink link for the report generated from documentRefreshID
  * @returns {Promise} the repsonse object for the documentrefresh report endpoint
  */
  documentRefreshReport(url) {
    return new Promise((resolve, reject) => {
      const action = () => {
        request.get({
          url,
          strictSSL: false,
          json: {},
        },
        (error, response, body) => {
          if (error) {
            const errorOBJ = { error, response, body };
            return reject(errorOBJ);
          }
          if (body && body.job && body.job.status < 100 && global.documentRefreshReport.attempts < 3) {
            global.documentRefreshReport.attempts += 1;
            return action(global.documentRefreshReport.attempts);
          } if (global.documentRefreshReport.attempts > 3) {
            const errorMsg = 'Maximum global.documentRefreshReport.attempts reached!';
            return reject(errorMsg);
          }
          return resolve({ code: response.statusCode, body });
        });
      };
      global.documentRefreshReport = {};
      global.documentRefreshReport.attempts = 0;
      action();
    });
  }

  /**
      * Reads an object with multilevels without break the code case undefined/null/invalid.
      * @param {object} ROOTOBJECT The root of the JSON object to be read.
      * @param {string} STEPS The expected path of the objects/subobjects.
      * @param {any} DVALUE Default value the function should return case invalid. Default null.
      * @returns {any} The value found or the default value case invalid.
      * Examples:
      * readObject(response, 'body.job.result.dbResponse.name');
      * readObject(response, 'body.job.result.yamlErrors.development', undefined);
      */
  readObject(ROOTOBJECT, STEPS, DVALUE = null) {
    try {
      const steps = STEPS.split('.');
      const stepsLength = steps.length;
      let stepObject = ROOTOBJECT;
      for (let index = 0; index < stepsLength; index += 1) {
        const obj = stepObject ? stepObject[steps[index]] : null;
        if (!obj) {
          return DVALUE;
        }
        stepObject = obj;
        if ((index + 1) >= stepsLength) {
          return stepObject;
        }
      }
      return DVALUE;
    } catch (error) {
      return error;
    }
  }
}

module.exports = {
  MockArtifactory,
  PortalPublicAPI,
  PortalPrivateAPI,
  configIntegration,
};
