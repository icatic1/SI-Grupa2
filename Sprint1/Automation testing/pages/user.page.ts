//  

require('selenium-webdriver/chrome');

const { By, Key } = require('selenium-webdriver');


export class UserPage{

    constructor() { }

    //#region Locators

    submitBtn = By.xpath('//*[@id="form"]/button');
    email = By.id('formBasicEmail');
    passwd = By.id('formBasicPassword'); 
    firstName = By.id('formBasicName'); 
    lastName = By.id('formBasicSurname'); 

    alertText = By.className('modal-body');
    yesBtn = By.xpath('/html/body/div[3]/div/div/div[3]/button[1]');
    deleteBtn = By.xpath('//*[@id="root"]/div/div[2]/div/div/div[21]/div[3]/div[2]/div/div/button[2]');
    emailText = By.xpath('//*[@id="root"]/div/div[2]/div/div/div[21]/div[3]/div[1]/div'); 
    role = By.xpath('//*[@id="formBasicRoleSelect"]');
    editBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[1]/li[2]/a');
    securityFld = By.id('formAnswer');
    submitEditBtn = By.xpath('//*[@id="root"]/div/div/div/form/button');
    logoutBtn = By.xpath('//*[@id="root"]/nav/div[2]/ul[2]/li/a');


    //#endregion Locators

}
