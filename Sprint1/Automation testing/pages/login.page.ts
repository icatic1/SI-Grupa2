require('selenium-webdriver/chrome');

const { By, Key } = require('selenium-webdriver');


export class LoginPage{

    constructor() { }

    //#region Locators
    
    submitLoginBtn = By.id('sub_btn');
    loginEmail = By.id('formBasicEmail');
    loginPasswd = By.id('formBasicPassword'); 
    errorMessage = By.id('error');
    qrPicture = By.xpath('//*[@id="root"]/div/div/img');
    formCode = By.xpath('//*[@id="formCode"]');
    submitCodeBtn = By.xpath('//*[@id="root"]/div/form/button');
    forgetPassword = By.xpath('//*[@id="root"]/div/form/a');
    securityQLink = By.xpath('//*[@id="everything"]/a[1]');
    securityEmail = By.xpath('//*[@id="first"]/form/div/input');
    securitySubmitBtn = By.className('btn btn-primary');
    answerFld = By.xpath('//*[@id="first"]/form[2]/div/input');
    newPasswordFld = By.xpath('//*[@id="formBasicPassword"]');
    label = By.xpath('//*[@id="root"]/div/form/div/label');
    submitAnswer = By.xpath('//*[@id="first"]/form[2]/button');
    errorAnswer = By.xpath('//*[@id="errorAnswer"]');
    
    //#endregion Locators

}
