const { codes } = require('./currencies')
const currencyCodes = codes
//const currencies = require('./currencies')
const { UnitNames, UnitPrefixes } = require('./unitUtil')

const userVariables = []

class VariableNameError extends Error {}
class VariableNameIsIncorrect extends VariableNameError {}
//class VariableNameIsBusy extends VariableNameError {}
class VariableNameIsReserved extends VariableNameError {}

function validateVariableName(name) {
  if (!/^[A-Za-z_]\w*$/.test(name)) throw new VariableNameIsIncorrect(`incorrect variable name: ${name} `)

  if ( ['prev', 'sum', 'total', 'average', 'avg'].includes(name) ) {
    throw new VariableNameIsReserved('is reserved')
  }

  if (currencyCodes.includes(name)) {
    throw new VariableNameIsReserved('is currency')
  }

  const UP = UnitPrefixes.map(escape).join('|')
  const UN = UnitNames.map(escape).join('|')
  if (new RegExp(`^(${UP})(${UN})$`).test(name)) {
    throw new VariableNameIsReserved('is unit')
  }

  //if ( userVariables.some(v => (v.name === name)) ) {
  //  throw new VariableNameIsBusy()
  //}
}

const findUserVariable = (name) => userVariables.find(v => (v.name === name))

// factory
function createUserVariable(name, value) {
  validateVariableName(name)
  const v = { name, value }
  //userVariables.push(v)
  return v
}

function setUserVariable(name, value) {
  const v = findUserVariable(name) || createUserVariable(name, value)
  v.value = value
  return v
}



module.exports = { setUserVariable, userVariables, VariableNameError }


