/* eslint-disable camelcase */
const urljoin = require('url-join');

class MimerTemplates {
  // =========================================================================================== //

  constructor(MIMER, MUNIN, ERIDOC, PRIMDD) {
    this.mimerMockServer = MIMER;
    this.muninMockServer = MUNIN;
    this.eridocMockServer = ERIDOC;
    this.primDDMockServer = PRIMDD;
  }

  // =========================================================================================== //

  mockProductMimer(PRODUCTNUMBER, MSNAME, VERSIONSARRAY) {
    const obj = {
      httpRequest: {
        method: 'GET',
        path: `/muninserver/api/v1/products/${PRODUCTNUMBER}`,
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: {
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [],
              productVersioningSchema: 'SemVer2.0.0',
              designation: `${MSNAME}`,
              productNumber: `${PRODUCTNUMBER}`,
              designResponsible: 'BDGSLBM',
            },
          }],
        },
      },
      times: {
        unlimited: true,
      },
    };
    if (Array.isArray(VERSIONSARRAY)) {
      VERSIONSARRAY.forEach((VERSION) => {
        const versionObj = {
          productVersionLabel: `${VERSION}`,
          productVersionUrl: urljoin(`${this.muninMockServer}`, `api/v1/products/${PRODUCTNUMBER}/versions/${VERSION}`),
        };
        obj.httpResponse.body.results[0].data.productVersions.push(versionObj);
      });
    }
    obj.httpResponse.body = JSON.stringify(obj.httpResponse.body);
    return obj;
  }

  // =========================================================================================== //

  mockVersionProductMimer(PRODUCTNUMBER, MSNAME, VERSION, TYPE = 0, LIFECYCLE = 'Released') {
    this.something = 1;
    const obj = {
      httpRequest: {
        method: 'GET',
        path: `/muninserver/api/v1/products/${PRODUCTNUMBER}/versions/${VERSION}`,
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: {
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: `${LIFECYCLE}`,
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: `${VERSION}`,
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: `${PRODUCTNUMBER}`,
              },
              description: 'TODO Replace this text.',
              designation: `${MSNAME}`,
              relations: {
                documentedBy: null,
              },
              artifactCategory: 'Abstract',
            },
          }],
        },
      },
      times: {
        unlimited: true,
      },
    };

    let documentedBy;

    switch (TYPE) {
      case 1:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `15283-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 2:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `1/15241-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'F',
            },
            systemOfRecord: 'Eridoc',
          },
        ];
        break;
      case 3:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `10921-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 4:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `19817-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 5:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `0360-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 6:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `10111-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 7:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `10112-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 8:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `15241-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
        ];
        break;
      case 9:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `1/1597-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
        ];
        break;
      case 10:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `19817-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
        ];
        break;
      case 11:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `1553-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
        ];
        break;
      case 12:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `15519-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
        ];
        break;
      case 13:
        documentedBy = [
          {
            muninTargetIdentifier: {
              productVersionLabel: '7.5.0',
              productNumber: 'CXU1010087',
            },
            systemOfRecord: 'Munin',
          },
        ];
        break;
      case 14:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `15283-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15284-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15285-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15286-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15287-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15288-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15289-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15290-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `15291-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
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
            primTargetIdentifier: {
              productRstate: 'R1A',
              referenceProductNumber: '1/FAL1153215',
            },
            systemOfRecord: 'PRIM',
          },
          {
            muninTargetIdentifier: {
              productVersionLabel: '1.9.0',
              productNumber: 'CXU1010039',
            },
            systemOfRecord: 'Munin',
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
        ];
        break;
        case 15:
          documentedBy = [
            {
              eridocTargetIdentifier: {
                documentNumber: `15519-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `19817-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `15283-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `10921-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `00664-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `0360-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `15241-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `1553-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
            {
              eridocTargetIdentifier: {
                documentNumber: `1597-${PRODUCTNUMBER}/7-6`,
                language: 'Uen',
                revision: 'A',
              },
              systemOfRecord: 'Eridoc',
            },
          ];
        break;
      default:
        documentedBy = [
          {
            eridocTargetIdentifier: {
              documentNumber: `15283-${PRODUCTNUMBER}/7-6`,
              language: 'Uen',
              revision: 'A',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `1/1597-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'F',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `1/1553-${PRODUCTNUMBER}/7`,
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
              documentNumber: `1/00664-${PRODUCTNUMBER}/7`,
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
              documentNumber: `1/19817-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'E',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `1/15241-${PRODUCTNUMBER}/7`,
              language: 'Uen',
              revision: 'F',
            },
            systemOfRecord: 'Eridoc',
          },
          {
            eridocTargetIdentifier: {
              documentNumber: `1/0360-${PRODUCTNUMBER}/7`,
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
              documentNumber: `10921-${PRODUCTNUMBER}/7-5`,
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
        ];
        break;
    }

    obj.httpResponse.body.results[0].data.relations.documentedBy = documentedBy;
    obj.httpResponse.body = JSON.stringify(obj.httpResponse.body);
    return obj;
  }


  // =========================================================================================== //


  mockPrimDDDocumentInfo(DCPREFIX, DC, DOCNUMBER, DOCNAME, DOCDESC) {
    this.something = true;
    const obj = {
      httpRequest: {
        method: 'GET',
        path: `/primddserver/REST/G3/CICD/Document/M/${encodeURIComponent(DOCNUMBER)}/A/en`,
      },
      httpResponse: {
        statusCode: 200,
        body: `<?xml version="1.0" encoding="UTF-8"?><Document xmlns:xalan="http://xml.apache.org/xslt" xmlns:corG3="urn:com:ericsson:schema:xml/Gima/cor/abstracts/objects/all/model/g3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><DecimalClassPrefix>${DCPREFIX}</DecimalClassPrefix><DecimalClass>${DC}</DecimalClass><DocumentNumber>${`${DOCNUMBER}`.trim().toLowerCase()}</DocumentNumber><DocumentName>${DOCNAME}</DocumentName><Itemlockowner>ERIDOC</Itemlockowner><ChangeDate>2022-07-08</ChangeDate><ChangeTime>12:43:01</ChangeTime><ChangedBy>PIERIDOC</ChangedBy><RevState>G</RevState><LanguageCode>en</LanguageCode><VersionChangeDate>2022-07-08</VersionChangeDate><VersionChangeTime>12:43:01</VersionChangeTime><VersionChangedBy>PIERIDOC</VersionChangedBy><VersionCreationDate>2022-07-08</VersionCreationDate><VersionCreationTime>00:00:00</VersionCreationTime><VersionCreatedBy>PIERIDOC</VersionCreatedBy><Versionlockowner>ERIDOC</Versionlockowner><DescriptionDisplayAttribute>${DOCDESC}</DescriptionDisplayAttribute><LanguageIssue><LanguageCode>en</LanguageCode><CreationDate>2022-07-08</CreationDate><CreationTime>00:00:00</CreationTime><ChangeDate>2022-07-08</ChangeDate><ChangeTime>12:43:01</ChangeTime><ChangedBy>PIERIDOC</ChangedBy><CreatedBy>PIERIDOC</CreatedBy><DocumentTitle>${DOCNAME}</DocumentTitle><RepositoryName>ERIDOC</RepositoryName><CertificationState>Certified</CertificationState><DocumentStatus>FREE</DocumentStatus><DocumentStatusChangeDate>2022-07-08</DocumentStatusChangeDate><DocumentStatusChangeTime>00:00:00</DocumentStatusChangeTime><SubjectResponsible>EZHANFR</SubjectResponsible><DocumentResponsible>BDGSLBMDD</DocumentResponsible></LanguageIssue></Document>`,
      },
      times: {
        unlimited: true,
      },
    };
    return obj;
  }


  // =========================================================================================== //
  static primXmlResponseDocument1256_1059() {
    const title = 'Alarm Handler User Guide';
    const name = 'USER GUIDE';
    const dcPrefix = '1';
    const decimalClass = '10112';
    const docNumber = '10112-apr201317-6';
    return MimerTemplates.primXmlResponseTemplate(dcPrefix, decimalClass, docNumber, name, title);
  }

  static primXmlResponseDocument1272() {
    const title = 'Alarm Handler Developer Guide';
    const name = 'USER GUIDE';
    const dcPrefix = '1';
    const decimalClass = '0360';
    const docNumber = '0360-apr201317-6';
    return MimerTemplates.primXmlResponseTemplate(dcPrefix, decimalClass, docNumber, name, title);
  }

  static primXmlResponseDocument3226_3030_2330_2021_1721_1487() {
    const title = 'Secure Coding Report';
    const name = 'SECURE CODING REPORT';
    const dcPrefix = '1';
    const decimalClass = '0360';
    const docNumber = '0360-apr201317-6';
    return MimerTemplates.primXmlResponseTemplate(dcPrefix, decimalClass, docNumber, name, title);
  }

  // eslint-disable-next-line class-methods-use-this
  static primXmlResponseTemplate(DCPREFIX, DC, DOCNUMBER, DOCNAME, DOCDESC) {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <Document xmlns:xalan="http://xml.apache.org/xslt"
        xmlns:corG3="urn:com:ericsson:schema:xml/Gima/cor/abstracts/objects/all/model/g3"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <DecimalClassPrefix>${DCPREFIX}</DecimalClassPrefix>
        <DecimalClass>${DC}</DecimalClass>
        <DocumentNumber>${`${DOCNUMBER}`.trim().toLowerCase()}</DocumentNumber>
        <DocumentName>${DOCNAME}</DocumentName>
        <Itemlockowner>ERIDOC</Itemlockowner>
        <ChangeDate>2022-07-08</ChangeDate>
        <ChangeTime>12:43:01</ChangeTime>
        <ChangedBy>PIERIDOC</ChangedBy>
        <RevState>G</RevState>
        <LanguageCode>en</LanguageCode>
        <VersionChangeDate>2022-07-08</VersionChangeDate>
        <VersionChangeTime>12:43:01</VersionChangeTime>
        <VersionChangedBy>PIERIDOC</VersionChangedBy>
        <VersionCreationDate>2022-07-08</VersionCreationDate>
        <VersionCreationTime>00:00:00</VersionCreationTime>
        <VersionCreatedBy>PIERIDOC</VersionCreatedBy>
        <Versionlockowner>ERIDOC</Versionlockowner>
        <DescriptionDisplayAttribute>${DOCDESC}</DescriptionDisplayAttribute>
        <LanguageIssue>
            <LanguageCode>en</LanguageCode>
            <CreationDate>2022-07-08</CreationDate>
            <CreationTime>00:00:00</CreationTime>
            <ChangeDate>2022-07-08</ChangeDate>
            <ChangeTime>12:43:01</ChangeTime>
            <ChangedBy>PIERIDOC</ChangedBy>
            <CreatedBy>PIERIDOC</CreatedBy>
            <DocumentTitle>${DOCDESC}</DocumentTitle>
            <RepositoryName>ERIDOC</RepositoryName>
            <CertificationState>Certified</CertificationState>
            <DocumentStatus>FREE</DocumentStatus>
            <DocumentStatusChangeDate>2022-07-08</DocumentStatusChangeDate>
            <DocumentStatusChangeTime>00:00:00</DocumentStatusChangeTime>
            <SubjectResponsible>EZHANFR</SubjectResponsible>
            <DocumentResponsible>BDGSLBMDD</DocumentResponsible>
        </LanguageIssue>
    </Document>
    `;
  }


  async mockEriDoc(MOCKFILEPATH, CONTENTTYPE, FILEREMOTENAME) {
    this.something = true;
    const fs = require('fs');
    const BufferResponse = fs.readFileSync(`${__dirname}${MOCKFILEPATH}`);
    const base64Response = await BufferResponse.toString('base64');
    const obj = {
      httpRequest: {
        path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*',
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': [`${CONTENTTYPE}`],
          'content-disposition': [`form-data; name='${FILEREMOTENAME}'; filename*=UTF-8''${FILEREMOTENAME}`],
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
    };
    return obj;
  }


  // =========================================================================================== //
}

module.exports = { MimerTemplates };
