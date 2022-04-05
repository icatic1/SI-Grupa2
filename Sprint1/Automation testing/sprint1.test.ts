require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver')

import { BrowserHelper } from "./browser.helper";
import { GetPageLocators } from "./page.objects";

const { By } = require('selenium-webdriver');

const rootURL = 'http://sigrupa4-001-site1.ctempurl.com/';

let browser = new BrowserHelper();
let pageLocators = new GetPageLocators();


describe('Tests for sprint1', () => {

  it('Check that admin is redirected to the homepage when the login is successful', async () => {

    await browser.driver.sleep(2000);
    await browser.goToPage(rootURL);
    await browser.driver.sleep(2000);
    await browser.loginToPage('dzeneta@admin.com', '123');
    await browser.driver.sleep(2000);
    await browser.enterDataAndClick(pageLocators.getLoginPage().formCode, '239201', pageLocators.getLoginPage().submitCodeBtn);
    await browser.driver.sleep(1000);
    var result = await browser.getText(pageLocators.getHomePage().welcomMessage);
    expect(result).toEqual('Welcome!');
    await browser.driver.sleep(1000);

  });

  it('Check add new user option for admin', async () => {

    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getAdminPage().addUserBtn);
    await browser.driver.sleep(1000);
    await browser.addUser('dodani1234@korisnik.com', 'novi', 'korisnik', '123');
    await browser.driver.sleep(2000);
    var result = await browser.getText(pageLocators.getAddUserPage().successAlert);
    expect(result).toEqual('User successfully added!');
    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getAddUserPage().okBtn);
    await browser.driver.sleep(1000);
  });

  it('Redirecting to the Home page by clicking the Home button', async () => {

    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getAdminPage().homeBtn);
    expect(await browser.getText(pageLocators.getHomePage().welcomMessage)).toEqual("Welcome!");
    await browser.driver.sleep(5000);

  });

  it('Check delete user option for admin', async () => {

    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getAdminPage().usersBtn);
    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getUserPage().deleteBtn); 
    await browser.click(pageLocators.getUserPage().yesBtn);
    var result = await browser.getText(pageLocators.getUserPage().emailText);
    expect(result).not.toEqual("dodani12@korisnik.com");
    await browser.driver.sleep(5000);

  });

  it('Redirecting to the Login page by clicking the Logout button', async () => {

    await browser.driver.sleep(2000);
    await browser.click(pageLocators.getAdminPage().logoutBtn);
    expect(await browser.visibleElement(pageLocators.getLoginPage().submitLoginBtn)).toBeTruthy();
    await browser.driver.sleep(5000);

  });

  it('Check login option for admin with bad email address ', async () => {
    await browser.goToPage(rootURL);
    await browser.driver.sleep(2000);
    await browser.loginToPage('dzeny.ahmic@gmail.com', '12345');
    await browser.driver.sleep(2000);
    var result = await browser.getText(pageLocators.getLoginPage().errorMessage);
    expect(result).toEqual("Your email or password is incorrect.");
    await browser.driver.sleep(2000);

  });

  it('Check login option for admin with incorrect password', async () => {

    await browser.driver.sleep(2000);
    await browser.loginToPage('dzeneta@admin.com', '12345');
    await browser.driver.sleep(2000);
    var result = await browser.getText(pageLocators.getLoginPage().errorMessage);
    expect(result).toEqual("Your email or password is incorrect.");
    await browser.driver.sleep(2000);

  });

  it('Check that QR code is visible when new users want to log in', async () => {

    await browser.driver.sleep(2000);
    await browser.loginToPage('dodani@korisnik.com', '123');
    await browser.driver.sleep(2000);
    var result = await browser.visibleElement(pageLocators.getLoginPage().qrPicture);
    expect(result).toBeTruthy();
    await browser.driver.sleep(2000);

  });

  // Nejra
  
  afterAll(() => {
    browser.driver.quit();
  });
  

});

