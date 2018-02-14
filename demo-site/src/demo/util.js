//https://stackoverflow.com/a/35431817/1948511
export function replaceAll(str, map) {
  let r = str

  for (const key in map) {
    r = r.replace(key, map[key]);
  }
  return r
}
