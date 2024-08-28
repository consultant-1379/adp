/**
     * Tests for dynamic sitemap endpoint
     * @author Githu Jeeva Savy
*/
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();

describe('Testing Dynamic site map endpoint on the backend for admin user', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Should get all menus from the sitemap endpoint', async (done) => {
    const responseallmenus = await portal.siteMap();

    const mainMenuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.some(menu => menu.mainMenuSlug === 'main')
      : null;

    expect(mainMenuFound)
      .withContext(`The return should be Truthy: ${responseallmenus}`)
      .toBeTruthy();

    const footerMenuFound = responseallmenus
      && responseallmenus.body
      && responseallmenus.body.data
      ? responseallmenus.body.data.some(menu => menu.mainMenuSlug === 'footer')
      : null;

    expect(footerMenuFound)
      .withContext(`The return should be Truthy: ${responseallmenus}`)
      .toBeTruthy();

    const theMenus = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data
      : [];

    expect(theMenus.length)
      .withContext(`The menus length should be greater than 1, got ${theMenus.length}: ${responseallmenus}`)
      .toBeGreaterThan(1);

    const theMenuCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(theMenuCode)
      .withContext(`The code should be 200, got ${theMenuCode}: ${responseallmenus}`)
      .toBe(200);

    done();
  });

  it('Should check presence of sub level menus from the sitemap endpoint', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const menuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.slug === 'discover')
      : null;

    const child = menuFound
      ? menuFound.children[0]
      : null;

    expect(child.menu_level)
      .withContext(`The return should be sub menu level: ${child}`)
      .toBe(1);

    const subchild = menuFound
      && menuFound.children[0]
      ? menuFound.children[0].children.find(menu => menu.slug === 'adp_benefits')
      : null;

    expect(subchild.title)
      .withContext(`The return should be the subchild menu: ${subchild}`)
      .toBe('Benefits of ADP');

    expect(subchild.menu_level)
      .withContext(`The return should be sub-sub menu level: ${subchild.menu_level}`)
      .toBe(2);

    expect(subchild.children.length)
      .withContext(`The sub-sub menu level length should be 0: ${subchild.children.length}`)
      .toBe(0);
    done();
  });

  it('Should check presence of sitemap URL for menu and sub menu items', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const menuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.slug === 'discover')
      : null;

    expect(menuFound.menu_level)
      .withContext(`The return should be  menu level: ${menuFound}`)
      .toBe(0);

    expect(menuFound.object)
      .withContext(`The return should be category: ${menuFound}`)
      .toBe('category');

    expect(menuFound.siteMapURL)
      .withContext(`No siteMapURL for category: ${menuFound}`)
      .toBeUndefined();

    const child = menuFound
      ? menuFound.children[0]
      : null;

    expect(child.menu_level)
      .withContext(`The return should be sub menu level: ${child}`)
      .toBe(1);

    expect(child.object)
      .withContext(`The return should be sub menu type: ${child}`)
      .toBe('page');

    expect(child.siteMapURL)
      .withContext(`The return should be sub menu full URL: ${child}`)
      .toBe('/discover/what_is_adp');

    const subchild = menuFound
    && menuFound.children[0]
      ? menuFound.children[0].children.find(menu => menu.slug === 'adp_benefits')
      : null;

    expect(subchild.title)
      .withContext(`The return should be the subchild menu: ${subchild}`)
      .toBe('Benefits of ADP');

    expect(subchild.menu_level)
      .withContext(`The return should be sub-sub menu level: ${subchild.menu_level}`)
      .toBe(2);

    expect(subchild.siteMapURL)
      .withContext(`The sub-sub menu levelshould have full URL: ${subchild.children.length}`)
      .toBe('/discover/what_is_adp/adp_benefits');
    done();
  });

  it('Should check presence of external icon on the sitemap main menus', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const menusFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.filter(menu => menu.target === '_blank')
      : null;

    expect(menusFound.length)
      .withContext(`The menus length should be greater than 5, got ${menusFound.length}: ${menusFound}`)
      .toBeGreaterThanOrEqual(5);

    expect(menusFound[0].title)
      .withContext(`The return should be Truthy: ${menusFound[0].title}`)
      .toBe('CI/CD Dashboard');

    const externalMenus = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data[0].children.filter(menu => menu.target === '_blank')
      : null;

    const externalTitles = externalMenus.map(menu => menu.title);

    expect(externalTitles.length)
      .withContext(`The external titles inside first menu to be atleast 3, got ${externalTitles.length}: ${externalTitles}`)
      .toBeGreaterThanOrEqual(3);

    expect(externalTitles)
      .withContext(`The array should contain: ${externalTitles}`)
      .toContain('Cloud Native', 'Product Management', 'ECCD');
    done();
  });

  it('Should check external link for menu is present', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const customMenuFound = responseallmenus
      && responseallmenus.body
      && responseallmenus.body.data
      ? responseallmenus.body.data.filter(menu => menu.target === '_blank' && menu.object === 'custom')
      : null;

    expect(customMenuFound.length)
      .withContext(`The menus length should be greater than 5, got ${customMenuFound.length}: ${customMenuFound}`)
      .toBeGreaterThan(5);

    expect(customMenuFound[0].title)
      .withContext(`The return should be title: ${customMenuFound}`)
      .toContain('CI/CD Dashboard');

    expect(customMenuFound[0].menu_level)
      .withContext(`The return should be menu level: ${customMenuFound}`)
      .toBe(0);
    done();
  });

  it('Should check presence of same item in multiple menus', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const mainMenuFound = responseallmenus
      && responseallmenus.body
      && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.slug === 'discover')
      : null;

    const menusFound = mainMenuFound
    && mainMenuFound.children
      ? mainMenuFound.children.some(menu => menu.slug === 'what_is_adp')
      : null;

    expect(menusFound)
      .withContext(`The menus length should true, got ${menusFound.length}: ${responseallmenus}`)
      .toBeTruthy();

    const item1 = mainMenuFound
      && mainMenuFound.children
      ? mainMenuFound.children.some(menu => menu.slug === 'adp_architecture')
      : null;

    expect(item1)
      .withContext(`item1 presence should true, got ${item1}: ${responseallmenus}`)
      .toBeTruthy();

    const footerMenuFound = responseallmenus
      && responseallmenus.body
      && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.mainMenuSlug === 'footer')
      : null;

    const itemsFound = footerMenuFound
    && footerMenuFound.children
      ? footerMenuFound.children.some(menu => menu.slug === 'what_is_adp')
      : null;

    expect(itemsFound)
      .withContext(`The item is found in other palce also, got ${itemsFound}: ${itemsFound}`)
      .toBeTruthy();

    const item2 = footerMenuFound
      && footerMenuFound.children
      ? footerMenuFound.children.some(menu => menu.slug === 'adp_architecture')
      : null;

    expect(item2)
      .withContext(`item1 presence should true, got ${item2}: ${item2}`)
      .toBeTruthy();
    done();
  });

  it('Should check presence of side level menus inside the main menu', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const subMenuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.slug === 'workinginadpframework-articles')
      : null;

    const child = subMenuFound
      ? subMenuFound.children[0]
      : null;

    expect(child.menu_level)
      .withContext(`The return should be sub menu level: ${child}`)
      .toBe(1);

    expect(child.children.length)
      .withContext(`The return should be sub menu level length: ${child}`)
      .toBeGreaterThanOrEqual(4);
    const childSideMenu1 = child
    && child.children
      ? child.children.find(menu => menu.slug === 'developing-a-microservice-overview-2')
      : null;

    expect(childSideMenu1.title)
      .withContext(`Checking child menu title: ${childSideMenu1}`)
      .toBe('Developing a Microservice Overview');

    expect(childSideMenu1.linked_menu_paths.length)
      .withContext(`Child menu linked path's length: ${childSideMenu1}`)
      .toBe(1);

    expect(childSideMenu1.children.length)
      .withContext(`Child menu children length: ${childSideMenu1}`)
      .toBe(0);

    const childSideMenu2 = child
      && child.children[0]
      ? child.children.find(menu => menu.slug === 'service-maturity-criteria')
      : null;

    expect(childSideMenu2.title)
      .withContext(`Checking child menu title: ${childSideMenu2}`)
      .toBe('Service Maturity Criteria');

    expect(childSideMenu2.linked_menu_paths.length)
      .withContext(`Child menu linked path's length: ${childSideMenu2}`)
      .toBe(1);

    expect(childSideMenu2.children.length)
      .withContext(`Child menu children length: ${childSideMenu2}`)
      .toBe(0);
    done();
  });

  it('Should check presence of level 5 menus inside the main menu', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const subMenuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.find(menu => menu.slug === 'e2e-main-menu-1')
      : null;

    const child2dlevel = subMenuFound
      ? subMenuFound.children.find(menu => menu.slug === 'e2e-tests-highlights')
      : null;

    expect(child2dlevel.children.length)
      .withContext(`Child menu children length: ${child2dlevel}`)
      .toBeGreaterThanOrEqual(2);

    const child3dlevel = child2dlevel
      ? child2dlevel.children.find(menu => menu.slug === 'highlight-test-002')
      : null;

    expect(child3dlevel.children.length)
      .withContext(`Child menu children length: ${child3dlevel}`)
      .toBeGreaterThanOrEqual(1);

    const child4dlevel = child3dlevel
      ? child3dlevel.children.find(menu => menu.slug === 'highlight-test-003')
      : null;

    expect(child4dlevel.children.length)
      .withContext(`Child menu children length: ${child4dlevel}`)
      .toBeGreaterThanOrEqual(1);

    const child5dlevel = child4dlevel
      ? child4dlevel.children.find(menu => menu.slug === 'highlight-test-004')
      : null;

    expect(child5dlevel.children.length)
      .withContext(`Child menu children length: ${child5dlevel}`)
      .toBeGreaterThanOrEqual(0);

    done();
  });

  it('Should check presence of tutorials on the site map', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const menusFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.filter(menu => menu.object === 'tutorials')
      : null;

    expect(menusFound.length)
      .withContext(`The menus length should be 0, got ${menusFound.length}: ${responseallmenus}`)
      .toBe(0);

    const childMenus = responseallmenus
      && responseallmenus.body
      && responseallmenus.body.data
      ? responseallmenus.body.data[0].children.filter(menu => menu.object === 'tutorials')
      : null;

    expect(childMenus.length)
      .withContext(`The menus length should be 0, got ${childMenus.length}: ${childMenus}`)
      .toBe(0);
    done();
  });

  it('Should check presence of pages not on any menu', async (done) => {
    const responseallmenus = await portal.siteMap();

    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);

    const menuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
      ? responseallmenus.body.data.filter(menu => menu.mainMenuSlug === 'pages-not-on-any-menu')
      : null;

    const itemFound1 = menuFound ? menuFound.find(menu => menu.slug === 'auto-draft')
      : null;

    expect(itemFound1.title)
      .withContext(`The return should be an item: ${itemFound1}`)
      .toBe('Auto Draft');

    expect(itemFound1.children.length)
      .withContext(`no children item present: ${itemFound1}`)
      .toBe(0);
    const itemFound2 = menuFound ? menuFound.find(menu => menu.slug === 'e2e-main-menu')
      : null;

    expect(itemFound2.menu_item_parent)
      .withContext(`The return should not have a parent item: ${itemFound2}`)
      .toBe('0');

    expect(itemFound2.object_id)
      .withContext(`object id check: ${itemFound2}`)
      .toBe('9385');
    done();
  });
});

