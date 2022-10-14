import { openDB } from 'idb';

export const dbPromise = openDB('keyval-store', 2, {
	upgrade(db) {
		if (!db.objectStoreNames.contains('keyval')) {
			db.createObjectStore('keyval');
		}
		if (!db.objectStoreNames.contains('watch')) {
			db.createObjectStore('watch');
		}
	}
});
