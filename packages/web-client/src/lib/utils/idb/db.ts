import { openDB } from 'idb'
import Log from '../Log'

export const dbPromise = openDB('keyval-store', 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('keyval')) {
      db.createObjectStore('keyval')
    }
    if (!db.objectStoreNames.contains('watch')) {
      db.createObjectStore('watch')
    }
  },
}).catch((e) => {
  Log({ error: e, from: 'idb' }, 'error')
})
