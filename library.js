const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const driver = new webdriver.Builder().forBrowser('chrome').build();

driver.get('http://google.com');