describe('Testing limited access in sitemap for dmapuse user', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTestUserDmapuse);
  });

  it('Should get sitemap menu items for dmapuse', async (done) => {
    const responseallmenus = await portal.siteMap();

    expect(responseallmenus.code).toBe(200);

    const allMenuItems = responseallmenus.body.data;

    const menuFound = allMenuItems
      ? allMenuItems.find(menu => menu.slug === 'getstarted')
      : null;

    expect(menuFound.menu_level)
      .withContext(`The return should be sub menu level: ${menuFound.menu_level}`)
      .toBe(0);

    const childMenus = menuFound
    && menuFound.children
      ? menuFound.children.filter(menu => menu.parent_slug === 'getstarted')
      : null;

    expect(childMenus.length)
      .withContext(`all child menu should have same parent: ${childMenus.title}`)
      .toBeGreaterThan(4);

    const someMenuFound = menuFound
    && menuFound.children
      ? menuFound.children.some(menu => menu.slug === 'service_reuse')
      : null;

    expect(someMenuFound)
      .withContext(`The return should be Truthy: ${someMenuFound}`)
      .toBeTruthy();

    done();
  });

  it('Should not fetch parent menu if only child sub menus are selected for dmapuse', async (done) => {
    const responseallmenus = await portal.siteMap();
    const allMenuItems = responseallmenus.body.data;
    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);
    const menuFound = allMenuItems
      ? responseallmenus.body.data.some(menu => menu.slug === 'discover')
      : null;

    expect(menuFound)
      .withContext(`The return should be Truthy: ${menuFound}`)
      .toBeFalsy();
    done();
  });

  it('Should not fetch parent menu if no child sub menus are selected for dmapuse', async (done) => {
    const responseallmenus = await portal.siteMap();
    const allMenuItems = responseallmenus.body.data;
    const responseCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(responseCode)
      .withContext(`The code should be 200, got ${responseCode}: ${responseallmenus}`)
      .toBe(200);
    const menuFound = allMenuItems
      ? responseallmenus.body.data.some(menu => menu.slug === 'workinginadpframework-articles')
      : null;

    expect(menuFound)
      .withContext(`The return should be Falsy: ${menuFound}`)
      .toBeFalsy();
    done();
  });
});
