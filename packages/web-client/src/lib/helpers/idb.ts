import { openDB } from 'idb';

const dbName = 'hotOrNot';
const storeName = 'username-to-canister';
const storeName2 = 'principal-to-canister';
const version = 1;

export async function init() {
	// Check for support.
	if (!('indexedDB' in window)) {
		console.log("This browser doesn't support IndexedDB.");
		return;
	}

	await openDB(dbName, version, {
		upgrade(db) {
			db.createObjectStore(storeName);
			db.createObjectStore(storeName2);
			// store.put('Hello world!', 'Hello');
		}
	});
}

export async function addUsernameToCanister(username: string, canisterId: string) {
	// Check for support.
	if (!('indexedDB' in window)) {
		console.log("This browser doesn't support IndexedDB.");
		return;
	}

	const db = await openDB(dbName, version);
	const tx = db.transaction(storeName, 'readwrite');
	const store = await tx.objectStore(storeName);
	const val = username;
	const key = canisterId;
	await store.put(val, key);
	await tx.done;
}

export async function addPrincipalToCanister(principal: string, canisterId: string) {
	// Check for support.
	if (!('indexedDB' in window)) {
		console.log("This browser doesn't support IndexedDB.");
		return;
	}

	const db = await openDB(dbName, version);
	const tx = db.transaction(storeName2, 'readwrite');
	const store = await tx.objectStore(storeName2);
	const val = principal;
	const key = canisterId;
	await store.put(val, key);
	await tx.done;
}
