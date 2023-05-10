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
  apiKey: 'AIzaSyDMe27WJxn-joIKf0WpTX8VGHuBFk5UCZ8',
  authDomain: 'hot-or-not-aad91.firebaseapp.com',
  projectId: 'hot-or-not-aad91',
  storageBucket: 'hot-or-not-aad91.appspot.com',
  messagingSenderId: '806664083728',
  appId: '1:806664083728:web:91248647826d45493e6d95',
  measurementId: 'G-EMSVJKZCYZ',
}

let app: FirebaseApp
let db: Firestore
const collectionName = 'airdrop-entries'

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  if (!db && app) {
    db = getFirestore(app)
  }
}

export async function uploadForm(data: object): Promise<boolean> {
  try {
    initFirebase()
    if (!app || !db) throw 'Initialization failed'

    const docRef = await addDoc(collection(db, collectionName), {
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
      collection(db, collectionName),
      where('principalId', '==', principalId),
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
