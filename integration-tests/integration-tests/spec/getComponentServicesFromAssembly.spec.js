
/**
* Endpoint should get component Services information basrd on assembly id or slug
* @author Ludmila Omelchenko
*/
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();


describe('Testing component services endpoint for Assembly', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Testing getComponentServicesFromAssembly for 3 ssemblies', async (done) => {
    const assets = {
      idsOrSlugs: [
        'assembly-update-test', 'assembly-max-report', 'assembly-auto-doc',
      ],
    };
    const responseReport = await portal.getComponentServicesFromAssembly(assets);

    let foundAssembly2 = false;
    responseReport.body.forEach((overviewAsset) => {
      if(overviewAsset && overviewAsset.denorm && overviewAsset.denorm.service_maturity) {
        if (overviewAsset.assembly_name === 'Assembly Max Report' && overviewAsset.name === 'Auto MS max' && overviewAsset.denorm.service_maturity === 'Ready for Non-Commercial Use') {
          foundAssembly2 = true;
          expect(foundAssembly2).toBeTruthy();
        }
      }
    });

    let foundAssembly1 = false;
    responseReport.body.forEach((overviewAsset) => {
      if(overviewAsset && overviewAsset.denorm && overviewAsset.denorm.service_category) {
        if (overviewAsset.assembly_name === 'Assembly Max Report' && overviewAsset.name === 'Document Refresh Errors Test' && overviewAsset.denorm.service_category === 'ADP Domain Specific Services') {
          foundAssembly1 = true;
          expect(foundAssembly1).toBeTruthy();
        }
      }
    });
    expect(responseReport.code).toBe(200);
    done();
  });


  it('Testing getComponentServicesFromAssembly for assemblies without component field', async (done) => {
    const assets = {
      idsOrSlugs: [
        'assembly-auto-doc',
      ],
    };
    const responseReport = await portal.getComponentServicesFromAssembly(assets);

    expect(responseReport.body).toEqual([]);
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Testing getComponentServicesFromAssembly for invalid assembly', async (done) => {
    const assets = {
      idsOrSlugs: [
        'assembly-auto-doc444',
      ],
    };
    const responseReport = await portal.getComponentServicesFromAssembly(assets);

    expect(responseReport.body).toEqual([]);
    expect(responseReport.code).toBe(200);
    done();
  });
});
