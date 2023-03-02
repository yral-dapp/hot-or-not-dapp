import { dbPromise } from './db'

export async function get(key) {
  return (await dbPromise)?.get('watch-hon', key)
}
export async function set(key, val) {
  return (await dbPromise)?.put('watch-hon', val, key)
}
export async function del(key) {
  return (await dbPromise)?.delete('watch-hon', key)
}
export async function clear() {
  return (await dbPromise)?.clear('watch-hon')
}
export async function keys() {
  return (await dbPromise)?.getAllKeys('watch-hon')
}

export async function values() {
  return (await dbPromise)?.getAll('watch-hon')
}
