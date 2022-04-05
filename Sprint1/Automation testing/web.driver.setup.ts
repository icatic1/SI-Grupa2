import { WebDriver } from "selenium-webdriver";

require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver')

const { Builder } = require('selenium-webdriver');

export class DriverSetup {
  
  public driver: WebDriver;

  constructor() {
    this.initializeWebDriver();
  }

  initializeWebDriver() {
    this.driver = new Builder().forBrowser('chrome').build();
    this.waitForDriver(this.driver);
    this.waitForWindowMaximize(this.driver);
    console.log('Webdriver initialized and running.');

  }

  waitForDriver(driver) {
    driver.then((_d: any) => { driver = _d });
  }

  waitForWindowMaximize(driver) {
    driver.manage().window().maximize();
  }

}
