require('selenium-webdriver/chrome');

const { By, Key } = require('selenium-webdriver');


export class AddUserPage{

    constructor() { }

    //#region Locators

    submitBtn = By.xpath('//*[@id="form"]/button');
    email = By.id('formBasicEmail');
    passwd = By.id('formBasicPassword'); 
    firstName = By.id('formBasicName'); 
    lastName = By.id('formBasicSurname'); 
    successAlert = By.className('modal-body');
    okBtn = By.xpath('/html/body/div[3]/div/div/div[3]/button');

    errorMessage = By.id('error');
    qrPicture = By.xpath('//*[@id="root"]/div/div/img');
    formCode = By.xpath('//*[@id="formCode"]');
    submitCodeBtn = By.xpath('//*[@id="root"]/div/form/button');
     
    //#endregion Locators

}
