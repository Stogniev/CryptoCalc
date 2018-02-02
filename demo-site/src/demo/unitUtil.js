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


const confusingUnits = [
  'as', 'in',   // used for money conversion
  //!!?  'a' // used as word in "as a % of"
  'b',  // very rarely used ad "byte", rather as variable
]


const UnitNames = Object.values(math.type.Unit.UNITS).map( u => u.name)
                        .filter( name => !confusingUnits.includes(name) )

const UnitPrefixes = Object.keys(math.type.Unit.PREFIXES.SHORTLONG)

module.exports = { UnitNames, UnitPrefixes, confusingUnits }
