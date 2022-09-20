import Log from '$lib/utils/Log';
import { Principal } from '@dfinity/principal';
import { get, set } from 'idb-keyval';

async function isPrincipal(p: string) {
	try {
		const r = Principal.from(p);
		return r._isPrincipal ? true : false;
	} catch (_) {
		return false;
	}
}

export async function getCanisterId(id: string) {
	const canId = await get(id);
	if (canId) return canId;
	else {
		const { userIndex } = await import('$lib/helpers/backend');
		try {
			if (await isPrincipal(id)) {
				const res = await userIndex().get_user_canister_id_from_user_principal_id();
				set(id, res.toString());
				return res.toString();
			} else {
				const res = await userIndex().get_user_canister_id_from_unique_user_name(id);
				set(id, res.toString());
				return res.toString();
			}
		} catch (e) {
			Log({ error: e, from: '1 getCanisterId' }, 'error');
			return;
		}
	}
}
