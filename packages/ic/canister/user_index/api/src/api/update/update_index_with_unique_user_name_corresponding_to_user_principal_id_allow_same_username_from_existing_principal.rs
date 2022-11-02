use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::shared_types::user_index::error_types::SetUniqueUsernameError;
use user_index_lib::{UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_index_with_unique_user_name_corresponding_to_user_principal_id_allow_same_username_from_existing_principal(
    unique_user_name: String,
    user_principal_id: Principal,
) -> Result<(), SetUniqueUsernameError> {
    let request_makers_canister_id = ic_cdk::caller();
    let mut unique_user_name_to_user_principal_id_map: UniqueUserNameToUserPrincipalIdMap =
        s!(UniqueUserNameToUserPrincipalIdMap);
    let user_principal_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);

    if !user_principal_id_to_canister_id_map.contains_key(&SPrincipal(user_principal_id)) {
        return Err(SetUniqueUsernameError::UserCanisterEntryDoesNotExist);
    }

    if user_principal_id_to_canister_id_map
        .get_cloned(&SPrincipal(user_principal_id))
        .map(|canister_id| canister_id.0)
        != Some(request_makers_canister_id)
    {
        return Err(SetUniqueUsernameError::SendingCanisterDoesNotMatchUserCanisterId);
    }

    unique_user_name_to_user_principal_id_map.remove(&unique_user_name);
    unique_user_name_to_user_principal_id_map
        .insert(unique_user_name.clone(), &SPrincipal(user_principal_id));
    s! { UniqueUserNameToUserPrincipalIdMap = unique_user_name_to_user_principal_id_map };

    Ok(())
}
