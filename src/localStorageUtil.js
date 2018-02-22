function localStoragePresent() {
  return typeof localStorage !== 'undefined'
}

function getItem(name) {
  if (!localStoragePresent()) {
    //console.warn('no localStorage')
    return;
  }

  return localStorage.getItem(name)
}

function setItem(name, value) {
  if (!localStoragePresent()) {
    //console.warn('no localStorage')
    return;
  }

  localStorage.setItem(name, value)
}


function setObject(name, obj) {
  setItem(name, JSON.stringify(obj))
}

function getObject(name) {
  try {
    return JSON.parse(getItem(name))
  } catch(e) {
    //console.log(e)
    return null
  }
}

export default { getItem, setItem, setObject, getObject }
