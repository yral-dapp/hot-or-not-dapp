import { openDB } from 'idb'
import Log from '../utils/Log'

export type IDBStores = 'up-down-watch-history'

const dbPromise = openDB('keyval-store', 8, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('up-down-watch-history')) {
      db.createObjectStore('up-down-watch-history')
    }
  },
}).catch((e) => {
  Log('error', 'Error while accessing IDB', {
    error: e,
    from: 'db.openDB',
    type: 'idb',
  })
})

export async function get(storeName: IDBStores, key) {
  return (await dbPromise)?.get(storeName, key)
}
export async function set(storeName: IDBStores, key, val) {
  return (await dbPromise)?.put(storeName, val, key)
}
export async function del(storeName: IDBStores, key) {
  return (await dbPromise)?.delete(storeName, key)
}
export async function clear(storeName: IDBStores) {
  return (await dbPromise)?.clear(storeName)
}
export async function keys(storeName: IDBStores) {
  return (await dbPromise)?.getAllKeys(storeName)
}
export async function values(storeName: IDBStores) {
  return (await dbPromise)?.getAll(storeName)
}
