import Log from '$lib/utils/Log'
import { Principal } from '@dfinity/principal'
import { isPrincipal } from '$lib/utils/isPrincipal'
import { userIndex } from './backend'
import type { IDB } from '$lib/idb'

export async function getCanisterId(id: string): Promise<string | undefined> {
  try {
    let canId: string | undefined = undefined
    let idb: IDB | undefined = undefined
    try {
      idb = await (await import('$lib/idb')).idb
      canId = await idb.get('canisters', id)
    } catch (e) {
      Log({ error: e, from: '1 getCanisterId', type: 'idb' }, 'error')
      return
    }
    if (canId) return canId
    else {
      if (isPrincipal(id)) {
        const res =
          await userIndex().get_user_canister_id_from_user_principal_id(
            Principal.from(id),
          )
        if (res[0]) {
          idb?.set('canisters', id, res[0].toString())
          return res[0].toString()
        }
      } else {
        const res =
          await userIndex().get_user_canister_id_from_unique_user_name(id)
        if (res[0]) {
          idb?.set('canisters', id, res[0].toString())
          return res[0].toString()
        }
      }
    }
  } catch (e) {
    Log({ error: e, from: '1 getCanisterId' }, 'error')
    return
  }
}
