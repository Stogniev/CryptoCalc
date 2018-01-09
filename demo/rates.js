const Currencies = require('./currencies').Currencies

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

const rates = {...cryptoCurrencyRates, ...currencyRates}

//
// function currenciesAndRates() {
//   Object.entries(Currencies).forEach( ([c, data]) => {
//     if (rates[c]) data.price_usd = rates[c]
//   })
// 
//   return Currencies
// }
// 
// // console.log(rates)
// console.log(currenciesAndRates())
// //currenciesAndRates()
// 

//console.log(rates)

module.exports = { rates }


