require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver')

import { Builder, WebDriver } from "selenium-webdriver";
import { DriverSetup } from "./web.driver.setup";
import { LoginPage } from "./pages/login.page";
import { AddUserPage } from "./pages/adduser.page";


export class BrowserHelper {

    public driver: WebDriver;
    public driverSetup = new DriverSetup();

    constructor() {
        this.driver = this.driverSetup.driver;
    }

    async goToPage(link: string) {
        return this.driver.get(link);
    }

    async click(elementLocator: any) {
        return (this.driver.findElement(elementLocator).click());
    }

    async getText(elementLocator: any) {

        return (this.driver.findElement(elementLocator).getText());

    }

    async enterDataAndClick(inputFieldLocator: any, inputData: string, submitLocator: any) {
        
        await this.driver.findElement(inputFieldLocator).clear();
        await this.driver.findElement(inputFieldLocator).sendKeys(inputData);
        await this.driver.sleep(500);
        await this.driver.findElement(submitLocator).click();
    
    }

    

    public async addUser(email: string, firstName: string, lastName : string, passwd: string){
        
        const addUserPage = new AddUserPage();
        await this.driver.findElement(addUserPage.email).sendKeys(email);
        await this.driver.findElement(addUserPage.firstName).sendKeys(firstName);
        await this.driver.findElement(addUserPage.lastName).sendKeys(lastName);
        await this.driver.findElement(addUserPage.passwd).sendKeys(passwd);
        await this.driver.sleep(500);
        await this.driver.findElement(addUserPage.submitBtn).click();
        await this.driver.sleep(5000);

    }

    public async loginToPage(email: string, passwd: string) {

        const authenticationPage = new LoginPage();
        await this.driver.findElement(authenticationPage.loginEmail).clear();
        await this.driver.findElement(authenticationPage.loginEmail).sendKeys(email);
        await this.driver.findElement(authenticationPage.loginPasswd).clear();
        await this.driver.findElement(authenticationPage.loginPasswd).sendKeys(passwd);
        await this.driver.findElement(authenticationPage.submitLoginBtn).click();
        await this.driver.sleep(1000);
        
    }

    public async visibleElement(elementLocator : any) {

        return await this.driver.findElement(elementLocator).isEnabled; 
        
    }

}
