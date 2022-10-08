import { openDB } from 'idb';

const dbPromise = openDB('keyval-store', 1, {
	upgrade(db) {
		db.createObjectStore('watch');
	}
});

export async function get(key) {
	return (await dbPromise).get('watch', key);
}
export async function set(key, val) {
	return (await dbPromise).put('watch', val, key);
}
export async function del(key) {
	return (await dbPromise).delete('watch', key);
}
export async function clear() {
	return (await dbPromise).clear('watch');
}
export async function keys() {
	return (await dbPromise).getAllKeys('watch');
}
