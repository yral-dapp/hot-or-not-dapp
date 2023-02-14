import { dbPromise } from './db'

export async function get(key) {
  return (await dbPromise)?.get('keyval', key)
}
export async function set(key, val) {
  return (await dbPromise)?.put('keyval', val, key)
}
export async function del(key) {
  return (await dbPromise)?.delete('keyval', key)
}
export async function clear() {
  return (await dbPromise)?.clear('keyval')
}
export async function keys() {
  return (await dbPromise)?.getAllKeys('keyval')
}
