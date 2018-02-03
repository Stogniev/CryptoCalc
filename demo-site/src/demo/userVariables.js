const { codes } = require('./currencies')
const currencyCodes = codes
//const currencies = require('./currencies')
const { UnitNames, UnitPrefixes } = require('./unitUtil')

const userVariables = []

class VariableNameError extends Error {}
// class VariableNameIsIncorrect extends VariableNameError {}  problem: e instance of VariableNameIsReserved return false in browser
// //class VariableNameIsBusy extends VariableNameError {}
// class VariableNameIsReserved extends VariableNameError {}

function validateVariableName(name) {
  if (!/^[A-Za-z_]\w*$/.test(name)) {
    throw new VariableNameError(`incorrect variable name: ${name} `)
  }

  if ( ['sum', 'total', 'average', 'avg'].includes(name) ) {
    throw new VariableNameError('is reserved')
  }

  if (currencyCodes.includes(name)) {
    throw new VariableNameError('is currency')
  }

  const UP = UnitPrefixes.map(escape).join('|')
  const UN = UnitNames.map(escape).join('|')
  if (new RegExp(`^(${UP})(${UN})$`).test(name)) {
    throw new VariableNameError('is unit')
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


const isUserVariable = (obj) => userVariableProto.isPrototypeOf(obj)

/* function getUserVariable(name) { } */


function clearAllUserVariables() {
  userVariables.length = 0  // manipulate length because of const
}

module.exports = {
  setUserVariable, userVariables, VariableNameError, userVariableProto, isUserVariable, clearAllUserVariables
}



