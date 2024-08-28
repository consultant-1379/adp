const urljoin = require('url-join');
const { mockServer } = require('../test.config.js');
const { mockCommitList } = require('../mockCommitData.js');
const { MockResponseBuilder, jsonMatch, GroupMeta } = require('./mockutils.js');
const { configIntegration } = require('./apiClients');
const config = require('../test.config.js');

// Tests in this suite are executed only during the Collection Setup phase of CI
// This phase runs after deployment and test data generator and before the collection scripts
// Ideally this suite will be used to setup mocks for the collection scripts if required

describe('Basic setups for the git and people finder collectors', () => {
  it('should only get functional users from the functional users endpoint', async (done) => {
    await mockServer.clear({ path: '/a/changes/' });
    await mockServer.clear({ path: '/b/changes/' });
    await mockServer.clear({ path: '/c/changes/' });
    // await mockServer.clear({ path: '/sample/mock-peoplefinder' });

    const builder = new MockResponseBuilder();

    // Setting A
    const jsonResponse = JSON.stringify(mockCommitList);
    await mockServer.mockAnyResponse(builder.matchGetRequest('/a/changes/')
      .expectRawResponse(200, `)]}'\n${jsonResponse}`)
      .create());

    // Setting B
    const magicWordRegExpWithoutAtSymbol = new RegExp(/InnerSource/gim);
    const mockCommitListOnlyWithMagicWord = [];
    let revision = 0;
    mockCommitList.forEach((ITEM) => {
      if (ITEM.subject.match(magicWordRegExpWithoutAtSymbol)) {
        ITEM.revision = `${revision + 1}${revision + 2}${revision + 3}${revision + 4}${revision + 5}`;
        revision = parseInt(revision, 10) + 5;
        if ((`${ITEM.subject}`).indexOf('\r\r') >= 0) {
          ITEM.subject = (`${ITEM.subject.split('\r\r')[0]}`).trim();
        }
        mockCommitListOnlyWithMagicWord.push(ITEM);
      }
    });
    const jsonResponseB = JSON.stringify(mockCommitListOnlyWithMagicWord);
    await mockServer.mockAnyResponse(builder.matchGetRequest('/b/changes/')
      .expectRawResponse(200, `)]}'\n${jsonResponseB}`)
      .create());

    // Setting C
    const objectAnswer = { message: 'Comment test\r\rSomething at second line\r\rTag: @InnerSource\r\rMock Subject.' };
    const jsonResponseC = JSON.stringify(objectAnswer);
    await mockServer.mockAnyResponse(builder.matchGetRequest('/c/changes/.*')
      .expectRawResponse(200, `)]}'\n${jsonResponseC}`)
      .create());

    done();
  });

  it('Preparing variables of the environment for Mock Mimer/Munin/Eridoc/PrimDD.', async (done) => {
    const setupConfigIntegration = await configIntegration(config.baseUrl);
    this.mimerMockServer = setupConfigIntegration.body.mimerServer;
    this.muninMockServer = setupConfigIntegration.body.muninServer;
    this.eridocMockServer = setupConfigIntegration.body.eridocServer;
    this.primDDMockServer = setupConfigIntegration.body.primDDServer;
    done();
  });

  it('should prepare Mimer Token for testing', async (done) => {
    const fileURL = '/mimerserver/authn/api/v2/refresh-token';
    await mockServer.clear({ path: fileURL });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'POST',
        path: fileURL,
        body: { token: 'tokenRefreshTest' },
        headers: { 'Content-Type': ['application/json'], 'X-On-Behalf-Of': ['eadphub'] },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            operation: 'Authentication',
            code: 'OK',
            correlationId: '123',
            messages: [],
            data: {
              access_token: 'accessTokenTest',
              signum: 'eadphub',
              refresh_token: 'tokenRefreshTest',
              ext_expires_in: 1000,
              token_type: 'Bearer',
              expires_in: 1000,
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    }).then(
      () => { done(); },
      () => { done.fail(); },
    ).catch(done.fail);
  });


  it('should prepare one product in Munin', async (done) => {
    const fileURL = '/muninserver/api/v1/products/APR20131';
    await mockServer.clear({ path: fileURL });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURL,
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.1',
                  productVersionUrl: urljoin(this.muninMockServer, '/api/v1/products/APR20131/versions/8.3.1'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Max',
              productNumber: 'APR20131',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    }).then(
      () => { done(); },
      () => { done.fail(); },
    ).catch(done.fail);
  });


  it('should prepare one document version in Munin', async (done) => {
    const fileURL = '/muninserver/api/v1/products/APR20131/versions/8.3.1';
    await mockServer.clear({ path: fileURL });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURL,
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycleStage: 'Released',
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20131',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Max',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '15283-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/1597-APR20131/7',
                      language: 'Uen',
                      revision: 'F',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/1553-APR20131/7',
                      language: 'Uen',
                      revision: 'E',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010364',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXD1010365',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/00664-APR20131/7',
                      language: 'Uen',
                      revision: 'E',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    primTargetIdentifier: {
                      productRstate: 'R1A',
                      referenceProductNumber: '1/FAL1153215',
                    },
                    systemOfRecord: 'PRIM',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/19817-APR20131/7',
                      language: 'Uen',
                      revision: 'E',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/15241-APR20131/7',
                      language: 'Uen',
                      revision: 'F',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/0360-APR20131/7',
                      language: 'Uen',
                      revision: 'E',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '1.9.0',
                      productNumber: 'CXU1010039',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '10921-APR20131/7-5',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '1.9.0',
                      productNumber: 'CXU1010038',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.3.0',
                      productNumber: 'CXU1010642',
                    },
                    systemOfRecord: 'Munin',
                  },
                  {
                    primTargetIdentifier: {
                      productRstate: 'R1A',
                      referenceProductNumber: '3/FAL1153215',
                    },
                    systemOfRecord: 'PRIM',
                  },
                  {
                    primTargetIdentifier: {
                      productRstate: 'R1A',
                      referenceProductNumber: '7/FAL1153215',
                    },
                    systemOfRecord: 'PRIM',
                  },
                  {
                    primTargetIdentifier: {
                      productRstate: 'R1A',
                      referenceProductNumber: '5/FAL1153215',
                    },
                    systemOfRecord: 'PRIM',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    }).then(
      () => { done(); },
      () => { done.fail(); },
    ).catch(done.fail);
  });

  it('should prepare one generic answer from Prim-DD Server', async (done) => {
    const fileURL = '/primddserver/REST/G3/CICD/Document/M/.*';
    await mockServer.clear({ path: fileURL });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURL,
        headers: {
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns:xalan="http://xml.apache.org/xslt" xmlns:corG3="urn:com:ericsson:schema:xml/Gima/cor/abstracts/objects/all/model/g3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><DecimalClassPrefix>1</DecimalClassPrefix><DecimalClass>1553</DecimalClass><DocumentNumber>1/1553-APR 201 31/8</DocumentNumber><DocumentName>USER GUIDE</DocumentName><Itemlockowner>ERIDOC</Itemlockowner><ChangeDate>2022-07-08</ChangeDate><ChangeTime>12:43:01</ChangeTime><ChangedBy>PIERIDOC</ChangedBy><RevState>G</RevState><LanguageCode>en</LanguageCode><VersionChangeDate>2022-07-08</VersionChangeDate><VersionChangeTime>12:43:01</VersionChangeTime><VersionChangedBy>PIERIDOC</VersionChangedBy><VersionCreationDate>2022-07-08</VersionCreationDate><VersionCreationTime>00:00:00</VersionCreationTime><VersionCreatedBy>PIERIDOC</VersionCreatedBy><Versionlockowner>ERIDOC</Versionlockowner><DescriptionDisplayAttribute>Alarm Handler User Guide</DescriptionDisplayAttribute><LanguageIssue><LanguageCode>en</LanguageCode><CreationDate>2022-07-08</CreationDate><CreationTime>00:00:00</CreationTime><ChangeDate>2022-07-08</ChangeDate><ChangeTime>12:43:01</ChangeTime><ChangedBy>PIERIDOC</ChangedBy><CreatedBy>PIERIDOC</CreatedBy><DocumentTitle>Alarm Handler User Guide</DocumentTitle><RepositoryName>ERIDOC</RepositoryName><CertificationState>Certified</CertificationState><DocumentStatus>FREE</DocumentStatus><DocumentStatusChangeDate>2022-07-08</DocumentStatusChangeDate><DocumentStatusChangeTime>00:00:00</DocumentStatusChangeTime><SubjectResponsible>EZHANFR</SubjectResponsible><DocumentResponsible>BDGSLBMDD</DocumentResponsible></LanguageIssue></Document>',
      },
      times: {
        unlimited: true,
      },
    }).then(
      () => { done(); },
      () => { done.fail(); },
    ).catch(done.fail);
  });

  it('should prepare Eridoc document for testing', async (done) => {
    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';
    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFile.pdf`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/pdf'],
          'content-disposition': ['form-data; name=\'mockFile.pdf\'; filename*=UTF-8\'\'mockFile.pdf'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    }).then(
      () => { done(); },
      () => { done.fail(); },
    ).catch(done.fail);
  });


  it('should mock people-finder people search for esupuse user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/esupuse' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/esupuse',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'esupuse',
            email: 'super-user@adp-test.com',
            name: 'esupuse',
            fullName: 'esupuse',
            signType: 'U',
            org: 'ericsson',
            operationalUnit: 'BDGS SA PC PDG IPW&POL CCRC Unit 1',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etesuse user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etesuse' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etesuse',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etesuse',
            email: 'test-user@adp-test.com',
            name: 'etesuse',
            fullName: 'etesuse',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Test User',
            operationalUnit: null,
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for eterase user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/eterase' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/eterase',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'eterase',
            email: 'eterase-user@adp-test.com',
            fullName: 'eterase',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Rase User',
            operationalUnit: 'BDGS SA OSS PDU OSS PDG EEA BUD Dev 3',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etapase user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etapase' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etapase',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etapase',
            email: 'apase-user@adp-test.com',
            fullName: 'Apase User',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Rase User',
            operationalUnit: 'BDGS SA OSS PDU OSS PDG EEA BUD Dev 3',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etesuse2 user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etesuse2' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etesuse2',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etesuse2',
            email: 'test-user2@adp-test.com',
            fullName: 'etesuse2',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Test User2',
            operationalUnit: 'BDGS RAN1 RAN2 RAN3 RAN4',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for epesuse user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/epesuse' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/epesuse',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'epesuse',
            email: 'pest-user@adp-test.com',
            fullName: 'epesuse',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Pest User',
            operationalUnit: 'BNEW DNEW CDS TCI CI Cont Integr',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etasase user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etasase' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etasase',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etasase',
            email: 'asase-user@adp-test.com',
            fullName: 'etasase',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Asase User',
            operationalUnit: 'BNEW GSU CN PIM Test Tech Team F',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etarase user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etarase' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etarase',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etarase',
            email: 'arase-user@adp-test.com',
            fullName: 'etarase',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Arase User',
            operationalUnit: 'RAN0 RAN1 RAN2 RAN3 RAN4',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  // Akshay
  it('should mock people-finder people search for etarase1 user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etarase1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etarase1',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etarase1',
            email: 'etarase1-user@adp-test.com',
            fullName: 'etarase1',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Rase1 User',
            operationalUnit: 'RAN0 RAN1 RAN2 RAN3 RAN4',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etapase1 user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etapase1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etapase1',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etapase1',
            email: 'apase1-user@adp-test.com',
            fullName: 'Apase1 User',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Pase1 User',
            operationalUnit: 'BDGS SA OSS PDU OSS PDG EEA BUD Dev 3',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for etesase1 user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etesase1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etesase1',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etesase1',
            email: 'etesase1-user@adp-test.com',
            fullName: 'etesase1',
            signType: 'U',
            org: 'ericsson',
            displayName: 'Sase1 User',
            operationalUnit: 'BDGS RDPS CD GS Dev LMF',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });


  it('should mock people-finder people search for etesase user', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/etesase' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/etesase',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            profileID: 'etesase',
            chargedCC: null,
            managerProfileID: 'test',
            managerFullName: 'test',
            legalManagerFullName: 'test',
            assistantProfileID: null,
            assistantFullName: null,
            companyName: 'Ericsson Communications Co. Ltd.',
            companyType: 'Ericsson company',
            jobArea: '76 Product Development',
            jobFamily: '7600 Product Development',
            job: 'Developer',
            firstName: 'Test',
            lastName: 'User',
            localFirstName: 'Test',
            localLastName: 'User',
            fullName: 'etesase',
            localName: 'Test User',
            company: 'CBC',
            department: null,
            telephone: null,
            telephoneSource: null,
            mobile: null,
            mobileSource: null,
            fax: null,
            ecnExtension: null,
            email: 'etesase-user@adp-test.com',
            emailSource: 'source: AD Office365',
            displayName: 'Test User',
            roomNumber: 'N/A',
            jobTitle: 'Software Developer',
            positionId: '123123',
            costCentre: '2520016524',
            ericssonConnection: 'Non-Ericsson',
            employeeNumber: '23760009',
            payrollNumber: null,
            status: 'Active',
            initials: null,
            country: 'Ireland',
            street: 'Building A No.1068',
            city: 'Dubline',
            postalCode: '200335',
            countryCode: 'IE',
            buildingNumber: 'SH35',
            operationalUnit: 'BDGS RDPS CD GS Dev LMF',
            organizationalUnitShortName: 'BDGSLFOB',
            organizationalUnitId: '31567073',
            employeeType: 'Workforce',
            isOpManager: 'N',
            hrContact: 'Y',
            signType: 'I',
            nickName: null,
            funcidowner: null,
            distinguishedName: null,
            owner: null,
            member: null,
            mailNickname: null,
            managedBy: null,
            memberOf: null,
            otherTelephone: null,
            info: null,
            assistantPhone: null,
            ownerDisplayname: null,
            objectClass: null,
            objectCategory: null,
            authOrig: null,
            authOrigBL: null,
            unixUid: '7374969',
            destinationIndicator: null,
            srchMOD: 'exact',
            srchONLYMGR: false,
            srchONLYEMP: false,
            functionalUserIdList: false,
            pdlDddlList: false,
            emailHelp: 'email_AD_EBR',
            telephoneHelp: 'no_info',
            mobileHelp: 'no_info',
            faxHelp: 'no_info',
            cityHelp: 'city_EBR',
            zipHelp: 'zip_EBR',
            officeHelp: 'office_EBR',
            countryHelp: 'Country_EBR',
            streetHelp: 'Street_EBR',
            contractEndDateHelp: 'contractEnd_EBR',
            office: 'CN SH35 N/A',
            resignDate: '2021-06-04',
            manager: false,
            modifyTimestamp: '2020-12-24 13:07:11',
            id: 'etesuse',
            funcIdOwner: null,
            operationalManagerFullName: null,
            operationalManager: null,
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock people-finder people search for emesuse user, functional user as empty array returned', async (done) => {
    await mockServer.clear({ path: '/people-finder/people/search/emesuse' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/emesuse',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });

  it('should mock peoplefinder for  Auto MS Test 4, sample-mailer2, etesuse user added to the team', async (done) => {
    const builder = new MockResponseBuilder();

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer2' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer 2', 'esamail', 'sample-mailer2@ericsson.com')],
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer2', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'etesuse', objectCategory: 'CN=Person' },
        ],
      })
      .create());
    done();
  });


  it('should mock peoplefinder token', async (done) => {
    await mockServer.clear({ path: '/token' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'POST',
        path: '/token',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({ access_token: 'sample_token' }),
      },
      times: {
        unlimited: true,
      },
    });
    done();
  });
});
