import { openDB } from 'idb';

export const dbPromise = openDB('keyval-store', 2, {
	upgrade(db) {
		db.createObjectStore('keyval');
		db.createObjectStore('watch');
	}
});
