const { codes } = require('../currencies')

const currencyCodes = codes
//const currencies = require('./currencies')
const { unitNames, unitPrefixes } = require('../unitUtil')

const { specVariables } = require('../common')

// TODO: moved to context
//const userVariables = []

class VariableNameError extends Error {}
// class VariableNameIsIncorrect extends VariableNameError {}  problem: e instance of VariableNameIsReserved return false in browser
// //class VariableNameIsBusy extends VariableNameError {}
// class VariableNameIsReserved extends VariableNameError {}

function validateVariableName(name) {
  if (!/^[A-Za-z_]\w*$/.test(name)) {
    throw new VariableNameError(`incorrect variable name: ${name} `)
  }

  if ( specVariables.includes(name) ) {
    throw new VariableNameError('is reserved')
  }

  if (currencyCodes.includes(name)) {
    throw new VariableNameError('is currency')
  }

  const UP = unitPrefixes().map(escape).join('|')
  const UN = unitNames().map(escape).join('|')
  if (new RegExp(`^(${UP})(${UN})$`).test(name)) {
    throw new VariableNameError('is unit')
  }

  //if ( userVariables.some(v => (v.name === name)) ) {
  //  throw new VariableNameIsBusy()
  //}
}

//112 const findUserVariable = (name) => userVariables.find(v => (v.name === name))

const userVariableProto = {
  name: null,
  value: null,
}

// factory
function createUserVariable(name, value) {
  //validateVariableName(name)
  const v = Object.create(
    userVariableProto,
    {
      name: { value: name, writable: true, enumerable: true },
      value: { value: value, writable: true, enumerable: true },
    }
  )

  return v
}

// 112
// // inject variable to userVariables (overwrite)
// function setUserVariable(v) {
//   //console.log('setUserVariable', name, value)
//   let existingVariable = findUserVariable(v.name)
//
//   if (existingVariable) {
//     existingVariable.value = v.value
//   } else {
//     userVariables.push(v)
//   }
//
//   return v
// }
//

const isUserVariable = (obj) => userVariableProto.isPrototypeOf(obj)

/* function getUserVariable(name) { } */

//  112
// function clearAllUserVariables() {
//   userVariables.length = 0  // manipulate length because of const
// }
//


module.exports = {
  /*112 setUserVariable, userVariables,*/ VariableNameError, userVariableProto, isUserVariable, /*112 clearAllUserVariables,*/ validateVariableName, createUserVariable
}
