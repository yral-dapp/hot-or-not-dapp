import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
	uploadBytesResumable,
	type UploadTask
} from 'firebase/storage';

interface UploadResponseSuccess {
	status: 'success';
	gcsUri: string;
	downloadUrl: string;
}

interface UploadResponseResumableSuccess {
	status: 'success';
	uploadTask: UploadTask;
}

interface UploadResponseError {
	status: 'error';
	error: string;
}

type UploadResponse = UploadResponseError | UploadResponseSuccess;
type UploadResponseResumable = UploadResponseError | UploadResponseResumableSuccess;

let app: FirebaseApp;

const config = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const gcsBucket = `gs://${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`;

function getFirebaseApp(): FirebaseApp {
	if (!app) {
		app = initializeApp(config);
		return app;
	} else {
		return app;
	}
}

export async function analyzeText(text: string) {
	const result = await fetch(`${import.meta.env.VITE_FUNCTIONS_HOST}/analyzeText`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ text })
	});
	return await result.json();
}

export async function uploadToBucket(file: File | Blob): Promise<UploadResponse> {
	try {
		const fileExt = file instanceof File ? file.name.split('.').pop() : 'webm';
		const fileName = Date.now().toString() + '.' + fileExt;
		const storage = getStorage(getFirebaseApp(), gcsBucket);
		const storageRef = ref(storage, fileName);

		await uploadBytes(storageRef, file);
		const gcsUri = gcsBucket + '/' + fileName;
		const pathReference = ref(storage, gcsUri);
		const downloadUrl = await getDownloadURL(pathReference);
		return { status: 'success', gcsUri, downloadUrl };
	} catch (e) {
		return { status: 'error', error: JSON.stringify(e) };
	}
}

export async function uploadToBucketResumable(file: File | Blob): Promise<UploadResponseResumable> {
	try {
		const fileExt = file instanceof File ? file.name.split('.').pop() : 'webm';
		const fileName = Date.now().toString() + '.' + fileExt;
		const storage = getStorage(getFirebaseApp(), gcsBucket);
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);
		return { status: 'success', uploadTask };
	} catch (e) {
		return { status: 'error', error: JSON.stringify(e) };
	}
}

export async function generateSignedUrl(gcsUri: string): Promise<string> {
	const storage = getStorage(getFirebaseApp(), gcsBucket);
	const pathReference = ref(storage, gcsUri);
	return await getDownloadURL(pathReference);
}
