use crate::UserPrincipalIdToCanisterIdMap;
use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use user_index_lib::util::canister_management::create_users_canister;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id(
) -> Principal {
    let user_id = SPrincipal(ic_cdk::caller());

    let mut user_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        Some(canister_id) => canister_id.0,
        None => {
            let created_canister_id = create_users_canister(user_id.0).await;

            user_id_to_canister_id_map.insert(user_id, &SPrincipal(created_canister_id));
            s! { UserPrincipalIdToCanisterIdMap = user_id_to_canister_id_map };

            created_canister_id
        }
    }
}
