const { Builder, By, Key, until } = require('selenium-webdriver');

// Example config
// At larger scale, would need to find a way to write data for multiple plans
// (JSON? YAML?)
const BASE_URL = 'https://planplanner.com';
const PRODUCT_URL = '/madrid/karaoke-brunch-halloween/';
const TICKET_TYPE = 2;
const PLAN_PRICE = 24.99;
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
        By.css('#quantity_5db36bd58f814:not([disabled])'),
      );
      return peopleOptions.length === 1;
    }, 8500);

    /**
     * 3. CHOOSE NUMBER OF PEOPLE
     */
    const peopleSelector = await driver.findElement(
      By.id('quantity_5db36bd58f814'),
    );
    await peopleSelector.click();
    const personsList = await driver.findElements(By.css('#personList > li'));
    // Select one person
    await personsList[NUM_PEOPLE - 1].click();

    // const peopleSelector = await driver.findElement(By.css('.peopleQty'));
    // await peopleSelector.click();
    // await ticketType.findElement(By.css('option:nth-child(3)')).click();
  } catch (e) {
    console.error('Error: ', e);
  }
})();
