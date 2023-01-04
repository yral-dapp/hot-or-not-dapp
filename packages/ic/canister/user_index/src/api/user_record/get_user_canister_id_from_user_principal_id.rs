use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};

use crate::data::UserPrincipalIdToCanisterIdMap;

// TODO: ignore anonymous principal
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
async fn get_user_canister_id_from_user_principal_id(user_id: Principal) -> Option<Principal> {
    let user_id = SPrincipal(user_id);

    let user_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        Some(canister_id) => Some(canister_id.0),
        None => None,
    }
}
