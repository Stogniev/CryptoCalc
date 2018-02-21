const math = require('mathjs');
const currencies = require('./currencies')
const { skippingCurrencies } = require('./currencies')

// Create units for every currency code (without subunits)
math.createUnit('USD')

//
// const skippingCreateUnitWarnings = [
//   'Invalid unit name',
//   'unit with that name already exists'
// ]

// create/update units for currencies and set rates
function refreshCurrencyUnits(rates) {

  currencies
    .codes
  //  .filter( code => !(filteredCurrencies.includes(code)) )
    .forEach( code => {
      if (code === 'USD') return;

      if (!rates.hasOwnProperty(code)) return;

      if (skippingCurrencies.includes(code)) return;
      //if (code === 'OFF') throw new Error('somehow created wrong currency')

      //console.log('CU', code, rates[code])
      // note: use skippingCurrencies instead (until no need to kill unit in favor of currency)
      //try {

      const unitRate = 1 / rates[code]
      if (math.type.Unit.UNITS.hasOwnProperty(code)) {
        math.type.Unit.UNITS[code].value = unitRate
      } else {
        math.createUnit(code, {definition: `${unitRate} USD`})
      }
      // } catch(e) {
      //   if (skippingCreateUnitWarnings.some( warn => e.message.includes(warn)) ) {
      //     console.log(`Error creating unit: ${e.message}`)
      //   } else {
      //     throw e
      //   }
      // }
    })
}

//create percent unit
math.createUnit('PERCENT')


const confusingUnits = [
  'as', 'in',   // used for money conversion
  //!!?  'a' // used as word in "as a % of"
  'b',  // very rarely used ad "byte", rather as variable
]


const unitNames = () => Object.values(math.type.Unit.UNITS).map( u => u.name)
  .filter( name => !confusingUnits.includes(name) )

const unitPrefixes = () => Object.keys(math.type.Unit.PREFIXES.SHORTLONG)

module.exports = { unitNames, unitPrefixes, confusingUnits, refreshCurrencyUnits }
