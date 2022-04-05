require('selenium-webdriver/chrome');

const { By, Key } = require('selenium-webdriver');


export class AdminPage{
   
    constructor() { }

    //#region  Locators

    navigationText = By.className('navigation_page');
    logOutBtn = By.className('logout');
    homeBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[1]/li[1]/a');
    addUserBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[1]/li[3]/a');
    logoutBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[2]/li');
    usersBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[1]/li[4]/a');
    
    //#endregion Locators

}
