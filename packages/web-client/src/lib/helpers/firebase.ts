import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  type Firestore,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCeK4AxhDiOYUnLcgDy-i9ixTvyQeWkwrc',
  authDomain: 'airdrop-test-f73eb.firebaseapp.com',
  projectId: 'airdrop-test-f73eb',
  storageBucket: 'airdrop-test-f73eb.appspot.com',
  messagingSenderId: '83823863266',
  appId: '1:83823863266:web:99df1237c2ae398af145bb',
}

let app: FirebaseApp
let db: Firestore

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  if (!db && app) {
    db = getFirestore(app)
  }
}

export async function setData(data: object): Promise<boolean> {
  try {
    initFirebase()
    if (!app || !db) throw 'Initialization failed'

    const docRef = await addDoc(collection(db, 'form'), {
      ...data,
    })

    if (docRef?.id) return true
    else return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}

export async function isFormFilled(principalId: string): Promise<boolean> {
  try {
    initFirebase()
    if (!app || !db) throw 'Initialization failed'
    if (principalId === '2vxsx-fae') return false

    const q = query(
      collection(db, 'form'),
      where('principal_id', '==', principalId),
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      if (doc?.exists()) {
        return true
      }
    }

    return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}
