const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get(
      'https://planplanner.com/madrid/karaoke-brunch-halloween/',
    );

    // 1. CHOOSE A TICKET TYPE
    await driver.wait(until.elementLocated(By.id('tipo-de-entradas')));
    const ticketType = await driver.findElement(By.id('tipo-de-entradas'));
    await ticketType.click();
    await ticketType.findElement(By.css('option:nth-child(3)')).click();

    // 2. CHOOSE A DATE
    const datePicker = await driver.findElement(By.id('booking_calender'));
    await datePicker.click();

    // The date picker markup semantics make it fairly hard to select a particular
    // date; for simplicity, we pick the first one available
    const pickableDates = await driver.findElements(
      By.css('td[data-handler="selectDay"]'),
    );
    await pickableDates[0].click();

    // Wait for the people selector to be populated
    await driver.wait(async () => {
      const peopleOptions = driver.findElements(
        By.css('.peopleQty > select > option'),
      );
      return peopleOptions.length > 1;
    }, 10000);

    const peopleSelector = await driver.findElement(By.css('.peopleQty'));
    await peopleSelector.click();
    // await ticketType.findElement(By.css('option:nth-child(3)')).click();
  } catch (e) {
    console.error('Error: ', e);
  }
})();
