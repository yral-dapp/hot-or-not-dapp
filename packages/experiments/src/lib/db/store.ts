// import {
//   DocumentReference,
//   onSnapshot,
//   PartialWithFieldValue,
//   setDoc,
// } from 'firebase/firestore'
// import { get_store_value } from 'svelte/internal'
// import { derived, Readable, Writable, writable } from 'svelte/store'

// export class FirestoreWritable<T extends Record<string, any>>
//   implements Readable<T>
// {
//   constructor(
//     private readonly document: DocumentReference<T>,
//     private readonly initial: T,
//   ) {
//     onSnapshot(this.document, (snapshot) => {
//       const data = snapshot.data()
//       if (data !== undefined) this.remoteStore.set({ ...this.initial, ...data })
//     })
//   }

//   private readonly remoteStore: Writable<T> = writable(this.initial)
//   public readonly subscribe: Readable<T>['subscribe'] =
//     this.remoteStore.subscribe
// }
