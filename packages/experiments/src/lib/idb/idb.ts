import { openDB } from 'idb'
import Log from '../utils/Log'

export type DBStores = 'up-down-watch-history'

const dbPromise = openDB('keyval-store', 7, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('keyval')) {
      db.createObjectStore('keyval')
    }
    if (!db.objectStoreNames.contains('canisters')) {
      db.createObjectStore('canisters')
    }
    if (!db.objectStoreNames.contains('watch')) {
      db.createObjectStore('watch')
    }
    if (!db.objectStoreNames.contains('watch-hon')) {
      db.createObjectStore('watch-hon')
    }
    if (!db.objectStoreNames.contains('bets')) {
      db.createObjectStore('bets')
    }
    if (!db.objectStoreNames.contains('wallet')) {
      db.createObjectStore('wallet')
    }
    if (!db.objectStoreNames.contains('reported')) {
      db.createObjectStore('reported')
    }
  },
}).catch((e) => {
  Log('error', 'Error while accessing IDB', {
    error: e,
    from: 'db.openDB',
    type: 'idb',
  })
})

export async function get(storeName: DBStores, key) {
  return (await dbPromise)?.get(storeName, key)
}
export async function set(storeName: DBStores, key, val) {
  return (await dbPromise)?.put(storeName, val, key)
}
export async function del(storeName: DBStores, key) {
  return (await dbPromise)?.delete(storeName, key)
}
export async function clear(storeName: DBStores) {
  return (await dbPromise)?.clear(storeName)
}
export async function keys(storeName: DBStores) {
  return (await dbPromise)?.getAllKeys(storeName)
}
export async function values(storeName: DBStores) {
  return (await dbPromise)?.getAll(storeName)
}
