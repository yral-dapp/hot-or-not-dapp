use crate::{canister_management::create_users_canister, AccessControlMap, UserIdToCanisterIdMap};
use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{does_principal_have_role, UserAccessRole};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_user_canister_id_from_user_principal_id() -> Principal {
    let user_id = SPrincipal(ic_cdk::caller());

    let mut user_id_to_canister_id_map = s!(UserIdToCanisterIdMap);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        Some(canister_id) => canister_id.0,
        None => {
            let created_canister_id = create_users_canister(user_id.0).await;

            user_id_to_canister_id_map.insert(user_id, &SPrincipal(created_canister_id));
            s! { UserIdToCanisterIdMap = user_id_to_canister_id_map };

            created_canister_id
        }
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn delete_user_index_reset_user_canisters() {
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));
    s! { UserIdToCanisterIdMap = UserIdToCanisterIdMap::new() };
}
