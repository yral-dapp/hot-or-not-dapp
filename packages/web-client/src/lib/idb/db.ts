import { openDB } from 'idb'
import Log from '../utils/Log'

type DBStores = 'canisters' | 'watch' | 'watch-hon'

const dbPromise = openDB('keyval-store', 2, {
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
  },
}).catch((e) => {
  Log({ error: e, from: 'idb' }, 'error')
})

export async function get(db: DBStores, key) {
  return (await dbPromise)?.get(db, key)
}
export async function set(db: DBStores, key, val) {
  return (await dbPromise)?.put(db, val, key)
}
export async function del(db: DBStores, key) {
  return (await dbPromise)?.delete(db, key)
}
export async function clear(db: DBStores) {
  return (await dbPromise)?.clear(db)
}
export async function keys(db: DBStores) {
  return (await dbPromise)?.getAllKeys(db)
}
export async function values(db: DBStores) {
  return (await dbPromise)?.getAll(db)
}
