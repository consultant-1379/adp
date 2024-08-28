/**
     * Tests for wordpress menus on the BE wordpress/menus endpoint
     * @author Ludmila Onelchenko
*/
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();

describe('Testing WP menus endpoint on the backend', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Should get all menus from the WP', async (done) => {
    const responseallmenus = await portal.wpMenus();

    const mainMenuFound = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
    && responseallmenus.body.data.menus
      ? responseallmenus.body.data.menus.some(menu => menu.slug === 'main')
      : null;

    expect(mainMenuFound)
      .withContext(`The return should be Truthy: ${responseallmenus}`)
      .toBeTruthy();

    const theMenus = responseallmenus
    && responseallmenus.body
    && responseallmenus.body.data
    && responseallmenus.body.data.menus
      ? responseallmenus.body.data.menus
      : [];

    expect(theMenus.length)
      .withContext(`The menus length should be greater than 5, got ${theMenus.length}: ${responseallmenus}`)
      .toBeGreaterThan(5);

    const theMenuCode = responseallmenus
    && responseallmenus.code
      ? responseallmenus.code
      : null;

    expect(theMenuCode)
      .withContext(`The code should be 200, got ${theMenuCode}: ${responseallmenus}`)
      .toBe(200);

    done();
  });

  it('Should get wordpress main menu and check slug and name', async (done) => {
    const responseallmenus = await portal.wpMenus('main');
    const mainMenuSlug = responseallmenus.body.data.slug;
    const mainMenuName = responseallmenus.body.data.name;

    expect(mainMenuSlug).toBe('main');
    expect(mainMenuName).toBe('Main');
    expect(responseallmenus.code).toBe(200);
    done();
  });

  it('Should get wordpress main menu items and check their fields', async (done) => {
    const responseallmenus = await portal.wpMenus('main');
    const allmainMenuItems = responseallmenus.body.data.items;

    let foundMenuItems = false;
    allmainMenuItems.filter((item) => {
      if ((item.type_label === 'Custom Link') && (item.title === 'Cloud Native')) {
        foundMenuItems = true;
      }
      return foundMenuItems;
    });

    expect(foundMenuItems).toBeTruthy();
    expect(allmainMenuItems.length).toBeGreaterThan(5);
    expect(responseallmenus.code).toBe(200);
    done();
  });

  it('Should get wordpress highlights menu and check it', async (done) => {
    const responseMenus = await portal.wpMenus('highlights');

    const menuSlug = responseMenus.body.data.slug;
    const menuName = responseMenus.body.data.name;

    expect(menuSlug).toBe('highlights');
    expect(menuName).toBe('Highlights');
    expect(responseMenus.code).toBe(200);
    done();
  });

  it('Should get wordpress highlights menu and check its items', async (done) => {
    const responseMenus = await portal.wpMenus('highlights');

    const allMenuItems = responseMenus.body.data.items;

    let foundMenuItems = false;
    allMenuItems.filter((item) => {
      if ((item.type_label === 'Page') && (item.title === 'E2E Tests Highlights')) {
        foundMenuItems = true;
      }
      return foundMenuItems;
    });

    expect(foundMenuItems).toBeTruthy();
    expect(allMenuItems.length).toBeGreaterThan(3);
    expect(responseMenus.code).toBe(200);
    done();
  });

  it('Should get wordpress tutorials menu', async (done) => {
    const responseMenus = await portal.wpMenus('tutorials');

    const menuSlug = responseMenus.body.data.slug;
    const menuName = responseMenus.body.data.name;

    expect(menuSlug).toBe('tutorials');
    expect(menuName).toBe('Tutorials');
    expect(responseMenus.code).toBe(200);
    done();
  });

  it('Should get wordpress tutorials menu and check its items', async (done) => {
    const responseMenus = await portal.wpMenus('tutorials');

    const allMenuItems = responseMenus.body.data.items;

    let foundMenuItems = false;
    allMenuItems.filter((item) => {
      if ((item.type_label === 'Tutorial page') && (item.title === 'E2E TESTS Tutorial')) {
        foundMenuItems = true;
      }
      return foundMenuItems;
    });

    expect(foundMenuItems).toBeTruthy();
    expect(allMenuItems.length).toBeGreaterThan(5);
    expect(responseMenus.code).toBe(200);
    done();
  });

  it('Should check requesting not existing menu, should return 404', async (done) => {
    const responseMenus = await portal.wpMenus('notExistingMenu');

    expect(responseMenus.code).toBe(404);
    done();
  });

  /*
     * Checks additional data added to the menu
     * for different Object types(category, page, tutorial, custom):
     * target, portal_url, slug, parent slug entries */
  it('Should get wordpress footer menu and check type object: "category" data', async (done) => {
    const menuItemExpected = {
      title: 'e2e Tests',
      target: '',
      portal_url: '/do-not-remove-footer-header',
      slug: 'do-not-remove-footer-header',
      object: 'category',
      parent_slug: '',
    };
    const responseMenus = await portal.wpMenus('footer');
    const allMenuItems = responseMenus.body.data.items;

    const e2eTestsMenuItem = allMenuItems.filter(item => item.title === 'e2e Tests');
    const e2eTestsMenuItemJSON = JSON.parse(JSON.stringify(e2eTestsMenuItem[0]));

    expect(responseMenus.code).toBe(200);
    expect(e2eTestsMenuItemJSON).toEqual(jasmine.objectContaining(menuItemExpected));

    done();
  });

  it('Should get wordpress footer menu and check type object: "custom" data: internal link, external link and Mailto', async (done) => {
    const menuItemExpected = [{
      title: 'Internal Link',
      target: '_self',
      portal_url: '/marketplace',
      slug: 'marketplace',
      object: 'custom',
      parent_slug: 'do-not-remove-footer-header',
    },
    {
      title: 'External Link',
      target: '_blank',
      portal_url: '',
      slug: '',
      object: 'custom',
      parent_slug: 'do-not-remove-footer-header',
    },
    {
      title: 'Mailto',
      target: 'mail',
      portal_url: 'mailto:PDLDPPORTA@pdl.internal.ericsson.com?subject=Portal%20Feedback&cc=PDLADPFRAM@pdl.internal.ericsson.com',
      slug: 'mailto:PDLDPPORTA@pdl.internal.ericsson.com?subject=Portal%20Feedback&cc=PDLADPFRAM@pdl.internal.ericsson.com',
      object: 'custom',
      parent_slug: 'do-not-remove-footer-header',
    }];

    const responseMenus = await portal.wpMenus('footer');
    const allMenuItems = responseMenus.body.data.items;
    let countTestData = 0;
    allMenuItems.forEach((item) => {
      menuItemExpected.forEach((itemExpected) => {
        if (itemExpected.title === item.title) {
          expect(item).toEqual(jasmine.objectContaining(itemExpected));
          countTestData += 1;
        }
      });
    });

    expect(countTestData).toEqual(menuItemExpected.length);
    expect(responseMenus.code).toBe(200);
    done();
  });

  it('Should get wordpress footer menu and check type object: "page" data', async (done) => {
    const menuItemExpected = {
      title: 'Article Page',
      target: '',
      portal_url: '/do-not-remove-footer-header/e2e-test-page-1',
      slug: 'e2e-test-page-1',
      object: 'page',
      parent_slug: 'do-not-remove-footer-header',
    };
    const responseMenus = await portal.wpMenus('footer');
    const allMenuItems = responseMenus.body.data.items;

    const articlePageMenuItem = allMenuItems.filter(item => item.title === 'Article Page');
    const articlePageItemJSON = JSON.parse(JSON.stringify(articlePageMenuItem[0]));

    expect(responseMenus.code).toBe(200);
    expect(articlePageItemJSON).toEqual(jasmine.objectContaining(menuItemExpected));
    done();
  });

  it('Should get wordpress tutorials menu and check type object: "tutorials" data', async (done) => {
    const menuItemExpected = [{
      title: 'Do not remove – UITEST tutorial',
      target: '',
      portal_url: '/do-not-remove-uitest-tutorial',
      slug: 'do-not-remove-uitest-tutorial',
      object: 'tutorials',
      parent_slug: '',
    },
    {
      title: 'E2E TESTS Tutorial',
      target: '',
      portal_url: '/do-not-remove-uitest-tutorial/e2e-tests-tutorial',
      slug: 'e2e-tests-tutorial',
      object: 'tutorials',
      parent_slug: 'do-not-remove-uitest-tutorial',
    }];

    const responseMenus = await portal.wpMenus('tutorials');
    const allMenuItems = responseMenus.body.data.items;
    let countTestData = 0;
    allMenuItems.forEach((item) => {
      menuItemExpected.forEach((itemExpected) => {
        if (itemExpected.title === item.title) {
          expect(item).toEqual(jasmine.objectContaining(itemExpected));
          countTestData += 1;
        }
      });
    });

    expect(countTestData).toEqual(menuItemExpected.length);
    expect(responseMenus.code).toBe(200);
    done();
  });
});


describe('Testing limited access in WP menus for epesuse user', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTestUserEpesuse);
  });

  it('Should get wordpress main menu items for Epesuse and check one of them is avaliable', async (done) => {
    const responseallmenus = await portal.wpMenus('main');
    const allmainMenuItems = responseallmenus.body.data.items;


    let foundMenuItems = false;
    allmainMenuItems.filter((item) => {
      if (item.title === 'What is ADP?' && item.type_label === 'Page') {
        foundMenuItems = true;
      }
      return foundMenuItems;
    });

    expect(foundMenuItems).toBeTruthy();
    expect(allmainMenuItems.length).toBeGreaterThan(5);
    expect(responseallmenus.code).toBe(200);
    done();
  });

  it('Should get wordpress main menu items for Epesuse and check availabylity of the item without access', async (done) => {
    const responseallmenus = await portal.wpMenus('main');
    const allmainMenuItems = responseallmenus.body.data.items;

    let foundMenuItems = false;
    allmainMenuItems.filter((item) => {
      if (item.title === 'Community') {
        foundMenuItems = true;
      }
      return foundMenuItems;
    });

    expect(foundMenuItems).toBeFalsy();
    expect(responseallmenus.code).toBe(200);
    done();
  });
});
