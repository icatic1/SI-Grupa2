require('selenium-webdriver/chrome');

const { By, Key } = require('selenium-webdriver');


export class HomePage{

    constructor() { }

    //#region Locators

    welcomMessage = By.css('h1');

    //#endregion

}
