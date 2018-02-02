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

const userVariableProto = {
  name: null,
  value: null,
}

// factory
function createUserVariable(name, value) {
  validateVariableName(name)
  const v = Object.create(
    userVariableProto,
    {
      name: { value: name, writable: true, enumerable: true },
      value: { value: value, writable: true, enumerable: true },
    }
  )

  return v
}

// find/create user variable and set value
function setUserVariable(name, value) {
  let v = findUserVariable(name)

  if (v) {
    v.value = value
  } else {
    v = createUserVariable(name, value)
    userVariables.push(v)
  }

  return v
}

/* function getUserVariable(name) {
 *   
 * }*/


module.exports = { setUserVariable, userVariables, VariableNameError }


