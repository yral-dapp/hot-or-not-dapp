use crate::{AccessControlMap, UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap};
use candid::Principal;
use canister_management::create_users_canister;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{does_principal_have_role, UserAccessRole};

mod canister_management;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_user_canister_id_from_user_principal_id() -> Principal {
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

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn delete_user_index_reset_user_canisters() {
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));
    s! { UserPrincipalIdToCanisterIdMap = UserPrincipalIdToCanisterIdMap::new() };
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_index_details_is_user_name_taken(user_name: String) -> bool {
    let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);

    unique_user_name_to_user_principal_id_map.contains_key(&user_name)
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_user_canister_id_from_unique_user_name(user_name: String) -> Option<Principal> {
    let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);
    let user_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);

    let profile_principal_id = unique_user_name_to_user_principal_id_map.get_cloned(&user_name)?;

    user_id_to_canister_id_map
        .get_cloned(&profile_principal_id)
        .map(|canister_id| canister_id.0)
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_index_with_unique_user_name_corresponding_to_user_principal_id(
    old_user_name: String,
    new_user_name: String,
) {
    let mut unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);

    assert!(
        unique_user_name_to_user_principal_id_map
            .get_cloned(&old_user_name)
            .unwrap()
            .0
            == ic_cdk::caller(),
        "User name does not belong to caller"
    );

    unique_user_name_to_user_principal_id_map.remove(&old_user_name);

    unique_user_name_to_user_principal_id_map
        .insert(new_user_name.clone(), &SPrincipal(ic_cdk::caller()));
    s! { UniqueUserNameToUserPrincipalIdMap = unique_user_name_to_user_principal_id_map };
}
