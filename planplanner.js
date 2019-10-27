const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');

// Example config
// At larger scale, would need to find a way to write data for multiple plans
// (JSON? YAML?)
const TIMEOUT = 15000;
const BASE_URL = 'https://planplanner.com';
const PRODUCT_URL = '/madrid/karaoke-brunch-halloween/';
const TICKET_TYPE = 2;
const PLAN_PRICE = 29.99;
const NUM_PEOPLE = 2;

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get(BASE_URL + PRODUCT_URL);

    /**
     * 1. CHOOSE A TICKET TYPE
     */
    await driver.wait(until.elementLocated(By.id('tipo-de-entradas')));
    const ticketType = await driver.findElement(By.id('tipo-de-entradas'));
    await ticketType.click();
    const types = await ticketType.findElements(By.css('option'));
    await types[TICKET_TYPE].click();

    /**
     * 2. CHOOSE A DATE
     */
    const datePicker = await driver.findElement(By.id('booking_calender'));
    await datePicker.click();
    // The date picker markup semantics make it fairly hard to select a particular
    // date; for simplicity, we pick the first one available
    const pickableDates = await driver.findElements(
      By.css('td[data-handler="selectDay"]'),
    );
    await pickableDates[0].click();

    // Wait for the people selector to be populated
    // Selector trick is a bit of a nasty hack:
    // "Wait for the selector to not be disabled" -- looks very brittle
    await driver.wait(async () => {
      const peopleOptions = await driver.findElements(
        By.css('input[id^="quantity"]:not([disabled])'),
      );
      return peopleOptions.length === 1;
    }, TIMEOUT);

    /**
     * 3. CHOOSE NUMBER OF PEOPLE
     */
    const peopleSelector = await driver.findElement(
      By.css('input[id^="quantity"]'),
    );
    await peopleSelector.click();

    // I thought the previous driver.wait would be enough, but sometimes it
    // still produced empty person lists... Added this for good measure
    await driver.wait(async () => {
      return (await driver.findElements(By.css('#personList > li'))).length > 0;
    }, TIMEOUT);

    const personsList = await driver.findElements(By.css('#personList > li'));

    // Save the price prior to changing # of people
    const beforePrice = await getPrice(driver);

    // Select number of people
    await personsList[NUM_PEOPLE - 1].click();

    // // Wait for the AJAX price calculator to finish
    await driver.wait(async () => {
      return beforePrice !== (await getPrice(driver));
    }, TIMEOUT);
    const afterPrice = await getPrice(driver);

    // Check that the value is what we expect
    assert(
      parseFloat(afterPrice.replace(/,/, '.')) === PLAN_PRICE * NUM_PEOPLE,
    );

    // Go to next page
    await driver.findElement(By.css('.single_add_to_cart_button')).click();
  } catch (e) {
    console.error('Error: ', e);
  }
})();

const getPrice = async driver => {
  const priceElement = await driver.findElement(
    By.css('#bkap_price > span:nth-child(1)'),
  );
  const price = await priceElement.getText();
  return price.substring(0, price.length - 1);
};
