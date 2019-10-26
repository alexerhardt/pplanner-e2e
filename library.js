const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const { describe, it, after, before } = require('selenium-webdriver/testing');
let driver;

describe('Main test', () => {
  beforeEach(() => {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://library-app.firebaseapp.com');
  });

  afterEach(() => {
    driver.quit();
  });

  it('does something', () => {
    driver.findElement(By.css('input')).sendKeys('user@email.com');
    driver.findElement(By.css('.btn-lg')).click();
    driver.wait(until.elementLocated(By.css('.alert-success')), 5000);
    driver
      .findElement(By.css('.alert-success'))
      .getText()
      .then(text => {
        console.log('Alert succcess text is: ' + text);
      });

    const submitBtn = driver.findElement(By.css('.btn-lg'));
    driver.wait(() => {
      return submitBtn.isEnabled();
    }, 10000);
  });
});
