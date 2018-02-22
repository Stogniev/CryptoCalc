export const localStoragePresent = typeof localStorage !== 'undefined'

function getItem(name) {
  if (!localStoragePresent) return;
  return localStorage.getItem(name)
}

function setItem(name, value) {
  if (!localStoragePresent) return;
  localStorage.setItem(name, value)
}

export default { getItem, setItem }
