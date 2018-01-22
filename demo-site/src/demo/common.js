// TODO: add all
//export const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']

// TODO: add all
//export const Units = ['cm', 'm', 'km', 'usd', 'uah',]



const scales = ["k", "thousand", "thousands", "M", "million", "millions", "billion", "billions"]

const confusingUnits = [
  'as', 'in',   // used for money conversion
//!!?  'a' // used as word in "as a % of"
]

const lexemSeparator = ';'

module.exports = { confusingUnits, lexemSeparator, scales }
