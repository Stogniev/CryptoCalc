const math = require('mathjs');
const rates = require('./rates')
const currencies = require('./currencies')

// Create units for every currency code (without subunits)
math.createUnit('USD')
currencies.codes.forEach( code => {
  if (code === 'USD') return;
  if (!rates.hasOwnProperty(code)) return;

  math.createUnit(code, {definition: `${rates[code]} USD`})
})

//create percent unit
math.createUnit('PERCENT')


const UnitNames = Object.values(math.type.Unit.UNITS).map( u => u.name)
const UnitPrefixes = Object.keys(math.type.Unit.PREFIXES.SHORTLONG)

module.exports = { UnitNames, UnitPrefixes }
