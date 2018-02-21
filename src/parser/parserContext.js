// const { /*setUserVariable,*/ createUserVariable, userVariables, validateVariableName, isUserVariable } = require('./userVariables')


// const contextProto = {
//   name: null,
// 
//   // result: [],
//   // 
//   // sum() {
//   //   // TODO
//   //   return 'SUM HERE'
//   // },
//   // 
//   // average() {
//   //   // TODO
//   //   return 'AVERAGE HERE'
//   // },
// 
// }

const contexts = {}

// function createContext(name) {
//   const context = Object.create(contextProto, {
//     name: {value: name},
//   })
// 
//   // note: not checking
//   contexts[name] = context
// }


function getContext(name='default') {
  return contexts[name]
}


function setContext(context, name='default') {
  contexts[name] = context
}




module.exports = { getContext, setContext /*createContext*/ }
