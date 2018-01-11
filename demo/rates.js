const currencyRatesData = require('./currencyRatesData')
const cryptoCurrencyRatesData = require('./cryptoCurrencyRatesData')


const currencyRates = Object.assign(
  {},
  ...Object.entries(currencyRatesData.rates).map(item => ({
    [item[0]]: 1 / item[1]
  })
  )
)


const cryptoCurrencyRates = Object.assign(
  {},
  ...cryptoCurrencyRatesData.map(item => ({
    [item.symbol]: parseFloat(item.price_usd),
  })
  )
)

// Rates to USD:  {UAH: 28.11, USD: 1, EUR: 1.19...}
const rates = {...cryptoCurrencyRates, ...currencyRates}

module.exports = rates


