// ============================================================================================= //
/**
* Unit test for [ adp.microservices.getVersionsForMicroservice ]
* @author Vinod
*/
const proxyquire = require('proxyquire');

class VersionsFromArtifactoryMock {
  /* eslint-disable no-unused-vars */
  async getVersionsFromRepos(_devRepo, _releaseRepo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Version1.yaml', 'version2.yaml']);
      }, 100);
    });
  }
}

class MockMimerController {
  /* eslint-disable no-unused-vars */
  getProduct(_pNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([{ version: '2.0' }, { version: '1.0' }, { version: '3.0' }]);
      }, 100);
    });
  }
}

class mockADP {
  getAssetByIDorSLUG() {
    const mockMicroservice = {
      docs: [{
        _id: 'mock_microsevice_id',
        name: 'Mock mimcroservice',
        slug: 'mockMicroserviceSlug',
        product_number: 'mock_product_number',
        mimer_version_starter: 'mock_mimer_version',
        menu_auto: true,
        repo_urls: {
          development: 'development_url',
          release: 'release_url',
        },
      }],
    };
    return new Promise(RES => RES({ docs: [mockMicroservice] }));
  }
}

const versionFromArtifactoryInstance = new VersionsFromArtifactoryMock();
const versionFromMimerInstance = new MockMimerController();

// ============================================================================================= //
describe('Testing [ adp.microservices.getVersionsForMicroservice ] Behavior.', () => {
  let getVersionsInstance;
  beforeEach(() => {
    global.adp = {
      artifactoryRepo: {
        getVersionsFromRepos: jasmine.createSpy('getVersionsFromRepos').and.returnValue(Promise.resolve(['version1.yaml', 'version2.yaml'])),
      },
      /* eslint-disable-next-line arrow-body-style */
      versionSort: (sortOrder) => {
        return (a, b) => {
          const [aMajor, aMinor] = a.split('.').map(Number);
          const [bMajor, bMinor] = b.split('.').map(Number);

          if (sortOrder === '-version') {
            if (bMajor !== aMajor) {
              return bMajor - aMajor;
            }
            return bMinor - aMinor;
          }

          if (aMajor !== bMajor) {
            return aMajor - bMajor;
          }
          return aMinor - bMinor;
        };
      },
    };
    adp.models = {};
    adp.models.Adp = mockADP;
    adp.config = {};
    adp.config.mimerServer = 'https://mockMimerServer/';
    adp.config.muninServer = 'https://mockMuninServer/';
    // - - - - - - - - - - - - - - - - - - - - //
    adp.mockBehavior = {
      existsSync: true,
      readFileSync: JSON.stringify({
        token: 'mockRefreshToken',
        saved_at: '2022-05-19T09:00:40.093Z',
      }),
      writeFileSync: true,
      mkdirSync: true,
      unlinkSync: true,
      axiosRefreshToken: 0,
      axiosGetProduct: 0,
      axiosGetVersion: 0,
    };
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.erroLog = (E1, E2, E3) => ({ code: E1, message: E2, object: E3 });
    adp.mimer = {};
    adp.mimer.MimerControl = proxyquire('../mimer/MimerControl', {
      './../library/errorLog': adp.erroLog,
    });
    spyOn(global.adp.mimer, 'MimerControl').and.returnValue(versionFromMimerInstance);
    const GetMicroserviceVersions = proxyquire('./getVersionsForMicroservice', {
      './../library/errorLog': adp.erroLog,
    });
    getVersionsInstance = new GetMicroserviceVersions();
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('getMSVersionsFromArtifactory', () => {
    it('should resolve with versions', async () => {
      const devRepo = 'http://localhost:1080/armserver/dev/';
      const releaseRepo = 'http://localhost:1080/armserver/release/';
      const msService = {
        menu: {
          manual: false,
          auto: true,
        },
        repo_urls: {
          release: 'http://localhost:1080/armserver/dev/',
          development: 'http://localhost:1080/armserver/release/',
        },
      };

      const expectedResult = ['version1', 'version2'];
      spyOn(versionFromArtifactoryInstance, 'getVersionsFromRepos').and.returnValue(Promise.resolve(['version1.yaml', 'version2.yaml']));

      getVersionsInstance.getMSVersionsFromArtifactory(devRepo, releaseRepo)
        .then((result) => {
          expect(result).toEqual(expectedResult);
          // expect(getVersionsInstance.getVersionsFromRepos)
          // .toHaveBeenCalledOnceWith( devRepo, releaseRepo, msService, null, 'ALL', true);
        })
        .catch((err) => {
          expect(err).toEqual([]);
        });
    });

    it('should reject with empty array', async () => {
      const devRepo = '';
      const releaseRepo = '';

      const expectedResult = [];
      /* eslint-disable prefer-promise-reject-errors */
      global.adp.artifactoryRepo.getVersionsFromRepos.and.returnValue(Promise.reject([]));

      getVersionsInstance.getMSVersionsFromArtifactory(devRepo, releaseRepo)
        .then((result) => {
          expect(result).toEqual([]);
          // expect(global.adp.artifactoryRepo.getVersionsFromRepos)
          // .toHaveBeenCalledWith(devRepo, releaseRepo, msService, null, 'ALL', false);
        })
        .catch((err) => {
          // console.log('inside catch erro');
          expect(err).toEqual(expectedResult);
        });
    });
  });

  describe('getMSVersionsFromMimer', () => {
    it('Should be able to resolve with sortedversion when getproduct is succesful', async () => {
      const pNumber = 'APR 123 45';
      const expectedSortedVersion = ['1.0', '2.0', '3.0'];

      spyOn(versionFromMimerInstance, 'getProduct').and.returnValue(Promise.resolve([
        { version: '2.0' },
        { version: '1.0' },
        { version: '3.0' },
      ]));

      getVersionsInstance.getMSVersionsFromMimer(pNumber)
        .then((result) => {
          expect(result).toEqual(expectedSortedVersion);
          /* eslint-disable jasmine/prefer-toHaveBeenCalledWith */
          expect(adp.mimer.MimerControl).toHaveBeenCalled();
          expect(adp.mimer.MimerControl.prototype.getProduct).toHaveBeenCalledWith(pNumber);
        })
        .catch((err) => {
          // console.log(err);
        });
    });
  });

  describe('getListOfVersions', () => {
    it('should resolve with the list of version info', async () => {
      const mockId = 'mock_microsevice_id';
      const mockVersionInfo1 = {
        product_number: undefined,
        mimer_version_starter: undefined,
        _id: undefined,
        slug: undefined,
        name: undefined,
        menu_auto: undefined,
        repo_urls: undefined,
        armVersions: [],
        mimerVersions: [],
      };

      spyOn(getVersionsInstance, 'getMSVersionsFromArtifactory').and.returnValue(Promise.resolve([]));
      spyOn(getVersionsInstance, 'getMSVersionsFromMimer').and.returnValue(Promise.resolve([]));

      try {
        getVersionsInstance.getListOfVersionForaMS(mockId)
          .then((result) => {
            expect(result).toEqual(mockVersionInfo1);
          });
      } catch (err) {
        // console.log(err);
      }
    });
  });
});
// ============================================================================================= //
